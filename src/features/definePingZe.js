import { game, get, lib } from "noname";
import { onPrecontent, setConfig } from "../utils/hooks.js";

/* <-------------------------平仄声相关-------------------------> */
let rusheng = null;
onPrecontent(() => {
  //将rusheng.json文件里的入声字数组存入rusheng
  lib.init.promises
    .json(`${lib.assetURL}extension/PS武将/json/rusheng.json`)
    .then(
      (info) => (rusheng = info),
      (err) => alert("JSON 文件解析失败\n" + err)
    );
});

setConfig({
  pingzeTip: {
    name: "平仄提示",
    intro: "开启后使用武将PS李白，手牌会有相应提示（即时生效）",
    init:
      lib.config.extension_PS武将_PS_pingzeTip === undefined
        ? false
        : lib.config.extension_PS武将_PS_pingzeTip,
    onclick(item) {
      game.saveConfig("extension_PS武将_PS_pingzeTip", item);
    },
  },
});

//获取平仄的函数
export function getPingZe(str) {
  //以平水韵为标准
  if (typeof str !== "string") return;
  if (str === "大宛") return "平";
  if (rusheng.includes(str.at(-1))) return "仄";
  const ping = ["ā", "á", "ē", "é", "ī", "í", "ō", "ó", "ū", "ú", "ǖ", "ǘ"];
  const ze = ["ǎ", "à", "ě", "è", "ǐ", "ì", "ǒ", "ò", "ǔ", "ù", "ǚ", "ǜ"];
  let pinyin = get.pinyin(str, true);
  pinyin = pinyin.at(-1);
  if (ping.some((yin) => pinyin.includes(yin))) return "平";
  if (ze.some((yin) => pinyin.includes(yin))) return "仄";
}
