var Dao = require( '../model/dao.js' );

function handleGet( request ){

  if( request.resource.documentId && "schema" === request.resource.documentId ){
    return Dao.getSchema( request.resource.collection );
  }else if( request.resource.documentId ){
    return Dao.findById( request.resource.collection, request.resource.documentId );
  }
  return Dao.find( request.resource.collection, request.query );

}

function handlePost( request ){

  return Dao.create( request.resource.collection, request.data );

}

function handlePut( request ){

  return Dao.update( request.resource.collection,
    request.resource.documentId, request.data );

}

function handlePatch( request ){

  return Dao.updatePartially( request.resource.collection,
    request.resource.documentId, request.data );

}

function handleDelete( request ){

  return Dao.delete( request.resource.collection, request.resource.documentId );

}

module.exports = {
  get:handleGet,
  post:handlePost,
  put:handlePut,
  patch:handlePatch,
  delete:handleDelete
};
