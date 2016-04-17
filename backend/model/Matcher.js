function Matcher(condition){
  var matcherInstance = this;
  this.attr = getAttribute( condition );

  function getOperator(){
    var matchValue = matcherInstance[ matcherInstance.attr ];
    if( matchValue instanceof Object ){
      var matchProp = getAttribute( matchValue );
      if( /[$]/.test(matchProp) ){
        return matchProp;
      };
    }
    return false;
  }

  function getAttribute( condition ){
    var prop;
    for( prop in condition ){
      if( condition.hasOwnProperty( prop ) ){
        return prop;
      }
    }
  }

  function defaultMatcher( item ){
    var matchValue = condition[ matcherInstance.attr ];
    if( !(matchValue instanceof Object) && !(item[ matcherInstance.attr ] instanceof Object) ){
      return matchValue === item[ matcherInstance.attr ];
    }

    if( !(matchValue instanceof Object) && item[ matcherInstance.attr ] instanceof Array ){
      return item[ matcherInstance.attr ].some(function( value ){
        return !(value instanceof Object) && matchValue === value;
      });
    }

    return false;
  }

  var operators = {
    "$elemMatch":function( item ){
      // TODO: implement element match
    }
  };

  this.operation = getOperator();
  if( this.operation ){
    this.match = operators[this.operation];
  }else{
    this.match = defaultMatcher;
  }
}

module.exports = Matcher;
