function pageLoad(){
    getTweets();
    showSuggestions();
}

function showPage(pageId){
    document.querySelectorAll(".subpage").forEach(page =>{
        page.style.display="none";
        select("#page").style.gridTemplateColumns="9fr 23fr 13fr";
        select("#right .trends").style.display="block"
        select("#right .search-bar").style.display="grid"
        select("#right").style.display="block";
        select("#chat").style.display="none";
    })

    //add the active class to the menu element
    document.querySelectorAll(".menu-container").forEach(menu =>{
        menu.classList.remove("active")
    })

    if(pageId=="explore"){
        select("#right .trends").style.display="none"
        select("#right .search-bar").style.display="none"
    }

    if(pageId=="messages"){
        select("#page").style.gridTemplateColumns="9fr 14fr 19fr";
        select("#right").style.display="none";
        select("#chat").style.display="block";
    }

    select("#follow-page").style.display="none";
    document.getElementById(pageId).style.display="grid"
    document.getElementById(pageId+"-menu").classList.add("active")
    //changes window ULR without reloading
    // cannot go back to previous page
    // window.history.replaceState({}, '',pageId);

    //USE THIS: CREATE A PAGE FOR EACH SECTION??
    window.history.pushState('', pageId, pageId);
}

function showFollowPage(){
    select("#profile").style.display="none";
    select("#follow-page").style.display="block";
}

function showLogout(){
    select(".logout").classList.toggle("hidden")
}

function showTweetVisibility(){
    let textarea = event.target
    textarea.nextElementSibling.nextElementSibling.style.display="grid"
}

function enableTweetBtn(){
    let tweetBtn = event.target.nextElementSibling.nextElementSibling.nextElementSibling.lastElementChild
    tweetBtn.disabled = false;
}

function openModal(modalName){
    select(modalName).style.display="block"
}

function closeModal(modalName){
    select(modalName).style.display="none"
}

function showLoginSignupPage(pageId){
    document.querySelectorAll(".landing-subpage").forEach(page =>{
        page.style.display="none"
    })
    document.getElementById(pageId).style.display="grid"
}

function toggleTweetOptions(){
    let btn = event.target.nextElementSibling
    btn.classList.toggle("hidden")
}

//this will give an unclickable preview to the user
function handleFiles() {
    let fileList = event.target.files;
    let mediaPreviewPlaceholder = event.target.parentNode.parentNode.parentNode.previousElementSibling.previousElementSibling;
    //enable tweet btn
    event.target.parentNode.parentNode.nextElementSibling.disabled = false;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      if (!file.type.startsWith('image/')){ continue }

      const objectURL = window.URL.createObjectURL(file);
    //   console.log(objectURL);
    objectURL.onload = function() {
        URL.revokeObjectURL(this);
      }
      mediaPreviewPlaceholder.style.backgroundImage="url('"+objectURL+"')";
      mediaPreviewPlaceholder.classList.add("showPreview");
    //   console.log(objectURL);
      
      /*************THIS IS CREATING AN IMG ELEMENT AND ADD IT TO THE DOM*****************/
    //   const img = document.createElement("img");
    //   img.classList.add("obj");
    //   img.file = file;
    //   mediaPreviewPlaceholder.appendChild(img);
    //   const reader = new FileReader();
    //   reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
    //   reader.readAsDataURL(file);
    }
}

