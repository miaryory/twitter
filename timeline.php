<?php

session_start();

if( !isset($_SESSION['sName'])){
    header('location: index.php');
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Twitter Clone</title>
    <link rel="stylesheet" href="css/app-mobile.css">
    <link rel="stylesheet" href="css/app-tablet.css">
    <link rel="stylesheet" href="css/app.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" rel="stylesheet"> 
</head>
<body onload="pageLoad()">

    <div id="page">

        <?php require_once(__DIR__.'/components/left.php') ?>
        <?php require_once(__DIR__.'/components/center.php') ?>
        <?php require_once(__DIR__.'/components/right.php') ?>

    </div>

    <script src="js/app.js"></script>
    
</body>
</html>