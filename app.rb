require 'sinatra/base'
require 'json'
require 'mongo'
require 'bson'

class AppServer < Sinatra::Base
  set :root, File.dirname(__FILE__)
  set :public_folder, 'scripts'
  DB = Mongo::Connection.new.db('todo', :pool_size => 5, :timeout => 5)

  def to_bson_id(id)
    BSON::ObjectId.from_string(id)
  end

  def from_bson_id(obj)
    obj.merge({'_id' => obj['_id'].to_s})
  end

  ##Serve index.html

  get '/' do
    send_file File.join(settings.root, 'scripts', 'index.html')
  end

  # Api Routes

  get '/api/:todo' do
    DB.collection(params[:todo]).find.to_a.map{|t| from_bson_id(t) }.to_json
  end

  get '/api/:todo/:id' do
    from_bson_id(DB.collection(params[:todo]).find_one(to_bson_id(params[:id]))).to_json
  end

  post '/api/:todo' do
    oid = DB.collection(params[:todo]).insert(JSON.parse(request.body.read.to_s))
    "{\"_id\": \"#{oid.to_s}\"}"
  end

  delete '/api/:todo/:id' do
    DB.collection(params[:todo]).remove('_id' => to_bson_id(params[:id]))
  end

  put '/api/:todo/:id' do
    DB.collection(params[:todo]).update({'_id' => to_bson_id(params[:id])}, {'$set' => JSON.parse(request.body.read.to_s).reject{|k,v| k == '_id'}})
  end
end