async function tweet(){
    let mediaPreviewPlaceholder = event.target.firstChild.nextElementSibling.nextElementSibling;
    mediaPreviewPlaceholder.classList.remove("showPreview");
    let tweetTextArea = event.target.querySelector("textarea");

    let tweetData=new FormData(event.target)

    let request =  await fetch('api/api-create-tweet.php', {method:"POST", body : tweetData})
    let jTweet = await request.json()
    // let jTweet = JSON.parse(sTweet)
    
    if(request.status!=200){
        return
    }

    // <div class="retweet">
    //     <svg viewBox="0 0 24 24"><g><path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path></g></svg>
    //     <p>imcardib retweeted</p>
    // </div>

    // createDivTweet(dataId, imgSrc, name, lastname, username, date, tweetContent, comments, retweets, likes, tweetMedia)
    let tweet = createDivTweet(jTweet.tweetId,jTweet.userProfilePictureUrl,jTweet.userName,jTweet.userLastName,jTweet.userUserName,jTweet.tweetCreationDate,jTweet.tweetContent,jTweet.tweetCommentsCount,jTweet.tweetRetweetsCount,jTweet.tweetLikesCount, false, true, jTweet.tweetMediaUrl);
    select("#timeline").insertAdjacentHTML('afterbegin', tweet);
    select(".tweet-input-content").value = '';
    let likeDiv = document.querySelector("#timeline .tweet-container .tweet .full-tweet .tweet-reactions .likes p");
    likeDiv.addEventListener("click", likeTweet);

    tweetTextArea.value = "";
}

function openDeleteModal(){
    let modal = event.target.parentNode.nextElementSibling;
    modal.style.display="block";
    event.target.parentNode.classList.add("hidden");
}

function closeDeleteModal(){
    let modal = event.target.parentNode.parentNode.parentNode;
    modal.style.display="none";
    event.target.parentNode.parentNode.parentNode.previousElementSibling.classList.add("hidden");
}

async function deleteTweet(){
    let tweetid=event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-id")
    let tweetElement=event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode

    let request = await fetch('api/api-delete-tweet.php?tweetid='+tweetid)
    
    if(request.status!=200){
        return
    }

    tweetElement.remove();
}

async function getTweets(){
    select("#timeline").innerHTML=""

    let request =  await fetch('api/api-get-tweets.php')

    if(request.status!=200){
        console.log("error")
        return
    }

    //the response is an array of json objects
    let ajTweets = await request.json();
    
    for(i=0;i<ajTweets.length;i++){

        let tweetData=new FormData();
        tweetData.append('id', ajTweets[i].tweetId);
        let request = await fetch('api/api-check-liked-tweet.php',{method:"POST", body:tweetData});
        let sLiked = await request.text();

        let form = new FormData();
        form.append('tweetid', ajTweets[i].tweetId);
        let request2 = await fetch('api/api-check-tweet-permissions.php',{
            method:"POST",
            body : form
        });
        let response = await request2.text();

        // createDivTweet(dataId, imgSrc, name, lastname, username, date, tweetContent, comments, retweets, likes)
        let tweet = createDivTweet(ajTweets[i].tweetId,ajTweets[i].userProfilePictureUrl,ajTweets[i].userName,ajTweets[i].userLastName,ajTweets[i].userUserName,ajTweets[i].tweetCreationDate,ajTweets[i].tweetContent,ajTweets[i].tweetCommentsCount, ajTweets[i].tweetRetweetsCount,ajTweets[i].tweetLikesCount, sLiked=="liked"?true:false,response==1?true:false, ajTweets[i].tweetMediaUrl);
        select("#timeline").insertAdjacentHTML('afterbegin', tweet);
        let likeDiv = document.querySelector("#timeline .tweet-container .tweet .full-tweet .tweet-reactions .likes p");
        if(sLiked=="liked"){
            likeDiv.addEventListener("click",unlikeTweet);
        }
        else{
            likeDiv.addEventListener("click", likeTweet);
        }
    }

}

function editTweet(){
    let tweetContent=event.target.parentNode.parentNode.nextElementSibling

    event.target.parentNode.classList.add("hidden")
    tweetContent.querySelector("form textarea").value=tweetContent.querySelector("p").innerText
    tweetContent.querySelector("form").classList.remove("hidden")
    tweetContent.querySelector("p").classList.add("hidden")
}

async function saveTweet(){
    let tweetContentDiv=event.target.parentNode
    
    let tweetid=event.target.parentNode.parentNode.parentNode.parentNode.getAttribute("data-id")
    let newTweetData= new FormData(event.target)
    
    let request = await fetch('api/api-update-tweet.php?tweetid='+tweetid, {"method":"POST","body":newTweetData})
    
    let sTweet=await request.text()
    let jTweet=JSON.parse(sTweet)
    
    if(request.status!=200){
        return
    }
    
    tweetContentDiv.querySelector("form").classList.add("hidden")
    tweetContentDiv.querySelector("p").innerText=jTweet[2]
    tweetContentDiv.querySelector("p").classList.remove("hidden")
    
}

