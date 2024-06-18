const BASE_URL = 'https://www.googleapis.com/youtube/v3';
const API_KEY = 'AIzaSyAyBeS9zvfTrjAU887RcMzZbhoUdrlEeKs';

const YTLogo  = document.getElementById("logo");
const toggleBtn = document.getElementById("toggle-btn");
let videoContainer = document.getElementById("videoContainer")
const videoDetails = JSON.parse(localStorage.getItem("selectedVideo"));
const showMorebtn = document.getElementById("showMore");


showMorebtn.addEventListener('click', () => {
  if(!showMorebtn.classList.contains('clicked')){
    document.getElementById("videoDescription").style.display = 'block';
    showMorebtn.innerText = "Show Less";
    showMorebtn.classList.add("clicked");
  }
  else{
  document.getElementById("videoDescription").style.display = '-webkit-box';
  showMorebtn.classList.remove("clicked");
  showMorebtn.innerText = "Show More";
  }
});

toggleBtn.addEventListener('click', () => {
  const sidebar = document.getElementById("sidebar");
  const mainContainer = document.getElementById("mainContainer")
  sidebar.classList.toggle("active");
  mainContainer.classList.toggle("filtered");
});

renderVideoDetails();

YTLogo.addEventListener('click' , () => {
    window.location.href = 'index.html';
});

const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


function onYouTubeIframeAPIReady() {
    videoContainer = new YT.Player('videoContainer', {
      height: '420',
      width: '770',
      videoId: `${videoDetails.id}`,
      playerVars: {
        'playsinline': 1,
        'autoplay' : 0,
        'controls' : 1
      }
    });
}

function renderVideoDetails(){
  const title =document.getElementById("videoTitle");
  const channelName = document.getElementById("channelName");
  const channelLogo = document.getElementById("channelLogo");
  const subscriberCount = document.getElementById("subsCount");
  const likesCount = document.querySelector("#like_btn span");
  const viewCount = document.getElementById("views");
  const videoAge = document.getElementById("videoAge");
  const description = document.getElementById("videoDescription");
  document.getElementById("commentCount").innerText = videoDetails.commentCount + " Comments";

  title.innerText = videoDetails.videoTitle;
  channelLogo.src = videoDetails.channelLogo;
  channelName.innerText = videoDetails.channelTitle;
  subscriberCount.innerText = videoDetails.subscriberCount;
  videoAge.innerText = videoDetails.publishTime;
  likesCount.innerText = videoDetails.likeCount;
  viewCount.innerText = videoDetails.viewCount + " views";
  subscriberCount.innerText = videoDetails.subscriberCount + " subscribers";
  description.innerText = videoDetails.videoDescription;

  fetchComments();
}

async function fetchComments(){
  let url = `${BASE_URL}/commentThreads?key=${API_KEY}&part=snippet&videoId=${videoDetails.id}&maxResults=25`;
  let response = await fetch(url);
  let data = await response.json();

  var comments = "";

   data.items.forEach( (item) => {
    comments += `
    <div class="comment">
    <img src="${item.snippet.topLevelComment.snippet.authorProfileImageUrl}" class="commentProfile">
    <div class="commentText">
    <p class="commentId">${item.snippet.topLevelComment.snippet.authorDisplayName}</p>
    <p>${item.snippet.topLevelComment.snippet.textOriginal}</p>
    </div>
    </div>
    `
  })

  console.log(comments);

  document.getElementById("comments").innerHTML = comments;
}