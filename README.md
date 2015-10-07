USE：
	var koaService = require('gulp-koa-service');

	gulp.task('coffee', function() {
		return gulp.src(paths.files)
		.pipe(koaService({file:'./build/service.js'}));
	});