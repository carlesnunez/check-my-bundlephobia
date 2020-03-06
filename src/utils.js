const core = require("@actions/core");

exports.getMarkDownTable = (report) => {
    let table = `
## 😱 Check my bundlephobia - New/Modified package report:

| name | gzip | size | pass
| ----------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----- |
`;
    report.forEach((packageInfo, index) => {
      if (index === 0) {
        table += `| [${packageInfo.name}](https://bundlephobia.com/result?p=${packageInfo.package})  | ${packageInfo.gzip} bytes         | ${packageInfo.size} bytes         | ${packageInfo.gzip > core.getInput('threshold') ? `❌ over threshold (${core.getInput('threshold')}) reduce ${Number(packageInfo.gzip) - Number(core.getInput('threshold'))}` : '✅'}
`;
      }
    });

    return table;
  }

  exports.getPackageListFromDiff = (diff) => {
    const stuffAdded = diff.split("\n").filter(e => e.includes('+   ')).map(e => e.split(" ").join("").split("+").join("").split(",").join(""));
    const packages = stuffAdded.filter(name => {
        const initIsQuote = name[0] === "\"" || name[0] === "'"
        const endIsQuote = name[name.length - 1] === "\"" || name[name.length - 1] === "'"
        const colonIndex = name.indexOf(":")
        const quoteBeforeColon = name[colonIndex-1] === "\"" || name[colonIndex] === "'"
        const quoteAfterColon = name[colonIndex+1] === "\"" || name[colonIndex] === "'"

        return initIsQuote && endIsQuote && colonIndex && quoteAfterColon && quoteBeforeColon
    });

    return packages.map(name => {
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
  }