# loi

一个轻松搭建 Vue 项目的脚手架

## 使用方法

```sh
npm init loi
npm init loi@alpha
```

## 模板功能

### 主题

> 本模板支持主题的完全自定义以及切换，以满足业务上多样化的视觉需求，按照以下说明即可在主色、阴影、边框、圆角等等各种属性上为你的组件进行主题定制。

1. 样式变量

   本模板的样式使用了原生 CSS 作为开发语言，以 CSS Variables 为原理，在根伪类:root 下定义了一系列全局/组件的样式变量，你可以根据需求进行相应调整。

   以下是一些最常用的通用变量，所有样式变量可以在[这里](https://github.com/BowiEgo/create-loi/blob/alpha/template/base/src/assets/styles/variables.css)找到。

   ```
   // src/assets/styles/variables.css
   :root {
      --my-c-white: #ffffff;
      --my-c-white-soft: #f9f9f9;
      --my-c-white-mute: #f1f1f1;

      --my-c-black: #1a1a1a;
      --my-c-black-pure: #000000;
      --my-c-black-soft: #242424;
      --my-c-black-mute: #2f2f2f;
      ...
    }

    :root {
      /**
      * Padding
      * --------------------------------------*/
      --my-padding-base: 4px;
      --my-padding-xs: calc(var(--my-padding-base) * 2);
      --my-padding-sm: calc(var(--my-padding-base) * 3);
      --my-padding-md: calc(var(--my-padding-base) * 4);
      --my-padding-lg: calc(var(--my-padding-base) * 6);
      --my-padding-xl: calc(var(--my-padding-base) * 8);
      ...
    }
   ```

2. 主题文件

   主题的设定以通过给 html 根标签设置一个 data-theme 属性，并声明不同 data-theme 下相关主题的 CSS 变量，然后通过 js 切换 data-theme 的属性值来达到切换主题的效果。主题文件可以在[这里](https://github.com/BowiEgo/create-loi/blob/alpha/template/base/src/assets/styles/theme.css)找到。

   ```
    // src/assets/styles/theme.css
    html,
    html[data-theme='light'] {
      --app-background: var(--my-c-white-soft);
      --app-background-soft: var(--my-c-white-soft);
      --app-background-mute: var(--my-c-white-mute);

      --color-border: var(--my-c-divider-light-2);
      --color-border-hover: var(--my-c-divider-light-1);

      --color-heading: var(--my-c-text-light-1);
      --color-text: var(--my-c-text-light-1);

      --section-gap: 160px;
    }

    html[data-theme='dark'] {
      --app-background: var(--my-c-black-soft);
      --app-background-soft: var(--my-c-black-soft);
      --app-background-mute: var(--my-c-black-mute);

      --color-border: var(--my-c-divider-dark-2);
      --color-border-hover: var(--my-c-divider-dark-1);

      --color-heading: var(--my-c-text-dark-1);
      --color-text: var(--my-c-text-dark-2);
    }
   ```

3. 主题之 CSS 变量的使用

   在之前跳到的 theme.css 中添加和修改相关 CSS 变量（比如--app-background: var(--my-c-white-soft);）之后，直接在样式中使用该变量，例如下：

   ```
     body {
      min-height: 100vh;
      color: var(--color-text);
      background: var(--app-background);
      line-height: 1.6;
      ...
     }
   ```

4. 主题切换

   通过[useTheme.js](https://github.com/BowiEgo/create-loi/blob/alpha/template/base/src/hooks/useTheme.js) (**/src/assets/hooks/useTheme.js**)实现主题切换，使用方法如下：

   ```
    import { useTheme } from '@/hooks'

    const { theme, setLightTheme, setDarkTheme } = useTheme()
    const isDarkTheme = ref(theme.value === 'dark')

    watch(isDarkTheme, () => {
      isDarkTheme.value ? setDarkTheme() : setLightTheme()
    })

    isDarkTheme.value = 'light'
   ```

### 字号缩放

> 本模板支持为你的组件添加随 App 整体字号倍数的缩放，以满足业务上例如适老化的需求。

### 骨架屏

> 本模板已默认添加骨架屏组件，按照以下说明可以为你的数据页面添加骨架屏。

### Mock

> 本模板已默认添加 Mock 功能，以适应前端独立于后端的初期开发，以及方便离线状态下项目的相关维护，以下为你介绍 Mock 的使用方法。
