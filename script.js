const BASE_URL = "https://www.googleapis.com/youtube/v3";
const API_KEY = "AIzaSyAyBeS9zvfTrjAU887RcMzZbhoUdrlEeKs";

const toggleBtn = document.getElementById("toggle-btn");
const suggestionLinks = Array.from(document.getElementById("suggestionLinks").children);
const searchBtn = document.getElementById("searchbtn");

//fetch video wheh website is opened
document.addEventListener('DOMContentLoaded', fetchVideos(""));

// fetch videos when clicked on any links
suggestionLinks.forEach( (li) => {
	li.addEventListener('click' , async () => {
		suggestionLinks.forEach( (link) => {
			link.classList.remove("active");
		})
		li.classList.add("active");
		await fetchVideos(li.innerText);
	})
	
})

//sidebar toggle function
toggleBtn.addEventListener('click', () => {
	const sidebar = document.getElementById("sidebar");
	const maninContainer = document.getElementById("mainContainer");
	if(window.getComputedStyle(sidebar).display === 'none'){
		maninContainer.style.gridTemplateColumns = '220px auto';
		document.querySelector("#sidebar").style.display= 'block';	
	}
	else{
		maninContainer.style.gridTemplateColumns = 'auto';
		document.querySelector("#sidebar").style.display= 'none';
	}
});

// fetch videos when serched for
searchBtn.addEventListener('click', () => {
	const searchValue = document.getElementById("searchInput").value;
	fetchVideos(searchValue);
});

async function fetchVideos(searchValue){
	//API Call = baseurl+route+apikey+params
	const impVideoDetails = [];
	try{
		const response = await fetch(`${BASE_URL}/search?key=${API_KEY}&part=snippet&q=${searchValue}&type=video&maxResults=40`);
		const data = await response.json();
		
		const videoPromises = data.items.map( async (videoItem) => {
			await fetchVideoStats(videoItem);
			await fetchChannelLogo(videoItem);
			const currObj = {}
			currObj.id = videoItem.id.videoId;
			currObj.thumbnail = videoItem.snippet.thumbnails.high.url;	
			currObj.videoTitle = videoItem.snippet.title;
			currObj.videoDescription= videoItem.videoDescription;
			currObj.channelLogo = videoItem.channelLogo;
			currObj.channelId = videoItem.snippet.channelId;
			currObj.channelTitle = videoItem.snippet.channelTitle;
			currObj.subscriberCount = videoItem.subscriberCount;
			currObj.publishTime = calVideoAge(videoItem.snippet.publishTime);
			currObj.viewCount = calCount(videoItem.viewCount);
			currObj.likeCount = calCount(videoItem.likeCount);
			currObj.commentCount = calCount(videoItem.commentCount);

			impVideoDetails.push(currObj);
		});

		//did this to store all the fetchedvideo data, else UI is rendered before fetching data
		await Promise.all(videoPromises);
		renderVideos(impVideoDetails);

	}
	catch(err){
		console.log(err);
	}
}

// don't use async keyword to avoid CORS error.
// only channelLogo is fetched
function fetchChannelLogo(videoItem) {
	return fetch(`${BASE_URL}/channels?key=${API_KEY}&part=snippet&part=statistics&id=${videoItem.snippet.channelId}`)
		.then((res) => res.json())
		.then((data) => {
		  	videoItem.channelLogo = data.items[0].snippet.thumbnails.default.url;
			videoItem.subscriberCount = calCount(parseInt(data.items[0].statistics.subscriberCount));
			videoItem.videoDescription = data.items[0].snippet.description;
		});   
}

//fetchinf videostats like comment,view,like count
async function fetchVideoStats(videoItem){
	try{
		const response = await fetch(`${BASE_URL}/videos?key=${API_KEY}&part=statistics,snippet&id=${videoItem.id.videoId}`);
		const data = await response.json();
		videoItem.commentCount = data.items[0].statistics.commentCount;
		videoItem.likeCount = data.items[0].statistics.likeCount;
		videoItem.viewCount = data.items[0].statistics.viewCount;
	}
	catch(error){
		console.log(error);
	}
}

// render video after fetching data.
function renderVideos(videosArray){
	const videoContainer = document.getElementById("videos")
	videoContainer.innerHTML = '';
	videosArray.forEach(element => {
		const videoCard = createVideoCard(element);
		videoContainer.appendChild(videoCard);
	});
}

// creating each video to render it and adding click listener
function createVideoCard(videoCardDetails){
	const videoCard = document.createElement("div");
	videoCard.classList.add("videoCard");
	videoCard.id = `${videoCardDetails.id}`
	videoCard.innerHTML= `
	<img src="${videoCardDetails.thumbnail}" alt="thumbnail">
	<div class="videoDetails">
		<img src="${videoCardDetails.channelLogo}" alt="channelLogo">
		<div class="textDetails">
			<h4>${videoCardDetails.videoTitle}</h4>
			<p class="channelName">${videoCardDetails.channelTitle}</p>
			<span class="views">${videoCardDetails.viewCount} views</span>
			<span class="videoAge">${videoCardDetails.publishTime}</span>
		</div>
	</div>`;

	videoCard.addEventListener('click', () => {
		localStorage.setItem('selectedVideo', JSON.stringify(videoCardDetails));
		window.location.href = 'video.html';
	});
	
	return videoCard;
}

// Changing the format of view,like,comment count to show them same as youtube UI.
function calCount (count){
	if (count >= 1000000000) {
		return (count / 1000000000).toFixed(1) + 'B';
	}
	else if (count >= 1000000) {
		return (count / 1000000).toFixed(1) + 'M';
	}
	else if (count >= 1000) {
		return (count / 1000).toFixed(1) + 'K';
	} 
	else {
		return count;
	}
}


// calculating how long ago video is uploaded.
function calVideoAge(dateString){
	let date = new Date(dateString);
	let seconds = Math.floor((new Date() - new Date(date)) / 1000 )
	let videoAge = seconds / 31536000;
	if(videoAge > 1){
		let years = Math.floor(videoAge);
		return ((years==1)? `${years} year ago` : `${years} years ago`);
	}

	videoAge = seconds / 2592000;
	if(videoAge > 1){
		let months = Math.floor(videoAge);
		return ((months==1)? `${months} month ago` : `${months} months ago`);
	}
	videoAge = seconds / 604800;
	if(videoAge > 1){
		let weeks = Math.floor(videoAge);
		return ((weeks==1)? `${weeks} week ago` : `${weeks} weeks ago`);
	}

	videoAge =seconds / 86400;
	if(videoAge > 1){
		let days = Math.floor(videoAge);
		return ((days==1)? `${days} day ago` : `${days} days ago`);
	}

	videoAge = seconds / 3600;
	let hours = Math.floor(videoAge);
	return ((hours==1)? `${hours} hour ago` : `${hours} hours ago`);
}
