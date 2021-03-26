<?php

//VALIDATION
session_start();

if (! isset($_SESSION['iUserId'])){
    sendError(400,"cannot fetch tweets", __LINE__ );
}

require_once( __DIR__.'/../private/db.php');

try{
    $query = $db->prepare('SELECT * FROM tweets JOIN users ON tweets.tweetUserFk = users.userId WHERE tweetUserFk = :userId');
    $query->bindValue(':userId', $_SESSION['iUserId']);
    $query->execute();
    $aRows = $query->fetchAll();
    header('Content-Type:application/json');
    echo json_encode($aRows);
    exit();
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