/*
 * @Descripttion:
 * @version:
 * @Author: ared
 * @Date: 2022-05-07 14:31:58
 * @LastEditors: ared
 * @LastEditTime: 2022-05-07 14:36:17
 */
const axios = require("axios");
const cheerio = require("cheerio");

// 获取父级页面
async function getParentLink(themeLink) {
  const parentLinkList = [];
  const parentHtml = await axios.get(themeLink);
  const $ = cheerio.load(parentHtml.data);
  const lis = $(".divBlockH178 li a");
  for (let i = 0; i < lis.length; i++) {
    const link = lis.eq(i).attr("href");
    parentLinkList.push(link);
  }
  return parentLinkList;
}

// 获取子集页面下载链接
async function getALink(link) {
  const childHtml = await axios.get(link);
  const $ = cheerio.load(childHtml.data);
  const aLinks = $(".mbButton a");
  const downLoadHref = aLinks.eq(0).attr("href");
  return downLoadHref;
}

// 获取下载链接数组配置
async function getResult(themeLink) {
  const resLinks = [];
  const resLinksStr = [];
  const parentLinkList = await getParentLink(themeLink);
  console.log(parentLinkList);
  for (let i = 0; i < parentLinkList.length; i++) {
    const parentLink = parentLinkList[i];
    console.log(parentLink, "parentLink");
    const resLink = await getALink(parentLink);
    resLinks.push(resLink);
    resLinksStr.push(`\'${resLink}\'`);
  }
  return { resLinksStr, resLinks };
}

module.exports = {
  getResult,
};
