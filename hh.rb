require 'sinatra'
require "HTTParty"

set :public_folder, '.'

get '/proxy' do
  response = HTTParty.get(params[:url])
  response.body
end
