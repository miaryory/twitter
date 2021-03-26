<?php

session_start();

if (! isset($_SESSION['iUserId'])){
    sendError(400, "You must login to delete a tweet", __LINE__ );
}

require_once( __DIR__.'/../private/db.php');

try{
    //SELECT * FROM tweets WHERE iUserFk=26
    $query = $db->prepare('SELECT * FROM tweets WHERE tweetId = :tweetId AND tweetUserFk = :tweetUserFk');
    $query->bindValue(':tweetId', $_POST['tweetid']);
    $query->bindValue(':tweetUserFk', $_SESSION['iUserId']);
    $query->execute();
    echo $query->rowCount();
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