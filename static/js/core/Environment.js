// (C) Copyright 2011-2012 Hewlett-Packard Development Company, L.P.
define(['jquery'], function() {"use strict";
    var Environment = ( function() {
        
        function Environment() {
            var isKiosk = false;
            
            function addIeClasses(floatVersion, compatibilityViewBrowser) {
                if ((floatVersion === 8.0 ||
                    (isNaN(compatibilityViewBrowser) === false &&
                    compatibilityViewBrowser === 8.0))) {
                
                    $('html').addClass('ie8');
                    
                } else if ((floatVersion === 9.0 ||
                    (isNaN(compatibilityViewBrowser) === false &&
                    compatibilityViewBrowser === 9.0))) {
                    
                    $('html').addClass('ie9');
                }
            }

            /**
             * Return false if the current browser is known to not be supported.
             */
            this.supportedBrowser = function() {
  
                var floatVersion = parseFloat($.browser.version);
                var compatibilityViewBrowser = parseFloat(document.documentMode);
                var isValid = true;
                
                if ($.browser.msie && floatVersion < 8.0) {
                    if (isNaN(compatibilityViewBrowser) === false &&
                        compatibilityViewBrowser >= 8.0) {
                        isValid =  true;
                    } else {
                        isValid =  false; 
                    }
                }
                
                // add 'ie8' class to <html> to allow CSS workarounds
                if ($.browser.msie) {
                    addIeClasses(floatVersion, compatibilityViewBrowser);
                }
                
                return isValid;
            };

            this.isKioskMode = function() {
                return isKiosk;
            };

            this.setKioskMode = function(value) {
                isKiosk = value;
            };
        }
        return new Environment();
    }());
    
    return Environment;
});
