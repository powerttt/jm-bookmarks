# JM-Bookmarks
个人书签管理工具（可能扩展更多），计划使用坚果云作为数据备份，目标能做到无服务多端同步
## Feature
- [ ] 书签功能（导入导出谷歌、Edge等浏览器书签）
- [ ] 本地数据
- [ ] 汇集多种功能（暂时没想好）
- [ ] Mac/Windows
## Future
- [ ] Android
- [ ] IOS
- [ ] 无服务多端同步

# 基于 [naiveui](https://www.naiveui.com)
这方方面面的，属实太好用了，一言难尽，去看看！

## 还有 [Naive Ui Admin](https://github.com/jekip/naive-ui-admin) 
`Naive Ui Admin` 是一个基于 [Vue3.0](https://github.com/vuejs/vue-next)、[Vite](https://github.com/vitejs/vite)、 [Naive UI](https://www.naiveui.com/)、[TypeScript](https://www.typescriptlang.org/) 的中后台解决方案，它使用了最新的前端技术栈，并提炼了典型的业务模型，页面，包括二次封装组件、动态菜单、权限校验、粒子化权限控制等功能，它可以帮助你快速搭建企业级中后台项目，相信不管是从新技术使用还是其他方面，都能帮助到你。

本项目中有很多借(fu)鉴(zhi)了 `Naive Ui Admin` 的代码，感谢。



# 基于 [electron-vite-boilerplate](https://github.com/caoxiemeihao/electron-vite-boilerplate)

`electron-vite-boilerplate` 项目是作者 `caoxuemeihao` 使用的 React，本项目改成了 Vue 的版本（我是后端开发，前端只懂一点皮毛）

![GitHub license](https://img.shields.io/github/license/caoxiemeihao/electron-vite-boilerplate)

## Feature

- Enabled `Electron` and `NodeJs` in `Renderer-process` by **[vitejs-plugin-electron](https://www.npmjs.com/package/vitejs-plugin-electron)**.
- Use `Vite` build `Renderer-process`.
- Use `esbuild` build `Main-process` and `Preload-script`.

## Run Setup

  ```bash
  # clone the project
  git clone git@github.com:caoxiemeihao/electron-vite-boilerplate.git

  # enter the project directory
  cd electron-vite-boilerplate

  # install dependency(recommend use pnpm)
  pnpm install

  # develop
  npm run dev
  ```

