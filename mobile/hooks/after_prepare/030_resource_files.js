#!/usr/bin/env node

//
// This hook copies various resource files
// from our version control system directories
// into the appropriate platform specific location
//

// [{source, target}]
var filestocopy = [{
    "config/android/res/screens/splash-hdpi-landscape.9.png":
    "platforms/android/res/drawable-land-hdpi/splash.png"
  }, {
    "config/android/res/screens/splash-hdpi-portrait.9.png":
    "platforms/android/res/drawable-port-hdpi/splash.png"
  }
];


var fs = require('fs');
var path = require('path');

// no need to configure below
var rootdir = process.argv[2];

filestocopy.forEach(function(obj) {
    Object.keys(obj).forEach(function(key) {
        var val = obj[key];
        var srcfile = path.join(rootdir, key);
        var destfile = path.join(rootdir, val);
        console.log("copying "+srcfile+" to "+destfile);
        var destdir = path.dirname(destfile);
        if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
            fs.createReadStream(srcfile).pipe(
               fs.createWriteStream(destfile));
        }
    });
});
