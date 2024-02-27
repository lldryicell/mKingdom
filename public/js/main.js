
$(function(){

    setTimeout(function() {
      $("#splash").css("display", "none");
    }, 3750);

    /* 배경 동영상 위치조정 */
    let bgMainHeight = $(".bg-common").css("height");
    bgMainHeight = parseInt(bgMainHeight.replace("px", ""));

    $(".bg-common").css("margin-top", bgMainHeight*-0.1+"px");

    /* 유튜브 동영상 슬라이드 */
    $(".carousel.zoom").carousel().on("slide.bs.carousel", function (data) {
      var n = $(data.target).find(".item").length;
      var active = data.relatedTarget;
      if(active===undefined){
        active = $(data.target).find(".item.active");
      }else{
        active = $(data.relatedTarget);
      }
      $(data.target).find(".item.next").removeClass("next");
      var next = $(data.target).find(".item").eq(active.index()-n+1);
      next.addClass("next");
      $(data.target).find(".item.prev").removeClass("prev");
      var prev = $(data.target).find(".item").eq(active.index()-1);
      prev.addClass("prev");
    }).trigger("slide.bs.carousel"); 

    $(".before-video").on("click", function(){
      $("#video-carousel-left").trigger("click");
    });

    $(".next-video").on("click", function(){
      $("#video-carousel-right").trigger("click");
    });

    /* 갤러리 이미지 슬라이드 */
    $('#carousel-generic').carousel({
      interval: 3500,
      pause: "hover",
      wrap: true,
      keyboard : true
	  });

    /* 나이계산 */
    let now = new Date();
    let birthday = new Date("1997-05-22");
    let nowYear = now.getFullYear();
    let birthYear = birthday.getFullYear();

    $("#age").text(nowYear - birthYear - 20 + 1);

    /* 유튜브 플레이리스트 초기화 */
    loadPlaylist("/playlist-recent");

    /* 방송중체크 */

    //최근 영상 리스트 가져오기 url
    var apiUrl = "https://apisabana.afreecatv.com/service/live/contents_recommend.php?nBroadNo=&szUserId=mingturn97&szPlatform=live_embeded";

    let data;
    // 최근동영상 리스트 가져오기
    $.ajax({
      type: "GET",
      url: apiUrl,
      dataType: "json",
      success: function(data) {
        console.log("최근동영상 리스트 가져오기 성공:", data.list[0].reg_date);
        var recentVodRegDate = new Date(data.list[0].reg_date);

        // 방송국 정보 가져오기 url
        apiUrl = "https://st.afreecatv.com/api/get_station_status.php?szBjId=mingturn97";

        // 방송국 정보 가져오기
        $.ajax({
          type: "GET",
          url: apiUrl,
          dataType: "jsonp", // cors회피를 위해, jsonp사용
          success: function(data) {
            console.log("방송국 정보 가져오기 성공:", data.DATA.broad_start);
            var recentLiveStartDate = new Date(data.DATA.broad_start);

            //최근방송vod는 직전 라이브 방송의 vod의 생성일이 data저장됨.
            //방송국정보의 최근방송일은 마지막 라이브(라이브 중 포함)의 방송시작일이 표시가 됨.

            //위에 따라 최근동영상리스트의 "최근방송vod생성일"이 방송국정보의 "최근방송일" 이전일 경우 현재 라이브 방송중
            if (recentVodRegDate < recentLiveStartDate) {
              $("#live_offline_img").html("");
              $("#afreecatv_player_video").show();
            //이후일 경우 방송종료이므로, 뱅종이미지 표시.
            } else if (recentVodRegDate > recentLiveStartDate) {
              $("#live_offline_img").show();
              $("#afreecatv_player_video").html("");
            } else {
            //동일할 경우, 방송종료 후 vod가 생성된 직후이므로, 뱅송은 종료된것. 뱅종이미지 표시.
              $("#live_offline_img").show();
              $("#afreecatv_player_video").html("");
            }
          },
          error: function(error) {
            console.error("방송국 정보 실패:", error);
          }
        });
      },
      error: function(error) {
        console.error("최근동영상 리스트 가져오기 실패:", error);
      }
    });
  });

  $("#btn-recent").on("click", function(){
    loadPlaylist("/playlist-recent");
    $("#youtube-redirect").attr("href", "https://www.youtube.com/@mingturn");
  });

  $("#btn-pasta").on("click", function(){
    loadPlaylist("/playlist-pasta");
    $("#youtube-redirect").attr("href", "https://www.youtube.com/@mingturn-pasta");
  });

  $("#btn-cute").on("click", function(){
    loadPlaylist("/playlist-cute");
    $("#youtube-redirect").attr("href", "https://youtube.com/playlist?list=PLoSpaEHwIuEZ-FYjDNGw9pfnT48yuQgmJ&si=UY0HTJ9L6q2Yxmvz");
  });

  $("#btn-music").on("click", function(){
    loadPlaylist("/playlist-music");
    $("#youtube-redirect").attr("href", "https://youtube.com/playlist?list=PLqF6kupuyiF-ZAnpudY3mz5_XDBnG99E5&si=bq8K-JVvt0yN6W49");
  });

  $("#btn-mingflix").on("click", function(){
    loadPlaylist("/playlist-mingflix");
    $("#youtube-redirect").attr("href", "https://youtube.com/playlist?list=PLqF6kupuyiF8mlrGWpUuHOFflfD1ddvSS&si=99zbRrOoXkFNgbcv");
  });

  function loadPlaylist(playlistUrl) {
    $("#youtube-playlist").find(".carousel-inner").html("");
    $.ajax({
        url: playlistUrl,
        method: "GET",
        dataType: "json",
        success: function (data) {
            // 받아온 데이터를 이용하여 동적으로 HTML 생성
            let videoCnt = 0;
            data.videos.forEach(function (video) {
                var htmlInner = "";
                if (playlistUrl=="/playlist-recent") {
                  if (videoCnt == 4) {
                      htmlInner += `<div class="item active">`;
                  } else if (videoCnt == 0) {
                      htmlInner += `<div class="item next">`;
                  } else if (videoCnt == 3) {
                      htmlInner += `<div class="item prev">`;
                  } else {
                      htmlInner += `<div class="item">`;
                  }
                } else {
                  if (videoCnt == 0) {
                      htmlInner += `<div class="item active">`;
                  } else if (videoCnt == 1) {
                      htmlInner += `<div class="item next">`;
                  } else if (videoCnt == 4) {
                      htmlInner += `<div class="item prev">`;
                  } else {
                      htmlInner += `<div class="item">`;
                  }
                }
                htmlInner += `<iframe style="width:50vw; height:29.125vw;" 
                                src="https://www.youtube.com/embed/${video.snippet.resourceId.videoId}" 
                                title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; 
                                clipboard-write; encrypted-media; gyroscope; picture-in-picture; 
                                web-share" allowfullscreen></iframe>
                            </div>`;
                $("#youtube-playlist").find(".carousel-inner").append(htmlInner);

                videoCnt++;
            });
        },
        error: function (error) {
            console.error('Error fetching playlist:', error);
        }
    });
  }