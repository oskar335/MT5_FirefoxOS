$(document).ready(function(){

	console.log("multipiste");
	loadSongList();
	
	
	// ######### SONGS
function loadSongList() {
  var xhr = new XMLHttpRequest();
  
    //xhr.open('GET', localStorage.getItem("address")+"/track", true);
    //xhr.open('GET', "http://192.168.1.121:8081/track", true);
    xhr.open('GET', "http://localhost:8081/track", true);

    // Menu for song selection
	var s = $("#listeMusique");
   /* s.change(function (e) {
      var songName = $(this).val();
      console.log("You chose : " + songName);

      if (songName !== "nochoice") {
            // We load if there is no current song or if the current song is
            // different than the one chosen
            if ((currentSong === undefined) || ((currentSong !== undefined) && (songName !== currentSong.name))) {
              loadSong(songName);

              View.activeConsoleTab();
            }
          }
        });*/

    xhr.onload = function (e) {
      var songList = JSON.parse(this.response);

      

      songList.forEach(function (songName) {
        console.log(songName);

		s.append('<a href="#" class="list-group-item clearfix">' + songName + '</a>');

      });
    };
    xhr.send();
}

});

