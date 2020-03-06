module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(104);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 104:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

// const { Octokit } = require("@octokit/rest");
// const octokit = new Octokit({
//     auth: process.env.TOKEN
// });
// const fetch = require('node-fetch');

// octokit.pulls.get({
//     owner: "carlesnunez",
//     repo: "check-my-bundlephobia",
//     pull_number: 2,
//     mediaType: {
//         format: "diff"
//       }
//   }).then((response) => {
//     console.log(response.data.split(new RegExp("/\ndiff --git a/package.json b/package.json/")).length)
//     const [_, diff] = response.data.split('dependencies": ');
//     const packageList = diff.split("\n").filter(e => e.includes('+   '));

//     const changedPackages = packageList.map(name => {
//         const noSpaces = name.split(" ").join("").split("+").join();
//         const noBreaks = noSpaces.split("\n").join("")
//         const noQuotes = noBreaks.split("\"").join("").split("'").join("");
//         const noCommas = noQuotes.split(",").join("");
//         const noBrackets = noCommas.split("}").join("").split("{").join("");;
//         const versionSeparator = noBrackets.split(":");
//         const [pkname, version] = versionSeparator;
//         const versionParsed = isNaN(version[0]) ? version.substr(1) : version
//         return `${pkname}@${versionParsed}`
//     });

//     const sizes = []
//     const requests = changedPackages.map(
//         package => fetch(`https://bundlephobia.com/api/size?package=${package}`, {
//         headers: {'User-Agent': 'bundle-phobia-cli', 'X-Bundlephobia-User': 'bundle-phobia-cli'}
//       }).then(r => r.json().then(l => {
//           if(!l.error){
//               sizes.push({name: l.name, gzip: l.gzip, size: l.size})
//           }
//         })));

//         Promise.all(requests).then((r) => {
//             console.log(sizes)
//         })
//   })

console.log(process.env)

const { exec } = __webpack_require__(129);
exec(`git diff refs/remotes/origin/${process.env.GITHUB_HEAD_REF} refs/remotes/origin/${process.env.GITHUB_BASE_REF} package.json`, (err, out, e) => {
    console.log(err, out, e)
});

/***/ }),

/***/ 129:
/***/ (function(module) {

module.exports = require("child_process");

/***/ })

/******/ });