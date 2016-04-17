var fs = require('fs');
var Promise = require('promise');
var tv4 = require('tv4');
var Matcher = require('./Matcher.js');
var shortid = require('shortid');

var basePath = __dirname + '/';
var collections = {};

function getIndexPath( sCollection ){
  return basePath + sCollection.toLowerCase() + '/index.json';
}

function getSchemaPath( sCollection ){
  return basePath + sCollection.toLowerCase() + '/schema.json';
}

function initCollection( sCollection ){
  var path = basePath + sCollection.toLowerCase();
  var indexPath = getIndexPath( sCollection );
  var schemaPath = getSchemaPath( sCollection );
  var promises = [];
  var promise1 = readJSON( indexPath ).then(function(result){
    return result;
  });
  var promise2 = readJSON( schemaPath ).then(function(result){
    return result;
  });
  promises.push( promise1 );
  promises.push( promise2 );
  return Promise.all( promises ).then( function(result){
    var idMap = {};
    result[0].forEach( function(item, index){
       idMap[ item.id ] = index;
    });
    return collections[sCollection] = {
      name:sCollection,
      index:result[0],
      schema:result[1],
      idMap:idMap,
      path:path,
      indexPath:indexPath,
      schemaPath:schemaPath
    };
  });
}

function getCollection( sCollection ){
  if( !collections[sCollection] ){
    return initCollection( sCollection ).then( function(result){
      return result;
    });
  }

  return Promise.resolve( collections[sCollection] );
}

function getIndex( sCollection ){

  return getCollection(sCollection).then( function(result){
    return result.index;
  });

}

function findItemById( oCollection, sId ){
  var index = oCollection.idMap[sId];
  return oCollection.index[ index ];
}

function readFile(filename, options){
  if(!options) options = { encoding:'utf-8' };
  return new Promise(function (fulfill, reject){
    fs.readFile(filename, options, function (err, res){
      if (err) reject(err);
      else fulfill(res);
    });
  });
}

function readJSON(filename){
  return readFile( filename, { encoding:'utf8' } ).then(JSON.parse);
}

function writeFile( filename, data, options){
  if(!options) options = { encoding:'utf-8' };
  return new Promise(function (fulfill, reject){
    fs.writeFile( filename, data, function (err) {
      if (err) reject(err);
      return fulfill(true);
    });
  });
}

function writeJSON( filename, data ){
  var text = JSON.stringify( data );
  return writeFile( filename, text );
}

function hasMatch(condition,item){
  var attr = getAttribute( condition );
};

function findInCollection( index, condition ){

  if(!condition) return index;

  var result = [];
  var matcher = new Matcher(condition);
  index.forEach(function(item){
    if( matcher.match( item ) ){
      result.push(item);
    }
  });

  return result;
}

function validateItem(oCollection, data){
  return tv4.validateMultiple(data, oCollection.schema);
}

function insertInIndex( oCollection, data ){

  data.id = shortid.generate();
  var index = oCollection.index.length;
  oCollection.index.push( data );
  oCollection.idMap[ data.id ] = index;
  return data.id;

}

function bulkInsertInIndex( oCollection, data ){
  var result = [];
  data.forEach(function(item){
    var id = insertInIndex( oCollection, item );
    result.push( id );
  });
  return result;
}

function create( oCollection, data ){
  var ids = [];
  if( data instanceof Array ){
    ids = bulkInsertInIndex( oCollection, data );
  }else{
    var id = insertInIndex( oCollection, data );
    ids.push( id );
  }
  return updateCollectionIndex( oCollection ).then( function( result ){
    var created = [];
    ids.forEach( function(id){
      created.push( oCollection.index[ oCollection.idMap[id] ] );
    });
    return created;
  });
}

function updateCollectionIndex( oCollection ){
  return writeJSON( oCollection.indexPath, oCollection.index ).then( function(result){
    if(result) return initCollection( oCollection.name );
  });
}

function copyJSON( data ){
  return JSON.parse(JSON.stringify(data));
}

function updateInCollection( oCollection, sId, oData ){

  var index = oCollection.idMap[ sId ];
  var copy = copyJSON( oData );
  oCollection.index[ index ] = copy;
  return index;

}

function updatePartiallyInCollection( oCollection, sId, oData ){

  var index = oCollection.idMap[ sId ];
  var copy = copyJSON( oData );

  for( var prop in copy ){
    if( copy.hasOwnProperty( prop ) ){
      oCollection.index[index][ prop ] = copy[ prop ];
    }
  }

  return index;

}

function findIndexesInCollection( oCollection, condition ){
  var matcher = new Matcher(condition);
  var result = [];
  oCollection.index.forEach( function(item, index){
    if( matcher.match( item ) ){
      result.push( index );
    }
  });
  return result;
}

function removeFromIndex( oCollection, aIndexes){
  var result = [];
  aIndexes.forEach(function(i){
    oCollection.index[i] = null;
  });
  oCollection.index.forEach(function(item){
    if( item ) result.push(item);
  });
  return result;
}

function deleteInCollection( oCollection, sId ){

  var index = oCollection.idMap[ sId ];
  var deleted = oCollection.index.splice( index, 1 );
  return deleted[0];

}

function validate( oCollection, oData ){

  var outcome = validateItem( oCollection, oData );

  if( !outcome.valid ){
    var message = 'Validation Error\n';
    outcome.errors.forEach( function(error){
      message += error.dataPath + ': ' + error.message + '\n';
    });
    throw new Error( message );
  };
  
}

module.exports = {

  find: function( sCollection, condition ){

    return getIndex( sCollection ).then( function( result ){
      if( !condition ) return result;
      return findInCollection( result, condition );
    });

  },

  findById: function( sCollection, sId ){
    return getCollection( sCollection ).then( function( result ){
      return findItemById( result, sId );
    });
  },

  create: function( sCollection, oData ){

    return getCollection( sCollection ).then( function( oCollection ){
      validate( oCollection, oData );
      var id = insertInIndex( oCollection, oData );
      return updateCollectionIndex( oCollection ).then( function( result ){
        return oCollection.index[ oCollection.idMap[id] ];
      });
    });

  },

  update:function( sCollection, sId, oData ){

    return getCollection( sCollection ).then( function( oCollection ){
      validate( oCollection, oData );
      var index = updateInCollection( oCollection, sId, oData );
      return updateCollectionIndex( oCollection ).then( function( result ){
        return result.index[ index ];
      });
    });

  },

  updatePartially:function( sCollection, sId, oData ){

    return getCollection( sCollection ).then( function( oCollection ){
      validate( oCollection, oData );
      var index = updatePartiallyInCollection( oCollection, sId, oData );
      return updateCollectionIndex( oCollection ).then( function( result ){
        return result.index[ index ];
      });
    });

  },

  delete:function( sCollection, sId ){

    return getCollection( sCollection ).then( function( oCollection ){
      var item = deleteInCollection( oCollection, sId );
      return updateCollectionIndex( oCollection ).then( function(){
        return item;
      });
    });

  },

  drop:function( sCollection ){
    collections[sCollection] = {
      name:sCollection,
      index:[],
      indexPath:getIndexPath( sCollection )
    };
    return updateCollectionIndex(collections[sCollection]).then( function( result ){
      return result.index.length === 0;
    });
  },

  getSchema:function( sCollection ){
    return getCollection( sCollection ).then( function( result ){
      return result.schema;
    });
  },

  setBasePath:function( sBasePath ){
    basePath = sBasePath;
  }

}
