$(document).ready(function(){

  // The current song
  var currentSong;
  // The audio context
  var context;
  var lastTime = 0;
  var dureeTotale = 0;
  var intervalId = 0;

  var btnPlay = document.getElementById("bplay");

  //Cache par defaut le slider boucle AB
  $("#divSliderRange").hide();
  $("#listePiste").hide();
  //Desactive par defaut le reset boucle AB
  $("#loopReset").prop('disabled', true);

  // Init audio context
  context = initAudioContext();

  loadSongList();
  loadSong("AdmiralCrumple_KeepsFlowing");

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

  function updateBtnPlay() {
    //recupere le span qui contient le glyphicon 
    var span = $(btnPlay).find(".glyphicon");

    if(btnPlay.dataset.state == "play"){
      span.removeClass("glyphicon-pause");
      span.addClass("glyphicon-play");
    } else {
      span.addClass("glyphicon-pause");
      span.removeClass("glyphicon-play");
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
  $("#listePiste").toggle();
  $("#listeMusique").toggle();

});


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
  console.log(event);
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

$("#browseLocal").click(function(){
  window.location = "browse.html";
});

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
  var xhr = new XMLHttpRequest();
  
    //xhr.open('GET', localStorage.getItem("address")+"/track", true);
<<<<<<< HEAD
    xhr.open('GET', "http://192.168.1.121:8081/track", true);
=======
    xhr.open('GET', "http://192.168.6.171:8081/track", true);
>>>>>>> 51b0e38c1b5811e066a2ef3128833f791eb60fa5

    // Menu for song selection
    var s = $("<select id='songSelect'/>");
    s.appendTo("#songs");

    s.change(function (e) {
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
        });

    xhr.onload = function (e) {
      var songList = JSON.parse(this.response);

      if (songList[0]) {
        $("<option />", {
          value: "nochoice",
          text: "Choose a song..."
        }).appendTo(s);
      }

      songList.forEach(function (songName) {
        console.log(songName);

        $("<option />", {
          value: songName,
          text: songName
        }).appendTo(s);
      });
    };
    xhr.send();
}

// ##### TRACKS #####

function loadSong(songName) {
    //resetAllBeforeLoadingANewSong();

    // This function builds the current
    // song and resets all states to default (zero muted and zero solo lists, all
    // volumes set to 1, start at 0 second, etc.)
currentSong = new Song(songName, context);


var xhr = new XMLHttpRequest({mozSystem: true});
    // xhr.open('GET', localStorage.getItem("address")+"/"+currentSong.url, true);
<<<<<<< HEAD
    xhr.open('GET', "http://192.168.1.121:8081/"+currentSong.url, true);
=======
    xhr.open('GET', "http://192.168.6.171:8081/"+currentSong.url, true);
>>>>>>> 51b0e38c1b5811e066a2ef3128833f791eb60fa5

    xhr.onload = function (e) {
        // get a JSON description of the song
        var song = JSON.parse(this.response);

        // resize canvas depending on number of samples
        //resizeSampleCanvas(song.instruments.length);

        var divPistes = $("#listePiste");
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

      //       // Render HTMl
      //       var span = document.createElement('tr');
      //       span.innerHTML = '<td class="trackBox" style="height : ' + SAMPLE_HEIGHT + 'px">' +
      //           "<progress class='pisteProgress' id='progress" + trackNumber + "' value='0' max='100' style='width : " + SAMPLE_HEIGHT + "px' ></progress>" +
      //           instrument.name + '<div style="float : right;">' +
      //           "<button class='mute' id='mute" + trackNumber + "' onclick='muteUnmuteTrack(" + trackNumber + ");'><span class='glyphicon glyphicon-volume-up'></span></button> " +
      //           "<button class='solo' id='solo" + trackNumber + "' onclick='soloNosoloTrack(" + trackNumber + ");'><img src='../img/earphones.png' /></button></div>" +
      //           "<span id='volspan'><input type='range' class = 'volumeSlider custom' id='volume" + trackNumber + "' min='0' max = '100' value='100' oninput='setVolumeOfTrackDependingOnSliderValue(" + trackNumber + ");'/></span><td>";
      // /**suppression des onCLICK et onInput INTERDIT daans application embarqué*/
      // span.innerHTML = '<td class="trackBox" style="height : ' + SAMPLE_HEIGHT + 'px">' +
      //           "<progress class='pisteProgress' id='progress" + trackNumber + "' value='0' max='100' style='width : " + SAMPLE_HEIGHT + "px' ></progress>" +
      //           instrument.name + '<div style="float : right;">' +
      //           "<button class='mute' id='mute" + trackNumber + "<span class='glyphicon glyphicon-volume-up'></span></button> " +
      //           "<button class='solo' id='solo" + trackNumber + "<img src='../img/earphones.png' /></button></div>" +
      //           "<span id='volspan'><input type='range' class = 'volumeSlider custom' id='volume" + trackNumber + "' min='0' max = '100' value='100'/></span><td>";
      //       divTrack.appendChild(span);

    });

        // Add range listeners, from range-input.js
        //addRangeListeners();


        // disable all mute/solo buttons
        //$(".mute").attr("disabled", true);
        //$(".solo").attr("disabled", true);

        // Loads all samples for the currentSong
        loadAllSoundSamples();
      };
      xhr.send();
    }

    function loadAllSoundSamples() {
      bufferLoader = new BufferLoader(
        context,
        currentSong.getUrlsOfTracks(),
        finishedLoading
        //drawTrack
        );
      bufferLoader.load();


    }

    function playAllTracks() {
    // First : build the web audio graph
    //currentSong.buildGraph();

    // Read current master volume slider position and set the volume
    //setMasterVolume();

    
      
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



    
      
    // Set each track volume depending on slider value
    //for (i = 0; i < currentSong.getNbTracks(); i++) {
        // set volume gain of track i the value indicated by the slider
        //setVolumeOfTrackDependingOnSliderValue(i);
    //}

    // Adjust the volumes depending on all mute/solo states
    //currentSong.setTrackVolumesDependingOnMuteSoloStatus();


    // enable all mute/solo buttons
    //$(".mute").attr("disabled", false);
    //$(".solo").attr("disabled", false);

    // Set play/stop/pause buttons' states
    // buttonPlay.disabled = true;
    // buttonStop.disabled = false;
    // buttonPause.disabled = false;

    // Note : we memorise the current time, context.currentTime always
    // goes forward, it's a high precision timer
    //lastTime = context.currentTime;
    //console.log("PLAY "+context.currentTime);


    //View.activeWaveTab();
  }

  function pauseAllTracks() {
    currentSong.pause();

    if(intervalId != 0 ){
      window.clearInterval(intervalId);
    }

    // currentSong.elapsedTimeSinceStart  = context.currentTime;
    // lastTime = context.currentTime;
  }

  function finishedLoading(bufferList) {
    console.log("Finished loading all tracks, press Start button above!");

    // set the decoded buffer in the song object
    currentSong.setDecodedAudioBuffers(bufferList);

    //a init dynamiquement en fnt de la musique (duree de la musique)
    dureeTotale = currentSong.getDuration();
    initSlide();
    // buttonPlay.disabled = false;
    // buttonRecordMix.disabled = false;

    // //enabling the loop buttons
    // $('#loopBox > button').each(function (key, item) {
    //     item.disabled = false;
    // });

    // // enable all mute/solo buttons
    // $(".mute").attr("disabled", false);
    // $(".solo").attr("disabled", false);

    // // enable song select menu
    // var s = document.querySelector("#songSelect");
    // s.disabled = false;

    // Set each track volume slider to max
    // for (i = 0; i < currentSong.getNbTracks(); i++) {
    //     // set volume gain of track i to max (1)
    //     //currentSong.setVolumeOfTrack(1, i);
    //     $(".volumeSlider").each(function (obj, value) {
    //         obj.value = 100;
    //     });
    // }
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
    // $(m).removeClass("activated");
    // Let's change the icon
    // m.innerHTML = "<span class='glyphicon glyphicon-volume-up'></span>";

    // Adjust the volumes depending on all mute/solo states
    currentSong.setTrackVolumesDependingOnMuteSoloStatus();
  }

  function muteUnmuteTrack(instrumentName) {
    // var m = document.querySelector("#mute" + trackNumber);
    // var s = document.querySelector("#solo" + trackNumber);

    var currentTrack = "";

    currentSong.tracks.forEach(function(track){
      if(track.name === instrumentName){
        currentTrack=track;
      }
    });

    //$(m).toggleClass("activated");

    if (!currentTrack.muted) {
        // Track was not muted, let's mute it!
        currentTrack.muted = true;
        // let's change the button's class
        // m.innerHTML = "<span class='glyphicon glyphicon-volume-off'></span>";
      } else {
        // track was muted, let's unmute it!
        currentTrack.muted = false;
        // m.innerHTML = "<span class='glyphicon glyphicon-volume-up'></span>";
      }

    // In all cases we must put the track on "no solo" mode
    currentTrack.solo = false;
    // $(s).removeClass("activated");
    // Let's change the icon
    // s.innerHTML = "<img src='../img/earphones.png' />";

    // adjust track volumes dependinf on all mute/solo states
    currentSong.setTrackVolumesDependingOnMuteSoloStatus();
  }

});

