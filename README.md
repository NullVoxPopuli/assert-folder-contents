# assert-folder-contents

CLI to assert that a folder has files (at any depth)

## Setup

- Must have Node 16+

## Usage

Create an `assert-contents.config.yml` in the directory that the CLI will be invoked from.

The only required config is an `expect` string,

```yml
expect: |
  index.js
  index.js.map
  index.d.ts
  index.d.ts.map
  some-folder/inedx.js
  some-folder/inedx.js.map
  some-folder/inedx.d.ts
  some-folder/inedx.d.ts.map
```

Optionally, a `target` may be specified if the expected files are not within the current directory.

```yml
target: '../my-library/dist'
```

Optionally, a `setup` config may be provided - potentially to generate the files to assert existance for.
```yml
setup:
  run: "pnpm build:js"
  cwd: "../my-library"
```

Altogether, a config using all fetaures might look something like this:
```yml
target: '../my-library/dist'

setup:
  run: "pnpm build:js"
  cwd: "../my-library"

expect: |
  index.js
  index.js.map
  index.d.ts
  index.d.ts.map
  some-folder/inedx.js
  some-folder/inedx.js.map
  some-folder/inedx.d.ts
  some-folder/inedx.d.ts.map
```
