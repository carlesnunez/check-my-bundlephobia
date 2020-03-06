const fetch = require('node-fetch');
const { exec } = require('child_process');
const { Octokit } = require("@octokit/rest");
const core = require('@actions/core');

const octokit = new Octokit({
    auth: process.env.TOKEN || core.getInput('repo-token')
});

function getMarkDownTable(report) {
    console.log(report)
    let table = `
## 😱 Check my bundlephobia - New/Modifies packages report:

| name | gzip | size |
| ----------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
`;
    report.forEach((packageInfo, index) => {
        console.log(packageInfo)
      if (index === 0) {
        table += `| ${packageInfo.name}  | ${packageInfo.gzip}         | ${packageInfo.size}         |
`;
      }
    });

    return table;
  }

exec(`git diff refs/remotes/origin/${process.env.GITHUB_BASE_REF} refs/remotes/origin/${process.env.GITHUB_HEAD_REF} package.json`, (err, out, e) => {
    const diff = out.split("\n");
    const stuffAdded = diff.filter(e => e.includes('+   ')).map(e => e.split(" ").join("").split("+").join("").split(",").join(""));
    const packageList = stuffAdded.filter(name => {
        const initIsQuote = name[0] === "\"" || name[0] === "'"
        const endIsQuote = name[name.length - 1] === "\"" || name[name.length - 1] === "'"
        const colonIndex = name.indexOf(":")
        const quoteBeforeColon = name[colonIndex-1] === "\"" || name[colonIndex] === "'"
        const quoteAfterColon = name[colonIndex+1] === "\"" || name[colonIndex] === "'"

        return initIsQuote && endIsQuote && colonIndex && quoteAfterColon && quoteBeforeColon
    })
    const changedPackages = packageList.map(name => {
        const noSpaces = name.split(" ").join("").split("+").join();
        const noBreaks = noSpaces.split("\n").join("")
        const noQuotes = noBreaks.split("\"").join("").split("'").join("");
        const noCommas = noQuotes.split(",").join("");
        const noBrackets = noCommas.split("}").join("").split("{").join("");;
        const versionSeparator = noBrackets.split(":");
        const [pkname, version] = versionSeparator;
        const versionParsed = isNaN(version[0]) ? version.substr(1) : version
        return `${pkname}@${versionParsed}`
    });

    const sizes = []
    const requests = changedPackages.map(
        package => fetch(`https://bundlephobia.com/api/size?package=${package}`, {
        headers: {'User-Agent': 'bundle-phobia-cli', 'X-Bundlephobia-User': 'bundle-phobia-cli'}
      }).then(r => r.json().then(l => {
          if(!l.error){
              sizes.push({name: l.name, gzip: l.gzip, size: l.size})
          }
        })));

        Promise.all(requests).then(() => {
            const [owner, repositoryName] = process.env.GITHUB_REPOSITORY.split("/")
            octokit.issues.createComment(
                {
                  owner,
                  repo: repositoryName,
                  issue_number: process.env.GITHUB_REF.split("refs/pull/")[1].split("/")[0],
                  body: getMarkDownTable(sizes)
                })

        })
});