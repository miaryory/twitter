async function login(){
    let request = await fetch('./api/api-login.php', {
        method: "POST",
        body: new FormData(event.target)
    })

    if( request.status == 200 ){
       location.href="timeline.php";
    }
}