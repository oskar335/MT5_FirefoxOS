//Action du bouton play
$("#bplay").click(function(){
	//recupere le span qui contient le glyphicon 
	var span = $(this).find(".glyphicon");
	//inverse le glyphicon play et pause
	span.toggleClass("glyphicon-pause");
	span.toggleClass("glyphicon-play");
});

// ******** Music slider (JQuery UI) ********

//a init dynamiquement en fnt de la musique (duree de la musique)
var dureeTotale = 150;

function repositionTooltip( e, ui ){

  var div = $(ui.handle).data("bs.tooltip").$tip[0];
  var pos = $.extend({}, $(ui.handle).offset(), { width: $(ui.handle).get(0).offsetWidth,
                                                  height: $(ui.handle).get(0).offsetHeight});
  
  var actualWidth = div.offsetWidth;
  
  tp = {left: pos.left + pos.width / 2 - actualWidth / 2}            
  $(div).offset(tp);
  
  $(div).find(".tooltip-inner").text( intToMinutes(ui.value) ); 

  var min = $("#slider").slider( "option", "min" );
  var max = $("#slider").slider( "option", "max" );
  var beginTime = min + ui.value
  var endTime = max - ui.value; 

  $("#beginTime").text(intToMinutes(beginTime));
	$("#endTime").text("- " + intToMinutes(endTime));
}

$("#slider").slider({
  range: "min",
  value: 0,
  min: 0,
  max: dureeTotale,
  slide: repositionTooltip,
  //init 
  create : function(e, ui){
    $("#slider .ui-slider-handle:first").tooltip( {title: intToMinutes($("#slider").slider("value")), trigger: "manual"}).tooltip("show");
  	var min = $("#slider").slider( "option", "min" );
    var max = $("#slider").slider( "option", "max" );
    var value = $("#slider").slider( "option", "value" ); 
    var endTime = max - value; 
  	
  	$("#beginTime").text(intToMinutes(min));
   	$("#endTime").text("- " + intToMinutes(endTime));
  },
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

