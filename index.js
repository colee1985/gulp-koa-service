var through = require('through');
var os = require('os');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;
var child_process = require('child_process');


module.exports = function(opt){
	// console.log('child_process',child_process);
	var service = null;
	function run(){
		service = process._servers;
		// console.log('restart express',process._servers);
		if(service && service.kill){
			console.log('stop');
			service.kill('SIGTERM');
			process._servers = null;
		}
		service = process._servers = child_process.spawn('node',['--harmony', opt.file, '--color']);
		service.stdout.setEncoding('utf8');
		service.stdout.on('data', function(data) {
			console.log(data);
		});
	};
	return through(run);
};