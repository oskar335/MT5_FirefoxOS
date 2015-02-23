$(document).ready(function() {
	$("#connect").submit(function(){
		var valide;
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
		if(valide){
			var address= "http://"+server+":"+port;
			localStorage.setItem('address', address);
			return true;
		}else{
			return false;
		}
	});
})