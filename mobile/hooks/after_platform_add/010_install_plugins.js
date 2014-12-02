#!/usr/bin/env node

//this hook installs all your plugins

// add your plugins to this list--either
// the identifier, the filesystem location
// or the URL
var pluginlist = [
  "com.ionic.keyboard",
  "org.apache.cordova.console",
  "org.apache.cordova.device",
  "org.apache.cordova.splashscreen",
  "org.apache.cordova.statusbar",
  "https://git-wip-us.apache.org/repos/asf/cordova-plugin-inappbrowser.git", //"org.apache.cordova.core.inappbrowser",
  "https://github.com/phonegap-build/GAPlugin.git", //"com.adobe.plugins.GAPlugin"
  "https://github.com/EddyVerbruggen/Insomnia-PhoneGap-Plugin.git" //"nl.x-services.plugins.insomnia"
];

// no need to configure below

var fs = require('fs');
var path = require('path');
var sys = require('sys')
var exec = require('child_process').exec;

function puts(error, stdout, stderr) {
    sys.puts(stdout)
}

pluginlist.forEach(function(plug) {
    exec("cordova plugin add " + plug, puts);
});
