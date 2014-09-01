// (C) Copyright 2012 Hewlett-Packard Development Company, L.P.
define(['jquery'],
function() {"use strict";

    var Encoder = (function() {

        /**
         * Constructor
         */
        function Encoder() {

            var encoderDiv = $('<div/>');
            
            function encode(text) {
                return text ? encoderDiv.text(text).html() : text; 
            }
            
            function encodeObject(obj) {
                var key,
                    fieldType;

                if (!obj) {
                    return;
                }

                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        fieldType = typeof(obj[key]);
                        if (fieldType === 'string') {
                            try {
                                obj[key] = encode(obj[key]);
                            }
                            catch (err) {
                                // do nothing. Probably hit this in Firefox for some protected field
                            }
                        }
                        else if (fieldType === 'object') {
                            // recursively encode the object.
                            encodeObject(obj[key]);
                        }
                    }
                }
            }
            
            /**
             * @public
             * @param {string} text The text to encode
             * @return returns the text with any unsafe characters replaced with their safe counterparts
             *        (e.g. < replaced with &lt;)
             */
            this.encode = encode;
            
            /**
             * @public
             * The object passed in is recursively modified to replace any unsafe characters in text members with
             * their safe counterparts
             * @param {Object} obj The object to encode
             */
            this.encodeObject = encodeObject;

        }

        return new Encoder();
    }());
    return Encoder;
});