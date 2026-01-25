import { lib } from "noname";
import { hooks } from "./utils/hooks.js";
import { info } from "./info.js";
import "./features/index.js";

lib.init.css(lib.assetURL + "extension/PS武将/css", "extension"); //调用css样式

export const type = "extension";
export default function () {
  return {
    name: "PS武将",
    arenaReady() {
      hooks.arenaReadyHooks.forEach((func) => {
        func();
      });
    },
    content(config, pack) {
      hooks.contentHooks.forEach((func) => {
        func(config, pack);
      });
    },
    prepare() {
      hooks.prepareHooks.forEach((func) => {
        func();
      });
    },
    precontent() {
      hooks.precontentHooks.forEach((func) => {
        func();
      });
    },
    config: {
      ...hooks.configObj,
    },
    help: {
      ...hooks.helpObj,
    },
    package: {
      character: {
        character: {},
        translate: {},
      },
      card: {
        card: {},
        translate: {},
        list: [],
      },
      skill: {
        skill: {},
        translate: {},
      },
      intro: info.intro,
      author: info.author,
      diskURL: info.diskURL,
      forumURL: info.forumURL,
      version: info.version,
    },
    files: { character: [], card: [], skill: [], audio: [] },
    connect: false,
  };
}
