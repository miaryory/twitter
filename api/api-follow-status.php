<?php

//NOT USED YET

session_start();

if (! isset($_SESSION['iUserId'])){
    sendError(400,"You must login", __LINE__ );
}

require_once( __DIR__.'/../private/db.php');

try{
    //SELECT * FROM followers WHERE iUserFk = 26 AND iFollowerFk = 29
    $query = $db->prepare('SELECT * FROM followNetworks WHERE followUserFk = :followUserFk AND followFollowerFk = :followFollowerFk LIMIT 1');
    $query->bindValue('followUserFk', $_POST['user2']);
    $query->bindValue('followFollowerFk', $_SESSION['iUserId']);
    $query->execute();
    echo $query->rowCount();
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