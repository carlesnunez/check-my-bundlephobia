const { Octokit } = require("@octokit/rest");
const octokit = new Octokit();

octokit.pulls.get({
    owner: "carlesnunez",
    repo: "check-my-bundlephobia",
    pull_number: 2
  }).then(e => console.log(e)).catch(console.log);