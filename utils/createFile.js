const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { reactTem, vue3Tem, vue2Tem, configTem } = require('./template');

// 增加小程序路由配置
const changeConfig = (filePath, name) => {
  const route = `pages/${name}/index`;

  // 读取文件内容
  let configCon = fs.readFileSync(filePath, 'utf8').split('\n');
  // 过滤换行符
  configCon = configCon.filter((e) => e.replace(/(\r\n|\n|\r)/gm, ''));

  const pageIndex = configCon.findIndex((value) => value.indexOf(']') >= 0);
  // 末尾没有逗号，增加逗号
  if (!configCon[pageIndex - 1].includes(',')) {
    configCon[pageIndex - 1] = configCon[pageIndex - 1] + ',';
  }
  configCon.splice(pageIndex, 0, `'${route}',`);
  const content = configCon.join('\n');
  fs.writeFileSync(filePath, content);
};

// 创建page文件/模板
const createFile = (filePath, isTs, typeName, isTem) => {
  let cssPath = `${filePath}/index.module.scss`;
  let configPath = `${filePath}/index.config.${isTs ? 'ts' : 'js'}`;
  let pagePath = '';
  let template = '';
  if (typeName === 'react') {
    pagePath = `${filePath}/index.${isTs ? 'tsx' : 'jsx'}`;
    template = reactTem;
  } else {
    pagePath = `${filePath}/index.vue`;
    template = typeName === 'vue2' ? vue2Tem : vue3Tem;
  }

  fs.mkdirSync(filePath, { recursive: true });

  fs.writeFileSync(pagePath, template);

  // react 项目加入css
  if (typeName === 'react') {
    fs.writeFileSync(cssPath, '');
  }

  // 小程序页面加入默认配置文件，组件不加入
  if (!isTem) {
    fs.writeFileSync(configPath, configTem);
  }
};

// 创建处理
const Index = (folderPath, pageName) => {
  // 项目根路径
  const appDirPath = path.resolve(folderPath, '../../');
  // src路径
  const srcPath = path.resolve(folderPath, '../');

  // project.config.json路径
  const projectPath = `${appDirPath}/project.config.json`;
  // 需要创建的目录
  const filePath = `${folderPath}/${pageName}`;
  // package.json路径
  const packagePath = `${appDirPath}/package.json`;

  // 判断是vue或者react项目
  const packageCon = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  let typeName = 'react';
  const vues = packageCon.dependencies.vue;
  if (vues) {
    const rew = RegExp(/~|\^/);
    const version = rew.test(vues) ? vues.slice(1, 2) : vues.slice(0, 1);
    typeName = `vue${version}`;
  }

  // 判断是ts项目还是js项目
  let isTs = false;
  // 判断app.config.ts是否存在，来证明是否ts项目
  if (fs.existsSync(`${appDirPath}/tsconfig.json`)) {
    isTs = true;
  }

  // app.config.ts 路径
  const appConfigPath = `${srcPath}/app.config.${isTs ? 'ts' : 'js'}`;

  // 判断用户选中的文件夹是否正常
  if (
    !folderPath.includes('/src') ||
    (!folderPath.includes('pages') && !folderPath.includes('components'))
  ) {
    vscode.window.showErrorMessage('请在src目录下对应的pages目录创建文件');
    return;
  }

  // 判断当前项目是否是 taro 小程序
  if (!fs.existsSync(projectPath) && !fs.existsSync(appConfigPath)) {
    vscode.window.showErrorMessage('请在taro项目对应的pages目录创建文件');
    return;
  }

  // 判断目录是否存在
  if (fs.existsSync(filePath)) {
    vscode.window.showErrorMessage('当前目录已存在，请重新输入名称');
    return;
  }

  // 创建page
  if (folderPath.includes('/src/pages')) {
    changeConfig(appConfigPath, pageName);
    createFile(filePath, isTs, typeName, false);
  }

  // 创建组件模板
  if (folderPath.includes('/src/components')) {
    createFile(filePath, isTs, typeName, true);
  }
};

module.exports = Index;
