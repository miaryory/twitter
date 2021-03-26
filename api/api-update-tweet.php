<?php

session_start();

if (! isset($_SESSION['iUserId'])){
    sendError(400, "You must login to delete a tweet", __LINE__ );
}

require_once( __DIR__.'/../private/db.php');

try{
    $query = $db->prepare('UPDATE tweets SET tweetContent = :tweetContent WHERE tweetId = :tweetId');
    $query->bindValue(':tweetContent', $_POST['newTweetContent']);
    $query->bindValue(':tweetId', $_GET['tweetid']);
    $query->execute();

    $query = $db->prepare('SELECT * FROM tweets WHERE tweetId = :tweetId');
    $query->bindValue(':tweetId', $_GET['tweetid']);
    $query->execute();
    $row = $query->fetch();
    echo json_encode($row);
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