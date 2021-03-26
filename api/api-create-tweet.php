<?php

    //VALIDATION
    session_start();

    if (! isset($_SESSION['iUserId'])){
        sendError(400,"You must login to tweet", __LINE__ );
    }
    if(! isset($_POST['tweetContent'])){
        sendError(400,"Tweet is empty", __LINE__ );
    }
    if(strlen($_POST['tweetContent'])>140){
        sendError(400,"Tweet should be at most 140 characters", __LINE__ );
    }

    //ADD VALIDATION FILE SIZE/TYPE etc
    $uploaddir = __DIR__.'/../uploads/';
    $uploadfile = $uploaddir.basename($_FILES['myFile']['name']);
    // $fileUrl = './uploads/'.basename($_FILES['myFile']['name']);
    $fileUrl = basename($_FILES['myFile']['name']);
    
    if (!move_uploaded_file($_FILES['myFile']['tmp_name'], $uploadfile)) {
        $fileUrl = '';
    }

    require_once( __DIR__.'/../private/db.php');

    try{
        $query = $db->prepare('INSERT INTO tweets VALUES (NULL, :tweetUserFk, :tweetContent, :tweetActiveStatus, current_timestamp(), :tweetLikesCount, :tweetRetweetsCount, :tweetSharesCount, :tweetCommentsCount, :tweetMediaUrl)');
        $query->bindValue(':tweetUserFk', $_SESSION['iUserId']);
        $query->bindValue(':tweetContent', $_POST['tweetContent']);
        $query->bindValue(':tweetActiveStatus', 1);
        $query->bindValue(':tweetLikesCount', 0);
        $query->bindValue(':tweetRetweetsCount', 0);
        $query->bindValue(':tweetSharesCount', 0);
        $query->bindValue(':tweetCommentsCount', 0);
        $query->bindValue(':tweetMediaUrl', $fileUrl);
        $query->execute();
        $iTweetId = $db->lastInsertId();
        // echo $iTweetId;
        $query = $db->prepare('SELECT * FROM tweets JOIN users ON tweets.tweetUserFk = users.userId WHERE tweetId = :tweetId LIMIT 1');
        $query->bindValue(':tweetId', $iTweetId);
        $query->execute();
        $row = $query->fetch();
        header('Content-Type: application/json');
        // echo $row->sTweet;
        echo json_encode($row);
    }
    catch(Exception $ex){
        // echo $ex;
        sendError(500, 'system under maintainance', __LINE__);
    }
    
    // #############################################
    function sendError($iResponseCode, $sMessage, $iLine){
        http_response_code($iResponseCode);
        header('Content-Type: application/json');
        echo '{"message":"'.$sMessage.'", "error":'.$iLine.'}';
        exit();
    }
    

// try{

//     $newTweet=new stdClass();
//     $newTweet->tweetid=uniqid();
//     $newTweet->userid=$_SESSION['iUserId'];
//     $newTweet->tweetContent=$_POST['tweetContent'];
//     $newTweet->comments=0;//random_int(0,999);
//     $newTweet->retweet=0;
//     $newTweet->likes=0;

//     //add tweet id to the user tweets list
//     $aUsers=json_decode(file_get_contents('private/users.txt'));
//     foreach($aUsers as $aUser){
//         if($aUser->id == $newTweet->userid){
//             array_push($aUser->tweetsid, $newTweet->tweetid);
//             file_put_contents('private/users.txt', json_encode($aUsers));
//         }
//     }

//     $aTweets=json_decode(file_get_contents('tweets.txt'));
//     array_push($aTweets, $newTweet);
//     file_put_contents('tweets.txt', json_encode($aTweets));
//     header('Content-Type: application/json');
//     echo json_encode($newTweet);
// }
// catch(Exception $ex){
//     http_response_code(500);
//     header('Content-Type: application/json');
//     echo '{"message":"error '.__LINE__.' "}';
// }