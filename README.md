# Check my bundlephobia

<p align="center">
<img width="400" src="https://carles-nunez.s3.eu-west-1.amazonaws.com/assets/cmb-logo.svg" />
</p>

Check my bundlephobia is a github action that will check for your code changes on a PR and will left a comment with the different sizes.


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
      - uses: carlesnunez/check-my-bundlephobia@v1.0.1
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

