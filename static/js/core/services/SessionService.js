// 
define(['js/core/services/Log', 'jquery'], function(log) {"use strict";
    var SessionService = ( function() {

        /**
         * @type {SessionService}
         * @constructor
         */
        function SessionService() {
          
            /**
             * Accesses the session of the current logged in user.
             */
            this.accessSession = function(token, lang, handlers) {
              
                $.ajax({
                    url : "/rest/sessions",
                    type : 'GET',
                    contentType : "application/json",
                    dataType : "json",
                    success : handlers.success,
                    error : handlers.error,
                    headers : {
                        "Accept-language" : lang,
                        "Session-ID" : token,
                        "Session-KeepAlive": true
                    }
                });
            };
        }

        return new SessionService();
    }());
    return SessionService;
});
