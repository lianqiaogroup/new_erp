<?php
require 'lib/function.php';
$referer = isset($_GET['referer']) ? trim($_GET['referer']) : '';
if (!$referer || !filter_var($referer, FILTER_VALIDATE_URL)) {
    echo apiReturnError(10002, 'error referer');
    die();
}

$requset_scheme = isset($_SERVER['REQUEST_SCHEME']) ? $_SERVER['REQUEST_SCHEME'] : '';
$server_name = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';
$callback_url = $requset_scheme . '://' . $server_name . '/fb-callback.php';
// facebook登录
require 'lib/facebook_sdk/src/Facebook/autoload.php';
$fb = new Facebook\Facebook([
        'app_id' => FACEBOOK_APP_ID, // Replace {app-id} with your app id
        'app_secret' => FACEBOOK_APP_SECRET,
        'default_graph_version' => FACEBOOK_APP_GRAPH_VERSION
]);

$helper = $fb->getRedirectLoginHelper();

$permissions = [
        'email'
]; // Optional permissions
$redirect_url = $referer ? $callback_url . '?referer=' . urlencode($referer) : $callback_url;
$login_url = $helper->getLoginUrl($redirect_url, $permissions);

echo apiReturnSuccess([
        'fb_login_url' => $login_url
]);
die();
