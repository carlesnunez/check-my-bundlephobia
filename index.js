const fetch = require('node-fetch');
const { exec } = require('child_process');

exec(`git diff refs/remotes/origin/${process.env.GITHUB_BASE_REF} refs/remotes/origin/${process.env.GITHUB_HEAD_REF} package.json`, (err, out, e) => {
    const [_, diff] = out.split('dependencies": ');
    const packageList = diff.split("\n").filter(e => e.includes('+   '));
console.log(out)
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
console.log(changedPackages)
        Promise.all(requests).then((r) => {
            console.log(sizes)
        })
});