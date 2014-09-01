define(['jquery'],
function (){"use strict";

	var Router = ( function() {
		var PA = "pa";
		
		function Router() { 
			var pb = 'pb';
			var routerMap = [];
				
			function pfa(){
			}
			
//			function 
			
			this.pfb = function(){
			};
			
			this.register = function () {
				routerMap.push(['^/login', 'view/LoginView']);
                routerMap.push(['^/index', 'view/IndexView']);
			};
			
			this.init = function(){
				var pathname = window.location.pathname;
				for (var i = 0; i < routerMap.length; i++) {
				    var patt1 = new RegExp(routerMap[i][0]);
				    if(patt1.test(pathname)){
				    	require([routerMap[i][1]], function(view){
				    		view.init();
				    	});
				    }
				};
			};
		}
		
		return new Router();
	}());
	return Router;
});