<?php

session_start();
// $_SESSION['sUserName']="miaryory";
// $_SESSION['iUserId']='26';

if (! isset($_SESSION['iUserId'])){
    sendError(400,"You must login", __LINE__ );
}

require_once( __DIR__.'/../private/db.php');

try{
    $query = $db->prepare('SELECT userId AS id, userUserName AS userName, userName AS name, userLastName AS lastName, userProfilePictureUrl AS profilePictureUrl FROM users WHERE userUserName != :sUserName LIMIT 5');
    $query->bindValue('sUserName', $_SESSION['sUserName']);
    $query->execute();
    $ajData = $query->fetchAll();
    //check follow status here : if they are already following each other
    $ajUsers=[];
    foreach($ajData as $jUser){
        $query = $db->prepare('SELECT * FROM followNetworks WHERE followUserFk = :followUserFk AND followFollowerFk = :followFollowerFk');
        $query->bindValue('followUserFk', $jUser->id);
        $query->bindValue('followFollowerFk', $_SESSION['iUserId']);
        $query->execute();
        $row = $query->rowCount();
        if($row == 0){
            array_push($ajUsers, $jUser);
        }
    }
    header('Content-Type: application/json');
    echo json_encode($ajUsers);
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
