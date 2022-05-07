/*
 * @Descripttion:
 * @version:
 * @Author: ared
 * @Date: 2022-04-26 17:16:48
 * @LastEditors: ared
 * @LastEditTime: 2022-05-05 19:25:09
 */

const {
  copyFolder,
  deleteFile,
  deleteFolder,
  renameFolder,
  clearComment,
} = require("./utils");
const glob = require("glob");
const path = require("path");

const deleteFiles = [
  "下载网页模板.url",
  "下载网页特效.url",
  "下载字体.url",
  "下载PPT模板.url",
  "ReadMe.txt",
];
// 重名名文件夹
function rename(file, start) {
  const srcName = path.join(__dirname, file);
  const dirName = path.dirname(srcName);
  const destName = path.resolve(dirName, `template-${start}`);
  renameFolder(srcName, destName);
}
// 删除文件及拷贝文件夹
/**
 * @name: deleteAndCopy
 * @msg: 删除文件及拷贝文件夹
 * @param {*} fileList 文件列表
 * @return {*}
 */
function deleteAndCopy(fileList, deleteFiles) {
  fileList.forEach((file) => {
    const srcPath = path.resolve(file, "html");
    const destPath = path.resolve(file);
    // 删除指定的文件
    deleteFile(file, deleteFiles);
    // 拷贝文件夹
    copyFolder(srcPath, destPath);
    // 删除html文件夹
    deleteFolder(srcPath);
  });
}

/**
 * @name: clearAndRename
 * @msg: 清除标识及重命名
 * @param {*} fileList 文件列表
 * @param {*} keyword 清除的关键字标识
 * @param {*} start 开始重命名的起使数字
 * @return {*}
 */
function clearAndRename(fileList, keyword, start) {
  fileList.forEach((file) => {
    const destPath = path.resolve(file);
    // 清除头部注释及关键词
    clearComment(destPath, keyword);
    // 重命名文件夹
    rename(file, ++start);
  });
}

let fileList = glob.sync("../template/*");
console.log(fileList, "res ==================");
deleteAndCopy(fileList, deleteFiles);
setTimeout(() => {
  clearAndRename(fileList, "w3layouts", 50);
}, 500);
