const fetch = require("node-fetch");
const { exec } = require("child_process");
const { Octokit } = require("@octokit/rest");
const core = require("@actions/core");
const utils = require("./utils");

const octokit = new Octokit({
  auth: process.env.TOKEN || core.getInput("repo-token")
});

exec(
  `git diff refs/remotes/origin/${process.env.GITHUB_BASE_REF} refs/remotes/origin/${process.env.GITHUB_HEAD_REF} package.json`,
  // (err, out, e) => {
  async (err, out, e) => {
    const {packagesAdded, packagesRemoved} = utils.getPackageListFromDiff(out);
    const devDependenciesList = await utils.getDevDependencies();
    const requestsAdded = packagesAdded.filter(p => {
      const packageName = p.split('@')[0];
      return !(core.getInput('ignore-dev-dependencies') === 'true' && devDependenciesList.includes(packageName));
    })
    .map(package => {
      const r = fetch(`https://bundlephobia.com/api/size?package=${package}`, {
        headers: {
          "User-Agent": "bundle-phobia-cli",
          "X-Bundlephobia-User": "bundle-phobia-cli"
        }
      })
      
      return r.then(r =>
        r.json().then(l => {
          if (!l.error) {
            return { name: l.name, gzip: l.gzip, size: l.size, package };
          } else {
            console.log('ERROR', l.error)
          }
        })
      )
      
      r.catch(e => console.log('->',e))
    });
    const requestsRemoved = packagesRemoved.filter(p => {
      const packageName = p.split('@')[0];
      return !(core.getInput('ignore-dev-dependencies') === 'true' && devDependenciesList.includes(packageName));
    }).filter(name => packagesAdded.find(n => n.includes(name.split("@")[0]))).map(package => {
      const r = fetch(`https://bundlephobia.com/api/size?package=${package}`, {
        headers: {
          "User-Agent": "bundle-phobia-cli",
          "X-Bundlephobia-User": "bundle-phobia-cli"
        }
      })
      
      return r.then(r =>
        r.json().then(l => {
          if (!l.error) {
            return { name: l.name, gzip: l.gzip, size: l.size, package };
          } else {
            console.log('ERROR', l.error)
          }
        })
      )
      
      r.catch(e => console.log('->',e))
    });
      Promise.all([Promise.all(requestsAdded), Promise.all(requestsRemoved)]).then(([sizesAdded, sizesRemoved]) => {
        if (
          process.env.GITHUB_REF.split("refs/pull/") &&
          process.env.GITHUB_REPOSITORY.split("/") && sizesAdded.length
        ) {
        const [owner, repositoryName] = process.env.GITHUB_REPOSITORY.split(
          "/"
        );

        octokit.pulls.createReview({
          owner,
          repo: repositoryName,
          pull_number: process.env.GITHUB_REF.split("refs/pull/")[1].split(
            "/"
          )[0],
          body: utils.getMarkDownTable(sizesAdded, sizesRemoved),
          event: sizesAdded.find(e => e.gzip > core.getInput('threshold')) && core.getInput('strict') ? 'REQUEST_CHANGES' : 'COMMENT'
        });
      }
      });
  }
);
