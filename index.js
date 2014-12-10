var through = require('through');
var path = require('path');
var gutil = require('gulp-util');
var File = gutil.File;
var PluginError = gutil.PluginError;


function bundleManifest(filename, opts) {
  'use strict';

  opts = opts || {base: "/", prefix: ""};

  if (!opts.base) {
    throw new PluginError('gulp-bundle-manifest', "please specify a base directory parameter");
  }
  if (!filename) {
    throw new PluginError('gulp-bundle-manifest', "please specify a filename parameter");
  }

  function removeBasePath(filepath) {
    return path.relative(opts.base || "", filepath);
  }

  function removeExtension(filepath) {
    var extension = path.extname(filepath);
    return filepath.replace(new RegExp(extension+"$"),"");
  }

  function convertPathToModuleName(filepath) {
    // splitting by file system seperator and
    // always using slashes makes it OS agnostic
    return filepath.split(path.sep).join("/");
  }

  function addPrefix(filepath) {
    return (opts.prefix || "") + filepath;
  }

  var list = [],
    firstfile;

  function bufferContents(file) {
    if (file.isNull()) {
      return;
    }

    if (file.isStream()) {
      var errorNoStream = new PluginError('gulp-bundle-manifest', "streaming is not supported");
      return this.emit('error', errorNoStream);
    }

    firstfile = firstfile || file;

    var result = file.path;

    result = removeBasePath(result);
    result = removeExtension(result);
    result = convertPathToModuleName(result);
    result = addPrefix(result);

    list.push(result);
  }

  function endStream() {
    if (list.length === 0) {
      return this.emit('end');
    }

    var outFileContents = new Buffer(JSON.stringify(list)),
      outFilePath = path.join(firstfile.base, filename);

    var outFile = new File({
      cwd: firstfile.cwd,
      base: firstfile.base,
      path: outFilePath,
      contents: outFileContents
    });

    this.emit('data', outFile);
    this.emit('end');
  }

  return through(bufferContents, endStream);
}

module.exports = bundleManifest;