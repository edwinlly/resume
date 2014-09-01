define(['core/services/REST', 
        //'core/model/Session', 
        'jquery'], function(REST) {"use strict";

	return {

        getResume: function(id, handlers){
        	REST.getURI('/rest/resumes/' + id, handlers);
        },
        getResumeList: function(handlers){
            REST.getURI('/rest/resumes', handlers);
        }
	};
});