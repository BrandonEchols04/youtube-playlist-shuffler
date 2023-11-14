const videoList = document.getElementById("videoList");
const videoPlayer = document.getElementById("videoPlayer");
const shuffleButton = document.getElementById("shuffleButton");
const searchButton = document.getElementById("searchButton");
const nextButton = document.getElementById("nextButton");
const backButton = document.getElementById("backButton");

function shufflePlaylists(){
    const playlistIDs = document.getElementById("playlistIDs").value.split("\n");
    console.log("Playlist IDs: " + playlistIDs);
    const apiKey = 'AIzaSyCPwLQhVhomLJeECNwyNDbcjfQP4oHD90c';
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
            console.log(videos);
        })
        .catch(error => console.error('Error:', error));
}


function backVideo(){

}


function nextVideo(){

}


function searchPlaylists(){

}


function copyLink(){

}