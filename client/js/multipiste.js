// var divPistes = $("#listePiste");
// var groupeBoutonPiste = '<span class="pull-right">' + 
// 							'<button class="btn btn-sm">' +
// 								'<span class="glyphicon glyphicon-volume-off"></span>'+
// 							'</button> '+ 
// 							'<button class="btn btn-sm">' +
// 								'<span class="glyphicon glyphicon-headphones"></span>'+
// 							'</button>'+
// 						'</span>';

// $(document).ready(function(){
// 	divPistes.append('<a href="#" class="list-group-item clearfix">Track 1' + groupeBoutonPiste + '</a>');
// 	divPistes.append('<a href="#" class="list-group-item clearfix">Track 2' + groupeBoutonPiste + '</a>');
// });



//divListeMusique.append('<a href="#" class="list-group-item clearfix">' + file.name + '</a>');
//divListeMusique.append('<a href="#" class="list-group-item clearfix">Musique 2</a>');

function listContents(storagename,callback) {
	var tabSetMusique = new Set();
	//Clear up the list first

	var files = navigator.getDeviceStorage(storagename);

	var cursor = files.enumerate();

	cursor.onsuccess = function () {
	  //alert("Got something");
	  var file = this.result;

	  if (file != null) {
	  	this.done = false;

	  	console.log("file name => " + file.name);

	  	if(file.name.indexOf("MT5") > -1){
	  		console.log("OOOOKKK");
	  		var tmp = file.name.split("MT5")[1];
	  		console.log(tmp);
	  		var musique = tmp.split("/")[1];
	  		console.log(musique);
	  		tabSetMusique.add(musique);
	  	}
	  }
	  else {
	  	this.done = true;
	  }

	  if (!this.done) {
	  	this.continue();
	  }else{
	  	callback(tabSetMusique);
	  }
	}
	
}

$(document).ready(function(){

	console.log("multipiste");
	listContents('sdcard',function (Tab){
		var divListeMusique = $("#listeMusique");

		Tab.forEach(function(value) {
				console.log(value);
		  		divListeMusique.append('<a href="#" class="list-group-item clearfix">' + value + '</a>');
	});
});
	
});
	