function cancelEdit(){
    let tweetContent=event.target.parentNode.parentNode.parentNode

    tweetContent.querySelector("form").classList.add("hidden")
    tweetContent.querySelector("p").classList.remove("hidden")
}

async function getMyTweets(userid){
    select("#profile #myTweets").innerHTML=""
    let request=await fetch('api/api-get-tweets-same-author.php?userid='+userid)

    if(request.status!=200){
        console.log("error")
        return
    }

    let ajTweets = await request.json();
    for(i=0;i<ajTweets.length;i++){
        let tweetData=new FormData();
        tweetData.append('id', ajTweets[i].tweetId);
        let request = await fetch('api/api-check-liked-tweet.php',{method:"POST", body:tweetData});
        let sLiked = await request.text();

        // createDivTweet(dataId, imgSrc, name, lastname, username, date, tweetContent, comments, retweets, likes)
        let tweet = createDivTweet(ajTweets[i].tweetId,ajTweets[i].userProfilePictureUrl,ajTweets[i].userName,ajTweets[i].userLastName,ajTweets[i].userUserName,ajTweets[i].tweetCreationDate,ajTweets[i].tweetContent,ajTweets[i].tweetCommentsCount, ajTweets[i].tweetRetweetsCount,ajTweets[i].tweetLikesCount, sLiked=="liked"?true:false,true, ajTweets[i].tweetMediaUrl);
        select("#profile #myTweets").insertAdjacentHTML('afterbegin', tweet);
        let likeDiv = document.querySelector("#profile #myTweets .tweet-container .tweet .full-tweet .tweet-reactions .likes p");
        if(sLiked=="liked"){
            likeDiv.addEventListener("click", unlikeTweet);
        }
        else{
            likeDiv.addEventListener("click", likeTweet);
        }
    }
}

