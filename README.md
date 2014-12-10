gulp-bundle-manifest
====================

Generates a manifest file from a list of input files. This may be usefull if you are using `gulp-concat`.

```
npm install gulp-bundle-manifest
```

```js
var bundleManifest = require("gulp-bundle-manifest");

gulp.task("script-manifest", function () {
  gulp.src("scripts/**/*.js")
    .pipe(bundleManifest("script-manifest.json", {base: "scripts", prefix: ""})
    .pipe(gulp.dest("."));
});
```

The contents of `script-manifest.json` will look like this:

```json
[
  "script1",
  "lib/script2"
]
```
