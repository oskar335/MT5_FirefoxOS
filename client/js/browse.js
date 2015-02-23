$(document).ready(function() {
    var io = new IOManager("sdcard");
    io.init();
    var fileList = $("#file-list");
    var filAriane = $("#ariane");

    // Fichier de test
    /*var file   = new Blob(["This is a text file."], {type: "text/plain"});

    io.writeFile(file, "dossier2/texte.txt", function (result) {
      console.log('File "' + result + '" successfully wrote on the sdcard storage area');
      getFiles();
    });*/

    drawFileList();

    function drawFileList() {
        for (f in io.currentDirContents) {
            fileList.append('<a href="#" class="list-group-item">'+f+'</a>');
            filAriane.append('<li><a href="#">'+f+'</a></li>');
        }
    }
});