String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

/*sauvegarde musique dans le deviceStorage : name  == MT5/nomdossier/nomdufichier, arraybuf == tableau de buffer*/
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
	var requestMusic = sdcard.addNamed(blob,name);
	requestMusic.onsuccess = function () {
			var name = this.result;
			console.log('File "' + name + '" successfully wrote on the sdcard storage area');
		}
	requestMusic.onerror = function () {
		console.warn(this.error.name);
	}
}
/*suppresion musique: name  == MT5/nomdossier/nomdufichier */
function deletedMusic(name){
	
	var sdcard = navigator.getDeviceStorage("sdcard");
	var requestDel = sdcard.delete(name);
	
	requestDel.onsuccess = function () {	
		console.log("deleted the file: " +name);	
	}

	requestDel.onerror = function () {
		console.warn(this.error.name);
	}
}
/*Lecture musique: name  == MT5/nomdossier/nomdufichier */
function readMusic(name, callback){
	var sdcard = navigator.getDeviceStorage("sdcard");
	var requestDown = sdcard.get(name);
	
	requestDown.onsuccess = function () {
		var result_file = this.result;
		console.log("Get the file: " + result_file.name);
		var reader = new FileReader();
		reader.addEventListener("loadend", function() {
			console.log("fin reader");
			callback(reader.result);
		});
		reader.readAsArrayBuffer(result_file);		
	}

	requestDown.onerror = function () {
		console.warn(this.error.name);
		callback(false);

	}
}