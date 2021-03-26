<?php

session_start();

if (! isset($_SESSION['iUserId'])){
    sendError(400,"You must login to start following people", __LINE__ );
}

require_once( __DIR__.'/../private/db.php');

try{
    //DELETE FROM followNetworks WHERE followUserFk = 5 AND followFollowerFk = 1
    $query = $db->prepare('DELETE FROM followNetworks WHERE followUserFk = :followUserFk AND followFollowerFk = :followFollowerFk');
    $query->bindValue(':followUserFk', $_POST['userFollowed']);
    $query->bindValue(':followFollowerFk', $_SESSION['iUserId']);
    $query->execute();
;
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