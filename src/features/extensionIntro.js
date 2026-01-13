import { lib } from "noname";
import { setConfig } from "../utils/hooks.js";

//更新说明
setConfig({
  introduce: {
    name: "扩展介绍",
    init: "1",
    unfrequent: true,
    intro: "查看扩展介绍",
    item: {
      1: "<font color=#2cb625>查看",
      //"2": "<font color=#00FF00>更新说明",
    },
    textMenu(node, link) {
      lib.setScroll(node.parentNode);
      node.parentNode.style.transform = "translateY(-100px)";
      //node.parentNode.style.height = "710px";
      node.parentNode.style.width = "350px";
      node.style.cssText = "width: 350px; padding:5px; box-sizing: border-box;";
      node.innerHTML =
        '<p style="line-height: 1.3; margin:0; padding: 0; text-indent: 2em;">本扩展主要是对本体武将进行不同方向的强化设计，设计方案大部分来自于网友，小部分来自本人（均有备注），强度基本上处<font class="firetext">半阴</font>到<font class="firetext">阴间</font>的范围。如果你在游玩过程中遇到bug，可以通过qq群或b站私信（b站同名）向本人反馈。</p>';
    },
  },
  // "repository1": {
  //     clear: true,
  //     name: `点击复制github仓库地址`,
  //     async onclick() {
  //         if (navigator.clipboard && navigator.clipboard.writeText) {
  //             await navigator.clipboard.writeText("https://github.com/nonameMaodie/PS-character");
  //             alert('内容已成功复制到剪贴板');
  //         } else {
  //             alert('复制失败');
  //         }
  //     }
  // },
  // "repository2": {
  //     clear: true,
  //     name: `点击复制gitee仓库地址`,
  //     async onclick() {
  //         if (navigator.clipboard && navigator.clipboard.writeText) {
  //             await navigator.clipboard.writeText("https://gitee.com/ninemangos/PS-character");
  //             alert('内容已成功复制到剪贴板');
  //         } else {
  //             alert('复制失败');
  //         }
  //     }
  // },
});
