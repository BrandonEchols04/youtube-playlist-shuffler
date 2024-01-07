const videoList = document.getElementById("videoList");
const videoPlayer = document.getElementById("videoPlayer");
const shuffleButton = document.getElementById("shuffleButton");
const searchButton = document.getElementById("searchButton");
const nextButton = document.getElementById("nextButton");
const backButton = document.getElementById("backButton");
let player;

function shufflePlaylists(){
    const playlistIDs = document.getElementById("playlistIDs").value.split("\n");
    console.log("Playlist IDs: " + playlistIDs);
    const apiKey = 'AIzaSyC6G420iL4LkTTGkxMZkiDYdniuHJQo0jg';
    let videos = []
    let fetchPromises = playlistIDs.map(playlistId => fetchVideos(playlistId));
    Promise.all(fetchPromises)
        .catch(error => console.error('Error:', error));
    function fetchVideos(playlistId, pageToken) {
        let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
        if (pageToken) {
            url += `&pageToken=${pageToken}`;
        }

        return fetch(url)
            .then(response => response.json())
            .then(data => {
                data.items.forEach(item => {
                    const videoId = item.snippet.resourceId.videoId;
                    const title = item.snippet.title;
                    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                    videos.push({url: embedUrl, title: title});
                });

                if (data.nextPageToken) {
                    return fetchVideos(playlistId, data.nextPageToken);
                }
            });
    }
    Promise.all(fetchPromises)
        .then(() => {
            // Fisher-Yates shuffle
            for (let i = videos.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [videos[i], videos[j]] = [videos[j], videos[i]];
            }

            // Populate videoList
            videos.forEach((video, index) => {
                let option = document.createElement("option");
                option.value = video.url;
                option.text = `${index + 1} - ${video.title}`;
                videoList.appendChild(option);
            });

            // Select the first option
            videoList.selectedIndex = 0;
            videoList.onchange();

            console.log(videos);
        })
        .catch(error => console.error('Error:', error));
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('videoPlayer', {
        height: '270',
        width: '480',
        videoId: '', // initially, no video is loaded
        playerVars: {
            autoplay: 1
        },
        events: {
            onStateChange: function(event) {
                if (event.data === YT.PlayerState.ENDED) {
                    nextVideo();
                }
            }
        }
    });
}

videoList.onchange = function() {
    const selectedUrl = this.value;
    let videoId = selectedUrl.split('embed/')[1];
    if (player) {
        player.loadVideoById(videoId);
    }
};

function backVideo() {
    if (videoList.selectedIndex > 0) {
        videoList.selectedIndex--;
        videoList.onchange();
    }
}

function nextVideo() {
    if (videoList.selectedIndex < videoList.options.length - 1) {
        videoList.selectedIndex++;
        videoList.onchange();
    }
}


function searchPlaylists(){

}


function copyLink(){

}