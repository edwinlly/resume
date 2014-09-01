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
            
             function getCookie(s) {
                return $.cookie(s);
            }

            function setCookie(s, val) {
                //writeOptions.secure = (window.location.protocol === "https:");
                $.cookie(s, val, writeOptions);
            }

            function delCookie(s) {
                $.removeCookie(s, removeOptions);
            }

            this.saveToken = function(auth) {
                setCookie(TOKEN, auth);
            };

            this.getToken = function() {
                return getCookie(TOKEN);
            };

            this.eraseToken = function() {
                delCookie(TOKEN);
            };

            this.saveUser = function(user) {
                setCookie(USER, user);
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

            this.eraseAll = function() {
                this.eraseToken();
                this.eraseUser();
                this.eraseLoginTime();
            };

        }

        return new Session();
    }());
    return Session;
});