function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.querySelectorAll("#profile .tabcontent");
    select("#myTweets").classList.add("tabcontent");

    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    tablinks = document.querySelectorAll(".profile-tab .tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", " ");
    }

    select("#"+tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function openFollowTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.querySelectorAll("#follow-page .tabcontent");
    select("#followers-tab").classList.add("tabcontent");

    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    tablinks = document.querySelectorAll(".follow-tab .tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", " ");
    }

    select("#"+tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function showSearchResults(){
    event.target.parentNode.style.background = "white";
    event.target.parentNode.style.border = "1px solid rgb(29, 161, 242)";
    event.target.previousElementSibling.style.fill = "rgb(29, 161, 242)";
    let resultsDiv = event.target.parentNode.parentNode.nextElementSibling;
    resultsDiv.style.display="block";
}

function hideSearchResults(){
    event.target.parentNode.style.background = "rgb(230, 236, 240)";
    event.target.parentNode.style.border = "none";
    event.target.previousElementSibling.style.fill = "rgb(101, 119, 134)";
    let resultsDiv = event.target.parentNode.parentNode.nextElementSibling;
    resultsDiv.style.display="none";
}

async function startSearch(){
    let searchInput = event.target;
    let searchValue = searchInput.value;

    if(searchValue.length<1){
        return;
    }

    let request = await fetch('api/api-search-by-username.php?userNameSearched='+ searchValue);

    if(request.status!=200){
        console.log("error")
        return;
    }

    let jData = await request.json();
    let resultsDiv = searchInput.parentNode.parentNode.nextElementSibling;
    resultsDiv.innerHTML="";

    jData.forEach(item =>{
    let divResult = `
    <div class="result">
        <img src=${item.profilePictureUrl} alt="Profile picture">
        <div>
            <p class="result-name">${item.name + " " +item.lastName}</p>
            <p class="result-username">@${item.userName}</p>
        </div>
    </div>`
    resultsDiv.insertAdjacentHTML('afterbegin', divResult);
    });
}

async function likeTweet(){
    let parentDiv = event.target.parentNode;
    let tweetId = parentDiv.parentNode.parentNode.parentNode.parentNode.getAttribute("data-id");
    let form = new FormData();
    form.append('id', tweetId);

    let request = await fetch('api/api-like-tweet.php',{
        method: "POST",
        body: form
    }
    );

    if(request.status!=200){
        console.log("error")
        return
    }

    let redHeart = '<svg viewBox="0 0 24 24" class="likes-red-heart"><g><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></path></g></svg>';
    let greyHeart = parentDiv.firstElementChild;
    parentDiv.removeChild(greyHeart);
    parentDiv.innerHTML=redHeart+parentDiv.innerHTML;
    let likes = parentDiv.lastElementChild.innerText;
    likes++;
    parentDiv.lastElementChild.innerText = likes;
    parentDiv.removeEventListener("click",likeTweet);
    parentDiv.addEventListener("click", unlikeTweet);

}

async function unlikeTweet(){
    let parentDiv = event.target.parentNode;
    let tweetId = parentDiv.parentNode.parentNode.parentNode.parentNode.getAttribute("data-id");

    let form = new FormData();
    form.append('id', tweetId);

    let request = await fetch('api/api-unlike-tweet.php',{
        method: "POST",
        body: form
    }
    );

    if(request.status!=200){
        console.log("error")
        return
    }

    // update interface
    let greyHeart = '<svg viewBox="0 0 24 24" class="grey-icon"><g><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path></g></svg>';
    let redHeart = parentDiv.firstElementChild;
    parentDiv.removeChild(redHeart);
    parentDiv.innerHTML=greyHeart+parentDiv.innerHTML;
    let likes = parentDiv.lastElementChild.innerText;
    likes--;
    parentDiv.lastElementChild.innerText = likes;
    parentDiv.removeEventListener("click", unlikeTweet);
    parentDiv.addEventListener("click", likeTweet);
}

async function retweet(){
    let parentDiv = event.target.parentNode;
    parentDiv.querySelector("svg").style.fill="rgb(23, 191, 99)";
    let tweetId = parentDiv.parentNode.parentNode.parentNode.parentNode.getAttribute("data-id");

    let form = new FormData();
    form.append('id', tweetId);

    let request = await fetch('api/api-count-retweet.php',{
        method: "POST",
        body: form
    }
    );

    if(request.status!=200){
        console.log("error")
        return
    }

    let retweets = parentDiv.lastElementChild.innerText;
    retweets++;
    parentDiv.lastElementChild.innerText = retweets;
}

function select(searchFor){
    return document.querySelector(searchFor)
}

function getDate(dateFromDB){
    const months =  ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
    let date = new Date(dateFromDB);
    let sDate = months[date.getMonth()] + " " + date.getDate();
    return sDate;
}

function createDivTweet(dataId, imgSrc, name, lastname, username, date, tweetContent, comments, retweets, likes, likeStatus, tweetPermissions, tweetMedia){
    return divTweet=`
        <div class="tweet-container" data-id=${dataId}>


            <div class="tweet">

                <img alt="Profile picture" src="${imgSrc}" class="profile-picture">

                <div class="full-tweet">

                    <div class="tweet-data">
                        <div class="user-data">
                            <p class="name">${name+" "+lastname}</p>
                            <p class="username">@${username}</p>
                            <p>•</p>
                            <p class="date">${getDate(date)}</p>
                        </div>
                        <svg onclick="toggleTweetOptions()" class="tweet-options" viewBox="0 0 24 24"><g><path d="M20.207 8.147c-.39-.39-1.023-.39-1.414 0L12 14.94 5.207 8.147c-.39-.39-1.023-.39-1.414 0-.39.39-.39 1.023 0 1.414l7.5 7.5c.195.196.45.294.707.294s.512-.098.707-.293l7.5-7.5c.39-.39.39-1.022 0-1.413z"></path></g></svg>
                        <div class="select-option hidden">
                            ${tweetPermissions ? 
                                `<p onclick="editTweet()">Edit</p>
                                <p onclick="openDeleteModal(); return false">Delete</p>`
                             : `<p>Hide</p>
                                <p>Report</p>`}
                        </div>

                        <div id="delete-${dataId}" class="delete-modal">
                            <div class="modal-overlay" onclick="closeModal('#delete-${dataId}')"></div>
                            <div class="modal-container">
                                <h1>Delete Tweet</h1>
                                <p>This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from Twitter search results. </p>
                                <div class="delete-buttons-container">
                                    <button onclick="closeDeleteModal()">Cancel</button>
                                    <button onclick="deleteTweet(); closeModal('#delete-${dataId}')">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="tweet-content">
                        <p>${tweetContent}</p>
                        ${tweetMedia !="" ? `<img data-tweet-id=${dataId} onclick="openMediaModal()" alt="Tweet media" src="./uploads/${tweetMedia}" class="tweet-media"> ` : `<div></div>`}
                        <form class="hidden" onsubmit="saveTweet(); return false">
                            <textarea name="newTweetContent" type="text" value="${tweetContent}"></textarea>
                            <div>
                                <button>Save</button>
                                <button onclick="cancelEdit(); return false">Cancel</button>
                            </div>
                        </form>
                    </div>

                    <div class="tweet-reactions">
                        <div class="comments">
                            <svg viewBox="0 0 24 24" class="grey-icon"><g><path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path></g></svg>
                            <p>${comments}</p>
                        </div>

                        <div onclick="retweet()" class="retweets">
                            <svg viewBox="0 0 24 24" class="grey-icon"><g><path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path></g></svg>
                            <p>${retweets}</p>
                        </div>

                        <div class="likes">
                            ${likeStatus ? `<svg viewBox="0 0 24 24" class="likes-red-heart"><g><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></path></g></svg>` : `<svg viewBox="0 0 24 24" class="grey-icon"><g><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path></g></svg>`}
                            <p>${likes}</p>
                        </div>

                        <div class="share">
                            <svg viewBox="0 0 24 24" class="grey-icon"><g><path d="M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.072.53-.22c.293-.293.293-.767 0-1.06z"></path><path d="M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z"></path></g></svg>
                        </div>

                    </div>

                </div>

            </div>

        </div>
        `
}

async function getLikedTweets(){
    select("#profile #likedTweets").innerHTML="";

    let request = await fetch ('api/api-get-liked-tweets.php');
    let ajLikedTweets = await request.json();
    // console.log(ajLikedTweets);

    for(i=0;i<ajLikedTweets.length;i++){
        let form = new FormData();
        form.append('tweetid', ajLikedTweets[i].tweetId);
        let request2 = await fetch('api/api-check-tweet-permissions.php',{
            method:"POST",
            body : form
        });
        let response = await request2.text();

        // createDivTweet(dataId, imgSrc, name, lastname, username, date, tweetContent, comments, retweets, likes)
        let tweet = createDivTweet(ajLikedTweets[i].tweetId,ajLikedTweets[i].userProfilePictureUrl,ajLikedTweets[i].userName,ajLikedTweets[i].userLastName,ajLikedTweets[i].userUserName,ajLikedTweets[i].tweetCreationDate,ajLikedTweets[i].tweetContent,ajLikedTweets[i].tweetCommentsCount, ajLikedTweets[i].tweetRetweetsCount,ajLikedTweets[i].tweetLikesCount, true,true, ajLikedTweets[i].tweetMediaUrl);
        select("#profile #likedTweets").insertAdjacentHTML('afterbegin', tweet);
        let likeDiv = document.querySelector("#profile #likedTweets .tweet-container .tweet .full-tweet .tweet-reactions .likes p");
        likeDiv.addEventListener("click", unlikeTweet);
    }
}

async function showSuggestions(){
    let suggestionsContainer = select("#right .suggestions .suggested-users");
    let request = await fetch('api/api-fetch-user-suggestions.php');
    
    if(request.status!=200){
        console.log("error")
        return;
    }
    
    let ajUsers = await request.json();
    ajUsers.forEach(user =>{
        let userDiv = createDivUser(user.profilePictureUrl, user.name, user.lastName, user.userName, user.id, true);
        suggestionsContainer.insertAdjacentHTML('afterbegin', userDiv);
    });
}

function createDivUser(profilePictureUrl, name, lastName, userName, id, followed){
    return divUser = `
        <div class="suggestion-container">

            <img alt="Profile picture" src=${profilePictureUrl} class="profile-picture">

            <div class="suggestion-user">
                <p class="suggestion-name">${name + " " + lastName}</p>
                <p class="suggestion-username">@${userName}</p>
            </div>

            ${followed ? `
                <button class="follow-btn secondary-btn" onclick="follow()" data-id=${id}>Follow</button>
            ` : `
                <button class="following-btn" onclick="unfollow()" data-id=${id}>Following</button>
            `}
            <button class="following-btn hidden" onclick="unfollow()" data-id=${id}>Following</button>
            
        </div>
    `;
}

async function follow(){
    // let followedUser = event.target.parentNode;
    let followBtn = event.target
    let form = new FormData();
    form.append('userToFollowId', event.target.getAttribute("data-id"));
    let request = await fetch('api/api-add-follower.php',{
        method: "POST",
        body : form
    });

    if(request.status!=200){
        return;
    }

    //delete suggestion
    followBtn.classList.add("hidden");
    followBtn.nextElementSibling.classList.remove("hidden");
    // followedUser.remove();
}

async function unfollow(){
    // let followedUser = event.target.parentNode;
    let followBtn = event.target
    let form = new FormData();
    form.append('userFollowed', event.target.getAttribute("data-id"));
    let request = await fetch('api/api-unfollow-user.php',{
        method: "POST",
        body : form
    });

    if(request.status!=200){
        return;
    }

    //delete suggestion
    followBtn.classList.add("hidden");
    followBtn.previousElementSibling.classList.remove("hidden");
}

async function getFollowers(){
    select("#follow-page #followers-tab").innerHTML="";

    let request = await fetch('api/api-get-followers.php');

    if(request.status!=200){
        return;
    }

    let ajFollowers = await request.json();

    ajFollowers.forEach(follower=>{
        let userDiv = createDivUser(follower.userProfilePictureUrl, follower.userName, follower.userLastName, follower.userUserName, follower.userId, true);
        select("#follow-page #followers-tab").insertAdjacentHTML('beforeend', userDiv);
    });

}

async function getFollowing(){

    select("#follow-page #following-tab").innerHTML="";

    let request = await fetch('api/api-get-following.php');

    if(!request.ok){
        return;
    }

    let ajFollowings = await request.json();

    ajFollowings.forEach(following=>{
        let userDiv = createDivUser(following.userProfilePictureUrl, following.userName, following.userLastName, following.userUserName, following.userId, false);
        select("#following-tab").insertAdjacentHTML('beforeend', userDiv);
    })

}

async function showChats(){
    select("#messages .all-messages").innerHTML="";

    let request = await fetch('api/api-get-all-chats.php');

    if(request.status!=200){
        return
    }

    let allChats = await request.json();

    allChats.forEach(chat=>{
        let chatDiv = `
        <div class="message-user-container" >
                <div class="message-user-container-overlay" data-id="${chat.userId}" onclick="selectChat(${chat.chatId}, '${chat.userId}','${chat.userName +" "+ chat.userLastName}','${chat.userUserName}')"></div>
                <img alt="Profile picture" src=${chat.userProfilePictureUrl} class="profile-picture">

                <div class="message-user">
                    <p class="message-user-name">${chat.userName +" "+ chat.userLastName}</p>
                    <p class="message-user-username">@${chat.userUserName}</p>
                </div>
            </div>
        `;

        select("#messages .all-messages").insertAdjacentHTML('afterbegin', chatDiv);

    });
}

async function showSuggestionsTab(){
    let suggestionsContainer = select("#follow-page #suggestions-tab");
    suggestionsContainer.innerHTML="";
    let request = await fetch('api/api-fetch-user-suggestions.php');
    
    if(request.status!=200){
        console.log("error")
        return;
    }
    
    let ajUsers = await request.json();
    ajUsers.forEach(user =>{
        let userDiv = createDivUser(user.profilePictureUrl, user.name, user.lastName, user.userName, user.id, true);
        suggestionsContainer.insertAdjacentHTML('afterbegin', userDiv);
    });
}

async function searchMessageRecipient(){
    let searchInput = event.target;
    let searchValue = searchInput.value;

    if(searchValue.length<1){
        return;
    }

    let request = await fetch('api/api-search-by-username.php?userNameSearched='+ searchValue);

    if(request.status!=200){
        console.log("error")
        return;
    }

    let jData = await request.json();
    let resultsDiv = searchInput.parentNode.parentNode.nextElementSibling;
    resultsDiv.innerHTML="";

    jData.forEach(item =>{
    let divResult = `
    <div class="search-result-overlay" onclick="createNewChat(${item.id}, '${item.profilePictureUrl}', '${item.name + " " +item.lastName}', '${item.userName}')" onmouseover="highlightSaerchResult()" data-id=${item.id}></div>
    <div class="result">
        <img src=${item.profilePictureUrl} alt="Profile picture">
        <div>
            <p class="result-name">${item.name + " " +item.lastName}</p>
            <p class="result-username">@${item.userName}</p>
        </div>
    </div>`
    resultsDiv.insertAdjacentHTML('afterbegin', divResult);
    });
}

async function createNewChat(userid, proflePictureUrl, fullname, username){
    event.target.parentNode.style.display="none";

    let form = new FormData();
    form.append('toUserId', userid);

    let request = await fetch('api/api-create-new-chat.php', {method: "POST", body: form});

    if(request.status!=200){
        return
    }

    let chatId = await request.text();
    let allMsgDiv = select(".all-messages");
    let newMsgDiv = `
        <div class="message-user-container" data-id="${userid}" onclick="selectChat(${chatId}, '${userid}','${fullname}','${username}')">
            <img alt="Profile picture" src=${proflePictureUrl} class="profile-picture">

            <div class="message-user">
                <p class="message-user-name">${fullname}</p>
                <p class="message-user-username">@${username}</p>
            </div>
        </div>
    `;
    allMsgDiv.insertAdjacentHTML('afterbegin', newMsgDiv);
}

function highlightSaerchResult(){
    event.target.nextElementSibling.style.background="rgb(245, 248, 250)";
}

async function selectChat(chatId, userId, userfullname, username){
    allChats = document.querySelectorAll(".message-user-container");

    allChats.forEach(chat=>{
        chat.style.background="white";
        chat.style.borderRight="none";
    });

    event.target.parentNode.style.background="rgb(245, 248, 250)";
    event.target.parentNode.style.borderRight="2px solid rgb(29, 161, 242)";

    let chatTemplate= `
        <div class="sticky-header"> 
            <div>
                <p class="chat-name">${userfullname}</p>
                <p class="chat-username">@${username}</p>
            </div>    
            <div class="icon-div">
                <svg viewBox="0 0 24 24"><g><path d="M12 18.042c-.553 0-1-.447-1-1v-5.5c0-.553.447-1 1-1s1 .447 1 1v5.5c0 .553-.447 1-1 1z"></path><circle cx="12" cy="8.042" r="1.25"></circle><path d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12S6.072 1.25 12 1.25 22.75 6.072 22.75 12 17.928 22.75 12 22.75zm0-20C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25s9.25-4.15 9.25-9.25S17.1 2.75 12 2.75z"></path></g></svg>
            </div>
        </div>

        <div class="chat-bubbles" data-user-id=${userId} data-id=${chatId}></div>

        <div class="chat-form">
            <form onsubmit="return false">
                <div>
                    <input id="message-input" type="text" placeholder="Type here..." name="chatMessage">
                </div>
                <div class="icon-div">
                    <button onclick="sendMessage()"></button>
                    <svg viewBox="0 0 24 24" ><g><path d="M21.13 11.358L3.614 2.108c-.29-.152-.64-.102-.873.126-.23.226-.293.577-.15.868l4.362 8.92-4.362 8.92c-.143.292-.08.643.15.868.145.14.333.212.523.212.12 0 .24-.028.35-.087l17.517-9.25c.245-.13.4-.386.4-.664s-.155-.532-.4-.662zM4.948 4.51l12.804 6.762H8.255l-3.307-6.76zm3.307 8.26h9.498L4.948 19.535l3.307-6.763z"></path></g></svg>
                </div>
            </form>
        </div>
    `;

    select("#chat").innerHTML = chatTemplate;

    let request = await fetch('api/api-get-messages-by-user.php?chatId='+chatId);
    let ajMessages = await request.json();

    for(i=0; i<ajMessages.length;i++){

        let form = new FormData();
        form.append('messageId', ajMessages[i].messageId);
        let request2 = await fetch('api/api-check-message-permission.php', {method: "POST", body:form});
        let response = await request2.text();

        let divChat = `
            <div class="message ${response==1 ? "message-sent" : "message-received"}">
                <span>${ajMessages[i].messageContent}</span>
            </div>
        `;
        select("#chat .chat-bubbles").insertAdjacentHTML('beforeend', divChat);

    }


    //GETTING LATEST MESSAGE
    // let iLatestChatId = 0;

    // setInterval( ()=>{getLatestMessages()},1000);

    // async function getLatestMessages(){
    //     select("#chat .chat-bubbles").innerHTML="";
    //     let request = await fetch('api/api-get-latest-messages.php?iLatestChatId=' + iLatestChatId +"&chatId="+chatId, {
    //         headers: {
    //             'Cache-Control': 'no-cache'
    //         }
    //     });

    //     if(request.status != 200){
    //         console.log('something went wrong');
    //         return;
    //     }
    //     let ajMessages = await request.json();

    //     for(i=0; i<ajMessages.length;i++){

    //         let form = new FormData();
    //         form.append('messageId', ajMessages[i].messageId);
    //         let request2 = await fetch('api/api-check-message-permission.php', {method: "POST", body:form});
    //         let response = await request2.text();

    //         let divChat = `
    //             <div class="message ${response==1 ? "message-sent" : "message-received"}">
    //                 <span>${ajMessages[i].messageContent}</span>
    //             </div>
    //         `;
    //         select("#chat .chat-bubbles").insertAdjacentHTML('beforeend', divChat);

    //     }
    // }
}

async function sendMessage(){
    let chatId = event.target.parentNode.parentNode.parentNode.previousElementSibling.getAttribute('data-id');
    let toUserId = event.target.parentNode.parentNode.parentNode.previousElementSibling.getAttribute('data-user-id');
    let form = new FormData(event.target.parentNode.parentNode);
    form.append('chatId', chatId);
    form.append('toUserId', toUserId);

    let request = await fetch('api/api-create-message.php', {
        method : "POST",
        body: form
    });

    if(!request.ok){
        // getLatestMessages();
        return;
    }
    let message = select("#message-input");
    let divChat = `
        <div class="message message-sent">
            <span>${message.value}</span>
        </div>
    `;
    message.value="";
    select("#chat .chat-bubbles").insertAdjacentHTML('beforeend', divChat);
}

async function openMediaModal(){
    select(".media-modal .media-container").innerHTML="";
    let tweetId = event.target.getAttribute('data-tweet-id');
    let form = new FormData();
    form.append('tweetId', tweetId);

    let request = await fetch('api/api-get-tweet-media.php', {
        method : "POST",
        body: form
    });

    if(!request.ok){
        return;
    }

    let response = await request.json();

    let media = `
    <img data-tweet-id=${tweetId} alt="Tweet media" src="./uploads/${response.tweetMediaUrl}" class="tweet-media-modal">
    `;

    select(".media-modal .media-container").insertAdjacentHTML('afterbegin', media);
    select(".media-modal").style.display="block";
}

function closeMediaModal(){
    select(".media-modal").style.display="none";
}
//<svg viewBox="0 0 24 24" class="grey-icon"><g><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path></g></svg>
//<svg viewBox="0 0 24 24" class="likes-red-heart"><g><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></path></g></svg>

//RENAME TBALE COLUMNS