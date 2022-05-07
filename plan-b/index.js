/*
 * @Descripttion: 方案二
 * @version:
 * @Author: ared
 * @Date: 2022-05-07 14:33:34
 * @LastEditors: ared
 * @LastEditTime: 2022-05-07 14:51:07
 */

const { getResult } = require("../build/utils/getFileLink");
const fs = require("fs");
const themeLink =
  "http://www.mobanwang.com/mb/special/dianzishangwu/List_21.html";
getResult(themeLink).then((res) => {
  const { resLinksStr } = res;
  console.log(resLinksStr, "resLinksStr ===========");
  let result = resLinksStr.toString();
  const data = `export const config = [${result}]`;
  fs.writeFileSync("./config.js", data, "utf-8");
});
