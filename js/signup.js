async function signup(){
    let request =  await fetch('./api/api-signup.php', {method:"POST", body: new FormData(event.target)});

    if( request.status != 200 ){
      alert('contact system admin');
      return;
    }
    // location.href="/"
}