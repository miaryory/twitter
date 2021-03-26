<?php

session_start();

if (! isset($_SESSION['iUserId'])){
    sendError(400,"You must login to tweet", __LINE__ );
}

require_once( __DIR__.'/../private/db.php');

try{
    $query = $db->prepare('SELECT * FROM likes WHERE likeUserFk = :userId AND likeTweetFk = :tweetId');
    $query->bindValue(':userId', $_SESSION['iUserId']);
    $query->bindValue(':tweetId', $_POST['id']);
    $query->execute();
    if($query->rowCount() == 0){
        echo 'not liked';
        exit();
    }
    echo 'liked';
}
catch(Exception $ex){
    sendError(500, "system under maintenance", __LINE__);
}

// #############################################
function sendError($iResponseCode, $sMessage, $iLine){
    http_response_code($iResponseCode);
    header('Content-Type: application/json');
    echo '{"message":"'.$sMessage.'", "error":'.$iLine.'}';
    exit();
}
