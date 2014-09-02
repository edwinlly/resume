// 
define([], function() {
    function doNothing() {
        //Does nothing, can expand to make it do something if needed for IE browsers
    }

    var noLog = {
        info : doNothing,
        log : doNothing,
        warn : doNothing,
        error : doNothing

    };

    return window.console ? window.console : noLog;
});
