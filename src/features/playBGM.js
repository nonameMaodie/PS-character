import { game, get, lib, ui } from "noname";
import { onPrecontent, setConfig } from "../utils/hooks.js";

function playBackgroundMusic() {
  //if(lib.config.background_music=='music_off'){
  //ui.backgroundMusic.src='';
  //}
  //ui.backgroundMusic.autoplay=true;
  var temp = lib.config.extension_PS武将_Background_Music;
  if (temp == "0") {
    temp = get.rand(2, 30);
    //生成一个范围2到30的整数
    temp = temp.toString();
    //转为字符串
  }
  ui.backgroundMusic.pause();
  var item = {
    2: "一战成名.m4a",
    3: "逐鹿天下.mp3",
    4: "三国杀牌局重制版.mp3",
    5: "争流.mp3",
    6: "征战虎牢.mp3",
    7: "决战虎牢关旧版.mp3",
    8: "决战虎牢关.mp3",
    9: "洛神赋.mp3",
    10: "群英会.mp3",
    11: "逍遥津.mp3",
    12: "单刀赴会变奏版.mp3",
    13: "幻化之战.mp3",
    14: "黄巾之乱.mp3",
    15: "军争三国.mp3",
    16: "乱世乾坤.mp3",
    17: "天书乱斗.mp3",
    18: "帐前点兵.mp3",
    19: "许昌.mp3",
    20: "自走棋.mp3",
    21: "OL排位.mp3",
    22: "大闹长坂坡.mp3",
    23: "烽火连天.mp3",
    24: "官阶系统.mp3",
    25: "欢乐三国杀征战.mp3",
    26: "洛阳.mp3",
    27: "三国杀烈.mp3",
    28: "太虚-黄巾之乱.mp3",
    29: "太虚-进军广宗.mp3",
    30: "太虚-长设之战.mp3",
  };
  if (item[temp]) {
    ui.backgroundMusic.src =
      lib.assetURL + "extension/PS武将/audio/BGM/" + item[temp];
  } else {
    game.playBackgroundMusic();
    ui.backgroundMusic.addEventListener("ended", game.playBackgroundMusic);
  }
}

onPrecontent(() => {
  /* <-------------------------播放BGM函数，搬运自福瑞拓展，已获得原作者允许，感谢钫酸酱-------------------------> */
  if (
    lib.config.extension_PS武将_Background_Music &&
    lib.config.extension_PS武将_Background_Music != "1"
  ) {
    lib.arenaReady.push(() => {
      playBackgroundMusic();
      ui.backgroundMusic.addEventListener("ended", playBackgroundMusic);
    });
  }
});

//切换BGM
setConfig({
  Background_Music: {
    name: `背景音乐<div class="PSmusic-container"><div class="PSneedle" style="background: url(${lib.assetURL}extension/PS武将/image/music/needle.png) no-repeat 0 0/cover"></div><div class="PSrecord-box"><div class="PSrecord" style="background: url(${lib.assetURL}extension/PS武将/image/music/coverall.png) no-repeat -140px -580px"></div><div class="PSrecord-img" style="background: url(${lib.assetURL}extension/PS武将/image/music/${lib.config.extension_PS武将_Background_Music || "1"}.jpg) no-repeat 0 0/cover"></div></div></div>`,
    clear: true,
    intro: "背景音乐：可随意点播、切换优质动听的背景音乐",
    init:
      lib.config.extension_PS武将_Background_Music === undefined
        ? "1"
        : lib.config.extension_PS武将_Background_Music,
    item: {
      0: "随机播放",
      1: "默认音乐",
      2: "一战成名",
      3: "逐鹿天下",
      4: "三国杀牌局重制版",
      5: "争流",
      6: "征战虎牢",
      7: "决战虎牢关旧版",
      8: "决战虎牢关",
      9: "洛神赋",
      10: "群英会",
      11: "逍遥津",
      12: "单刀赴会变奏版",
      13: "幻化之战",
      14: "黄巾之乱",
      15: "军争三国",
      16: "乱世乾坤",
      17: "天书乱斗",
      18: "帐前点兵",
      19: "许昌",
      20: "自走棋",
      21: "OL排位",
      22: "大闹长坂坡",
      23: "烽火连天",
      24: "官阶系统",
      25: "欢乐三国杀征战",
      26: "洛阳",
      27: "三国杀烈",
      28: "太虚-黄巾之乱",
      29: "太虚-进军广宗",
      30: "太虚-长设之战",
    },
    onclick(item) {
      const div = document.querySelector(".PSrecord-box .PSrecord-img");
      div.style.backgroundImage = `url(${lib.assetURL}extension/PS武将/image/music/${item}.jpg)`;
      game.saveConfig("extension_PS武将_Background_Music", item);
      playBackgroundMusic();
      ui.backgroundMusic.addEventListener("ended", playBackgroundMusic);
    },
    visualMenu(node, link) {
      lib.setScroll(node.parentNode);
      node.parentNode.style.cssText = "padding: 8px; color: white;";
      node.style.cssText = `width: 94px; height: 80px; box-sizing: border-box; border-radius: 10px 0 0 10px; margin: 8px; background: url(${lib.assetURL}extension/PS武将/image/music/coverall.png) no-repeat -240px -1120px`;
      node.innerHTML = `<div style="width: 80px; height: 80px; box-sizing: border-box; border-radius: 10px; font-family: xingkai, xinwei; padding: 3px; background:url(${lib.assetURL}extension/PS武将/image/music/${link}.jpg) no-repeat right center/cover ">${node.innerText}</div>`;
    },
  },
});
