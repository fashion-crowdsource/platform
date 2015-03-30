var gulp 	= require("gulp");
var lab 	= require("gulp-lab");

gulp.task("lab", function (){
    return gulp.src("test/*.js")
      .pipe(lab(["-v", "-c"])); //-v shows all the passed tests as well as failed ones, -l hides global variable leaks, -c test coverage
});

gulp.task("watch-lab", function() {
	gulp.watch(["test/**.js", "api/**.js"], ["lab"]);
});

gulp.task("default", ["lab", "watch-lab"]);