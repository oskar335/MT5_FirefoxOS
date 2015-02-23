String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

/*sauvegarde musique dans le deviceStorage : name  == nomdossier/nomdufichier, arraybuf == tableau de buffer*/
function saveMusic(name,arrayBuf){
	/*création blob en fonction du type*/
	var blob;
	if(name.endsWith(".ogg")){
		blob = new Blob([arrayBuf],{type: "audio/ogg"});
	}
	if(name.endsWith(".mp3")){
		blob = new Blob([arrayBuf],{type: "audio/mpeg"});
		console.log('rere');
	}
	if(name.endsWith(".wav")){
		blob = new Blob([arrayBuf],{type: "audio/wav"});
	}
	
	var sdcard = navigator.getDeviceStorage("sdcard");
	/*ajout fichier dans deviceStorage*/
	var requestMusic = sdcard.addNamed(blob,"MT5/"+name);
	requestMusic.onsuccess = function () {
			var name = this.result;
			console.log('File "' + name + '" successfully wrote on the sdcard storage area');
		}
	requestMusic.onerror = function () {
		console.warn(this.error.name);
		if(this.error.name == "NoModificationAllowedError")
			readMusic(name);
	}
}
/*suppresion musique: name  == nomdossier/nomdufichier */
function deletedMusic(name){
	
	var sdcard = navigator.getDeviceStorage("sdcard");
	var requestDel = sdcard.delete("MT5/"+name);
	
	requestDel.onsuccess = function () {	
		console.log("deleted the file: " + "MT5/"+name);	
	}

	requestDel.onerror = function () {
		console.warn(this.error.name);
	}
}

/*Lecture musique: name  == nomdossier/nomdufichier */
function readMusic(name){
	var sdcard = navigator.getDeviceStorage("sdcard");
	var requestDown = sdcard.get("MT5/"+name);
	var result;
	requestDown.onsuccess = function () {
		var result_file = this.result;
		console.log("Get the file: " + result_file.name);
		window.open(URL.createObjectURL(result_file));
		var reader = new FileReader();
		reader.addEventListener("loadend", function() {
			var result = reader.result;
			return result;
		});
		reader.readAsArrayBuffer(result_file);
	}

	requestDown.onerror = function () {
		console.warn(this.error.name);
		if(this.error.name == "NotFoundError")
			alert("Musique introuvable");

	}
}

$('#del').click(function(){
	deletedMusic("AdmiralCrumple_KeepsFlowing/09_LeadVoxDouble2.mp3");
})
$('#read').click(function(){
	readMusic("AdmiralCrumple_KeepsFlowing/09_LeadVoxDouble2.mp3");
})
$('#add').click(function(){
	
	var request = new XMLHttpRequest({mozSystem: true});
	request.open("GET", "http://localhost:8081/multitrack/AdmiralCrumple_KeepsFlowing/09_LeadVoxDouble2.mp3", true);
	request.send();

	request.responseType = "arraybuffer"; 
		request.onload = function () {
			var buf = request.response;
			saveMusic("AdmiralCrumple_KeepsFlowing/09_LeadVoxDouble2.mp3",buf);
		}	
	request.onerror = function () {
	 
		console.log(this.error.name);
	}
})