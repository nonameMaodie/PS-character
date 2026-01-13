import { get, lib } from "noname";
import { onContent } from "../utils/hooks.js";

onContent(() => {
  /* <-------------------------台词补充-------------------------> */
  if (get.mode && get.mode() !== "boss") {
    lib.translate["#boss_lvbu1:die"] = "虎牢关，失守了……";
    lib.translate["#xiuluo1"] = "准备受死吧！";
    lib.translate["#xiuluo2"] = "鼠辈！螳臂当车！";
    lib.translate["#shenwei1"] = "萤烛之火，也敢与日月争辉？";
    lib.translate["#shenwei2"] = "我不会输给任何人！";
    lib.translate["#shenji1"] = "杂鱼们！都去死吧！";
    lib.translate["#shenji2"] = "竟想赢我？痴人说梦！";
    lib.translate["#boss_lvbu2:die"] = "虎牢关，失守了……";
    lib.translate["#shenqu1"] = "别心怀侥幸了，你们不可能赢！";
    lib.translate["#shenqu2"] = "虎牢关，我一人镇守足矣！";
    lib.translate["#jiwu1"] = "我，是不可战胜的！";
    lib.translate["#jiwu2"] = "今天，就让你们感受一下真正的绝望！";
    lib.translate["#qiangxi_boss_lvbu31"] = "这么想死，那我就成全你！";
    lib.translate["#qiangxi_boss_lvbu32"] = "项上人头，待我来取！";
    lib.translate["#retieji_boss_lvbu31"] = "哈哈哈，破绽百出！";
    lib.translate["#retieji_boss_lvbu32"] = "我要让这虎牢关下，血流成河！";
    lib.translate["#xuanfeng_boss_lvbu31"] = "千钧之势，力贯苍穹！";
    lib.translate["#xuanfeng_boss_lvbu32"] = "横扫六合，威震八荒！";
    lib.translate["#wansha_boss_lvbu31"] = "蝼蚁，怎容偷生？";
    lib.translate["#wansha_boss_lvbu32"] = "沉沦吧，在这无边的恐惧！";
    lib.translate["#boss_lvbu3:die"] = "你们的项上人头，我改日再取！";
  }
});
