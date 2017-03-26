/*jslint sloppy: true */
/*global window:true, document:true, APP_COUPONSINC:true, CI_jQuery:true, FB: true */
/*Setting FB as global for FB signin */
/**
 * @property APP_COUPONSINC.signin
 * @type Object
 * @static
 */
APP_COUPONSINC.signin = (function ($) {
    var module,
    //     cd = APP_COUPONSINC.contextData,
        pnzdata = {
            pid: '13306',
            nid: '10',
            zid: 'iq37'
        },
        doc = $(document),
        body;

    /**
     * The error handler for SignIn Dialog Content ajax query.
     * @method handleSignInError
     * @param {Object} jqXHR Object representing the Ajax query. Not used yet.
     * @param {String} textStatus Ajax status string. Not ued yet.
     * @param {errorThrown} errorThrown Textual portion of the HTTP status, such as "Not Found" or "Internal Server Error."
     */
    function handleSignInError(jqXHR, textStatus, errorThrown) {
        var errmsg = $(".errmsg[data-field='common']", body),
            signuplink = $(".hd .signup", body).attr("href");
        body.addClass("error");
        switch (textStatus) {
        case "FAIL":
            //NOTE: For Sign-In failure, BE will return 2 cases. TODO: this message is really fragile on Front-end handling, for the next phase,
            //      we should figure a better way to handle this. Ex: Status code matching with certain message.
            // 1. "Invalid username" for invalid email address
            // 2. "Invalid password" for invalid password with correct email address
            if (errorThrown === "Invalid username") {
                errmsg.html("We don't have a profile with this email address. <a class='signup' href='" + signuplink + "'>Sign up</a>" +
                               " to create your Coupons.com profile.");
            } else if (errorThrown === "Invalid password") {
                errmsg.html("The password you entered doesn't match our records. <a class='forgotpwd'>Did you forget your password?</a>");
            } else {
                errmsg.html("Sorry we are experiencing technical difficulty.");
            }
            break;
        default:
            errmsg.html("Sorry we are experiencing technical difficulty.");
            break;
        }
    }

    /**
     * The success handler for SignIn Dialog Content ajax query.
     * @method handleSignInSuccess
     * @param {Object} data Ajax Response
     * @param {String} textStatus Ajax status string. Not used yet.
     * @param {Object} jqXHR Object representing the Ajax query. Not used yet.
     */
    function handleSignInSuccess(data, textStatus, jqXHR) {
        switch (data.Status) {
        case "OK":
            module.handleSignInClientSuccess(data, textStatus, jqXHR);
            break;
        default: //default case will handle other cases, including status FAIL
            handleSignInError(null, "FAIL", data.Message);
            break;
        }
    }

    /**
     * Factors out what the client does  if the server returns successfully
     * and  that the signin  that it  did was successful (success-success).
     * This allows  this  code to be overridden  using the  module pattern.
     *
     * @method handleSignInSuccess
     * @param {Object} data Ajax Response
     * @param {String} textStatus Ajax status string. Not used yet.
     * @param {Object} jqXHR Object representing the Ajax query. Not used yet.
     */
    function handleSignInClientSuccess(data, textStatus, jqXHR) {
        window.location.reload();
    }

    /**
     * The error handler for Forgotpwd ajax query.
     * @method handleForgotpwdError
     * @param {Object} jqXHR Object representing the Ajax query. Not used yet.
     * @param {String} textStatus Ajax status string. Not ued yet.
     * @param {errorThrown} errorThrown Textual portion of the HTTP status, such as "Not Found" or "Internal Server Error."
     */
    function handleForgotpwdError(jqXHR, textStatus, errorThrown) {
        $(".mod-forgotpwd .btn-cta").removeClass("disabled");
        var errmsg = $(".errmsg", body);

        switch (textStatus) {
        case "FAIL":
            errmsg.html("The email address you entered is invalid.");
            break;
        default:
            errmsg.html("Sorry we are experiencing technical difficulty.");
            break;
        }
    }

    /**
     * The success handler for Forgotpwd ajax query.
     * @method handleForgotpwdSuccess
     * @param {Object} data Ajax Response
     * @param {String} textStatus Ajax status string. Not used yet.
     * @param {Object} jqXHR Object representing the Ajax query. Not used yet.
     */
    function handleForgotpwdSuccess(data, textStatus, jqXHR) {
        var status = data.Status,
            message = data.Message,
            errmsg = $(".mod-signin .errmsg[data-field='common']");
        $(".mod-signin .errmsg").html(""); //Clear out the previous error
        $(".mod-signin input").removeClass("err"); //Clear out the previous error
        $(".mod-signin input").val("");

        switch (status) {
        case "OK":
            $(".mod-signin").addClass("error");
            errmsg.html(message);
            $(".mod-signin").removeClass("hidden");
            $(".mod-forgotpwd").addClass("hidden");
            $(".mod-forgotpwd .btn-cta").removeClass("disabled");
            break;
        default: //default case handle FAIL status and others
            handleForgotpwdError(null, "FAIL", message);
            break;
        }
    }

    /**
     * Perform Sign in process
     * @param {Event} event The event object
     * @method doSignIn
     */
    function doSignIn(event) {

        body = $(".mod-signin");

        var inputemail = $(".input-email", body),
            inputpwd = $(".input-pwd", body),
            email = inputemail.val().replace(/\s/g, ""),
            pwd = inputpwd.val().replace(/\s/g, ""),
            remember = $(".chk-remember-user", body).prop("checked") ? 1 : 0,
            email_errmsg = ($(".errmsg[data-field='email']", body).length > 0) ? $(".errmsg[data-field='email']", body) : $(".errmsg", body),
            pwd_errmsg = ($(".errmsg[data-field='pwd']", body).length > 0) ? $(".errmsg[data-field='pwd']", body) : $(".errmsg", body);

        $(".errmsg", body).html(""); //Initially set back errmsg to be empty
        inputemail.removeClass("err");
        inputpwd.removeClass("err");

        if (email === '') {
            email_errmsg.html("Please enter your email address.");
            inputemail.addClass("err");
        }
        if (pwd === '') {
            pwd_errmsg.html("Please enter your password.");
            inputpwd.addClass("err");
        }

        if (inputemail.hasClass("err") || inputpwd.hasClass("err")) {
            body.addClass("error");
            return; //Don't generate ajax call at all
        }

        $.ajax({
            url: "/ajax/signin/",
            type: "POST",
            dataType: "json",
            data: $.extend({
                action: "doSignin",
                email: email,
                pwd: pwd,
                remember: remember
            }, pnzdata),
            timeout: 5000, /* 5sec timeout */
            success: handleSignInSuccess,
            error: handleSignInError
        });
    }

    /**
     * Perform FB Sign in process
     * @param {Event} event The event object
     * @method doSignIn
     */
    function doFacebookLogIn(event) {
        body = $(".mod-signin");

        var errmsg = $(".errmsg[data-field='fb']", body);

        FB.login(function (response) {
            if (response.authResponse) {
                FB.api('/me', function (user) {
                    var email = user.email,
                        extUID = user.id,
                        appID = cd.fbAppId,
                        srcID = 1,
                        remember = $(".chk-remem", body).prop("checked") ? 1 : 0;
                    $.ajax({
                        url: "/ajax/signin/",
                        type: "POST",
                        dataType: "json",
                        data: $.extend({
                            action: "doFacebookSignin",
                            email: email,
                            extUID: extUID,
                            appID: appID,
                            srcID: srcID,
                            remember: remember
                        }, pnzdata),
                        timeout: 5000, /* 5sec timeout */
                        success: handleSignInSuccess,
                        error: handleSignInError
                    });
                });
            } else {
                // user is not logged in
                $(".errmsg", body).html(""); //Clean up all previous error msg
                errmsg.html("Facebook login failed");
                body.addClass("error");
            }
        }, {scope: 'email'});
    }

    /**
     * Forgotpwd form submitting process
     * @method doForgotpwd
     * @param {Event} event The event obejct
     */
    function doForgotpwd(event) {
        // stop form from submitting normally
        event.preventDefault();

        body = $(".mod-forgotpwd");

        var inputemail = $(".input-email", body),
            email = $(".input-email", body).val().replace(/\s/g, ""),
            errmsg = $(".errmsg", body);

        if (email === '') {
            errmsg.html("Please enter your email address.");
            inputemail.addClass("err");
        } else if (!APP_COUPONSINC.flyout_account.isEmailValid(email)) {
            errmsg.html("The email address you entered is invalid.");
            inputemail.addClass("err");
        } else {
            if ($(".mod-forgotpwd .btn-cta").hasClass("disabled")) {
                return;
            }
            //Making this button disable to making sure that use is not clicking on forgotpwd multiple times while waiting for the response come back
            $(".mod-forgotpwd .btn-cta").addClass("disabled");
            APP_COUPONSINC.log("User submitted password-reset while attempt to sign in");

            $.ajax({
                url: "/ajax/signin/",
                type: "POST",
                dataType: "json",
                data: $.extend({
                    action: "doForgotpwd",
                    email: email
                }, pnzdata),
                timeout: 5000, /* 5sec timeout */
                success: handleForgotpwdSuccess,
                error: handleForgotpwdError
            });
        }
    }

    /**
     * Event handler when click on the module
     * @method handleClick
     * @param {Event} event The event object
     */
    function handleClick(event) {
        var target = $(event.target);

        if (target.hasClass("forgotpwd")) {
            event.preventDefault();
            //clicked on forgotpwd link
            $(".mod-signin").addClass("hidden");
            $(".mod-forgotpwd").removeClass("hidden");
            $(".mod-forgotpwd .errmsg").html(""); //Clear out existing error
            $(".mod-forgotpwd input").removeClass("err");
            $(".mod-forgotpwd input").val("");
        } else if (target.hasClass("fb-login") || target.parents(".fb-login").length === 1) {
            event.preventDefault();
            // clicked on Fabcebook log in button
            doFacebookLogIn(event);
        } else if (target.parents(".mod-signin").length === 1 && (target.hasClass("btn-cta") || target.parents(".btn-cta").length === 1)) {
            event.preventDefault();
            // clicked on Sign In button
            doSignIn(event);
        } else if (target.parents(".mod-forgotpwd").length === 1 && (target.hasClass("btn-cta") || target.parents(".btn-cta").length === 1)) {
            event.preventDefault();
            // clicked on Sign In button
            doForgotpwd(event);
        }
    }

    /**
     * Function handling when hitting on enter key
     * @method handleEnterKey
     */
    function handleEnterKey() {
        $(".mod-signin").keypress(function (e) {
            if (e.keyCode === 13) {
                doSignIn(e);
            }
        });

        $(".mod-forgotpwd").keypress(function (e) {
            if (e.keyCode === 13) {
                doForgotpwd(e);
            }
        });
    }

    /**
     * Bind all types of event this module handles.
     * @method setupEventHandlers
     */
    function setupEventHandlers() {
        if (typeof FB === "undefined") {
            APP_COUPONSINC.facebook.init();
        }
        body = $(".mod-signin");

        $(".mod-signin").click(module.handleClick);
        $(".mod-forgotpwd").click(module.handleClick);

        handleEnterKey();
    }

    /**
     * Function handle on DOM ready
     * @method onReady
     */
    function onReady(themeModule) {
        module = themeModule || this;
        module.setupEventHandlers();
    }

    return {
        handleClick: handleClick,
        setupEventHandlers: setupEventHandlers,
        handleSignInClientSuccess: handleSignInClientSuccess,
        onReady: onReady
    };

}($));

// CI_jQuery(document).ready(function () {
//     APP_COUPONSINC.signin.onReady();
// });
