const core = require("@actions/core");
const fetch = require("node-fetch");

exports.getMarkDownTable = (sizesAdded, sizesRemoved) => {
  let table = `
## 😱 Check my bundlephobia - New/Modified package report:

<details opened=false>
<summary>Action settings</summary>

**Treshold**: < ${core.getInput("threshold")} bytes
**Strict mode**: ${core.getInput("strict") ? "✅ enabled" : "❌ disabled"}

</details>

|  | name | gzip | size | pass
| -- | ----------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----- |
`;
console.log('borradas', sizesRemoved)
  sizesAdded.forEach((packageInfo, index) => {
    const sizeRemoved = sizesRemoved.find(({name, package}) => name === packageInfo.name);
    console.log(packageInfo.name)
    sizeRemoved && console.log(sizeRemoved.package, packageInfo.package)
    if(!sizeRemoved || (sizeRemoved.package !== packageInfo.package)) {
      const gzipSize = (parseInt(packageInfo.gzip) / 1024).toFixed(1);
      const rawSize = (packageInfo.size / 1024).toFixed(1);
      const isBlockedMessage = packageInfo.gzip > core.getInput("threshold") ? "❌" : "✅";
      const isNew = sizeRemoved ? 'New' : '';
      table += `| ${isNew} | [${packageInfo.package}](https://bundlephobia.com/result?p=${packageInfo.package})  | ${gzipSize}kB         | ${rawSize}kB         | ${isBlockedMessage}
`;

    if(sizeRemoved) {
      const removedGzipSize = (parseInt(sizeRemoved.gzip) / 1024).toFixed(1);
      const removedRawSize = (sizeRemoved.size / 1024).toFixed(1)
      const removedIsBlockedMessage = packageInfo.gzip > core.getInput("threshold") ? "❌" : "✅"
      table += `| Old | [${sizeRemoved.package}](https://bundlephobia.com/result?p=${sizeRemoved.package})  | ${removedGzipSize}kB         | ${removedRawSize}kB         | ${removedIsBlockedMessage}
`;
      
      const gzipedDiff = (((parseInt(packageInfo.gzip) / 1024).toFixed(1)) - ((parseInt(sizeRemoved.gzip) / 1024).toFixed(1))).toFixed(1);
      const sizeDiff = (((parseInt(packageInfo.size) / 1024).toFixed(1)) - ((parseInt(sizeRemoved.size) / 1024).toFixed(1))).toFixed(1);
    
      table += `| | | ${Math.sign(gzipedDiff) &&  gzipedDiff !== '0.0' ? '+' : ''}${gzipedDiff !== '0.0' ? gzipedDiff + 'kB' : ''}         | ${Math.sign(sizeDiff) && sizeDiff !== '0.0' ? '+' : ''}${sizeDiff !== '0.0' ? sizeDiff + 'kB' : ''}        | `;
    
    }
  }
  });


  return table;
};

exports.getPackageListFromDiff = (diff) => {
  const stuffAdded = diff
    .split("\n")
    .filter((e) => e.includes("+   "))
    .map((e) => e.split(" ").join("").split("+").join("").split(",").join(""));
  const stuffRemoved = diff
    .split("\n")
    .filter((e) => e.includes("-   "))
    .map((e) => e.split(" ").join("").split("+").join("").split(",").join(""));
  const packagesAdded = stuffAdded.filter((name) => {
    const initIsQuote = name[0] === '"' || name[0] === "'";
    const endIsQuote =
      name[name.length - 1] === '"' || name[name.length - 1] === "'";
    const colonIndex = name.indexOf(":");
    const quoteBeforeColon =
      name[colonIndex - 1] === '"' || name[colonIndex] === "'";
    const quoteAfterColon =
      name[colonIndex + 1] === '"' || name[colonIndex] === "'";

    return (
      initIsQuote &&
      endIsQuote &&
      colonIndex &&
      quoteAfterColon &&
      quoteBeforeColon
    );
  });

  const packagesRemoved = stuffRemoved.filter((name) => {
    name = name.replace(",", "");
    const initIsQuote = name[0] === "-";
    const endIsQuote =
      name[name.length - 1] === '"' || name[name.length - 1] === "'";
    const colonIndex = name.indexOf(":");
    const quoteBeforeColon =
      name[colonIndex - 1] === '"' || name[colonIndex] === "'";
    const quoteAfterColon =
      name[colonIndex + 1] === '"' || name[colonIndex] === "'";
    return (
      initIsQuote &&
      endIsQuote &&
      colonIndex &&
      quoteAfterColon &&
      quoteBeforeColon
    );
  });

  return {
    packagesAdded: packagesAdded.map((name) => {
      const noSpaces = name.split(" ").join("").split("+").join();
      const noBreaks = noSpaces.split("\n").join("");
      const noQuotes = noBreaks.split('"').join("").split("'").join("");
      const noCommas = noQuotes.split(",").join("");
      const noBrackets = noCommas.split("}").join("").split("{").join("");
      const versionSeparator = noBrackets.split(":");
      const [pkname, version] = versionSeparator;
      const versionParsed = isNaN(version[0]) ? version.substr(1) : version;
      return `${pkname}@${versionParsed}`;
    }),
    packagesRemoved: packagesRemoved.map((name) => {
      const noSpaces = name.split(" ").join("").split("-").join();
      const noBreaks = noSpaces.split("\n").join("");
      const noQuotes = noBreaks.split('"').join("").split("'").join("");
      const noCommas = noQuotes.split(",").join("");
      const noBrackets = noCommas.split("}").join("").split("{").join("");
      const versionSeparator = noBrackets.split(":");
      const [pkname, version] = versionSeparator;
      const versionParsed = isNaN(version[0]) ? version.substr(1) : version;
      return `${pkname}@${versionParsed}`;
    }),
  };
};


exports.getDevDependencies = async () => {
  const result = await fetch(`https://raw.githubusercontent.com/${process.env.GITHUB_REPOSITORY}/${process.env.GITHUB_HEAD_REF}/package.json`);
  const data = await result.json();
  return data.devDependencies ? Object.keys(data.devDependencies) : [];
}
