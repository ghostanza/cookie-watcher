# cookie-watcher
Allow DOM elements to listen for cookie changes

## How It Works
- The file contains a `readCookie` function that reads the value of a given cookie. It will either return the value or `undefined`.
- It also creates a new `Object.prototype` function called `cookieWatcher` which will continually check a cookie value and trigger a custom event when the value is changed
- Lastly, it creates a new `Object.prototype` function called `triggerCustomEvent` that is responsible for creating and emitting the custom event.


### `readCookie(cookieName)`
- Takes a cookie name to look for, and returns its value (or `undefined` if it does not have one)
- *This will also be set on the `window` object if it does not already have its own `readCookie` function, so you can use it globally if you want*

### `Object.prototype.triggerCustomEvent(name, data)`
- Creates and triggers a custom event on the given object.
- The data passed gets set as the `event.detail` value.

**Example**:
```
let a = document.getElementById('testing');
a.addEventListener('test', function(e){
  console.log(e.detail.foo); // 'bar'
});
a.triggerCustomEvent('test', { foo: 'bar' });
```

### `Object.prototype.cookieWatcher(cookieName, freq, func)`
- Uses the `readCookie()` function to check the value of the provided `cookieName`.
- Then kicks off a `setInterval` and checks the cookie value every `freq`ms (defaults to 100ms).
- If the cookie value has changed, it triggers a custom `cookieChange` event on the object that set the watcher and then continues to listen for cookie changes with the new value.
- The event passes the cookie name, the new value, and the previous value to the `event.detail` object.
  - `event.detail.name` = cookie name
  - `event.detail.value` = new value
  - `event.detail.previous` = old value
- `func` is an optional callback function that can be passed. *(If you do not supply a `freq` value, it can also be passed as the second parameter)*. If this is present, it will be called *instead* of emitting an event. It will receive the `data` (the same as the `event.detail` object above), and the `target` object (the object/element that originally set the `cookieWatcher`).
  - *Ex A:* `el.cookieWatcher('testCookie', 200, function(data, target){ console.log(data.name) });`
  - *Ex B:* `el.cookieWatcher('testCookie', function(data, target){ console.log(data.name) });`

**Example**:
```
let a = document.getElementById('testing');

a.addEventListener('cookieChange', function(e){
  console.log(e.detail.name);
  console.log(e.detail.value);
});

// check the value of the "test" cookie every 300ms
a.cookieWatcher('test', 300);

// (cookie value changes to 'bar')
// console logs "test" and "bar"

// (cookie expires or gets deleted)
// console logs "test" and undefined
```

---

### EXAMPLE:
*Set up an element to listen for a particular cookie change ('testCookie'), and update a data attribute when that cookie changes*
```
// Load the cookie-watcher script, and then...

let el = document.getElementById('test-element');

el.addEventListener('cookieChange', function(e){
  if( e.value != undefined ){
    this.dataset.cookieHasChangedTo = e.value;
  } else{
    this.dataset.cookieHasExpired = true;
  }
});

el.cookieWatcher('testCookie');
```

## TODO:
- Update the `cookieWatcher` to use a Web Worker if available in order to take the `setInterval` off the main thread
- Add a way to stop listening for cookie changes after a `cookieWatcher` has been set (possibly add a flag to the call to indicate whether it should be a one-time watcher or continuously listen for changes).
- Allow `cookieWatcher` to take an option callback parameter that will fire instead of triggering the custom event
