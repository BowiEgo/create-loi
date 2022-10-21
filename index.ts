#!/usr/bin/env node

import * as fs from 'node:fs'
import * as path from 'node:path'

import minimist from 'minimist'
import prompts, { prompt } from 'prompts'
import { red, blue, magenta, bold } from 'kolorist'

import renderTemplate from './utils/renderTemplate'
import { postOrderDirectoryTraverse, preOrderDirectoryTraverse } from './utils/directoryTraverse'
import generateAppVue from './utils/generateAppVue'
import generateViteConfig from './utils/generateViteConfig'
import generateEntry from './utils/generateEntry'
import generateReadme from './utils/generateReadme'
import getCommand from './utils/getCommand'
import renderEslint from './utils/renderEslint'
import banner from './utils/banner'

function isValidPackageName(projectName) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(projectName)
}

function toValidPackageName(projectName) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')
}

function canSkipEmptying(dir: string) {
  if (!fs.existsSync(dir)) {
    return true
  }

  const files = fs.readdirSync(dir)
  if (files.length === 0) {
    return true
  }
  if (files.length === 1 && files[0] === '.git') {
    return true
  }

  return false
}

function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return
  }

  postOrderDirectoryTraverse(
    dir,
    (dir) => fs.rmdirSync(dir),
    (file) => fs.unlinkSync(file)
  )
}

