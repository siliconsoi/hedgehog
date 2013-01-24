require 'sinatra'
require "HTTParty"
require 'json'
require "redis"
# require "project"

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

get '/' do
  erb :index, :locals => {:project => Project.new({}, REDIS), :permalink => false}
end

get '/proxy' do    #When u push '+' btn
  content_type :json
  url = preprocess(params[:url])
  { :url => url, :body => fetch_data(url)}.to_json
end

post '/projects' do    #When u push 'save' btn 1st time
  project =  Project.new(params, REDIS)
  project.save
  content_type :json
  { :url => project.resource }.to_json
end

put '/project/:id' do    #When u push 'save' btn after 1st time
  project = Project.new(params, REDIS)
  project.save
  content_type :json
  { :url => project.resource }.to_json
end

get '/project/:id' do         #When u push 'permalink' btn
  erb :index, :locals => {:project => Project.new(params, REDIS), :permalink => true}
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

#########################################################################

class Project

  attr_reader :url

  def initialize(data = {}, redis = nil)
    @project = data[:project] || nil
    @id = data[:id]
    @redis = redis
  end

  def generate_random_str(length)
    SecureRandom.hex(length / 2)
  end

  def save
    @id = generate_random_str(6) if @id.nil?
    @redis.set(@id, @project.to_json)
  end

  def entries
    @project = JSON.parse(@redis.get(@id)) if (@project.nil? && !@id.nil?)
    @project
  end

  def resource
    return '/projects' if entries.nil?
    "/project/#{@id}" unless @id.nil?
  end

  def resource_method
    return 'post' if entries.nil?
    'put'
  end

end
