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

  Object.prototype.cookieWatcher = function (cookieName, freq){
    let c = readCookie(cookieName),
        time = freq || 100,
        that = this;

    setInterval(function(){
      let a = readCookie(cookieName);
      if( a != c ){
        that.triggerCustomEvent('cookieChange', {name: cookieName, value: a, previous: c});
        c = a;
      }
    }, time);
  }
})();
