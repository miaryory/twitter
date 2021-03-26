<?php

session_start();

if (! isset($_SESSION['iUserId'])){
    sendError(400, "You must login to delete a tweet", __LINE__ );
}

require_once( __DIR__.'/../private/db.php');

try{
    $query = $db->prepare('DELETE FROM tweets WHERE tweetId = :tweetId AND tweetUserFk = :tweetUserFk');
    $query->bindValue(':tweetId', $_GET['tweetid']);
    $query->bindValue(':tweetUserFk', $_SESSION['iUserId']);
    $query->execute();
}
catch(Exception $ex){
    sendError(500, 'system under maintainance', __LINE__);
}

// #############################################
function sendError($iResponseCode, $sMessage, $iLine){
    http_response_code($iResponseCode);
    header('Content-Type: application/json');
    echo '{"message":"'.$sMessage.'", "error":'.$iLine.'}';
    exit();
}