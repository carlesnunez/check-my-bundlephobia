const { Octokit } = require("@octokit/rest");
const octokit = new Octokit();

octokit.pullRequests.get({
    owner: "carlesnunez",
    repo: "check-my-bundlephobia",
    number: 1,
    headers: {accept: "application/vnd.github.v3.diff"}
  });