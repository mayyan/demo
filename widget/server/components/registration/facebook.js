APP_COUPONSINC.facebook = (function ($) {
    /*
     * Asynchronous load. See http://developers.facebook.com/docs/reference/javascript/FB.init/
     */
    function init() {
        if (typeof FB === "undefined") {

            /**
             * Always use xfbml=false.
             * Module need to call FB.XFBML.parse(domElement) to programatically render XFBML buttons.
             */
            var option = {
                appId: "2412324777",
                version: 'v2.0',
                status: true,
                cookie: true,
                xfbml: false
            },
                fbjs = 'https://connect.facebook.net/en_US/sdk.js';

            window.fbAsyncInit = function() {
                FB.init(option);
            };
            
            var scriptTag = document.createElement("script");
            scriptTag.type = "text/javascript";
            scriptTag.src = fbjs;

            $('head').append(scriptTag);
        }
    }

    return {
        init: init
    };
})($);

