define(['core/services/REST', 
        //'core/model/Session', 
        'jquery'], function(REST) {"use strict";

	return {

        getResume: function(id, handlers){
        	REST.getURI('/rest/resumes/' + id, handlers);
        },
        
        login: function(username, password, handlers){
            var loginInfoDto = {
                username : username,
                password : password
            };
            REST.postObject('/rest/login-sessions', loginInfoDto, handlers);
        }
	};
});