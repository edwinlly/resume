// (C) Copyright 2011-2012 Hewlett-Packard Development Company, L.P.
define([ 'core/EventDispatcher', 'core/services/Log', 'jquery',
        'lib/jquery.cookie' ], function(EventDispatcher, Log) {
    "use strict";

    var Session = (function() {
        var SESSION_REFRESH = 300000; // 5 minutes
        var writeOptions = {
            path : '/',
            secure : true
        };
        var removeOptions = {
            path : '/'
        };
        var TOKEN = "token";
        var AUTH_SERVICE = "authService";
        var USER = "user";
        var LOGIN_TIME = "loginTime";
        var PROPERTY_PREFIX = "CIC_PROP_";
        var authorizations = [];
        var checkingSessionState =false;

        function Session() {

            // Derive from EventDispatcher
            EventDispatcher.call(this);
            
            var self = this;
            var timer = null;
            var refreshHandlers = {
                success : function(data) {
                    // Note: an invalid token returns null
                    if ((!data.hasOwnProperty("sessionID")) ||
                         (data.sessionID !== self.getToken())) {
                        var hash = hashManager.getHash();
                        if (!hash.match(/\/login\/.*/)) {
                            self.eraseAll();
                            hashManager.setHashAndReload('/login' + hash);
                        }
                    }
                },
                // TODO this doesn't get called... Will call after REST API is
                // consistent
                error : function(jqXHR) {
                    Log.error("Error for token refresh failed.");
                }
            };
            var validateHandlers = {
                success : function(data) {
                    // Note: an invalid token returns null
                    if ((!data.hasOwnProperty("sessionID")) ||
                         (data.sessionID !== self.getToken())) {
                        handleSessionLogout();
                    } else {
                        checkingSessionState = false;
                    }
                }, 
                error : function(jqXHR) {      
                     handleSessionLogout();      
                }
            }; 
          
            var properties = {};

            function getCookie(s) {
                return $.cookie(s);
            }

            function setCookie(s, val) {
                writeOptions.secure = (window.location.protocol === "https:");
                $.cookie(s, val, writeOptions);
            }

            function delCookie(s) {
            	$.removeCookie(s, removeOptions);
            }

            function stopTimer() {
                timer = clearInterval(timer);
            }

            function accessSession() {
                sessionService.accessSession(self.getToken(), self
                        .getLanguage(), refreshHandlers);
            }

            function validateSession() {
                if (!checkingSessionState && self.getToken()) {
                    checkingSessionState = true;
                    sessionService.accessSession(self.getToken(), self
                        .getLanguage(), validateHandlers);
                }
            }
            
           function handleSessionLogout() {
                checkingSessionState = false;             
                self.fire('sessionLost');                 
            }
            
            function reset() {
                timer = setInterval(accessSession, SESSION_REFRESH);
            }

            function getCookies() {
                var cookies = { },
                    name;
                if (document.cookie && document.cookie != '') {
                    var pairs = document.cookie.split(';');
                    for (var i = 0; i < pairs.length; i++) {
                        var pair = pairs[i].split("=");
                        name = decodeURIComponent(pair[0].replace(/^ /, ''));
                        cookies[name] = decodeURIComponent(pair[1]);
                    }
                }
                return cookies;
            }
            
            function eraseProperties() {
                var cookies = getCookies();
                
                for (var name in cookies) {
                    if (cookies.hasOwnProperty(name) &&
                        name.match("^"+PROPERTY_PREFIX)) {
                        delCookie(name);
                    }
                }
                properties = {};
            }
            
            this.saveToken = function(auth) {
                setCookie(TOKEN, auth);
                reset();
            };

            this.getToken = function() {
                return getCookie(TOKEN);
            };

            this.eraseToken = function() {
                delCookie(TOKEN);
                stopTimer();
            };

            this.saveAuthService = function(authService) {
                setCookie(AUTH_SERVICE, authService);
            };

            this.getAuthService = function() {
                return getCookie(AUTH_SERVICE);
            };

            this.saveUser = function(user) {
                setCookie(USER, user);
            };

            this.eraseAuthService = function() {
                delCookie(AUTH_SERVICE);
            };

            this.getUser = function() {
                return getCookie(USER);
            };

            this.eraseUser = function() {
                delCookie(USER);
            };

            this.saveLoginTime = function(loginTime) {
                setCookie(LOGIN_TIME, loginTime);
            };

            this.getLoginTime = function() {
                return getCookie(LOGIN_TIME);
            };

            this.eraseLoginTime = function() {
                delCookie(LOGIN_TIME);
            };

            this.saveAuthorizations = function(auths) {
                authorizations = auths;
                self.fire("authorizationsChanged", auths);
            };

            this.getAuthorizations = function() {
                return authorizations;
            };

            function actionsForCategory(category) {
                var actions = [];
                if (category) {
                    $.each(authorizations, function(index, auth) {
                        if (auth.categoryDto === category) {
                            actions.push(auth.actionDto);
                        }
                    });
                }
                return actions;
            }

            this.actionsForCategory = actionsForCategory;

            function canMultipleCategories(categories, func) {
                var index;
                for (index in categories) {
                    if (func(categories[index])) {
                        return true;
                    }
                }
                return false;
            }

            function canViewCategory(category) {
                if (category instanceof Array) {
                    return canMultipleCategories(category, canViewCategory);
                } else {
                    return (actionsForCategory(category).length > 0);
                }
            }

            this.canViewCategory = canViewCategory;

            function canManageCategory(category) {
                var manageActions;
                if (category instanceof Array) {
                    return canMultipleCategories(category, canManageCategory);
                } else {
                    manageActions = $.grep(actionsForCategory(category),
                        function(action) {
                        // todo: revisit this approach
                        if (action.match(/create/i) || action.match(/add/i) ||
                            action.match(/edit/i) || action.match(/update/i) ||
                            action.match(/delete/i) || action.match(/remove/i) ||
                            action.match(/release/i) || action.match(/write/i) ||
                            action.match(/configure_network/i)) {
                            return true;
                        }
                    });
                    return (manageActions.length > 0);
                }
            }

            this.canManageCategory = canManageCategory;

            // Checks whether user is authorized for the specified action
            this.canPerformAction = function(category, action) {
                var actionArray = $.grep(this.actionsForCategory(category),
                        function(actionAllowed) {
                            if (actionAllowed.match(action)) {
                                return true;
                            }
                        });
                return (actionArray.length > 0);
            };

            this.getLanguage = function() {
                var language = hp.defaultLanguage;
                return language;
            };

            this.eraseAll = function() {
                this.eraseToken();
                this.eraseUser();
                this.eraseLoginTime();
                eraseProperties();
                authorizations = [];
            };

            /**
             * Set arbitrary name/value pairs on the session object.
             * @param {string} name The name of the property.
             * @param {Object} value The value of the property.
             *        This can be any javascript object or null.
             * @param {boolean} notPersistent
             *        If false (the default) this property should be
             *        persisted in a browser cookie.
             *        If true, don't persist this property.
             */
            this.setProperty = function(name, value, notPersistent) {
                var persistent = !notPersistent,
                     cookieName = PROPERTY_PREFIX + name;
                
                // delete any associated cookie (also catches the case where one is change from persistent to not persistent)
                delCookie(cookieName);
                
                if (persistent) {
                    if (value) {
                        setCookie(cookieName, value);
                    }
                }
                else {
                    properties[name] = value;
                }
            };
            
            /**
             * Get the value of a property (originally set with setProperty())
             * @param {string} name The name of the desired property
             * @return {Object} The object originally set by setProperty or undefined if
             *                  no property by this name was set.
             */
            this.getProperty = function (name) {
                // check cookies first
                var cookieValue = getCookie(PROPERTY_PREFIX + name);
                return cookieValue ? cookieValue : properties[name];
            };


            /** only public for testing */
            this.accessSession = function() {
                accessSession();
            };
                  
            this.validateSession = validateSession;
            
            this.isKioskMode = function() {
                Log.warn("Session.isKioskMode() is deprecated. Use Environment.isKioskMode()");
                return environment.isKioskMode();
            };
            
            this.setKioskMode = function(value) {
                Log.warn("Session.setKioskMode() is deprecated. Use Environment.setKioskMode()");
                environment.setKioskMode(value);
            };
             
            function init() {
                if (self.getToken()) {
                    accessSession();
                    reset();
                }
            }

            init();
            **/
        }

        return new Session();
    }());
    return Session;
});
