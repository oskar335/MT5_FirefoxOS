function BufferLoader(context, urlList, callback, callbackDraw) {
	this.context = context;
	this.urlList = urlList;
	this.onload = callback;
	this.bufferList = [];
	this.loadCount = 0;
	this.drawSample = callbackDraw;
}

BufferLoader.prototype.loadBuffer = function (url, index) {
	// Load buffer asynchronously
	var urlData = url.replace("multitrack","MT5");
	var loader = this;
	var bufSong;
	readMusic(urlData, function(result){
		bufSong = result;	
		if(bufSong === false){

			var request = new XMLHttpRequest({mozSystem: true});
			request.open("GET",localStorage.getItem("address")+"/"+url, true);

			request.responseType = "arraybuffer"; 
			request.onload = function () {
				var file = request.response;
				if(localStorage.getItem("cache_record") == "true"){
					saveMusic(urlData,file);
				}
				// Asynchronously decode the audio file data in request.response
				loader.context.decodeAudioData(
						request.response,function(buffer){
							getCallback(buffer,loader,index);
						}
						,function (error) {
							console.error('decodeAudioData error', error);
							$("#footer").popover({
								'content' :error,
								'title' : "Erreur",
								'placement' : 'top',
								'trigger' : 'manual'
							});			
							$("#footer").popover('show');
							$("#footer").on('shown.bs.popover', function () {
								setTimeout(function(){
									$("#footer").popover('hide');
								},1400);
							});
							//TODO faire le rollback
						}
				);
			};


			/*request.onprogress = function (e) {

			if (e.total !== 0) {
				var percent = (e.loaded * 100) / e.total;
				console.log("loaded " + percent  + "of song " + index);
				//var progress = document.querySelector("#progress" + index);
				//progress.value = e.loaded;
				// progress.max = e.total;
			}
		};*/

			request.onerror = function () {
				console.error(this.error.name);
				alert('erreur de récupération');
			};

			request.send();
		}else{
			loader.context.decodeAudioData(
					bufSong,function(buffer){
						getCallback(buffer,loader,index);
					}
					,function (error) {
						console.error('decodeAudioData error', error);
						$("#footer").popover({
							'content' :error,
							'title' : "Erreur",
							'placement' : 'top',
							'trigger' : 'manual'
						});
						
						$("#footer").popover('show');
						$("#footer").on('shown.bs.popover', function () {
							setTimeout(function(){
								$("#footer").popover('hide');
							},1400);
						});
						//TODO faire le rollback
					}
			);
		}
	});
};

function getCallback (buffer,loader,index) {
	console.log("Loaded and decoded track " + (loader.loadCount + 1) +
			"/" + loader.urlList.length + "...");

	if (!buffer) {
		console.error('error decoding file data: ' + url);
		$("#footer").popover({
			'content' :error,
			'title' : 'error decoding file data: ' + url,
			'placement' : 'top',
			'trigger' : 'manual'
		});	
		$("#footer").popover('show');
			$("#footer").on('shown.bs.popover', function () {
				setTimeout(function(){
					$("#footer").popover('hide');
				},1400);
			});

		return;
	}
	loader.bufferList[index] = buffer;

	if (++loader.loadCount == loader.urlList.length)
		loader.onload(loader.bufferList);
}

BufferLoader.prototype.load = function () {
	// M.BUFFA added these two lines.
	this.bufferList = [];
	this.loadCount = 0;
	console.log("Loading tracks "+this.urlList.length+"... please wait...");
	for (var i = 0; i < this.urlList.length; ++i)
		this.loadBuffer(this.urlList[i], i);
};
