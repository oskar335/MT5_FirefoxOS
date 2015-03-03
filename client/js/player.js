$(document).ready(function(){

  // The current song
  var currentSong;
  // The audio context
  var context;
  var lastTime = 0;
  var dureeTotale = 0;
  var intervalId = 0;

  var btnPlay = document.getElementById("bplay");
  var btnBrowse = document.getElementById("browseServer");
  var btnBrowseLocal = document.getElementById("browseLocal");

  //Cache par defaut le slider boucle AB
  $("#divSliderRange").hide();
  $("#listePiste").hide();
  $("#listeMusiqueServer").hide();

  //Desactive par defaut le reset boucle AB
  $("#loopReset").prop('disabled', true);

  // Init audio context
  context = initAudioContext();

  loadSongListLocal(); //initialise la liste des musiques en local
  $(btnBrowseLocal).addClass("active");

  //loadSong("Big Stone Culture - Fragile Thoughts");

  //Action du bouton play
  $(btnPlay).click(function(){

    if(this.dataset.state === "play"){
      playAllTracks();
      this.dataset.state = "pause";
    } else {
      pauseAllTracks();
      this.dataset.state = "play";
    }

    updateBtnPlay();
    
  });

  //Met a jour l'image du bouton en fnt de son état
  function updateBtnPlay() {
    //recupere le span qui contient le glyphicon 
    var span = $(btnPlay).find(".glyphicon");

    if(btnPlay.dataset.state == "play"){
      span.removeClass("glyphicon-pause");
      span.removeClass("glyphicon-refresh glyphicon-refresh-animate");
      span.addClass("glyphicon-play");
      btnPlay.disabled = false;
    } else if (btnPlay.dataset.state == "pause") {
      span.removeClass("glyphicon-refresh glyphicon-refresh-animate");
      span.removeClass("glyphicon-play");
      span.addClass("glyphicon-pause");
      btnPlay.disabled = false;
    } else if (btnPlay.dataset.state == "loading") {
      span.removeClass("glyphicon-pause");
      span.removeClass("glyphicon-play");
      span.addClass("glyphicon-refresh glyphicon-refresh-animate");
      btnPlay.disabled = true;
    }
  }

  //Action du bouton de boucle (1er a gauche)
  $("#loopAB").click(function(){
    $(this).toggleClass("active");
    $("#divSlider").toggle();
    $("#divSliderRange").toggle();
    
    //Toggle la desactivation du bouton reset boucle AB
    $( "#loopReset" ).prop( "disabled", function( i, val ) {
      return !val;
    });

    //Toggle la desactivation du bouton reset boucle lecture normale
    $( "#loop" ).prop( "disabled", function( i, val ) {
      return !val;
    });
  });

//Action du bouton de reset de boucle AB
$("#loopReset").click(function(){
  $("#slider-range").slider( "option", "values", [0,dureeTotale] );
  updateDivSliderRange();
});

//ACtion du bouton de boucle pour revenir au debut de la chanson
$("#loop").click(function(){
  $("#slider").slider( "option", "value",0 );
  updateDivSlider();
  pauseAllTracks();

  btnPlay.dataset.state = "play";
  updateBtnPlay();

});

//Action du bouton mode multi/monopiste
$("#toggleMultipiste").click(function(){
  
  $(this).text(function(i, text){
    return text === "Mode Multipiste" ? "Mode Monopiste" : "Mode Multipiste";
  });

  if ($(this).text() === "Mode Monopiste") {
    $("#listeMusique").hide();
    $("#listeMusiqueServer").hide();
    showDivMultiPiste();
  } else {
    $("#listePiste").hide();
    if($(btnBrowseLocal).hasClass("active")){
      showDivLocalSong();
    } else {
      showDivServerSong();
    }
  }
  
});

$(btnBrowseLocal).click(function(){
  //window.location = "browse.html";
  if(!$(this).hasClass("active")){
    $(this).toggleClass("active");
      $("#listeMusiqueServer").hide();
      $("#listePiste").hide();
      $("#toggleMultipiste").text("Mode Multipiste");
      showDivLocalSong();
      loadSongListLocal();
      $(btnBrowse).removeClass("active");
  }
});


$(btnBrowse).click(function(){
  if(!$(this).hasClass("active")){
    $(this).addClass("active")
    $("#listeMusique").hide();
    $("#listePiste").hide();
    $("#toggleMultipiste").text("Mode Multipiste");
    showDivServerSong();
    loadSongList();
    $("#browseLocal").removeClass("active");
  }
  
});

function showDivLocalSong(){
  $("#listeMusique").show();
  $("#titreListe").text("Musiques locales");
}

function showDivServerSong(){
  $("#listeMusiqueServer").show();
  $("#titreListe").text("Musiques distantes");
}

function showDivMultiPiste(){
  $("#listePiste").show();
  $("#titreListe").text("Multipiste ON");
}

$(".btn btn-sm > .glyphicon glyphicon-volume-off").click(function(){
  $(this).toggleClass("active");
});

$("#listePiste").delegate(".volume-off","click",function(event){
  $(this).toggleClass("active");
  var instrument = $(this).parent()[0].previousSibling.data;
  muteUnmuteTrack(instrument);
});

$("#listePiste").delegate(".volume-solo","click",function(event){
  $(this).toggleClass("active");
  var instrument = $(this).parent()[0].previousSibling.data;
  soloNosoloTrack(instrument);
});

$("#listeMusique").delegate("a","click",function(event){
  $(this).siblings().removeClass("active");
  $(this).addClass("active");
  pauseAllTracks();
  loadLocalSong(this.firstChild.data);
});


$("#listeMusiqueServer").delegate("a","click",function(event){
  $(this).siblings().removeClass("active");
  $(this).addClass("active");
  pauseAllTracks();
  loadSong(this.firstChild.data);
});

// ******** Music slider (JQuery UI) ********

//Met a jour les elements du div du slider normal
function updateDivSlider(){
  var min = $("#slider").slider( "option", "min" );
  var max = $("#slider").slider( "option", "max" );
  var valeur = $("#slider").slider( "option", "value" );
  var beginTime = min + valeur;
  var endTime = max - valeur;
  
  if(valeur >= max)
    endTime = 0;

  $("#beginTime").text(intToMinutes(beginTime));
  $("#endTime").text("- " + intToMinutes(endTime));

}

function initSlide(){

//Definition du slider
$("#slider").slider({
  range: "min",
  value: 0,
  min: 0,
  step : 0.1,
  max: dureeTotale,
  //init 
  create : function(e, ui){
    updateDivSlider();
  },
  slide: function(e,ui){
    $('#slider > .ui-slider-handle:first').html('<div class="tooltip top slider-tip"><div class="tooltip-arrow"></div><div class="tooltip-inner">' +intToMinutes(ui.value) + '</div></div>');
    updateDivSlider();
  },
  //Quand on lache le slider
  stop: function(e, ui){
    $('#slider > .ui-slider-handle').html("");
    if(btnPlay.dataset.state === "pause"){
      pauseAllTracks();
      playAllTracks(ui.value);
    }
    updateDivSlider();
  },
  //Quand on commence a tenir le slider
  start: function(e, ui){
    $('#slider > .ui-slider-handle:first').html('<div class="tooltip top slider-tip"><div class="tooltip-arrow"></div><div class="tooltip-inner">' +intToMinutes(ui.value) + '</div></div>');
  }
  
});

//Permet de ne pas selectionner les elements du slider (permet de pouvoir deplacer le curseur)
$("#divSlider").attr('unselectable','on')
.css({'-moz-user-select':'-moz-none',
 '-moz-user-select':'none',
 '-o-user-select':'none',
           '-khtml-user-select':'none',  //you could also put this in a class 
           '-webkit-user-select':'none',/* and add the CSS class here instead */
           '-ms-user-select':'none',
           'user-select':'none'
         }).bind('selectstart', function(){ return false; });

// ******** Fin slider ********
//Définition du slider multicurseur
$("#slider-range").slider({
  range: true,
  min: 0,
  max: dureeTotale,
  values: [dureeTotale/5 ,dureeTotale/3],
  slide: function(e, ui){
    updateDivSliderRange();
    pauseAllTracks();
    btnPlay.dataset.state = "play";
    updateBtnPlay();

  },
  create: function(e,ui){
    $("#loopA").text("Début : " + intToMinutes($("#slider-range").slider( "option", "values" )[ 0 ]));
    $("#loopB").text("Fin : " + intToMinutes($("#slider-range").slider( "option", "values" )[ 1 ]));
  },
  stop: function(e, ui){
    $('#slider-range > .ui-slider-handle').html("");
  }
});

$( "#slider-range > .ui-slider-handle" ).mouseleave(function() {
  $('#slider-range > .ui-slider-handle').html("");
});

$( "#slider-range > .ui-slider-handle" ).mouseenter(function() {
  updateDivSliderRange();
});

//Permet de ne pas selectionner les elements du slider (permet de pouvoir deplacer les curseurs)
$("#divSliderRange").attr('unselectable','on')
.css({'-moz-user-select':'-moz-none',
 '-moz-user-select':'none',
 '-o-user-select':'none',
           '-khtml-user-select':'none',  //you could also put this in a class 
           '-webkit-user-select':'none',/* and add the CSS class here instead */
           '-ms-user-select':'none',
           'user-select':'none'
         }).bind('selectstart', function(){ return false; });

// ******** Fin slider range ********
};
// ******** Music slider range avec deux positions (JQuery UI) ********

//Met a jour les elements du div du slider multi curseur
function updateDivSliderRange(){
  var value = $( "#slider-range" ).slider( "option", "values" );
  $('#slider-range > .ui-slider-handle:first').html('<div class="tooltip top slider-tip"><div class="tooltip-arrow"></div><div class="tooltip-inner">' +intToMinutes(value[0]) + '</div></div>');
  $('#slider-range > .ui-slider-handle:last').html('<div class="tooltip top slider-tip"><div class="tooltip-arrow"></div><div class="tooltip-inner">' + intToMinutes(value[1]) + '</div></div>');
  $("#loopA").text("Début : " + intToMinutes(value[ 0 ]));
  $("#loopB").text("Fin : " + intToMinutes(value[ 1 ]));
}



//Convertit un nombre de secondes en mm:ss
function intToMinutes(secs){
  var hr  = Math.floor(secs / 3600);
  var min = Math.floor((secs - (hr * 3600))/60);
  var sec = Math.floor(secs - (hr * 3600) -  (min * 60));

  if(min < 10 ){
    min = "0" + min
  }
  if(sec <10) {
    sec = "0" + sec
  }

  return min + ":" + sec;
}



// MODIF CONNECTION JS PROF


function initAudioContext() {
  // Initialise the Audio Context
  // There can be only one!
  var context;

  if (typeof AudioContext == "function") {
    context = new AudioContext();
    console.log("USING STANDARD WEB AUDIO API");
  } else if ((typeof webkitAudioContext == "function") || (typeof webkitAudioContext == "object")) {
    context = new webkitAudioContext();
    console.log("USING WEBKIT AUDIO API");
  } else {
    throw new Error('AudioContext is not supported. :(');
  }
  return context;
}


// ######### SONGS
function loadSongList() {
  var xhr = new XMLHttpRequest({mozSystem: true});
  
    //xhr.open('GET', localStorage.getItem("address")+"/track", true);
    xhr.open('GET', "http://192.168.6.171:8081/track", true);
    //xhr.open('GET', "http://localhost:8081/track", true);

    // Menu for song selection
    var s = $("#listeMusiqueServer");

xhr.onload = function (e) {
  var songList = JSON.parse(this.response);
  s.empty();
  songList.forEach(function (songName) {
    console.log(songName);
    if(songName.indexOf(".") != 0) //évite les fichiers/dossiers tq '.', '..', '.DS_Store' etc
      if (currentSong && songName == currentSong.name)
        s.append('<a href="#" class="list-group-item clearfix active">' + songName + '</a>');
      else
        s.append('<a href="#" class="list-group-item clearfix">' + songName + '</a>');
  });
};
xhr.send();
}

function isASoundFile(fileName) {
    if(endsWith(fileName, ".mp3")) return true;
    if(endsWith(fileName, ".ogg")) return true;
    if(endsWith(fileName, ".wav")) return true;
    return false;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function loadSongListLocal(){
  
  //Clear up the list first
  var tabSetMusique = new Set();
  var tabSetMusiqueMt5 = new Set();
  
  var files = navigator.getDeviceStorage("music");

  var cursor = files.enumerate();

  var divListeMusique = $("#listeMusique");
  divListeMusique.empty(); //vide la liste

  cursor.onsuccess = function () {
    //alert("Got something");
    var file = this.result;

    if (file != null) {
      this.done = false;

      if (file.name.indexOf("MT5") > -1) {
        //musique importées de MT5
        var tmp = file.name.split("MT5")[1];
        var musique = tmp.split("/")[1];
        tabSetMusiqueMt5.add(musique);
      } else if(isASoundFile(file.name)){
        //musiques du telephone
        tabSetMusique.add(file.name);
      }


    }
    else {
      this.done = true;
    }

    if (!this.done) {
      this.continue();
    }else {
      //Remplit la liste de musique MT5
      tabSetMusiqueMt5.forEach(function(value) {
        console.log(value);
        if (currentSong && value == currentSong.name)
          divListeMusique.append('<a href="#" class="list-group-item list-group-item-success clearfix active">' + value + '</a>');
        else 
          divListeMusique.append('<a href="#" class="list-group-item list-group-item-success clearfix">' + value + '</a>');
      });

      //liste de musiques en local (dossier music)
      tabSetMusique.forEach(function(value) {
         console.log(value);
		 if(isASoundFile(value))
			divListeMusique.append('<a href="#" class="list-group-item clearfix">' + value + '</a>');
     });

    }
  }
}


// ##### TRACKS #####

function loadSong(songName) {
    // This function builds the current
    // song and resets all states to default (zero muted and zero solo lists, all
    // volumes set to 1, start at 0 second, etc.)
currentSong = new Song(songName, context);


var xhr = new XMLHttpRequest({mozSystem: true});
    // xhr.open('GET', localStorage.getItem("address")+"/"+currentSong.url, true);
    xhr.open('GET', "http://192.168.6.171:8081/"+currentSong.url, true);
   //xhr.open('GET', "http://localhost:8081/"+currentSong.url, true);
   
  xhr.addEventListener("progress", progressLoading(), false);
  xhr.addEventListener("load", loadingSong, false);

   function progressLoading(){
    btnPlay.dataset.state = "loading";
    updateBtnPlay();
   }

   function loadingSong(e) {
    
          // get a JSON description of the song
          var song = JSON.parse(this.response);
        // resize canvas depending on number of samples
        //resizeSampleCanvas(song.instruments.length);

        var divPistes = $("#listePiste");
        divPistes.empty();
        var groupeBoutonPiste = '<span class="pull-right">' + 
        '<button class="btn btn-sm volume-off">' +
        '<span class="glyphicon glyphicon-volume-off"></span>'+
        '</button> '+ 
        '<button class="btn btn-sm volume-solo">' +
        '<span class="glyphicon glyphicon-headphones"></span>'+
        '</button>'+
        '</span>';


        // for eah instrument/track in the song
        song.instruments.forEach(function (instrument, trackNumber) {
            // Let's add a new track to the current song for this instrument
            currentSong.addTrack(instrument);

            divPistes.append('<a href="#" class="list-group-item clearfix">'+ instrument.name + groupeBoutonPiste + '</a>');
    });
        // Loads all samples for the currentSong
        loadAllSoundSamples();
      };
      xhr.send();
    }

function loadLocalSong(songName){

  currentSong = new Song(songName, context);

  function sendTrackLocal(track){
    // get a JSON description of the song
    var descrTrack = JSON.stringify(track);
    console.log("descr track : " + descrTrack);
    var song = JSON.parse(descrTrack);
    console.log("song : " + song);

    var divPistes = $("#listePiste");
    divPistes.empty();
    var groupeBoutonPiste = '<span class="pull-right">' + 
                              '<button class="btn btn-sm volume-off">' +
                                '<span class="glyphicon glyphicon-volume-off"></span>'+
                              '</button> '+ 
                              '<button class="btn btn-sm volume-solo">' +
                                '<span class="glyphicon glyphicon-headphones"></span>'+
                              '</button>'+
                            '</span>';

    // for eah instrument/track in the song
    song.instruments.forEach(function (instrument, trackNumber) {
      // Let's add a new track to the current song for this instrument
      currentSong.addTrack(instrument);
      divPistes.append('<a href="#" class="list-group-item clearfix">'+ instrument.name + groupeBoutonPiste + '</a>');
    });
  }

  getLocalTrack(songName,sendTrackLocal);
}

function getLocalTrack(songName,callback){
  var track = {
      id: songName,
      instruments: [] 
  };
	
  var files = navigator.getDeviceStorage("music");
	
  var cursor = files.enumerate();
var isLocal = false;
  cursor.onsuccess = function () {
    //alert("Got something");
    var file = this.result;
	
    if (file != null ) {
	
      this.done = false;
	 
      if(file.name.indexOf("MT5/" + songName) > -1 && !isASoundFile(songName)){
        var tmp = file.name.split("MT5")[1];
        var instrument = tmp.split("/")[2].match(/(.*)\.[^.]+$/, '')[1];
        track.instruments.push({
          name: instrument,
          sound: tmp.split("/")[2]
        });
      }else{
		  console.log(songName);
		  console.log(file.name);
		   if(file.name===songName && isASoundFile(songName)){
			   var tmp = file.name;
				track.instruments.push({
				name: tmp,
				sound: tmp
				});
				isLocal=true;
				this.done = true;
		   }
		}
	}
    else {
      this.done = true;
    }

    if (!this.done) {
      this.continue();
    }else {
      callback(track);
      loadAllSoundSamples(isLocal);
    }
  }
}
 
	function loadAllSoundSamples(isLocal) {
		btnPlay.dataset.state = "loading";
		updateBtnPlay();
		bufferLoader=null;
      if(isLocal){
      bufferLoader = new BufferLoader(
        context,
        currentSong.getUrlsOfTracksLoc(),
        finishedLoading
        //drawTrack
        );
	  }else{
		    bufferLoader = new BufferLoader(
        context,
        currentSong.getUrlsOfTracks(),
        finishedLoading
        //drawTrack
        );
	  }
      bufferLoader.load();
    }
    function playAllTracks() {

    var intDuree = Math.round(dureeTotale * 100) / 100;      

    if($("#divSlider").css("display") == "block"){

      if($("#slider").slider("option","value") >= intDuree){
        $("#slider").slider("option","value",0);
      }

      
      intervalId = setInterval(function(){

        if(btnPlay.dataset.state === "pause"){
          var val = $("#slider").slider("option","value");
          val += 0.1;

          if(val!=intDuree) {
            $("#slider").slider("option","value",val);
            updateDivSlider();
          } 

          if(val >= intDuree) {
            window.clearInterval(intervalId);
            btnPlay.dataset.state = "play";
            $(btnPlay).find(".glyphicon").toggleClass("glyphicon-pause");
            $(btnPlay).find(".glyphicon").toggleClass("glyphicon-play");
          }
        }
        else {
          window.clearInterval(intervalId);
        }
      }, 100);


      // Starts playing
      currentSong.play($("#slider").slider("option","value"));  

    } else if ($("#divSliderRange").css("display") == "block"){

      var debut = $("#slider-range").slider("option","values")[0];
      var fin = $("#slider-range").slider("option","values")[1];

      currentSong.play(debut);
      
      var valRange = debut;
      var valMax = fin
      
      intervalId = setInterval(function(){

        if(btnPlay.dataset.state === "pause"){
          valRange += 0.1;
          
          if(valRange >= valMax) {
            window.clearInterval(intervalId);
            pauseAllTracks();
            playAllTracks();
          }
        }
        else {
          // window.clearInterval(intervalId);
        }
      }, 100);
    }
  }

  function pauseAllTracks() {
    if(currentSong != null)
      currentSong.pause();

    if(intervalId != 0 ){
      window.clearInterval(intervalId);
    }

    // currentSong.elapsedTimeSinceStart  = context.currentTime;
    // lastTime = context.currentTime;
  }

  function finishedLoading(bufferList) {
    btnPlay.dataset.state = "loading";
    $("#titleCurrentSong").text(currentSong.name);
    updateBtnPlay();
    console.log("Finished loading all tracks, press Start button above!");

    // set the decoded buffer in the song object
    currentSong.setDecodedAudioBuffers(bufferList);

    //a init dynamiquement en fnt de la musique (duree de la musique)
    dureeTotale = currentSong.getDuration();
    initSlide();
    updateDivSlider();
    updateDivSliderRange();
    
    btnPlay.dataset.state = "play";
    updateBtnPlay();
  }

  function soloNosoloTrack(instrumentName) {
    // var s = document.querySelector("#solo" + trackNumber);
    // var m = document.querySelector("#mute" + trackNumber);

    var currentTrack = "";

    currentSong.tracks.forEach(function(track){
      if(track.name === instrumentName){
        currentTrack=track;
      }
    });


    // $(s).toggleClass("activated");

    // Is the current track in solo mode ?
    if (!currentTrack.solo) {
        // we were not in solo mode, let's go in solo mode
        currentTrack.solo = true;
        // Let's change the icon
        // s.innerHTML = "<img src='../img/noearphones.png' />";
      } else {
        // we were in solo mode, let's go to the "no solo" mode
        currentTrack.solo = false;
        // Let's change the icon
        // s.innerHTML = "<img src='../img/earphones.png' />";
      }

    // In all cases we remove the mute state of the curent track
    currentTrack.mute = false;

    // Adjust the volumes depending on all mute/solo states
    currentSong.setTrackVolumesDependingOnMuteSoloStatus();
  }

  function muteUnmuteTrack(instrumentName) {
    var currentTrack = "";

    currentSong.tracks.forEach(function(track){
      if(track.name === instrumentName){
        currentTrack=track;
      }
    });
    if (!currentTrack.muted) {
        // Track was not muted, let's mute it!
        currentTrack.muted = true;
      } else {
        // track was muted, let's unmute it!
        currentTrack.muted = false;
      }

    // In all cases we must put the track on "no solo" mode
    currentTrack.solo = false;
    // adjust track volumes dependinf on all mute/solo states
    currentSong.setTrackVolumesDependingOnMuteSoloStatus();
  }

});



