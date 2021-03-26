<?php

if( ! isset($_POST['name']) ){
sendError(400, 'missing name', __LINE__);
}
if( ! isset($_POST['lastname']) ){
sendError(400, 'missing lastname', __LINE__);
}
if( ! isset($_POST['username']) ){
sendError(400, 'missing username', __LINE__);
}
if( ! isset($_POST['email']) ){
sendError(400, 'missing email', __LINE__);
}
if( ! isset($_POST['password']) ){
sendError(400, 'missing password', __LINE__);
}
if( ! isset($_POST['passwordConfirmation']) ){
sendError(400, 'missing passwordConfirmation', __LINE__);
}

if( strlen($_POST['name']) < 2 ){
sendError(400, 'name must be at least 2 characters', __LINE__);
}
if( strlen($_POST['name']) > 20 ){
sendError(400, 'name cannot be longer than 5 characters', __LINE__);
}
if( strlen($_POST['lastname']) < 2 ){
sendError(400, 'lastname must be at least 2 characters', __LINE__);
}
if( strlen($_POST['lastname']) > 20 ){
sendError(400, 'lastname cannot be longer than 5 characters', __LINE__);
}
if( strlen($_POST['username']) < 2 ){
sendError(400, 'username must be at least 2 characters', __LINE__);
}
if( strlen($_POST['username']) > 20 ){
sendError(400, 'username cannot be longer than 20 characters', __LINE__);
}

if( ! filter_var( $_POST['email'], FILTER_VALIDATE_EMAIL ) ){
sendError(400, 'email is not valid', __LINE__);
}
if( strlen($_POST['password']) < 2 ){
sendError(400, 'password must be at least 2 characters', __LINE__);
}
if( strlen($_POST['password']) > 20 ){
sendError(400, 'password cannot be longer than 5 characters', __LINE__);
}
if( $_POST['password'] !=  $_POST['passwordConfirmation'] ){
sendError(400, 'passwords do not match', __LINE__);
}

require_once( __DIR__.'/../private/db.php');

try{
    //check of email is already registered
    $query = $db->prepare('SELECT * FROM users 
    WHERE userEmail = :email LIMIT 1');
    $query->bindValue(':email', $_POST['email']);
    $query->execute();
    $aRow = $query->fetch();
    if( $aRow ){
        sendError(500, 'email already registered', __LINE__);
    }
    
    // INSERT INTO `users` (`iId`, `sName`, `sLastName`, `sUserName`, `sEmail`, `sPassword`, `bActive`, `sVerificationCode`, `dCreated`) VALUES (NULL, '', '', '', '', '', '0', '', current_timestamp());
    $query = $db->prepare('INSERT INTO users VALUES (:userId, :userName, :userLastName, :userUserName, :userEmail, :userPassword, :userActiveStatus, :userVerificationCode, current_timestamp(), :userProfileUrl, :userProfilePictureUrl, :userProfileDescription, :userFollowersCount, :userFollowingCount, :userTweetsCount)');
    $query->bindValue(':userId', null);
    $query->bindValue(':userName', $_POST['name']);
    $query->bindValue(':userLastName', $_POST['lastname']);
    $query->bindValue(':userUserName', $_POST['username']);
    $query->bindValue(':userEmail', $_POST['email']);
    $query->bindValue(':userPassword', password_hash($_POST['password'], PASSWORD_DEFAULT));
    $query->bindValue(':userActiveStatus', 0);
    $query->bindValue(':userVerificationCode', uniqid());
    $query->bindValue(':userProfileUrl', 'twitter/'.$_POST['username']);
    $query->bindValue(':userProfilePictureUrl', "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png");
    $query->bindValue(':userProfileDescription', null);
    $query->bindValue(':userFollowersCount', 0);
    $query->bindValue(':userFollowingCount', 0);
    $query->bindValue(':userTweetsCount', 0);
    // $query->bindValue(':dCreated', current_timestamp());
    $query->execute();
}
catch(Exception $ex){
    echo $ex;
    sendError(500, 'system under maintainance', __LINE__);
}

// #############################################
function sendError($iResponseCode, $sMessage, $iLine){
    http_response_code($iResponseCode);
    header('Content-Type: application/json');
    echo '{"message":"'.$sMessage.'", "error":'.$iLine.'}';
    exit();
}