async function init() {
  console.log(`\n${banner}\n`)

  const cwd = process.cwd()
  // possible options:
  // --default
  // --multi-page / --pages
  // --px-to-viewport / --px
  // --router / --vue-router
  // --eslint
  // --eslint-with-prettier (only support prettier through eslint for simplicity)
  // --force (for force overwriting)
  const argv = minimist(process.argv.slice(2), {
    alias: {
      'multi-page': ['pages'],
      'px-to-viewport': ['px'],
      'with-tests': ['tests'],
      router: ['vue-router']
    },
    // all arguments are treated as booleans
    boolean: true
  })

  // if any of the feature flags is set, we would skip the feature prompts
  const isFeatureFlagsUsed =
    typeof (argv.default ?? argv.page ?? argv.px ?? argv.router ?? argv.eslint) === 'boolean'

  let targetDir = argv._[0]
  const defaultProjectName = !targetDir ? 'vue-project' : targetDir

  const forceOverwrite = argv.force

  let result: {
    projectName?: string
    shouldOverwrite?: boolean
    packageName?: string
    needsPrettier?: boolean
    isMultiPage?: boolean
    needsPxToViewport?: boolean
    needsRouter?: boolean
    needsPinia?: boolean
    needsEslint?: boolean
  } = {}

  let isFirstPrompt = true

  async function promptQuestions() {
    let promptsResult,
      // Prompts:
      // - Project name:
      //   - whether to overwrite the existing directory or not?
      //   - enter a valid package name for package.json
      // - A Multi Page Project?
      // - Install Plugin PxToViewport for Postcss?
      // - Install Vue Router for SPA development?
      // - Install Pinia for state management?
      // - Add ESLint for code quality?
      // - Add Prettier for code formatting?
      questions: any[] = [
        {
          name: 'projectName',
          type: targetDir ? null : 'text',
          message: 'Project name:',
          initial: defaultProjectName,
          onState: (state) => (targetDir = String(state.value).trim() || defaultProjectName)
        },
        {
          name: 'shouldOverwrite',
          type: () => (canSkipEmptying(targetDir) || forceOverwrite ? null : 'confirm'),
          message: () => {
            const dirForPrompt =
              targetDir === '.' ? 'Current directory' : `Target directory "${targetDir}"`

            return `${dirForPrompt} is not empty. Remove existing files and continue?`
          }
        },
        {
          name: 'overwriteChecker',
          type: (prev, values) => {
            if (values.shouldOverwrite === false) {
              throw new Error(red('✖') + ' Operation cancelled')
            }
            return null
          }
        },
        {
          name: 'packageName',
          type: () => (isValidPackageName(targetDir) ? null : 'text'),
          message: 'Package name:',
          initial: () => toValidPackageName(targetDir),
          validate: (dir) => isValidPackageName(dir) || 'Invalid package.json name'
        },
        {
          name: 'optionalConfiguration',
          type: () => {
            if (isFeatureFlagsUsed) {
              return null
            }
            return 'multiselect'
          },
          message: 'Select multi options for your project:',
          choices: [
            { title: `A ${magenta('Multi Page')} Project?`, value: 'isMultiPage' },
            {
              title: `Install Plugin ${magenta('PxToViewport')} for Postcss?`,
              value: 'needsPxToViewport'
            },
            {
              title: `Install Vue ${magenta('Router')} for SPA development?`,
              value: 'needsRouter'
            },
            { title: `Install ${magenta('Pinia')} for state management?`, value: 'needsPinia' },
            {
              title: `Add ${magenta('ESLint')} for code quality?`,
              value: 'needsEslint'
            }
          ],

          format: (val) => {
            return {
              isMultiPage: val.includes('isMultiPage'),
              needsPxToViewport: val.includes('needsPxToViewport'),
              needsRouter: val.includes('needsRouter'),
              needsPinia: val.includes('needsPinia'),
              needsEslint: val.includes('needsEslint')
            }
          }
        },
        {
          name: 'needsPrettier',
          type: (prev, values) => {
            if (isFeatureFlagsUsed || !values.optionalConfiguration.needsEslint) {
              return null
            }
            return 'toggle'
          },
          message: `Add ${magenta('Prettier')} for code formatting?`,
          initial: false,
          active: 'Yes',
          inactive: 'No'
        }
      ]

    try {
      promptsResult = await prompts(isFirstPrompt ? questions : questions.slice(3), {
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled')
        }
      })
    } catch (cancelled) {
      console.log(cancelled.message)
      process.exit(1)
    }

    if (isFirstPrompt) {
      result.projectName = promptsResult.projectName
      result.packageName = promptsResult.projectName ?? defaultProjectName
      result.shouldOverwrite = argv.force || promptsResult.shouldOverwrite
    }

    const { optionalConfiguration } = promptsResult

    const {
      isMultiPage = argv.pages,
      needsPxToViewport = argv.px,
      needsRouter = argv.router,
      needsPinia = argv.pinia,
      needsEslint = argv.eslint
    } = optionalConfiguration
    const needsPrettier = !!promptsResult.needsPrettier

    let answerHints = []
    Object.keys(optionalConfiguration).forEach((key) => {
      answerHints.push(
        `${
          questions
            .find((item) => item.name === 'optionalConfiguration')
            .choices.find((item) => item.value === key).title
        }  ${optionalConfiguration[key] ? bold(blue('✓')) : bold(red('✗'))}`
      )
    })
    answerHints.push(
      `${questions.find((item) => item.name === 'needsPrettier').message}  ${
        needsPrettier ? bold(blue('✓')) : bold(red('✗'))
      }`
    )

    console.log(bold('\nThis is your configuration:\n'))
    console.log('  Project name:', bold(blue(result.projectName)))
    console.log('  Package name:', bold(blue(result.packageName)))
    answerHints.forEach((hint) => console.log(`  ${hint}`))
    console.log('\n')

    isFirstPrompt = false

    let isConfirm

    try {
      isConfirm = await prompts(
        {
          type: 'confirm',
          name: 'value',
          message: 'Is This OK?',
          initial: true
        },
        {
          onCancel: () => {
            throw new Error(red('✖') + ' Operation cancelled')
          }
        }
      )
    } catch (cancelled) {
      console.log(cancelled.message)
      process.exit(1)
    }

    if (isConfirm.value) {
      return {
        isMultiPage,
        needsPxToViewport,
        needsRouter,
        needsPinia,
        needsEslint,
        needsPrettier
      }
    } else {
      return await promptQuestions()
    }
  }

  try {
    let promptResult = await promptQuestions()
    result = { ...result, ...promptResult }
  } catch (cancelled) {
    console.log(cancelled.message)
    process.exit(1)
  }

  // console.log('result', result)
  const {
    packageName,
    shouldOverwrite,
    isMultiPage,
    needsPxToViewport,
    needsRouter,
    needsPinia,
    needsEslint,
    needsPrettier
  } = result

  const root = path.join(cwd, targetDir)

  if (fs.existsSync(root) && shouldOverwrite) {
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }

  console.log(`\nScaffolding project in ${root}...`)

  const pkg = { name: packageName, version: '0.0.0' }
  fs.writeFileSync(path.resolve(root, 'package.json'), JSON.stringify(pkg, null, 2))

  // todo:
  // work around the esbuild issue that `import.meta.url` cannot be correctly transpiled
  // when bundling for node and the format is cjs
  // const templateRoot = new URL('./template', import.meta.url).pathname
  const templateRoot = path.resolve(__dirname, 'template')
  const render = function render(templateName, dest = '') {
    const templateDir = path.resolve(templateRoot, templateName)
    dest = path.resolve(root, dest)
    renderTemplate(templateDir, dest)
  }

  // Render base template
  render('base')

  // Add configs.
  fs.writeFileSync(
    path.resolve(root, 'vite.config.js'),
    generateViteConfig({ isMultiPage, needsPxToViewport })
  )
  if (needsPxToViewport) {
    render('config/px-to-viewport')
  }
  if (needsRouter) {
    render('config/router')
  }
  if (needsPinia) {
    render('config/pinia')
  }
  if (needsEslint) {
    renderEslint(root, { needsPrettier })
  }

  // Render code template.
  if (isMultiPage) {
    render('code/multi-page')
    render('code/views/src/views', 'src/pages/index/views')

    fs.writeFileSync(path.resolve(root, 'src/pages/index/App.vue'), generateAppVue({ needsRouter }))

    needsRouter && render('code/router/src', 'src/pages/index')
  } else {
    render('code/default')
    render('code/views')

    fs.writeFileSync(path.resolve(root, 'src/App.vue'), generateAppVue({ needsRouter }))

    needsRouter && render('code/router')
  }

  // Render entry file
  if (isMultiPage) {
    fs.writeFileSync(
      path.resolve(root, 'src/pages/index/main.js'),
      generateEntry({ needsPinia, needsRouter })
    )
  } else {
    fs.writeFileSync(path.resolve(root, 'src/main.js'), generateEntry({ needsPinia, needsRouter }))
  }

  // prettier-ignore
  // Instructions:
  // Supported package managers: pnpm > yarn > npm
  // Note: until <https://github.com/pnpm/pnpm/issues/3505> is resolved,
  // it is not possible to tell if the command is called by `pnpm init`.
  const userAgent = process.env.npm_config_user_agent ?? ''
  const packageManager = /pnpm/.test(userAgent) ? 'pnpm' : /yarn/.test(userAgent) ? 'yarn' : 'npm'

  // README generation
  fs.writeFileSync(
    path.resolve(root, 'README.md'),
    generateReadme({
      projectName: result.projectName ?? defaultProjectName,
      packageManager,
      needsEslint
    })
  )

  console.log(`\nDone. Now run:\n`)
  if (root !== cwd) {
    console.log(`  ${bold(blue(`cd ${path.relative(cwd, root)}`))}`)
  }
  console.log(`  ${bold(blue(getCommand(packageManager, 'install')))}`)
  if (needsPrettier) {
    console.log(`  ${bold(blue(getCommand(packageManager, 'lint')))}`)
  }
  console.log(`  ${bold(blue(getCommand(packageManager, 'dev')))}`)
  console.log()
}

init().catch((e) => {
  console.error(e)
})
