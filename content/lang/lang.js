function _e(t, cont){
  var key = ((undefined != cont) ? '{' + cont + '}' : '') + t;
//  if('PIN' == t) console.log(t, cont, key, _lang[key], _lang[t]);
  if(undefined != _lang[key])
    return _lang[key];
  else if(undefined != _lang[t])
    return _lang[t]
  else
    return t;
}