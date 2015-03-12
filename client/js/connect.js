window.addEventListener("load",function() {

	var btnBrowse = document.getElementById("browseServer");
	var btnBrowseLocal = document.getElementById("browseLocal"); //bouton parcourir musiques locales

	// Verifier l'etat de la connexion au lancement
	if (navigator.onLine) {
	  	// Accepter l'entree des informations de connexion au serveur distant
		$("#server").prop('disabled', false);
		$("#port").prop('disabled', false);

		//test si la connexion au serveur est OK, sinon change le bouton parcourir musiques distantes
		checkServer(localStorage.getItem('address'),function(e){
			if(!e){
				setOfflineMode();
			}else {
				setOnlineMode();
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
						setOnlineMode();
						$("#modal-server").modal('hide');
						$("#connect").prop("disabled",false);

						
					}
				});
			}
		}
	});

	// Traiter l'evenement du click sur le bouton deconnexion de la pop-up de connexion
	$("#modeHorsConnexion").click(function(){
		setOfflineMode();
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

	//Ajoute l'évenement lorsque la visibilité de l'appli change (quand on revient dessus par ex)
 	document.addEventListener("visibilitychange", handleVisibilityChange, false);

	//Si la page devient visible un test de connexion est fait
	function handleVisibilityChange() {
		if (document["hidden"]) {
			console.log("hidden");
		} else {
			//test si la connexion au serveur est OK, sinon change le bouton parcourir musiques distantes
			checkServer(localStorage.getItem('address'),function(e){
				if(!e){
					setOfflineMode();
				} else {
					setOnlineMode();
				}
			});
	 	}
	}

 	

 	//Met l'application en mode hors ligne en modifiant le HTML 
 	function setOfflineMode(){
		$(btnBrowse).find(".glyphicon").removeClass("glyphicon-globe");
		$(btnBrowse).find(".glyphicon").addClass("glyphicon-log-in");
		$("#listeMusiqueServer").hide(); 
		$("#listePiste").hide();
		showDivLocalSong();
		$(btnBrowseLocal).addClass("active");
		$(btnBrowse).removeClass("active");
	}   

	//Met l'application en mode en ligne en modifiant le HTML 
	function setOnlineMode(){
		var span = $(btnBrowse).find(".glyphicon");
		span.addClass("glyphicon-globe");
		span.removeClass("glyphicon-log-in");
	}

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
		if(this.response !== null){
			callback(true);			
		} else {
			callback(false);
		}
	};
	
	xhr.onerror = function () {
		callback(false);
	};

xhr.send();
}

