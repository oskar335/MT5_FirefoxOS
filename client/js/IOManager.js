/* IOManager.js
 * Class to read and write on the sdcard on Firefox OS.
 * @author Alex Pernot
 * @param string deviceStorage The deviceStorage to read from. Can be sdcard, music...
 */
function IOManager(deviceStorage) {
    // If we're not on FxOS, no need to go further
    if (!navigator.getDeviceStorage) {
        return false;
    }

    this.storage = navigator.getDeviceStorage(deviceStorage);
    this.currentDir = "";
    this.currentDirContents = [];
}

IOManager.prototype = {
    constructor: IOManager,
    /**
     * Async function to read a given path.
     * @param string path
     * @param function callback Function executed after the directory has been read. One parameter : an array containing the results
     */
    read: function(path, callback) {
        var results = [];
        var cursor = this.storage.enumerate(path);

        // We add the filenames to the array
        cursor.onsuccess = function() {
            if (this.result) {
                console.log(this.result);
                results.push(this.result.name);
            }            

            if (!this.done) {
                this.continue();
            }
            else {
                callback(results);
            }
        }

        cursor.onerror = function() {
            console.warn("No file found: " + this.error.name);
        }
    },
    /**
     * Get the filenames at path
     * @param string path
     * @param array
     */
    readCurrentDir: function() {
        console.log("Scanning dir: "+this.currentDir);
        this.read(this.currentDir, function(files) {
            console.log("Found: "+files);
            this.currentDirContents = files;
        });
    },
    openDir: function(dirName) {
        console.log("Openning dir: "+dirName);
        if ($.inArray(dirName, this.currentDirContents) !== -1) {
            this.currentDir = dirName;
            readCurrentDir();
        }
    },
    writeFile: function(blob, filename, callback) {
        var request = this.storage.addNamed(blob, this.currentDir+filename);

        request.onsuccess = function() {
            // If we didn't put the new file in a subfolder, we cache the new file in currentDirContents.
            if (filename.indexOf('/') === -1) {
                this.currentDirContents.push(filename);
            }
            callback(this.result);
        }

        // An error typically occur if a file with the same name already exist
        request.onerror = function () {
          console.warn('Unable to write the file: ' + this.error.name);
        }
    },    
    init: function() {
        this.readCurrentDir();
    }
};