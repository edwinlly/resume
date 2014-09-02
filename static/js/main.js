require.config({
    paths: {
        jquery: 'lib/jquery-1.11.1'
    }
});
 
require(['Router', 'core/services/Log', 'jquery' ], 
function(route, Log) {
//    alert(loginView.init);
	route.register();
	route.init();
});