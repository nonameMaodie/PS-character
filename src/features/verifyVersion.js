import { game, lib, ui } from "noname";
import { onPrecontent, setPreConfig } from "../utils/hooks.js";
import { info } from "../info.js";
import { showChangelog } from "../utils/changelog.js"
import { checkVersion } from "../utils/checkVersion.js";

let updateHistory = null;

// 弹出更新说明对话框，搬运自“活动武将”
function showChangeLog(version) {
  const characters = Object.keys(lib.characterPack.PScharacter || {}).concat(
    Object.keys(lib.characterPack.PSsp_character || {})
  );

  const changeInfo = updateHistory[0];
  version = changeInfo.version;
  //加载
  var dialog = ui.create.dialog("hidden");
  dialog.addText(
    '<div style="font-size:24px;margin-top:5px;text-align:center;">PS武将 ' +
    version +
    " 版本更新内容</div>"
  );
  dialog.style.left = "25%";
  dialog.style.width = "50%";
  for (var log of changeInfo.changes) {
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

onPrecontent(() => {
  if (checkVersion(lib.version, info.minCompatibility) < 0) {
    alert(
      `检测到您的本体版本过低，为避免产生不必要的兼容问题，已为您关闭《PS武将》，请及时将本体更新至${info.minCompatibility}以上版本。`
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

let observed = false;

//更新说明
setPreConfig({
  updateInfo: {
    name: `版本：${info.version}`,
    unfrequent: true,
    intro: "查看更新内容",
    init: "1",
    item: {
      1: "<font color=#2cb625>更新内容",
    },
    visualBar(node, item, create, switcher) {
      if (observed) return;
      observed = true;
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "class" &&
            switcher.classList.contains("on")
          ) {
            showChangelog(updateHistory, info.name, () => {
              const popupContainer =
                ui.window.querySelector(".popup-container");
              if (popupContainer) {
                popupContainer.hide();
              }
              switcher.classList.remove("on");
            });
          }
        });
      });
      observer.observe(switcher, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["class"],
      });
    },
    visualMenu(node, link, name, config) {
      node.parentElement.style.display = "none";
    },
  },
  bd1: {
    clear: true,
    name: `最低适配：${info.minCompatibility}`,
    nopointer: true,
  },
});
