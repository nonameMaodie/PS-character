import { lib } from "noname";
import { onContent } from "../utils/hooks.js";

onContent(() => {
  /* <-------------------------添加时机翻译-------------------------> */
  lib.translate.phaseBegin = "回合开始阶段";
  lib.translate.phaseZhunbei = "准备阶段";
  lib.translate.phaseJudge = "判定阶段";
  lib.translate.phaseDraw = "摸牌阶段";
  lib.translate.phaseUse = "出牌阶段";
  lib.translate.phaseDiscard = "弃牌阶段";
  lib.translate.phaseJieshu = "回合结束阶段";
});
