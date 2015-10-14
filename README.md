USE：
	var koaService = require('gulp-koa-service');

	gulp.task('run_service', function() {
		return gulp.src('./trunk/index.js')
		.pipe(koaService({
			"env": {
				"PORT": 8080,
				"NODE_ENV": "dev",//production
				"NODE_OPTIONS": "--debug=47977",
			}
		}));
	});

	gulp.task("watch", function() {
		gulp.watch(["trunk/**/*.js"], ['run_service']);
	});

logs:
0.0.8 添加错误显示,其它修复和优化。参考了#gulp-koa#，他对我很有帮助。