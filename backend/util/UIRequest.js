function UIRequest( sender, args ){
  this.sender = sender;
  this.ref = args.ref;
  this.data = args.data;
  var request = parseRequest( args.ref );
  this.uri = request.uri;
  this.resource = request.resource;
  this.query = request.query;
}

function parseRequest( request ){
  var parts = decodeURI( request ).split("?");
  var uri = parts[0];
  var resource = parseResource( uri );
  var query = null;
  if( parts.length > 1 ){
    query = parseQuery( parts[1] );
  }
  return {
    uri:parts[0],
    query:query,
    resource:resource
  };
}

function parseResource( uri ){
  var result = {};
  // TODO: refactor way to get URI parts and their namings
  var parts = uri.split("/");
  result.collection = parts[0];
  if( parts.length > 1 ) result.documentId = parts[ parts.length - 1 ];
  if( parts.length > 2 ){
    result.location = /^(.*)\/\w\/$/.exec( uri )[1];
  }
  return result;
}

function parseQuery( queryString ){
  var data = decodeURIComponent( queryString ).split("&");
  var result = {};
  data.forEach();
  function setAttribute( item ){
    var parts = item.split("=");
    var key = parts[0].trim();
    var value = parts[1].trim();
    result[ key ] = value;
  }
  return result;
}


module.exports = UIRequest;
