<?php

//VALIDATION

require_once( __DIR__.'/../private/db.php');

try{
    $query= $db->prepare('UPDATE tweets SET tweetRetweetsCounts = tweetRetweetsCounts + 1 WHERE tweetId = :tweetId');
    $query->bindValue(':tweetId', $_POST['id']);
    $query->execute();
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
