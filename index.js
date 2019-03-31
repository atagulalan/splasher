const {promisify} = require('util');
const path = require('path');
const childProcess = require('child_process');
const https = require('https');
const fs = require('fs');
const execFile = promisify(childProcess.execFile);
const binary = path.join(__dirname, 'bin/win-wallpaper.exe');

var oldFolder = 'wallpapers/old/'
var next = 'wallpapers/next.jpg'
var current = 'wallpapers/current.jpg'
var dims = [2560, 1440];
var url = "https://source.unsplash.com/random/"+dims.join("x");

function success(text, alter){
	console.log('\x1b[32m', '\u2713', alter ? '\x1b[31m' : '\x1b[36m', text, '\x1b[0m');
}

function download(cb) {
	success((cb ? "[CURRENT]" : "[NEXT]") + " DOWNLOADING...", !!cb)
	var file = fs.createWriteStream(next);
	https.get(url, function(res) {
		// expected
		if (res.statusCode > 300 && res.statusCode < 400 && res.headers.location) {
			https.get(res.headers.location, function(res) {
				res.pipe(file);
				file.on('finish', function() {
					file.close(cb);
				});
			});
		}
	});
}

function main() {
	fs.access(next, fs.F_OK, (err) => {
		if (err) {
			download(main);
			return;
		}
		fs.copyFile(current, oldFolder+(+ new Date())+".jpg", (err) => {
			console.log(err)
			fs.rename(next, current, function () {
				success("RENAMING THE FILE")
				execFile(binary, [path.resolve(current)]);
				success("SETTING WALLPAPER")
				download();
			})
		});
	})
};

main();