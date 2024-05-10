const express = require("express"); // express 모듈 셋팅
const ejs = require("ejs"); // 페이지 로딩을 위해 필수
const app = express();

// view 엔진을 ejs를 쓰겠다는 설정
app.set("view engine", "ejs");

app.use(express.static("public"));

const axios = require('axios');
const cheerio = require('cheerio');

const apiKey = "AIzaSyCmKMTkfYgxRPLTb-K31JLEk9mNOXvDI-g";

app.get("/playlist-recent", async function(req, res){
    try {
        // 채널 ID로부터 Uploads 플레이리스트 ID 가져오기
        const channelId = "UC1IX083pPBnLiRDxfYeKjcg"; // 여기에 채널 ID를 입력하세요
        const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;

        const channelResponse = await axios.get(channelUrl);
        const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

        // Uploads 플레이리스트에서 최신 5개 동영상 가져오기
        const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=30&playlistId=${uploadsPlaylistId}&key=${apiKey}&order=date`;

        const playlistResponse = await axios.get(playlistUrl);
        const filteredVideos = playlistResponse.data.items.filter(item => !item.snippet.description.includes("#short") && !item.snippet.title.includes("#short"));
        
        // 최대 5개까지만 선택
        const videos = filteredVideos.slice(0, 5);
        
        // 디버그용
        // console.log(videos);

        res.json({ videos });
    } catch (error) {
        console.error('Error fetching latest videos:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/playlist-pasta", async function(req, res){
    try {
        // 채널 ID로부터 Uploads 플레이리스트 ID 가져오기
        const channelId = "UCH17TIVS-ux2orQDHn23RDw"; // 여기에 채널 ID를 입력하세요
        const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;

        const channelResponse = await axios.get(channelUrl);
        const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

        // Uploads 플레이리스트에서 최신 5개 동영상 가져오기
        const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${uploadsPlaylistId}&key=${apiKey}&order=date`;

        const playlistResponse = await axios.get(playlistUrl);
        const filteredVideos = playlistResponse.data.items.filter(item => !item.snippet.description.includes("#short") && !item.snippet.title.includes("#short"));
        
        // 최대 5개까지만 선택
        const videos = filteredVideos.slice(0, 5);

        res.json({ videos });
    } catch (error) {
        console.error('Error fetching latest videos:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/playlist-cute", function(req, res){

    const playlistId = "PLoSpaEHwIuEZ-FYjDNGw9pfnT48yuQgmJ";
    const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=5&playlistId=${playlistId}&key=${apiKey}&order=date`;

    axios.get(apiUrl)
        .then(response => {
            const data = response.data;
            const videos = data.items;
            res.json({ videos }); // 데이터를 JSON 형식으로 전송
        })
        .catch(error => {
            console.error('Error fetching playlist:', error);
            res.status(500).send('Internal Server Error');
        });
});

app.get("/playlist-music", function(req, res){

    const playlistId = "PLqF6kupuyiF-ZAnpudY3mz5_XDBnG99E5";
    const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=5&playlistId=${playlistId}&key=${apiKey}&order=date`;

    axios.get(apiUrl)
        .then(response => {
            const data = response.data;
            const videos = data.items;
            res.json({ videos }); // 데이터를 JSON 형식으로 전송
        })
        .catch(error => {
            console.error('Error fetching playlist:', error);
            res.status(500).send('Internal Server Error');
        });
});

app.get("/playlist-mingflix", function(req, res){

    const playlistId = "PLqF6kupuyiF8mlrGWpUuHOFflfD1ddvSS";
    const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=5&playlistId=${playlistId}&key=${apiKey}&order=date`;

    axios.get(apiUrl)
        .then(response => {
            const data = response.data;
            const videos = data.items;
            res.json({ videos }); // 데이터를 JSON 형식으로 전송
        })
        .catch(error => {
            console.error('Error fetching playlist:', error);
            res.status(500).send('Internal Server Error');
        });
});

app.get("/chkLive", function(req, res){

    const afUrl = 'https://play.afreecatv.com/mingturn97/embed';
    
    axios.get(afUrl)
      .then(response => {

        const html = response.data;
            
        // Cheerio를 사용하여 HTML 파싱
        const $ = cheerio.load(html);
    
        // og:title 메타 태그 정보 가져오기
        const ogTitle = $('meta[property="og:title"]').attr('content');
    
        // og:description 메타 태그 정보 가져오기
        const ogDescription = $('meta[property="og:description"]').attr('content');
    
        // og:updated_time 메타 태그 정보 가져오기
        const ogUpdatedTime = $('meta[property="og:updated_time"]').attr('content');
    
        // og:image 메타 태그 정보 가져오기
        const ogImage = $('meta[property="og:image"]').attr('content');

        //체크결과 반환
        //아래 하나라도 해당하면 방종중이기 때문에, false반환
        let isLive = true;

        if (ogTitle.includes("방송중이지 않습니다") 
                || ogDescription.includes("방송중이지 않습니다")
                || ogUpdatedTime == ""
                || ogImage.includes("default_logo") ) {
            isLive = false;
        }

        res.json({ isLive }); // 데이터를 JSON 형식으로 전송

        // //디버그용 JSON출력
        // const debugResult = {
        //     'og_title': ogTitle,
        //     'og_description': ogDescription,
        //     'og_updated_time': ogUpdatedTime,
        //     'og_image': ogImage
        // };
        // console.log(debugResult);
        // console.log(isLive);
      })
      .catch(error => {
        console.error('Error:', error);
      });
});

app.get("/", function(req, res){
    res.render("home", {});
});

app.get('/healthyChk', (req, res) => {
    res.status(200).send('OK');
});

app.get("/eyecatch", function(req, res){
    res.render("eyecatch", {});
});

const port = 3000;

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});