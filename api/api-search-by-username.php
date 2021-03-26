<?php

session_start();

require_once( __DIR__.'/../private/db.php');

if ( ! isset($_GET['userNameSearched']) ){
    sendError(400, 'missing input',__LINE__);
}

if( strlen($_GET['userNameSearched']) < 1 ){
    sendError(400, 'input must be at least 1 characters',__LINE__);
}

if( strlen($_GET['userNameSearched']) > 100 ){
    sendError(400, 'input must be at most 100 characters',__LINE__);
}

try{
    //MySQL Full text search:
    // $query = $db->prepare('SELECT iId AS id, sUserName AS userName, sName AS name, sLastName AS lastName, sProfilePictureUrl AS profilePictureUrl FROM users WHERE sUserName LIKE :userNameSearched LIMIT 5');
    $query = $db->prepare('SELECT userId AS id, userUserName AS userName, userName AS name, userLastName AS lastName, userProfilePictureUrl AS profilePictureUrl FROM users WHERE userUserName LIKE :userNameSearched  LIMIT 5');
    $query->bindValue('userNameSearched', $_GET['userNameSearched'].'%');
    $query->execute();
    $ajData = $query->fetchAll();
    header('Content-Type: application/json');
    echo json_encode($ajData);
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
