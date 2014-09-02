define(['services/IndexService',
        'core/model/Session',
		'core/EventDispatcher',
		'core/services/Log',
        'jquery'],
function (indexService, session, EventDispatcher, Log){"use strict";
	var IndexPresenter = ( function() {
		var PA = "pa";
		
		function IndexPresenter() { 
			var dispatcher = new EventDispatcher();
				
			this.loadResume = function(){
				indexService.getResumeList({
					success: function(data){
						dispatcher.fire('loadResumeSuccess', data);
					},
					error: function(errorInfo){
						dispatcher.fire('loadResumeError', errorInfo);
					}
				});
			};
			
			function toISODateString(d) {
                function pad(n) {
                    return n < 10 ? '0' + n : n;
                }
                return d.getUTCFullYear() +
                '-' + pad(d.getUTCMonth() + 1) +
                '-' + pad(d.getUTCDate()) +
                'T' + pad(d.getUTCHours()) + ':' +
                pad(d.getUTCMinutes()) +
                ':' + pad(d.getUTCSeconds()) + 'Z';
            }

			function onLoginSuccess(loginSessionIdDto, username, handlers){
                session.saveToken(loginSessionIdDto.sessionID);
                session.saveUser(username);
                session.saveLoginTime(toISODateString(new Date()));
                handlers.success();
			}
			
			function onLoginError(errorInfo, handlers){
			    handlers.error(errorInfo);
			}
			
			this.login = function(username, password, handlers){
			     loginService.login(username, password, {
			         success : function(loginSessionIdDto) {
			             onLoginSuccess(loginSessionIdDto, username, handlers);
			         },
			         error : function(errorInfo) {
                        onLoginError(errorInfo, handlers);
                    }
			     }); 
			};
			
            this.on = function(eventName, callback) {
                dispatcher.on(eventName, callback);
			};

            this.off = function(eventName, callback) {
                dispatcher.off(eventName, callback);
            };
		}
		
		return new IndexPresenter();
	}());
	return IndexPresenter;
});