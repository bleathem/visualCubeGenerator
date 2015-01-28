#!/usr/bin/env node

//
// This hook copies various resource files
// from our version control system directories
// into the appropriate platform specific location
//

// [{source: target}]
var filestocopy = [{
    "config/scramble_icon_48.png":
    "platforms/android/res/drawable-mdpi/icon.png"
  }, {
    "config/scramble_icon_72.png":
    "platforms/android/res/drawable-hdpi/icon.png"
  }, {
    "config/scramble_icon_96.png":
    "platforms/android/res/drawable-xhdpi/icon.png"
  },{
    "config/scramble_icon_96.png":
    "platforms/android/res/drawable/icon.png"
  }, {
    "config/android/res/screens/splash.9.png":
    "platforms/android/res/drawable/splash.9.png"
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
