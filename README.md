# cookie-watcher
Allow DOM elements to listen for cookie changes

## How It Works
- The file contains a `readCookie` function that reads the value of a given cookie. It will either return the value or `undefined`.
- It also creates a new `Object.prototype` function called `cookieWatcher` which will continually check a cookie value and trigger a custom event when the value is changed
- Lastly, it creates a new `Object.prototype` function called `triggerCustomEvent` that is responsible for creating and emitting the custom event.
