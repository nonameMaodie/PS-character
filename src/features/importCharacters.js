import { game, lib } from "noname";
import { onPrecontent, setConfig } from "../utils/hooks.js";

onPrecontent(async () => {
  import("../character/PScharacter/index.js");
  if (lib.config.extension_PS武将_PS_spCharacter === true)
    import("../character/PSsp_character/index.js");
});

// 特殊武将开关
setConfig({
  PS_spCharacter: {
    name: "特殊武将",
    intro: "开启/关闭PS特殊武将包（重启生效）",
    init:
      lib.config.extension_PS武将_PS_spCharacter === undefined
        ? false
        : lib.config.extension_PS武将_PS_spCharacter,
    onclick(item) {
      game.saveConfig("extension_PS武将_PS_spCharacter", item);
    },
  },
});
