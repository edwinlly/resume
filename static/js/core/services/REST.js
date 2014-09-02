// (C) Copyright 2011-2012 Hewlett-Packard Development Company, L.P.
define(['core/model/Session',  'core/services/Encoder', 'jquery'],
function(session, encoder) {"use strict";

    function getErrorInfo(uri, jqXHR, textStats, errorThrown, encodeErrors) {
        var response;
        try {
            response = JSON.parse(jqXHR.responseText);
            if (response) {
                // Adapt new fields from ErrorMessage onto the old style to minimize changes needed by downstream code.
                // Map message onto errorMessage and recommendedActions[] onto resolution.
                // DEPRECATED: Will be removed in sprint 23.
                if (!response.hasOwnProperty('errorMessage') && response.hasOwnProperty('message')) {
                    response.errorMessage = response.message;
                }
                if (!response.hasOwnProperty('resolution') && response.hasOwnProperty('recommendedActions')) {
                    response.resolution = response.recommendedActions ? response.recommendedActions.join('\n') : null;
                }
            }
        }
        catch(err) {
             // the components are responsible for handling an error as they know the context
            // but here we give a general message as the underlying cause
            
            response = {
                errorMessage: "Encountered a communication problem with " + window.location.hostname +".  Try again.",
                message: "Encountered a communication problem with " + window.location.hostname +".  Try again."
            };
        }
        if (encodeErrors) {
            encoder.encodeObject(response);
        }
        return response;
    }

    function onError(uri, handlers, jqXHR, textStats, errorThrown, encodeErrors) {
        var errorInfo;

        errorInfo = getErrorInfo(uri, jqXHR, textStats, errorThrown, encodeErrors);
        
        if (errorInfo.errorCode === "AUTHORIZATION") {
            session.validateSession();          
        }
        
        if (handlers.error) {
            handlers.error(errorInfo, jqXHR);
        }
    }

     /**
     * Create a set of options for an ajax call which is the combination of the standard ones,
     * and any the user passed in. Adds data parameter if included.
     */
    function ajaxOptions (uri,type,handlers,options,data) {
        
        // Determine how to handle options param
        var hasOptions = false,
            async = true,
            encodeResults = true,
            encodeErrors = true;
        
        if (options){
            if (typeof(options)=='boolean') {
                hasOptions=false;
                // Reverse polarity because old method signature was synchronous
                async = options?false:true;
            }
            else {
                if (typeof(options)=='object') {
                    hasOptions = true;
                    // Allow callers to turn off response encoding just in case untouched responses are needed.
                    if (options.hasOwnProperty('encodeResults')) {
                        encodeResults = options.encodeResults;
                    }
                    if (options.hasOwnProperty('encodeErrors')) {
                        encodeErrors = options.encodeErrors;
                    }
                }
            }
        }
        
        // Do initial setup of options, this is the original version of this function
        var finalOptions = {
            url : uri,
            type : type,
            async : async,
            success : function(data, status, xhr) {
                if (encodeResults) {
                    encoder.encodeObject(data);
                }
                handlers.success(data, status, xhr);
                //performance.endOperation(uri);
            },
            error : function (jqXHR, textStats, errorThrown) {
                onError(uri, handlers, jqXHR, textStats, errorThrown, encodeErrors);
            },
            contentType : "application/json",
            dataType : "json",
            headers : {
                //"auth" : session.getToken(),
                "auth" : 'dskfjlsjdfiosjflKjLfj'
            }
        };
        
        var apiVersion = 1;
        if (hasOptions) {
            if (options && options.apiVersion) {
                apiVersion = options.apiVersion;
            }
            $.extend(true,finalOptions,options);  
            delete finalOptions.apiVersion;
        }
        finalOptions.headers['X-API-Version'] = apiVersion.toString();
        if (data){
            finalOptions.data = data;
        }
        return finalOptions;
    }

    function ajax(uri, type, handlers, options,data) {
        $.ajax(ajaxOptions(uri, type, handlers, options, data));
    }
    
    function getUriHandlers(handlers) {
        return {
            success: function (data, status, xhr) {
                if (data && (data.type === 'TaskResource' || data.type === 'TaskResourceV2')) {
                	// need to add replyTimestamp so TaskNotificationFormatter works
                	// correctly if the task is running
                    data.__replyTimestamp = new Date(xhr.getResponseHeader('Date'));
                }
                handlers.success(data, status, xhr);
            },
            error: handlers.error};
    }

    return {
        
        /**
         * Builds the options object to be passed to $.ajax to send the message desired.
         
         * @param {string} uri
         * @param {string} type of the rest call. One of {GET,PUT,POST,DELETE}
         * @param {Object} handlers an Object with success and error functions.
         * @param {Object} options key value pairs listing options for the ajax call
         * @param {Object} data The payload to be carried in either POST or PUT
         */
        getAjaxOptions : function(uri, type, handlers, options, data) {
            return ajaxOptions(uri, type, handlers, options,data);
        },

        /**
         * Does an HTTP GET with appropriate CIC headers
         *
         * @public
         * @param {string} uri
         * @param {Object} handlers an Object with success and error functions.
         * @param {Object} options key value pairs listing options for the ajax call
         */
        getURI : function(uri, handlers, options) {
            ajax(uri, 'GET', getUriHandlers(handlers), options); 
        },

        /**
         * Does an HTTP HEAD with appropriate CIC headers
         *
         * @public
         * @param {string} uri
         * @param {Object} handlers an Object with success and error functions.
         * @param {Object} options key value pairs listing options for the ajax call
         */
        headURI : function(uri, handlers, options) {
            ajax(uri, 'HEAD', handlers, options); 
        },

        /**
         * Does an HTTP DELETE with appropriate CIC headers
         *
         * @public
         * @param {string} uri
         * @param {Object} handlers an Object with success and error functions.
         * @param {Object} options key value pairs listing options for the ajax call
         */
        deleteURI : function(uri, handlers, options) {
            ajax(uri, 'DELETE', handlers, options);
        },
        /**
         * Does an HTTP POST with appropriate CIC headers. Use this method to post an Object in the http request body
         *
         * @public
         * @param {string} uri
         * @param {Object} object the object you wish to post to the uri
         * @param {Object} handlers an Object with success and error functions.
         * @param {Object} options key value pairs listing options for the ajax call
         *
         */
        postObject : function(uri, object, handlers, options) {
             ajax(uri, 'POST', handlers, options, JSON.stringify(object)); 
        },

        /**
         * Does an HTTP POST with appropriate CIC headers for multi-part content.
         *
         * @public
         * @param {string} uri
         * @param {Object} object the object you wish to post to the uri
         * @param {Object} handlers an Object with success and error functions.
         * @param {Object} options key value pairs listing options for the ajax call
         *
         */
        postMultipart : function(uri, data, handlers, options) {
            
            var methodOptions = {
                data : data,
                contentType : false,
                beforeSend : handlers.beforeSend,
                xhr : function() {
                    var xhr = $.ajaxSettings.xhr();
                    if (xhr.upload && handlers.progressHandler) {
                        xhr.upload.addEventListener('progress', handlers.progressHandler, false);
                    }
                    return xhr;
                },
                error : function(jqXHR, textStats, errorThrown) {
                    // not sure how to determine if the upload was aborted by the user.
                    // indication is to check that the textStats = 'abort' but it isn't being set to that.
                    if (jqXHR.state() == 'rejected' && !jqXHR.status) {
                        handlers.onAbort();
                    } else {
                        onError(uri, handlers, jqXHR, textStats, errorThrown);
                    }
                },
                cache : false,
                processData : false
            };
            
            $.extend(methodOptions,options);
            ajax(uri, 'POST', handlers, methodOptions);
        },

        /**
         * Does an HTTP PUT with CIC headers. Use this method to put an Object in the http request body
         *
         * @public
         * @param {string} uri
         * @param {Object} object the object you wish to put to the uri
         * @param {Object} handlers an Object with success and error functions.
         * @param {Object} options key value pairs listing options for the ajax call
         *
         */
        putObject : function(uri, object, handlers, options) {
             ajax(uri, 'PUT', handlers, options, JSON.stringify(object));
        }
    };
});
