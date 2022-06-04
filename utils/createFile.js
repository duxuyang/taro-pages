const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

// 页面内容
const pageContent = `
import Taro from '@tarojs/taro';
import React, { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import classNames from 'classnames/bind';

import styles from './index.module.scss';

const cx = classNames.bind(styles);

const Index = () => {

  useEffect(() => {
    // 12
  }, []);

  return (
    <View >

    </View>
  );
};

export default Index;
`;

// 配置模板内容
const configContent = `
export default {
  navigationBarTitleText: '',
};
`

// 增加小程序路由配置
const changeConfig = (filePath, name) => {
  const route = `pages/${name}/index`;

    // 读取文件内容
    let configCon = fs.readFileSync(filePath, 'utf8').split('\n');
    // 过滤换行符
    configCon = configCon.filter(e => e.replace(/(\r\n|\n|\r)/gm, ''));

    const pageIndex = configCon.findIndex(value => value.indexOf(']') >= 0);
    // 末尾没有逗号，增加逗号
    if (!configCon[pageIndex - 1].includes(',')) {
        configCon[pageIndex - 1] = configCon[pageIndex - 1] + ',';
    }
    configCon.splice(pageIndex, 0, `'${route}',`);
    const content = configCon.join('\n');
    fs.writeFileSync(
        filePath,
        content
    );
};

// 创建page文件/模板
const createFile = (filePath, isTs, isTem) => {

  let pagePath = `${filePath}/index.${isTs ? 'tsx' : 'jsx'}`;
  let cssPath=`${filePath}/index.module.scss`
  let configPath = `${filePath}/index.config.${isTs ? 'ts' : 'js'}`;

  fs.mkdirSync(filePath, { recursive: true });

  fs.writeFileSync(
    pagePath,
    pageContent
  );
  fs.writeFileSync(
    cssPath,
    ''
  );
  if (!isTem) {
    fs.writeFileSync(
      configPath,
      configContent
    );
  }

  // fs.mkdirSync(filePath, { recursive: true });
  // const stats = fs.statSync(filePath);

  // // 模板地址目录
  // const templateRoot = path.resolve(__dirname, `../template/${isTs ? 'taroTs' : 'taroJs'}`);

  // if (stats.isDirectory()) {
  //   for (const file of fs.readdirSync(templateRoot)) {
  //     // 把模板文件复制到目标文件夹
  //     fs.copyFileSync(path.resolve(templateRoot, file), path.resolve(filePath, file));
  //   }
  // }

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

  // 判断是ts项目还是js项目
  let isTs = false;
  let dirArr = fs.readdirSync(srcPath);
  dirArr.forEach((item) => {
    if (item.includes('.ts') || item.includes('.tsx')) {
      isTs = true;
    }
  });
  // app.config.ts 路径
  const appConfigPath = `${srcPath}/app.config.${isTs ? 'ts' : 'js'}`;

  // 判断用户选中的文件夹是否正常
  if (!folderPath.includes('/src') || (!folderPath.includes('pages') && !folderPath.includes('components'))) {
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
    createFile(filePath, isTs,false);
  }
  // 创建组件模板
  if (folderPath.includes('/src/components')) {
    createFile(filePath, isTs, true);
  }

};

module.exports = Index;
