// Set environment variable for production
"use strict";
process.env.PRODUCTION = false;
var webpack = require("webpack"),
    webpackConfig = require('../webpack.config'),
    fs = require("fs");

function CompleteBuild() {
    var newFile = fs.createWriteStream('dist/index.html'),
        oldFile = fs.createReadStream('app/index.html');

    //fs.createReadStream().pipe(fs.createWriteStream('newLog.log'));

    oldFile.pipe(newFile);

}

// returns a Compiler instance
webpack(webpackConfig, function(err, stats) {
    if (err) {
        console.error(err);
    }
    var jsonStats = stats.toJson();
    if (jsonStats.errors.length > 0) {
        console.info(jsonStats.errors);
    }
    if (jsonStats.warnings.length > 0) {
        console.warn(jsonStats.warnings);
    }
    CompleteBuild();
});
