function capitalize( string ){
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function camelCase( string ){
  var pascaled = pascalCase(string);
  return pascaled.charAt(0).toLowerCase() + pascaled.slice(1);
}

function pascalCase( string ){
  return /([A-Za-z]+)/g.exec(string).reduce( parse );
  function parse( prev, current, index ){
    if( 1 === index ) return capitalize( current );
    if( 1 < index ) return prev + capitalize( current );
  }
}

module.exports = {
  capitalize: capitalize,
  camelCase:  camelCase,
  pascalCase: pascalCase
};
