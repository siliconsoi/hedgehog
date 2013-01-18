require 'sinatra'
require "HTTParty"
require 'pp'

set :public_folder, '.'

# get '/' do
#   request.env['HTTP_USER_AGENT']
# end

get '/proxy' do
  proxy_response = HTTParty.get(params[:url].split('?')[0],
            :headers => {'User-Agent' => request.env['HTTP_USER_AGENT']})
  proxy_response.body
end
