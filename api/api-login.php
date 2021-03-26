<?php

require_once( __DIR__.'/../private/db.php');

try{
    $query = $db->prepare('SELECT * FROM users WHERE userEmail = :userEmail LIMIT 1');
    $query->bindValue(':userEmail', $_POST['email']);
    $query->execute();
    $row = $query->fetch();
    if(password_verify($_POST['password'], $row->userPassword)){
        session_start();
        $_SESSION['iUserId'] = $row->userId;
        $_SESSION['sName'] = $row->userName;
        $_SESSION['sLastName'] = $row->userLastName;
        $_SESSION['sUserName'] = $row->userUserName;
        $_SESSION['sProfilePictureUrl'] = $row->userProfilePictureUrl;
        header('location: ../timeline.php');
        exit();
    }
    http_response_code(401);
    echo 'INVALID';
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
