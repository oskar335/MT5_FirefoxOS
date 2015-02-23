//Cache par defaut le slider boucle AB
$("#divSliderRange").hide();
$("#listePiste").hide();
//Desactive par defaut le reset boucle AB
$("#loopReset").prop('disabled', true);



//Action du bouton play
$("#bplay").click(function(){
	//recupere le span qui contient le glyphicon 
	var span = $(this).find(".glyphicon");
	//inverse le glyphicon play et pause
	span.toggleClass("glyphicon-pause");
	span.toggleClass("glyphicon-play");

  //loadDogSound("http://localhost:8081/multitrack/AdmiralCrumple_KeepsFlowing/06_Sample.mp3");
});

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
  $("#slider-range").slider( "option", "values", [0,30] );
  updateDivSliderRange();
});

//ACtion du bouton de boucle pour revenir au debut de la chanson
$("#loop").click(function(){
  $("#slider").slider( "option", "value",0 );
  updateDivSlider();
});

if($("#toggleMultipiste").text==="Mode Multipiste"){

}

//Action du bouton mode multi/monopiste
$("#toggleMultipiste").click(function(){
  $(this).text(function(i, text){
          return text === "Mode Multipiste" ? "Mode Monopiste" : "Mode Multipiste";
  });
  $("#listePiste").toggle();
  $("#divImgAlbum").toggle();

});

// ******** Music slider (JQuery UI) ********

//a init dynamiquement en fnt de la musique (duree de la musique)
var dureeTotale = 150;

//Met a jour les elements du div du slider normal
function updateDivSlider(){
  var min = $("#slider").slider( "option", "min" );
  var max = $("#slider").slider( "option", "max" );
  var beginTime = min + $("#slider").slider( "option", "value" );
  var endTime = max - $("#slider").slider( "option", "value" ); 

  $("#beginTime").text(intToMinutes(beginTime));
  $("#endTime").text("- " + intToMinutes(endTime));
}

//Permet de repositionner les tooltips sur les curseurs
function repositionTooltip( e, ui ){

  var div = $(ui.handle).data("bs.tooltip").$tip[0];
  var pos = $.extend({}, $(ui.handle).offset(), { width: $(ui.handle).get(0).offsetWidth,
                                                  height: $(ui.handle).get(0).offsetHeight});
  
  var actualWidth = div.offsetWidth;
  
  tp = {left: pos.left + pos.width / 2 - actualWidth / 2}            
  $(div).offset(tp);
  
  $(div).find(".tooltip-inner").text( intToMinutes(ui.value) ); 

  updateDivSlider();

}

//Definition du slider
$("#slider").slider({
  range: "min",
  value: 0,
  min: 0,
  max: dureeTotale,
  //init 
  create : function(e, ui){
    $("#slider .ui-slider-handle:first").tooltip( {title: intToMinutes($("#slider").slider("value")), trigger: "manual"}).tooltip("show");
  	updateDivSlider();
  },
  slide: repositionTooltip,
  //Quand on lache le slider
  stop: function(e, ui){
  	$("#slider .ui-slider-handle:first").tooltip("hide");
  },
  //Quand on commence a tenir le slider
  start: function(e, ui){
  	$("#slider .ui-slider-handle:first").tooltip( {title: intToMinutes($("#slider").slider("value")), trigger: "manual"}).tooltip("show");
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




// ******** Music slider range avec deux positions (JQuery UI) ********

//Met a jour les elements du div du slider multi curseur
function updateDivSliderRange(){
  var value = $( "#slider-range" ).slider( "option", "values" );
  $('#slider-range > .ui-slider-handle:first').html('<div class="tooltip top slider-tip"><div class="tooltip-arrow"></div><div class="tooltip-inner">' +intToMinutes(value[0]) + '</div></div>');
  $('#slider-range > .ui-slider-handle:last').html('<div class="tooltip top slider-tip"><div class="tooltip-arrow"></div><div class="tooltip-inner">' + intToMinutes(value[1]) + '</div></div>');
  $("#loopA").text("Début : " + intToMinutes(value[ 0 ]));
  $("#loopB").text("Fin : " + intToMinutes(value[ 1 ]));
}

//Définition du slider multicurseur
$("#slider-range").slider({
  range: true,
  min: 0,
  max: dureeTotale,
  values: [dureeTotale/5 ,dureeTotale/3],
  slide: function(e, ui){
    updateDivSliderRange();
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



