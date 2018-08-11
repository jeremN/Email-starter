# Email-starter

## Intro

Starter base for Email templating with Gulp, MJML and Nunjucks. 
Powered by Gulp with this features:

- [MJML](https://mjml.io/) engine
- Partials and templates with [Nunjucks](https://mozilla.github.io/nunjucks/)
- Insert data with [Gulp-data](https://github.com/colynb/gulp-data)
- Image optimization with [Gulp-imagemin](https://github.com/sindresorhus/gulp-imagemin)
- Built-in [BrowserSync](https://browsersync.io/) server

## Installation

### Requirements
- [NodeJS](https://nodejs.org/en/) (6 or greater)
- [Git](https://git-scm.com/)

Now clone this repository

```bash
git clone https://github.com/jeremN/Email-starter.git
```

Open the folder in your command line, and install the needed dependencies:

```bash
cd Email-starter
npm install
```

## Usage

Finally, run gulp dev. Your finished templates will be created in a folder called build, viewables at this URL:

```bash
gulp dev
```

## TODO
- HTML minifier and/or beautifier
