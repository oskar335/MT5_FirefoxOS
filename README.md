MT5 for Firefox OS - A multitrack Player for Firefox OS in HTML5
===========

This project is a Firefox OS fork of the [original MT5](https://github.com/squallooo/MT5) by @squallooo and @micbuffa. While the original tries to be as cross-browser as possible, this one is optimized for the Gecko rendering engine, with a focus on small resolutions and low-budget CPUs. It also takes advantage of Firefox OS-only features, such as DeviceStorage, and cannot be used outside of Firefox OS yet.

An online demo of the desktop version is available at http://mt5demo.gexsoft.com, but please bear in mind that all the features may not be present in the mobile version.

MT5 is a multitrack player that has been developed for musicians who like to study a song track by track, or mute some tracks and play along with it.

This repository contains a nodeJS server to host your audio files and MT5 itself, the mobile client. The default behaviour is that the client will connect to @micbuffa's server, but you can customize the server address in the app.

A complete tutorial is available in the wiki of this project.

Server setup
-----------

To run the server, you will need nodeJS and some node modules. Just run `npm install` to download the modules, then run `node server.js`.

Client setup
-----------

Just download the app, and put your server IP in the settings menu.

Technical informations
-----------

This project is based on Web Audio API allowing to play some songs in the same time and create loops.

The multitrack songs are located in the directory assigned to TRACK_PATH, this is by default client/multitrack, and a multitrack song is just a directory with files in it, corresponding to the tracks. Just create new dir with mp3, ogg, wav files and reload the page, you will be able to play new songs.

Web audio pausing or jumping in a song is way unnatural as the AudioBufferSource nodes can be started and stopped only once. This "fire and forget" approach chosen in web audio for these particular nodes means that we need to rebuild partially the web audio graph at each pause or jump. The play/pause/jump and building of the audio graph is done in the song.js file.

Contributors 
-----------

* Nouriel Azria (Felours)
* Medhy Salim (BrainZz)
* Svetlana Kvasova (kvassova)
* Romain Chalut (RomainChalut) 
* Alexis Manganiello (AlexManga)
* Alex Pernot (AlexPernot) 


* Michel Buffa (micBuffa)
* Didier Courtaud (Desiderius77)

Privacy Policy
-----------

A privacy policy is available [here](http://romainchalut.github.io/MT5_FirefoxOS/privacy-policy.html).