<?php
//VALIDATION
session_start();

if (! isset($_SESSION['iUserId'])){
    sendError(400,"cannot fetch tweets", __LINE__ );
}

require_once( __DIR__.'/../private/db.php');

try{
    $query = $db->prepare('SELECT tweetMediaUrl FROM tweets WHERE tweetId = :tweetId');
    $query->bindValue(':tweetId', $_POST['tweetId']);
    $query->execute();
    $aRow = $query->fetch();
    echo json_encode($aRow);
    exit();
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
