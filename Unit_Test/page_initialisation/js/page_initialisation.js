// --- Page javascript de la page d'initialisation
// -------------------------------------------- //

$(document).ready(function(){
	
	// --- Fonction de prise en charge de changement dans l'upload d'un fichier
	//
	$('#inputFiles').delegate('input[type=file]', 'change', function() {

		/* Ajouter ici le traitement des fichiers, 
		peut etre mettre une variable globale qui stockera les elements? 
		A voir. */

		// Creer un nouveau input file
		var newInputFile = $('<input type="file" data-input="false"/>');

		// Ajouter le nouverau input dans le conteneur des input files
		$('#inputFiles').append(newInputFile);

		// Ajouter correctement le CSS au bouton
		$(":file").filestyle('input', false); 
	});
	
});