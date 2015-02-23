 $('#play').click(
function(){ 
 var request = new XMLHttpRequest({mozSystem: true});
  request.open("GET", "http://localhost:8081/multitrack/AdmiralCrumple_KeepsFlowing_1/01_Kick1.mp3", true);
	request.send();
  var loader = this;
request.responseType = "arraybuffer"; 
 request.onload = function () {
	var file = request.response;
	var aBlob = new Blob([file],{type: "audio/mpeg"});
		

	var sdcard = navigator.getDeviceStorage("sdcard");
		var requestMusic = sdcard.addNamed(aBlob,"test5.mp3");
		requestMusic.onsuccess = function () {
			var name = this.result;
			console.log('############################File "' + name + '" successfully wrote on the sdcard storage area');
		}

		// An error typically occur if a file with the same name already exist
		requestMusic.onerror = function () {

			console.warn('Unable to write the file: ' + this.error);
		}
	/*var requestDown = sdcard.get("test3.mp3");

	requestDown.onsuccess = function () {
		var file2 = this.result;
		console.log("Get the file: " + file2.name);
		window.open(file2);
	}

	requestDown.onerror = function () {
		console.warn("Unable to get the file: " + this.error);
	}*/
 }	
 
 request.onerror = function () {
	 
	 console.log("erreur");
 }
})