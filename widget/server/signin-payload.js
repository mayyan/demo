// Name your class anything you want. Here, I call it Foo.
// Note that by writing out our code in its own class, we namespace it.
var RegistrationWidget;

RegistrationWidget = (function() {
    // debugger;
    var ajaxProtocol = window.location.protocol;
    var host         = "localhost"; // // TODO: change to server host vdevusvr06,
    var scriptTag    = $("#embedder-signin");
    var client_id    = scriptTag.attr("data-client-id");

    // // TODO: change to server host name
    var cssArray = [
            // '//localhost/~myan/tests/widget/server/components/cleanslate.css'
            ajaxProtocol + '//localhost/~myan/tests/widget/server/components/yui-reset-context.css',
            ajaxProtocol + '//localhost/~myan/tests/widget/server/components/common.css',
            ajaxProtocol + '//localhost/~myan/tests/widget/server/components/registration/signin.css'];
    var jsArray = [
            ajaxProtocol + '//localhost/~myan/tests/widget/server/components/registration/facebook.js',
            ajaxProtocol + '//localhost/~myan/tests/widget/server/components/registration/signin.js'];

    var settingsURL = ajaxProtocol + '//localhost/~myan/tests/widget/server/get-signin-settings/' + client_id;
    var htmlURL     = ajaxProtocol + '//localhost/~myan/tests/widget/server/components/registration/signin.php';

    function RegistrationWidget() {
        this.ajaxProtocol = ajaxProtocol;
        this.host         = host, // TODO: change to server host vdevusvr06,
        this.scriptTag    = scriptTag;
        this.client_id    = client_id;
        this.settingsURL  = settingsURL;
        this.htmlURL      = htmlURL;

        // Load necessary stylesheets
        this.loadCSS(cssArray);

        APP_COUPONSINC = (typeof APP_COUPONSINC == "undefined") ?  {} : APP_COUPONSINC;

        var _this = this;
        $.when(this.getSettings())
            .then(function(settings) {
                return _this.getHTML(settings);
            })
            .then(function(html) {
                return _this.putWidget(html);
            })
            .then(function() {
                return _this.loadJS(jsArray);
            })
            .then(function() {
                _this.onReady();
            });
    }

    RegistrationWidget.prototype.loadCSS = function(urls) {
        $.each(urls, function(i, url) {
            // This constructs a styleTag with your widget's stylesheet.
            $('<link rel="stylesheet" type="text/css" media="all">')
                .attr("href", url)
                .appendTo('head');
        })        
    }

    RegistrationWidget.prototype.loadJS = function(urls) {
        var _this = this;
        $.each(urls, function(i, url) {
            var oneScript = $('<script type="text/javascript">')
                    .attr("src", url);
            // insert after the scriptTag
            _this.scriptTag.after(oneScript);
        });
    }

    RegistrationWidget.prototype.getSettings = function() {
        var _this = this;
        // Gets the widget settings for a given company with a http/s request:
        return $.ajax({
            url: _this.settingsURL,
            dataType: 'json'
        });
    };

    // Construct your widget however you like here.
    RegistrationWidget.prototype.getHTML = function(settings) {
        var _this = this;
        this.settings = settings;

        this.element = $('<div class="yui3-cssreset"></div>');

        return $.ajax({
            url: _this.htmlURL,
            dataType: 'html',
            data: settings
        });
    };

    // Injects widget into DOM body.
    RegistrationWidget.prototype.putWidget = function(html) {
        var deferred = $.Deferred();

        this.element.html(html);
        // insert after the scriptTag
        this.scriptTag.after(this.element);

        if ($("body").length == 0) {
            $(document).load(function(_this) {
                return function(event) {
                    deferred.resolve(this.element);
                };
            }(this));
        } else {
            deferred.resolve(this.element);
        }

        return deferred;
    };

    RegistrationWidget.prototype.onReady = function() {
        APP_COUPONSINC.signin.onReady();
    }

    return RegistrationWidget;

})();

window.mySigninWidget = new RegistrationWidget();