import * as fs from 'node:fs'
import * as path from 'node:path'

import type { Linter } from 'eslint'

import { devDependencies as allEslintDeps } from '../template/eslint/package.json'
import deepMerge from './deepMerge'
import sortDependencies from './sortDependencies'

const dependencies = {}
function addEslintDependency(name) {
  dependencies[name] = allEslintDeps[name]
}

addEslintDependency('eslint')
addEslintDependency('eslint-plugin-vue')

interface ESLintConfig extends Linter.Config {
  extends: string[]
}
const config: ESLintConfig = {
  root: true,
  extends: ['plugin:vue/essential']
}

function configureEslint({ language, styleGuide, needsPrettier }) {
  switch (`${styleGuide}-${language}`) {
    case 'default-javascript':
      config.extends.push('eslint:recommended')
      break
    case 'default-typescript':
      addEslintDependency('@vue/eslint-config-typescript')
      config.extends.push('eslint:recommended')
      config.extends.push('@vue/eslint-config-typescript/recommended')
      break
    // TODO: airbnb and standard
  }

  if (needsPrettier) {
    addEslintDependency('prettier')
    addEslintDependency('@vue/eslint-config-prettier')
    config.extends.push('@vue/eslint-config-prettier')
  }

  // generate the configuration file
  let configuration = '/* eslint-env node */\n'
  if (styleGuide !== 'default' || language !== 'javascript' || needsPrettier) {
    addEslintDependency('@rushstack/eslint-patch')
    configuration += `require("@rushstack/eslint-patch/modern-module-resolution");\n\n`
  }
  configuration += `module.exports = ${JSON.stringify(config, undefined, 2)}\n`

  return {
    dependencies,
    configuration
  }
}

export default function renderEslint(rootDir, { needsTypeScript, needsPrettier }) {
  const { dependencies, configuration } = configureEslint({
    language: needsTypeScript ? 'typescript' : 'javascript',
    // we currently don't support other style guides
    styleGuide: 'default',
    needsPrettier
  })

  // update package.json
  const packageJsonPath = path.resolve(rootDir, 'package.json')
  const existingPkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const pkg = sortDependencies(
    deepMerge(existingPkg, {
      scripts: {
        // Note that we reuse .gitignore here to avoid duplicating the configuration
        lint: needsTypeScript
          ? 'eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore'
          : 'eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix --ignore-path .gitignore'
      },
      devDependencies: dependencies
    })
  )
  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n')

  // write to .eslintrc.cjs
  const eslintrcPath = path.resolve(rootDir, '.eslintrc.cjs')
  fs.writeFileSync(eslintrcPath, configuration)
}