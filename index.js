var through = require('through');
var os = require('os');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;
var child_process = require('child_process');
var merge = require('deepmerge');
var service = null;

module.exports = function(options){
	function run(script){
		if (!script || typeof(script.path) !== "string") {
			throw new PluginError('gulp-koa-service', 'Missing or invalid script for gulp-koa-service', {showProperties: false});
		}
		if(service && service.kill){
			service.kill('SIGTERM');
			servers = null;
		}
		options = options || {};
		var opts = merge({
			cwd: undefined,
			env: process.env,
			stdio: 'inherit'
		}, options);
		service = process._servers = child_process.spawn('node',['--harmony', script.path, '--color'], opts);
	};
	return through(run);
};