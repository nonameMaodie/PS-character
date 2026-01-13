import { game, lib, ui } from "noname";
import { onPrecontent, setConfig } from "../utils/hooks.js";
import { MINVERSION, VERSION } from "../version.js";

let updateHistory = null;

// 弹出更新说明对话框，搬运自“活动武将”
function showChangeLog(version) {
  const characters = Object.keys(lib.characterPack.PScharacter || {}).concat(
    Object.keys(lib.characterPack.PSsp_character || {})
  );

  version = version || lib.extensionPack["PS武将"].version;
  const changeInfo = updateHistory[lib.extensionPack.PS武将.version];
  //加载
  var dialog = ui.create.dialog("hidden");
  dialog.addText(
    '<div style="font-size:24px;margin-top:5px;text-align:center;">PS武将 ' +
      version +
      " 版本更新内容</div>"
  );
  dialog.style.left = "25%";
  dialog.style.width = "50%";
  for (var log of changeInfo.changeLog) {
    switch (log) {
      case "/setPlayer/":
        dialog.addText(
          '<div style="font-size:17.5px;text-align:center;">更新角色：</div>'
        );
        dialog.addSmall([changeInfo.players, "character"]);
        break;
      case "/setCard/":
        dialog.addText(
          '<div style="font-size:17.5px;text-align:center;">更新卡牌：</div>'
        );
        dialog.addSmall([changeInfo.cards, "vcard"]);
        break;
      default: {
        var li = document.createElement("li");
        if (!log.startsWith("收录了")) {
          characters.forEach((j) => {
            if (
              log.includes(lib.translate[j]) ||
              (log.includes("〖") && log.includes("〗"))
            ) {
              log = log
                .replace(
                  new RegExp(lib.translate[j], "g"),
                  `<font color=#ff9800>${lib.translate[j]}</font>`
                )
                .replace(/〖/g, "<font color=#24c022>〖")
                .replace(/〗/g, "〗</font>");
            }
          });
        }
        li.innerHTML = log;
        li.style.textAlign = "left";
        li.style.marginLeft = "25px";
        li.style.marginTop = "2.5px";
        dialog.content.appendChild(li);
      }
    }
  }
  var ul = document.createElement("ul");
  dialog.content.appendChild(ul);
  dialog.open();
  var hidden = false;
  if (!ui.auto.classList.contains("hidden")) {
    ui.auto.hide();
    hidden = true;
  }
  game.pause();
  var control = ui.create.control("确定", () => {
    dialog.close();
    control.close();
    if (hidden) ui.auto.show();
    game.resume();
  });
}

/**
 * 本体版本验证
 * @param {string} curVersion 当前版本
 * @param {string} minVersion 要求的最小版本
 * @returns {boolean} 是否满足最低版本要求
 */
function compareVersion(curVersion, minVersion) {
  function getSliceVersion(version) {
    const spotIndex = version.search(/(?<=\d+\.\d+\.\d+)(\.)/);
    if (!spotIndex === -1) version = version.slice(0, spotIndex);
    return version.split(".");
  }
  curVersion = getSliceVersion(curVersion);
  minVersion = getSliceVersion(minVersion);
  let bool = false;
  for (let i = 0; i < curVersion.length; i++) {
    if (+curVersion[i] > +minVersion[i]) {
      bool = true;
      break;
    }
    if (+curVersion[i] === +minVersion[i]) {
      if (i === curVersion.length - 1) {
        bool = true;
        break;
      }
    } else {
      break;
    }
  }
  return bool;
}

onPrecontent(() => {
  if (!compareVersion(lib.version, MINVERSION)) {
    alert(
      `检测到您的本体版本过低，为避免产生不必要的兼容问题，已为您关闭《PS武将》，请及时将本体更新至${MINVERSION}以上版本。`
    );
    game.saveExtensionConfig("PS武将", "enable", false);
    game.reload();
  }

  //将updateHistory.json文件里的更新日志存入updateHistory
  lib.init.promises
    .json(`${lib.assetURL}extension/PS武将/json/updateHistory.json`)
    .then(
      (info) => (updateHistory = info),
      (err) => alert("JSON 文件解析失败\n" + err)
    );

  lib.skill._PS_changeLog = {
    charlotte: true,
    ruleSkill: true,
    trigger: {
      global: [
        /*'chooseButtonBefore',*/ "gameStart",
        "gameDrawAfter",
        "phaseBefore",
      ],
    },
    filter(event, player) {
      //if(event.name=='chooseButton'&&event.parent.name!='chooseCharacter') return false;
      return (
        !lib.config.extension_PS武将_PS_version ||
        lib.config.extension_PS武将_PS_version !=
          lib.extensionPack.PS武将.version
      );
    },
    direct: true,
    priority: 1_919_810,
    async content() {
      game.saveConfig(
        "extension_PS武将_PS_version",
        lib.extensionPack.PS武将.version
      );
      showChangeLog();
    },
  };
});

//更新说明
setConfig({
  versionUpdate: {
    name: `版本：${VERSION}`,
    init: "1",
    unfrequent: true,
    intro: "查看此版本更新说明",
    item: {
      1: "<font color=#2cb625>更新说明",
      //"2": "<font color=#00FF00>更新说明",
    },
    textMenu(node, link) {
      const characters = Object.keys(
        lib.characterPack.PScharacter || {}
      ).concat(Object.keys(lib.characterPack.PSsp_character || {}));
      lib.setScroll(node.parentNode);
      node.parentNode.style.transform = "translateY(-100px)";
      //node.parentNode.style.height = "710px";
      node.parentNode.style.width = "350px";
      node.style.cssText = "width: 350px; padding:5px; box-sizing: border-box;";
      let str = "";
      if (lib.extensionPack.PS武将) {
        const info = updateHistory[VERSION];
        if (!info) {
          node.innerHTML = "<font color=red>[读取更新说明出现异常]</font>";
          return;
        }
        const changeLog = info.changeLog.slice(0);
        changeLog.forEach((i) => {
          if (i !== "/setPlayer/" && i !== "/setCard/") {
            characters.forEach((j) => {
              if (
                (i.includes(lib.translate[j]) ||
                  (i.includes("〖") && i.includes("〗"))) &&
                !i.startsWith("收录了")
              ) {
                i = i
                  .replace(
                    new RegExp(lib.translate[j], "g"),
                    `<font color=#ff9800>${lib.translate[j]}</font>`
                  )
                  .replace(/〖/g, "<font color=#24c022>〖")
                  .replace(/〗/g, "〗</font>");
              }
            });
            str += `·${i}<br>`;
          }
        });
        str = `<span style="width:335px; display:block; font-size: 15px">${str}<span>`;
        /* '·<span style="color:#ffce46">PS左慈</span>增强，制衡化身时额外获得一张化身牌。',
                '·<span style="color:#ffce46">PS裴秀</span><span style="color:#24c022">【行图】</span>增加了“倒计时”显示。',
                '·优化了<span style="color:#ffce46">PS赵襄、大魏吴王、双倍许劭、PS神张辽</span>选技能时的loading框样式。（需要开启扩展<span style="color:#24c022">“天牢令”</span>，已征得<span style="color:#bd6420">铝宝</span>和<span style="color:#bd6420">雷佬</span>同意）', */
        node.innerHTML = str;
      } else {
        node.innerHTML =
          "<font color=red>[需要开启本扩展并重启才能查看]</font>";
      }
    },
  },
  bd1: {
    clear: true,
    name: `最低支持本体版本：${MINVERSION}`,
    nopointer: true,
  },
});
