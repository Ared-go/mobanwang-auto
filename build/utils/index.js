/*
 * @Descripttion: 拷贝文件夹
 * @version: copyFolder方法中的地址为绝对地址
 * @Author: ared
 * @Date: 2022-04-26 21:07:26
 * @LastEditors: ared
 * @LastEditTime: 2022-05-07 13:38:24
 */
const fs = require("fs");
const path = require("path");

// 拷贝文件夹
function copyFolder(srcPath, destPath) {
  if (!fs.existsSync(srcPath)) {
    return;
  }
  // 获取文件夹下的文件
  const srcList = fs.readdirSync(srcPath);
  srcList.forEach((file) => {
    const currPath = path.resolve(srcPath, file);
    const statObj = fs.statSync(currPath);
    const newPath = path.resolve(destPath, file);
    if (statObj.isFile()) {
      fs.copyFileSync(currPath, newPath);
    }
    if (statObj.isDirectory()) {
      // 判断文件夹是否存在
      if (fs.existsSync(newPath)) {
        return;
      }
      // 创建文件夹
      fs.mkdirSync(newPath);
      copyFolder(currPath, newPath);
    }
  });
}

// 删除指定的文件
async function deleteFile(url, deleteFiles) {
  var files = [];
  console.log(url, "url ----------------");
  if (fs.existsSync(url)) {
    //判断给定的路径是否存在
    files = fs.readdirSync(url); //返回文件和子目录的数组
    console.log(files, "删除指定文件 =============");
    files.forEach((file, index) => {
      const curPath = path.join(url, file);
      if (deleteFiles.includes(file)) {
        //是指定文件，则删除
        fs.unlinkSync(curPath);
        // console.log("删除文件：" + curPath);
      }
    });
  } else {
    console.log("给定的路径不存在！");
  }
}

// 删除文件夹
async function deleteFolder(path) {
  if (!fs.existsSync(path)) {
    return;
  }
  fs.rmdirSync(path, { recursive: true, force: true });
}

// 重命名文件夹
function renameFolder(oldPath, newPath) {
  fs.renameSync(oldPath, newPath);
}

// 清除html中的部分注释
function clearHtmlComment(fileStr) {
  if (!fileStr) return;
  // 替换头部注释声明
  let result = fileStr.replace(
    /(<!--[\w\W]+-->[\s]+?)(?=<!DOCTYPE HTML>)/i,
    (match, _1, _2) => {
      console.log(match, "html match ==============");
      return "";
    }
  );

  // 替换尾部版权声明
  result = result.replace(
    /<a[\s]+href="http:\/\/w3layouts.com\/"[\s]*>.+<\/a>/i,
    (match) => {
      // console.log(match, "match ======");
      return "";
    }
  );
  return result;
}

// 清除css中的部分注释
function clearCssComment(fileStr) {
  if (!fileStr) return;
  // 去除css中的第一个注释信息 如果要取出所有注释使用g标识符
  let result = fileStr.replace(/\/\*[\w\W]+?\*\//i, (match) => {
    // console.log(match, "css match =============");
    return "";
  });
  return result;
}

// 清除指定的关键字
function clearKeyword(keyword, fileStr) {
  if (!keyword || !fileStr) return fileStr;
  const reg = new RegExp(`${keyword}`, "ig");
  let result = fileStr.replace(reg, "");
  return result;
}

// 清除关键注释
function clearComment(srcPath, keyword) {
  if (!fs.existsSync(srcPath)) return;
  const files = fs.readdirSync(srcPath);
  files.forEach((file) => {
    const currPath = path.resolve(srcPath, file);
    const statObj = fs.statSync(currPath);
    // 文件
    if (statObj.isFile(currPath)) {
      const htmlReg = /\.html$/;
      const cssReg = /\.(css|scss)$/;
      const fileStr = fs.readFileSync(currPath, "utf-8");

      // html 文件
      if (htmlReg.test(currPath)) {
        let result = clearHtmlComment(fileStr);
        result = clearKeyword(keyword, result);
        fs.writeFileSync(currPath, result, "utf-8");
      }

      // css文件
      if (cssReg.test(currPath)) {
        let result = clearCssComment(fileStr);
        result = clearKeyword(keyword, result);
        fs.writeFileSync(currPath, result, "utf-8");
      }
    }

    // 文件夹
    if (statObj.isDirectory(currPath)) {
      // 递归调用
      clearComment(currPath);
    }
    // console.log(currPath, "currPath =============");
  });
}

// 重名名文件夹
function rename(srcPath, start) {
  const dirName = path.dirname(srcPath);
  const destName = path.resolve(dirName, `template-${start}`);
  renameFolder(srcPath, destName);
}

// 删除文件及拷贝文件夹
/**
 * @name: deleteAndCopy
 * @msg: 删除文件及拷贝文件夹
 * @param {*} fileList 文件列表
 * @return {*}
 */
async function deleteAndCopy(destPath, deleteFiles) {
  console.log("deleteAndCopy destPath", destPath);
  const fileList = fs.readdirSync(destPath);
  console.log(fileList, "fileList  ===========");
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    const deltePathUrl = path.resolve(destPath, file);
    const copyPathUrl = path.resolve(destPath, file, "html");
    const destPathUrl = path.resolve(destPath, file);
    console.log(deltePathUrl, "srcPath ================");
    // 删除指定的文件
    await deleteFile(deltePathUrl, deleteFiles);
    // console.log("删除完毕");
    // 拷贝文件夹
    await copyFolder(copyPathUrl, destPathUrl);
    // 删除html文件夹
    await deleteFolder(copyPathUrl);
  }
}

/**
 * @name: clearAndRename
 * @msg: 清除标识及重命名
 * @param {*} fileList 文件列表
 * @param {*} keyword 清除的关键字标识
 * @param {*} start 开始重命名的起使数字
 * @return {*}
 */
function clearAndRename(destPath, keyword, start) {
  const fileList = fs.readdirSync(destPath);
  console.log(fileList, "clearAndRename ===========");
  fileList.forEach(async (file) => {
    const destPathUrl = path.resolve(destPath, file);
    // 清除头部注释及关键词
    await clearComment(destPathUrl, keyword);
    // 重命名文件夹  eg: template/template-30
    await rename(destPathUrl, ++start);
  });
}

module.exports = {
  copyFolder,
  deleteFile,
  deleteFolder,
  renameFolder,
  clearComment,
  clearAndRename,
  deleteAndCopy,
};
