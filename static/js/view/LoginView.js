define(['presenter/LoginPresenter',
	    'core/services/Log',
	     //'text!template.html',
	    'jquery'], 
function(presenter, Log) {
    var LoginView = ( function() {
        var DIV = '#login-test-div';
        var BUTTON = '#resume-login-button';
        var USERNAME = '#resume-login-username';
        var PASSWORD= '#resume-login-password';
        var MESSAGE_SPAN = '#resume-login-message';
        /**
        * Constructor
        */
        function LoginView() {
            var a1;
            
            function onLoginSuccess(){
                window.location = '/index.html';
            }
            
            function onLoginError(errorInfo){
                $(MESSAGE_SPAN).text(errorInfo.message);
            }
            
            function onLogin() {
                $(MESSAGE_SPAN).text("");
             	var username = $(USERNAME).val();
             	var password = $(PASSWORD).val();
             	if ( username == '' || password == ''){
                    $(MESSAGE_SPAN).text("Please input username and password!");           	  
             	}
                presenter.login(username, password, {
                    success: onLoginSuccess,
                    error: onLoginError
                });
            }

            /**
             * @public
             */
            this.pause = function() {
            };

            this.resume = function() {
            };

            this.init = function() {
               	Log.log("Init in LoginView");
                this.resume();
            	$(BUTTON).bind('click', onLogin);
            };
        }
        return new LoginView();
    }());
    return LoginView;
});
