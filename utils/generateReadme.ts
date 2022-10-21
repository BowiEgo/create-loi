import getCommand from './getCommand'

export default function generateReadme({ projectName, packageManager, needsEslint }) {
  let readme = `# ${projectName}

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

`

  let npmScriptsDescriptions = `\`\`\`sh
${getCommand(packageManager, 'install')}
\`\`\`

### Compile and Hot-Reload for Development

\`\`\`sh
${getCommand(packageManager, 'dev')}
\`\`\`

### Compile and Minify for Production

\`\`\`sh
${getCommand(packageManager, 'build')}
\`\`\`
`

  if (needsEslint) {
    npmScriptsDescriptions += `
### Lint with [ESLint](https://eslint.org/)

\`\`\`sh
${getCommand(packageManager, 'lint')}
\`\`\`
`
  }

  readme += npmScriptsDescriptions

  return readme
}
