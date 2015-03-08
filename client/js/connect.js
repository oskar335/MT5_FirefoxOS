$(document).ready(function() {

	// Verifier l'etat de la connexion au lancement
	//
	if (navigator.onLine) {
	  	// Accepter l'entree des informations de connexion au serveur distant
		$("#server").prop('disabled', false);
		$("#port").prop('disabled', false);
	} else {
		// Empecher l'entree des informations de connexion au serveur distant
		$("#server").prop('disabled', true);
		$("#port").prop('disabled', true);
	}

	// Traiter l'evenement de la connexion (modifie par Nouriel, traitement du button vis a vis de l'etat du reseau)
	//
	$("#connect").submit(function(){

		var valide;

		// Accepter s'il y a une connexion, refuser sinon
		if (navigator.onLine) {
			var server = $("#server").val();
			if(server != null && (server == "localhost" || server.match(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/))){
				valide = true;
			}
			else{
				alert("Adresse IP non valide");
			}
			
			var port = $("#port").val();
			if(!(port !=null || port.match(/\d{2,4}/))){
				alert("Port non valide");
				valide = false;
			}
			
		}
		else {
			valide = false;
			alert("Pas de connexion possible");
		}

		if(valide){
			var address= "http://"+server+":"+port;
			localStorage.setItem('address', address);
			return true;
		}else{
			return false;
		}

	});

	// Traiter l'evenement du click du mode hors ligne
	//
	$("#modeHorsConnexion").click(function(){

		localStorage.setItem('address', "");
		window.location = "player.html";

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

})

// --- Fonction de verification de l'accessibilite serveur distant
// Site http://bioinfo-fr.net/ping-en-jquery
// Ne semble pas fonctionner, peu importe l'adresse construit (avec ou sans port, avec ou sans 'http://'..) le status est toujours 'error'.
// Peut etre un probleme de cross-domain, bien que sur le node serveur.js il est traite.. A voir pourquoi.
//
function checkServer(ip, port){
 	
	var adresse = ip+":"+port;//"http://"+  +":"+port

 	//alert(adresse);
    $.ajax({ 
    	type: "HEAD",
        url: adresse,
        cache:false,
        complete: function(xhr,status){
        	alert(status);
        }
     });
}        
