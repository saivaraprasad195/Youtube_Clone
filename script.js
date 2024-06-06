const BASE_URL = "https://www.googleapis.com/youtube/v3";
const API_KEY = "AIzaSyA80H8kVPCKVq9EDqw82WD_XWI_eXzc730";

const toggleBtn = document.getElementById("toggle-btn");
const suggestionLinks = document.getElementById("suggestionLinks").children;
const searchBtn = document.getElementById("searchbtn");

for(let i=0;i<suggestionLinks.length;i++){
	suggestionLinks[i].addEventListener('click', () => {
		fetchVideos(suggestionLinks[i].innerText);
	})
}

toggleBtn.addEventListener('click', () => {
	const sidebar = document.getElementById("sidebar");
	const maninContainer = document.getElementById("mainContainer");
	if(sidebar.style.left === '-220px'){
		maninContainer.style.gridTemplateColumns = '220px auto';
		sidebar.style.display= 'block';	
		sidebar.style.left = '0px';
		
	}
	else{
		maninContainer.style.gridTemplateColumns = 'auto';
		sidebar.style.left = '-220px';
		sidebar.style.display= 'none';
	}
});

searchBtn.addEventListener('click', () => {
	const searchValue = document.getElementById("searchInput").value;
	fetchVideos(searchValue);
});

async function fetchVideos(searchValue){
	//API Call = baseurl+route+apikey+params
	try{
		// const response = await fetch(`${BASE_URL}/search?key=${API_KEY}&part=snippet&q=${searchValue}&type=video&maxResults=25`);
		// const data = await response.json();
		const data = JSON.parse(localStorage.getItem("videoDetails"));
		// data.items.forEach( (videoItem) => {
		// 	// fetchVideoStats(videoItem);
		// 	// fetchChannelLogo(videoItem);
		// });
		console.log(data);

	}
	catch(err){
		alert(err);
	}
}


// async function fetchChannelLogo(videoItem){
// 	try{
// 		const response = await fetch(`${BASE_URL}/channel?key=${API_KEY}&part=snippet&part=statistics&id=${videoItem.snippet.channelId}`);
// 		const data = await response.json();
// 		console.log(data);
// 	}
// 	catch(error){
// 		console.log(error);
// 	}
// }

// async function fetchVideoStats(videoItem){
// 	try{
// 		const response = await fetch(`${BASE_URL}/videos?key=${API_KEY}&part=statistics&id=${videoItem.id.videoId}`);
// 		const data = await response.json();
// 		videoItem.commnetCount = data.items[0].statistics.commentCount;
// 		videoItem.likeCount = data.items[0].statistics.likeCount;
// 		videoItem.viewCount = data.items[0].statistics.viewCount;
// 	}
// 	catch(error){
// 		alert(error);
// 	}
// }

// function renderVideos(videosArray){
// 	const videoContainer = document.getElementById("videos")
// 	videosArray.forEach(element => {
// 		const videoCard = createVideoCard(element);
// 		videoContainer.appendChild(videoCard);
// 	});
// }

// function createVideoCard(videoDetails){
	


// }

