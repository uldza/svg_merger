var gulp    = require('gulp'),
imagemin    = require('gulp-imagemin'),
cheerio     = require('gulp-cheerio'),
svgSprite   = require('gulp-svg-sprite');


var config                  = {
    transform               : [],
    svg                     : {
        xmlDeclaration      : false,
        doctypeDeclaration  : true,
        namespaceIDs        : true,
        dimensionAttributes : true
    },
    mode                    : {
      symbol                : {
        dest                : '.',
        sprite              : 'interface.svg'
      }
    },
};

gulp.task('merge_svg', function() {
    return gulp
        .src('src/*.svg')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [
              {removeViewBox: true},
              {removeDesc: true},
              {removeUselessStrokeAndFill: true},
              {cleanupEnableBackground: true}
            ]
        }))
        .pipe(cheerio({
            run: function($) {
                $('[fill]').removeAttr('fill');
                $('svg').removeAttr('preserveAspectRatio');
                $('path').removeAttr('class');
                $('path').removeAttr('fill-rule');
                $('defs').remove();
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe( svgSprite(config) )
        .pipe(gulp.dest('optimized'));
});



gulp.task('default', ['merge_svg']);
