const electron = require('electron');

function UIResponse( request ){
  // var route = routes[ request.uri ];
  // var view = baseURL + route.view;
  this.requestRef = request.ref;
  this.requestMethod = request.method;
  this.status = "200";
  this.sender = request.sender;

  // renderOptions:{ model:result }
  this.send = function( data ){
    this.data = data;
    var response = getResponse( this );
    this.sender.send( 'response', response );
  }

  function getResponse( instance ){
    return {
      requestRef: instance.requestRef,
      requestMethod: instance.requestMethod,
      status: instance.status,
      data: instance.data
    };
  }
}

UIResponse.prototype.sendError = function( err ){
  this.status = "500";
  console.log("An error has ocurred",err);
}

module.exports = UIResponse;
