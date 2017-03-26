<?php
$layout = $_REQUEST["layout"];
?>
<div class="mod-signin <?php echo $layout ?>">
        <div class="hd">
            <h1 class="txt-xxl bold">Sign In to Coupons.com</h1>
            <span class="txt-md">
                Not a member?                <a class="signup" href="/sign-up?sig=NDNlZWE2YTE1ZjI1NzgyOGNhYzFmNDkwMGVjODRiMmQ0Y2MyYjkwNA&amp;done=%2F&amp;ts=1458347622">Sign Up</a>
            </span>
        </div>

        <div class="bd">
            <form>
                <fieldset class="fb-register">
    <button type="button" class="sprite-icons fb-login"><span class="fb-text">Sign In with <strong>Facebook</strong></span></button>
    <p class="errmsg txt-md bold" data-field="fb"></p>
</fieldset>

                <div class="separator">
                    <hr>
                    <p class="txt-lg">OR</p>
                </div>

                

<fieldset class="email-register">
    <p class="signin-option2-label txt-lg">Use your email address:</p>

    <legend></legend>

    <label class="lbl-email" for="signin-email"></label>
    <input type="email" placeholder="Email address" name="email" class="input-email txt-lg" id="signin-email">
    <p class="errmsg txt-md bold" data-field="email"></p>

    <label class="lbl-pwd" for="signin-password"></label>
    <input type="password" placeholder="Password" name="pwd" class="input-pwd txt-lg" id="signin-password">
    <p class="errmsg txt-md bold" data-field="pwd"></p>

    <a class="forgotpwd txt-md">Forgot your password?</a>

    <div class="rememme">
        <input type="checkbox" class="chkbox chk-remember-user" checked="" id="signin-remember-user">
        <label for="signin-remember-user" class="txt-md">Remember me</label>
    </div>

    <p class="errmsg txt-md bold" data-field="common"></p>
    <button type="button" class="btn-cta">Sign In</button>
</fieldset>
<div class="clearfix"></div>
            </form>
        </div>
    </div>