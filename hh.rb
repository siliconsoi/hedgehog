require 'sinatra'
require "HTTParty"
require 'json'
require "redis"
require 'date'

set :public_folder, '.'

REDIS = Redis.new
EXPIRES = 60 * 60 * 24 * 3 # 3 days

get '/proxy' do
  content_type :json
  { :url => params[:url], :body => fetch_data(params[:url])}.to_json
end

def fetch_data(url)
  body = REDIS.get(url)
  body = get_new_data(url) if body.nil?
  body
end

def get_new_data(url)
  response = HTTParty.get(url)
  REDIS.set(url,response.body)
  REDIS.expire(url, EXPIRES)
  response
end
