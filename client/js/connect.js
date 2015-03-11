$(document).ready(function() {
 

	// Verifier l'etat de la connexion au lancement
	//
	var btnBrowse = document.getElementById("browseServer");
	var btnBrowseLocal = document.getElementById("browseLocal"); //bouton parcourir musiques locales
	if (navigator.onLine) {
	  	// Accepter l'entree des informations de connexion au serveur distant
		$("#server").prop('disabled', false);
		$("#port").prop('disabled', false);

		//test si la connexion au serveur est OK, sinon change le bouton parcourir musiques distantes
		checkServer(localStorage.getItem('address'),function(e){
			if(!e){
				var span = $(btnBrowse).find(".glyphicon");
				span.removeClass("glyphicon-globe");
				span.addClass("glyphicon-log-in");
			}
		});

	} else {
		// Empecher l'entree des informations de connexion au serveur distant
		$("#server").prop('disabled', true);
		$("#port").prop('disabled', true);
	}

	// Traiter l'evenement de la connexion (modifie par Nouriel, traitement du button vis a vis de l'etat du reseau)
	//
	$("#connect").click(function(){
		
		var valide;

		// Accepter s'il y a une connexion, refuser sinon
		if (navigator.onLine) {
			var server = $("#server").val();
			if(server != null ){
				valide = true;
			}
			else{
				alert("Adresse IP non valide");
			}
			
			var port = $("#port").val();
			if(!(port !=null && port.match(/\d{2,5}/))){
				alert("Port non valide");
				valide = false;
			}
			
		}
		else {
			valide = false;
			alert("Pas de connexion possible");
		}
		
		if(valide){
			var addresse= "http://"+server+":"+port;
			if(valide){
				$("#connect").prop("disabled",true);
				checkServer(addresse,function(e){
					if(!e){
						valide=false;
						alert("Serveur MT5 indisponible ou incorrect");
						$("#connect").prop("disabled",false);

					}else{
						localStorage.setItem('address', addresse);
						var span = $(btnBrowse).find(".glyphicon");
						span.addClass("glyphicon-globe");
						span.removeClass("glyphicon-log-in");
						$("#modal-server").modal('hide');
						$("#connect").prop("disabled",false);

						
					}
				});
			}
		}
	});

	// Traiter l'evenement du click du mode hors ligne
	//
	$("#modeHorsConnexion").click(function(){

		//localStorage.setItem('address', "");
		 $(btnBrowse).find(".glyphicon").toggleClass("glyphicon-globe");
		$(btnBrowse).find(".glyphicon").toggleClass("glyphicon-log-in");
		$("#listeMusiqueServer").hide(); 
		$("#listePiste").hide();
		showDivLocalSong();
		$(btnBrowseLocal).addClass("active")
		$(btnBrowse).removeClass("active")

		//window.location = "player.html";
		$("#modal-server").modal('hide');

	});

	// --- Traitement d'evenements de validite de connexion
	// ----------------------------------------------------

	// --- Traitement de connexion reseau viable
	// addEventListener
	$(window).on("offline", function() {
		
		// Empecher l'entree des informations de connexion au serveur distant
		$("#server").prop('disabled', true);
		$("#port").prop('disabled', true);
	});

	// --- Traitement de connexion reseau non viable
	// addEventListener
	$(window).on("online", function() {
		
		// Accepter l'entree des informations de connexion au serveur distant
		$("#server").prop('disabled', false);
		$("#port").prop('disabled', false);
	});

});

// --- Fonction de verification de l'accessibilite serveur distant
// Site http://bioinfo-fr.net/ping-en-jquery
// Ne semble pas fonctionner, peu importe l'adresse construit (avec ou sans port, avec ou sans 'http://'..) le status est toujours 'error'.
// Peut etre un probleme de cross-domain, bien que sur le node serveur.js il est traite.. A voir pourquoi.
//
function checkServer(addresse,callback){
	
	var xhr = new XMLHttpRequest({mozSystem: true}); 

    xhr.open('GET', addresse+"/track", true);

    // Menu for song selection

	xhr.onload = function (e) {
		callback(true);
	};
	xhr.onerror = function () {
		callback(false);
	};

xhr.send();
}        
