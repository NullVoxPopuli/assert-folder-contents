#!/usr/bin/env node
'use strict';

import path from 'path';
import fse from 'fs-extra';
import { execaCommand } from 'execa';
import { parse } from 'yaml';
import { assert } from 'chai';

const CWD = process.cwd();

let config;

async function main() {
  config = await readConfig();

  await build();
  await test();
}

/********************************************
 *
 * ***********************************/

async function build() {
  if (!config?.setup?.run) return;

  let { run, cwd = CWD } = config?.setup ?? {};

  if (!process.env.CI) {
    await execaCommand(run, { cwd, preferLocal: true });

    return;
  }

  await execaCommand(run, {
    cwd,
    preferLocal: true,
    stdio: 'inherit',
  });
}

const CONFIG_NAME = 'assert-contents.config.yml';

async function readConfig() {
  let configPath = path.join(CWD, CONFIG_NAME);
  let buffer = await fse.readFile(configPath);
  let str = buffer.toString();

  let config = parse(str);

  return config;
}

async function test() {
  let expected = await getExpected();
  let results = await assertExists(expected);

  expected.sort();

  console.debug({ results });

  assert.strictEqual(
    results.every((entry) => entry.exists),
    true
  );
}

async function getExpected() {
  let expected = config.expect.split('\n');

  return expected.filter(Boolean);
}

async function assertExists(fileList) {
  return await Promise.all(
    fileList.map(async (filePath) => {
      let targetPath = path.join(CWD, config.target, filePath);

      return {
        filePath,
        exists: await fse.pathExists(targetPath),
      };
    })
  );
}

main();
