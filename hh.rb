require 'sinatra'
require "HTTParty"
require 'json'

set :public_folder, '.'

get '/proxy' do
  response = HTTParty.get(params[:url])
  content_type :json
  { :url => params[:url], :body => response.body}.to_json
end
