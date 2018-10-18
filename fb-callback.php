<?php
require 'lib/ini.php';
require 'lib/facebook_sdk/src/Facebook/autoload.php';
$fb = new Facebook\Facebook([
        'app_id' => FACEBOOK_APP_ID, // Replace {app-id} with your app id
        'app_secret' => FACEBOOK_APP_SECRET,
        'default_graph_version' => FACEBOOK_APP_GRAPH_VERSION
]);

$helper = $fb->getRedirectLoginHelper();
if (isset($_GET['state'])) {
    $helper->getPersistentDataHandler()->set('state', $_GET['state']);
}

$referer = isset($_GET['referer']) ? trim($_GET['referer']) : '';
if (!$referer) {
    echo apiReturnError(10004, 'error referer');
    die();
}
$log = new \lib\log();
try {
    $accessToken = $helper->getAccessToken();
} catch (Facebook\Exceptions\FacebookResponseException $e) {
    // When Graph returns an error
    $log->write('facebook_api_error', 'Graph get accestoken returned an error: ' . $e->getMessage());
    header('Location:' . $referer);
    die();
} catch (Facebook\Exceptions\FacebookSDKException $e) {
    // When validation fails or other local issues
    $log->write('facebook_api_error', 'Facebook SDK returned an error: ' . $e->getMessage());
    header('Location:' . $referer);
    die();
}

if (!isset($accessToken)) {
    if ($helper->getError()) {
        header('HTTP/1.0 401 Unauthorized');
        echo "Error: " . $helper->getError() . "\n";
        echo "Error Code: " . $helper->getErrorCode() . "\n";
        echo "Error Reason: " . $helper->getErrorReason() . "\n";
        echo "Error Description: " . $helper->getErrorDescription() . "\n";
    } else {
        header('HTTP/1.0 400 Bad Request');
        echo 'Bad request';
    }
    header('Location:' . $referer);
    die();
}

$access_token_value = $accessToken->getValue();

try {
    // Returns a `Facebook\FacebookResponse` object
    $response = $fb->get('/me?fields=id,name,email', $access_token_value);
} catch (Facebook\Exceptions\FacebookResponseException $e) {
    $log->write('facebook_api_error', 'Graph get me api returned an error: ' . $e->getMessage());
    header('Location:' . $referer);
    die();
} catch (Facebook\Exceptions\FacebookSDKException $e) {
    $log->write('facebook_api_error', 'Facebook SDK returned an error: ' . $e->getMessage());
    header('Location:' . $referer);
    die();
}

$user = $response->getGraphUser();
if (!$user) {
    $log->write('facebook_api_error', 'user is null');
    header('Location:' . $referer);
    die();
}
$user_data['facebook_uid'] = $user->getId();
$user_data['nickname'] = $user->getName();
$user_data['email'] = $user->getEmail();
$facebook_user_model = new \lib\FacebookUser();
$facebook_user_info = $facebook_user_model->getByUid($user_data['facebook_uid']);
if (!$facebook_user_info) {
    $result = $facebook_user_model->insert($user_data);
} else {
    $result = $facebook_user_model->updateById($facebook_user_info['id'], $user_data);
}
if ($result === false) {
    $log->write('facebook_api_error', 'insert or update error');
    header('Location:' . $referer);
    die();
}
$_SESSION['user']['facebook'] = $user_data;
header('Location:' . $referer);
die();







