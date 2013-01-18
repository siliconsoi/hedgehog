require 'sinatra'
require "HTTParty"
require 'json'
require "redis"

set :public_folder, '.'

REDIS = Redis.new
EXPIRES = 60 * 60 * 24 * 3 # 3 days

get '/proxy' do
  content_type :json
  url = params[:url].split('?')[0]
  { :url => url, :body => fetch_data(url)}.to_json
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
