# bundlephobia-pr-review

Bundlephobia PR review is a github action that will check for your code changes on a PR and will left a comment with the different sizes.

## How to use it

```yml
name: "check my bundlephobia"
on:
  push:
    branches:
      - master
  pull_request:
    branches:
      - master
jobs:
  bundlecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: carlesnunez/check-my-bundlephobia@v1.2.0
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          strict: true
          threshold: 500
```

## Options

| name       | description                                        | required | type    | default |
| ---------- | -------------------------------------------------- | -------- | ------- | ------- |
| repo-token | used by the action in order to perform PR reviews  | true     |         |         |
| strict     | If true will reject the PR if threshold is exceded | false    | Boolean | false   |
| threshold  | Max package size in bytes                          | false    | String  | 500     |


## Credits

This is a fork of https://github.com/carlesnunez/check-my-bundlephobia, with fixes for disabling strict mode.
