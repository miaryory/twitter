<?php

//VALIDATION
session_start();

$_SESSION['iUserId']=1;

if (! isset($_SESSION['iUserId'])){
    sendError(400,"You must login to tweet", __LINE__ );
}

require_once( __DIR__.'/../private/db.php');

try{
    $db->beginTransaction();

    $query = $db->prepare('UPDATE tweets SET tweetLikesCount = tweetLikesCount + 1 WHERE tweetId = :tweetId');
    $query->bindValue(':tweetId', $_POST['id']);
    $query->execute();
    //if rowCount then it was updated
    if( $query->rowCount() == 0){
        //call rollback if something goes wrong: if statement, error, exception
        $db->rollback(); 
        sendError(400, "Something went wrong", __LINE__);
    }

    $query = $db->prepare('INSERT INTO likes VALUES (:likeId, :likeUserFk, :likeTweetFk, current_timestamp())');
    $query->bindValue(':likeId', null);
    $query->bindValue(':likeUserFk',$_SESSION['iUserId']);
    $query->bindValue(':likeTweetFk',$_POST['id']);
    $query->execute();
    if( $query->rowCount() == 0){
        $db->rollback(); 
        sendError(400, "Something went wrong", __LINE__);
    }

    $db->commit();
}
catch(Exception $ex){
    echo $ex;
    sendError(500, "system under maintenance", __LINE__);
}

// #############################################
function sendError($iResponseCode, $sMessage, $iLine){
    http_response_code($iResponseCode);
    header('Content-Type: application/json');
    echo '{"message":"'.$sMessage.'", "error":'.$iLine.'}';
    exit();
}
