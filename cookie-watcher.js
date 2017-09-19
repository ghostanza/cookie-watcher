(function(){
  function readCookie(cookieName){
    if( !cookieName ){ return undefined; }
    let reg = new RegExp(`${cookieName}.*?=(.*?)(?:;|$)`, 'g'),
        cookieVal,
        regMatch;
    while(regMatch = reg.exec(document.cookie)){
      cookieVal = regMatch[1];
    }

    return cookieVal;
  }

  window.readCookie = window.readCookie || readCookie;

  Object.prototype.triggerCustomEvent = function(name, data){
    let event;
    if( window.CustomEvent ){
      event = new CustomEvent(name, {detail: data});
    } else{
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(name, true, true, {detail: data});
    }
    this.dispatchEvent(event);
  }

  Object.prototype.cookieWatcher = function (cookieName, freq, func){
    let c = readCookie(cookieName),
        argLength = arguments.length,
        time = !isNaN(arguments[1]) ? freq : 100,
        callback = (argLength == 2 && typeof(arguments[1])) === 'function' ? arguments[1]
          : (argLength >= 2 && typeof(func) === 'function') ? func : undefined,
        that = this;

    setInterval(function(){
      let a = readCookie(cookieName);
      if( a != c ){
        let data = { name: cookieName, value: a, previous: c };
        if(callback){
          callback(data, that);
        }else{
          that.triggerCustomEvent('cookieChange', {name: cookieName, value: a, previous: c});
        }
        c = a;
      }
    }, time);
  }
})();
