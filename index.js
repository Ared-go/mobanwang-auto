/*
 * @Descripttion:
 * @version:
 * @Author: ared
 * @Date: 2022-04-26 11:35:20
 * @LastEditors: ared
 * @LastEditTime: 2022-05-07 14:56:58
 */
const axios = require("axios");
const cheerio = require("cheerio");
const glob = require("glob");
const { unrar, list } = require("unrar-promise");
const { clearAndRename, deleteAndCopy } = require("./build/utils");
const { getResult } = require("./build/utils/getFileLink");
const fs = require("fs");
const path = require("path");
const http = require("http");

// 获取rar文件列表
async function getRarFileList(themeLink) {
  const { resLinks } = await getResult(themeLink);
  const rarLinkList = [];
  try {
    for (let i = 0; i < resLinks.length; i++) {
      const link = resLinks[i];
      let rarLink = await getRarUrl(link);
      rarLinkList.push(rarLink);
    }
  } catch (err) {
    console.log(err);
  }
  return rarLinkList;
}
// 获取rar文件链接
async function getRarUrl(fileUrl) {
  const { data } = await axios.get(fileUrl, {
    responseType: "stream", // default
  });
  return data.responseUrl;
}
// 解压rar文件
async function decodeRarFile(srcPath, destPath) {
  const fileList = fs.readdirSync(srcPath);
  console.log(fileList, "fileList is ======");
  for (let i = 0; i < fileList.length; i++) {
    // fileList.forEach(async (file, index) => {
    const file = fileList[i];
    const currPath = path.resolve(srcPath, file);
    console.log(currPath, "currPath ============");
    const filePath = path.resolve(destPath, `template-${i + 1}`);
    if (fs.existsSync(filePath)) {
      return;
    }
    fs.mkdirSync(filePath);
    // 解压rar文件
    const dirPath = await unrar(currPath, filePath);
    console.log(dirPath, "dirPath is ==========");
    // });
  }
}
// 获取rar文件
async function getRarFile(themeLink, deleteFiles) {
  const list = await getRarFileList(themeLink);
  console.log("rar 文件列表 ==== ", list);
  console.log(
    "===========================>开始加载解压文件============================>"
  );
  // 文件数量标识
  let count = 0;
  list.forEach((url, index) => {
    http.get(url, (res) => {
      const path = `${__dirname}/files/test${index + 1}.rar`;
      const filePath = fs.createWriteStream(path);
      res.pipe(filePath);
      filePath.on("finish", () => {
        filePath.close();
        count++;
        console.log("Download Completed", count);
        if (count === list.length) {
          console.log(
            "===========================>所有rar文件加载完成，开始解压============================>"
          );
          solveFile(deleteFiles);
        }
      });
    });
  });
}

async function solveFile(deleteFiles) {
  //  所有rar文件加载完成才开始
  const srcPath = path.resolve(__dirname, "files");
  const destPath = path.resolve(__dirname, "template");
  // 解压文件
  await decodeRarFile(srcPath, destPath);
  // 处理文件
  await deleteAndCopy(destPath, deleteFiles);
  // 清除关键信息以及文件重命名
  clearAndRename(destPath, "w3layouts", 30);
}

const deleteFiles = [
  "下载网页模板.url",
  "下载网页特效.url",
  "下载字体.url",
  "下载PPT模板.url",
  "ReadMe.txt",
];
// 2022/4/28 采集30套 第二页
const themeLink =
  "http://www.mobanwang.com/mb/special/dianzishangwu/List_21.html";

getRarFile(themeLink, deleteFiles);
// solveFile(deleteFiles);

// ====================================== 方案二 ====================================

// const themeLink =
//   "http://www.mobanwang.com/mb/special/dianzishangwu/List_21.html";
// getResult(themeLink).then((res) => {
//   console.log(res, "linsk ===========");
//   let result = res.toString();
//   const data = `export const config = [${result}]`;
//   fs.writeFileSync("./config.js", data, "utf-8");
// });
