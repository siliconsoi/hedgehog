require 'sinatra'
require "HTTParty"
require 'json'
require "redis"

set :public_folder, '.'

REDIS = Redis.new
EXPIRES = 60 * 60 * 24 * 3 # 3 days

URL_CONFIG = [
  { :urlRegex => /^.+wotif.com\/hotel.+$/,
    :rules => [:retain_query]
  },
  { :urlRegex => /^.+hotels.co.+\/hotel.+$/,
    :rules => [:retain_query]
  }
]

get '/proxy' do
  content_type :json
  url = preprocess(params[:url])
  { :url => url, :body => fetch_data(url)}.to_json
end

get '/continue' do
  # link = params[:link]

end

def fetch_data(url)
  body = REDIS.get(url)
  body = get_new_data(url) if body.nil?
  body
end

def get_new_data(url)
  response = HTTParty.get(url, :headers => {
    'Accept-Charset' => request.env['HTTP_ACCEPT_CHARSET'],
    'Accept-Encoding' => request.env['HTTP_ACCEPT_ENCODING'],
    'Accept-Language' => request.env['HTTP_ACCEPT_LANGUAGE'],
    'User-Agent' => request.env['HTTP_USER_AGENT']
  })
  REDIS.set(url,response.body)
  REDIS.expire(url, EXPIRES)
  response
end

def preprocess(url)
  config = url_config(url)
  url = params[:url].split('?')[0] unless config.has_key?(:retain_query)
  url
end

def url_config(url)
  result = {}
  URL_CONFIG.each do |cfg|
    if cfg[:urlRegex].match(url)
      cfg[:rules].each { |rule| result[rule] = true }
    end
  end
  result
end

