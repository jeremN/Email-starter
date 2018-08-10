'use strict'

import gulp 					from 'gulp'
import nunjucksRender from 'gulp-nunjucks-render'
import data 					from 'gulp-data'
import gulpMjml 			from 'gulp-mjml'
import mjml 					from 'mjml'
import browserSync 		from 'browser-sync'
import imagemin 			from 'gulp-imagemin'
import pngquant 			from 'imagemin-pngquant'
import cache 					from 'gulp-cache'
import plumber 				from 'gulp-plumber'
import del 						from 'del'
import rimraf 				from 'rimraf'
import Inlinecss			from 'gulp-inline-css'
import fs 						from 'fs'

const server = browserSync.create()

const paths = {
	data: './src/data/data.json',
	templates: './src/templates/',
	emails: './src/emails/*.mjml',
	imgs: './src/images/*.+(png|jpg|jpeg|gif|svg)',
	build: {
		dist: './build/html/',
		imgs: './build/images/'
	},
	dev: {
		temp: './build/mjml/',
		src: './build/mjml/*.mjml'
	}
}

export function reload(done) {
	server.reload()
	done()
}

export function serve(done) {
	server.init({
		server: {
			baseDir: ['./build/html/', './build/']
		}
	})
	done()
}

export function clean(done) {
	rimraf('build', done)
}

export function loadData() {
	return JSON.parse(fs.readFileSync(paths.data))
}

export function optimImg() {
	const options = {
		interlaced: true,
		progressive: true,
		use: [pngquant()]
	}
	return gulp.src(paths.imgs)
		.pipe(cache(imagemin(options)))
		.pipe(gulp.dest(paths.build.imgs))
}

export function cssInline() {
	const options = {
		applyStyletags: false,
		removeStyleTags: false
	}
	return gulp.src('./build/html/index.html')
		.pipe(Inlinecss())
		.pipe(gulp.dest(paths.build.dist))
}

export function buildTemplates() {
	return gulp.src(paths.emails)
		.pipe(plumber({
			errorHandler: (error) => {
				console.log(error)
				this.emit('end')
			}
		}))
		.pipe(data(loadData))
		.pipe(nunjucksRender({
			path: [paths.templates],
			envOptions: {
				noCache: true,
				watch: false
			},
			inheritExtension: true
		}))
		.pipe(gulp.dest(paths.dev.temp))
}

export function buildMjml() {
	const options = {
		beautify: true,
		minify: false
	}
	const inline = {
		applyStyletags: false,
		removeStyleTags: false
	}
	return gulp.src(paths.dev.src)
		.pipe(gulpMjml(mjml, options))
		.pipe(gulp.dest(paths.build.dist))
		.pipe(Inlinecss(inline))
		.pipe(gulp.dest(paths.build.dist))
}
               
export function watch() {
	gulp.watch(paths.emails, gulp.series(buildTemplates, buildMjml, reload))
	gulp.watch(paths.templates, gulp.series(buildTemplates, buildMjml, reload))
	gulp.watch(paths.data, gulp.series(buildTemplates, buildMjml, reload))
	gulp.watch(paths.imgs, gulp.series(optimImg, reload))
}

//Optimize imgs, build template and output template as html
gulp.task('build', 
	gulp.series(optimImg, buildTemplates, buildMjml))

//Run build task and create server, reload on change
gulp.task('dev', 
	gulp.series('build', gulp.parallel(serve, watch)))