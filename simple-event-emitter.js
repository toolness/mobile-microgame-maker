function SimpleEventEmitter(target) {
  var eventHandlers = {};

  target.trigger = function(eventName) {
    var handlers = eventHandlers[eventName] || [];
    handlers.forEach(function(cb) { cb(); });
  };

  target.on = function(eventName, cb) {
    if (!(eventName in eventHandlers))
      eventHandlers[eventName] = [];
    eventHandlers[eventName].push(cb);
  };

  return target;
};
