// (C) Copyright 2011 Hewlett-Packard Development Company, L.P.
/**
 * @type {EventDispatcher}
 */
define(['core/services/Log'], function(Log) { //"use strict";

    var EventDispatcher = (function() {
        /**
         * @constructor
         */
        function EventDispatcher() {
                        
            var events = {};
            var logging = false;

            // attach events by calling on('myEvent', callback)
            this.on = function (eventName, callback) {
                if (!events.hasOwnProperty(eventName)) {
                    events[eventName] = [];
                }
                events[eventName].push(callback);
                if (logging) {
                    Log.log('ON ' + eventName);
                }
            };
            
            this.off = function (eventName, callback) {
                if (events.hasOwnProperty(eventName)) {
                    events[eventName] = $.grep(events[eventName], function (func) {
                        return (callback !== func);
                    });
                }
                if (logging) {
                    Log.log('OFF ' + eventName);
                }
            };
            
            // fire an event
            this.fire = function (eventName, eventInfo) {
                var i, fireEvents;
                
                if (events.hasOwnProperty(eventName)) {
                    fireEvents = events[eventName];
                    
                    if (logging && fireEvents.length > 0) {
                        Log.log('FIRE ' + eventName);
                    }

                    for (i = 0; i < fireEvents.length; i++) {
                        fireEvents[i](eventInfo);
                    }
                } else if (logging) {
                    Log.log('FIRE BLANK ' + eventName);
                }
            };

            this.getEvents = function() {
                return events;
            };                        
        }

        return EventDispatcher;
    }());
    return EventDispatcher;
});
