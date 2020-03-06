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

console.log(exec(`git diff ${process.env.GITHUB_HEAD_REF} ${GITHUB_BASE_REF} package.json`));