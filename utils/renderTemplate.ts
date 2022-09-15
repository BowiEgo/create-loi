import * as fs from 'node:fs'
import * as path from 'node:path'

import deepMerge from './deepMerge'
import sortDependencies from './sortDependencies'

const DiffLines = require('diff').diffLines

/**
 * Renders a template folder/file to the file system,
 * by recursively copying all files under the `src` directory,
 * with the following exception:
 *   - `_filename` should be renamed to `.filename`
 *   - Fields in `package.json` should be recursively merged
 * @param {string} src source filename to copy
 * @param {string} dest destination filename of the copy operation
 */
function renderTemplate(src, dest) {
  const stats = fs.statSync(src)

  if (stats.isDirectory()) {
    // skip node_module
    if (path.basename(src) === 'node_modules') {
      return
    }

    // if it's a directory, render its subdirectories and files recursively
    fs.mkdirSync(dest, { recursive: true })
    for (const file of fs.readdirSync(src)) {
      renderTemplate(path.resolve(src, file), path.resolve(dest, file))
    }
    return
  }

  const filename = path.basename(src)

  if (filename === 'package.json' && fs.existsSync(dest)) {
    // merge instead of overwriting
    const existing = JSON.parse(fs.readFileSync(dest, 'utf8'))
    const newPackage = JSON.parse(fs.readFileSync(src, 'utf8'))
    const pkg = sortDependencies(deepMerge(existing, newPackage))
    fs.writeFileSync(dest, JSON.stringify(pkg, null, 2) + '\n')
    return
  }

  if (filename === 'vite.config.js' && fs.existsSync(dest)) {
    let cfg = ''
    // merge instead of overwriting
    const existing = fs.readFileSync(dest, 'utf8')
    const newCfg = fs.readFileSync(src, 'utf8')

    DiffLines(existing, newCfg).forEach((part) => {
      console.log(part)
      cfg += part.value
    })

    fs.writeFileSync(dest, cfg)

    // const importReg = /import\s+\{?(.|\r\n)+}?\s+from\s+'(\S*)'/g
    // const configReg = /defineConfig\(\{(\s*\S*){10,}/g

    // let existingImport = existing.match(importReg),
    //   newImport = newCfg.match(importReg),
    //   existingConfig = existing
    //     .match(configReg)
    //     .map((str) => str.replace('defineConfig', ''))[0]
    //     .trim()
    //     .replace(/^(\s|\()+|(\s|\))+$/g, ''),
    //   newConfig = newCfg
    //     .match(configReg)
    //     .map((str) => str.replace('defineConfig', ''))[0]
    //     .trim()
    //     .replace(/^(\s|\()+|(\s|\))+$/g, '')

    // console.log(existingImport, '\n', newImport)
    // console.log(existingConfig, '\n', newConfig)
    // console.log('import:', deepMerge(existingImport, newImport))
    // console.log('config:', deepMerge(existingConfig, newConfig))
    // const cfg = sortDependencies(deepMerge(existing, newConfig))
    // fs.writeFileSync(dest, JSON.stringify(cfg, null, 2) + '\n')
    return
  }

  if (filename.startsWith('_')) {
    // rename `_file` to `.file`
    dest = path.resolve(path.dirname(dest), filename.replace(/^_/, '.'))
  }

  fs.copyFileSync(src, dest)
}

export default renderTemplate
