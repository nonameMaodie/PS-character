import { lib } from "noname";
import { onContent } from "../utils/hooks.js";

/**
 * 改变技能配音的函数
 * @param { Array | string } skillsName
 * @param { HTMLDivElement[] | HTMLDivElement } playersName
 * @param { boolean | string | Array | number } audioName
 */
export function changeSkillAudio(skillsName, playersName, audioName) {
  if (typeof skillsName === "string") {
    skillsName = [skillsName];
  }
  skillsName.forEach((skillName) => {
    if (typeof playersName === "string") {
      playersName = [playersName];
    }
    playersName.forEach((playerName) => {
      if (!lib.skill[skillName]) return;
      if (!lib.skill[skillName].audioname2)
        lib.skill[skillName].audioname2 = {};
      lib.skill[skillName].audioname2[playerName] = audioName;
    });
  });
}

onContent(() => {
  /* <-------------------------改变部分武将的技能配音-------------------------> */
  //改变虎牢关吕布“强袭”的配音
  changeSkillAudio(
    "qiangxix",
    ["PSboss_lvbu2", "PSboss_lvbu3", "PSboss_lvbu4"],
    "qiangxi_boss_lvbu3"
  );
  //改变虎牢关吕布“完杀”的配音
  changeSkillAudio(
    "rewansha",
    ["PSboss_lvbu2", "PSboss_lvbu3", "PSboss_lvbu4", "PSshengui"],
    "wansha_boss_lvbu3"
  );
  //改变虎牢关吕布“铁骑”的配音
  changeSkillAudio(
    "retieji",
    ["PSboss_lvbu2", "PSboss_lvbu3", "PSboss_lvbu4"],
    "retieji_boss_lvbu3"
  );
  changeSkillAudio("sbtieji", "PSshengui", "retieji_boss_lvbu3");
  //改变虎牢关吕布“旋风”的配音
  changeSkillAudio(
    "decadexuanfeng",
    ["PSboss_lvbu2", "PSboss_lvbu3", "PSboss_lvbu4", "PSshengui"],
    "xuanfeng_boss_lvbu3"
  );
  //改变虎牢关吕布“无双”的配音
  changeSkillAudio(
    "wushuang",
    [
      "PSboss_lvbu1",
      "PSboss_lvbu2",
      "PSboss_lvbu3",
      "PSboss_lvbu4",
      "PSshengui",
    ],
    "ext:PS武将/audio/skill:8"
  );
  //改变PS曹操“护驾”的配音
  changeSkillAudio("hujia", "PScaocao", "hujia_re_caocao");
  //改变PS刘备“激将”的配音
  changeSkillAudio("rejijiang", "PSliubei", "jijiang1_re_liubei");
  //改变PS戏志才“天妒”的配音
  changeSkillAudio("tiandu", "PSxizhicai", "tiandu_xizhicai");
  //改变PS钟会“保族”的配音
  changeSkillAudio("clanbaozu", "PSzhonghui", "clanbaozu_clan_zhonghui");
  //改变PS钟琰“保族”的配音
  changeSkillAudio("clanbaozu", "PSzhongyan", "clanbaozu_clan_zhongyan");
  //改变PS曹丕“颂威”的配音
  changeSkillAudio("songwei", "PScaopi", "songwei_re_caopi");
  //改变PS赵襄的配音
  changeSkillAudio(["refanghun", "ollongdan"], "PSzhaoxiang", [
    "ext:PS武将/audio/skill/PSfanghun1",
    "ext:PS武将/audio/skill/PSfanghun2",
  ]);
  changeSkillAudio(["refanghun", "ollongdan"], "PSzhaoxiang2", [
    "ext:PS武将/audio/skill/PSfanghun_PSzhaoxiang21",
    "ext:PS武将/audio/skill/PSfanghun_PSzhaoxiang22",
  ]);
  changeSkillAudio("PSfushi", "PSzhaoxiang2", [
    "ext:PS武将/audio/skill/PSfushi_PSzhaoxiang21",
    "ext:PS武将/audio/skill/PSfushi_PSzhaoxiang22",
  ]);
  //改变PS神邓艾的配音
  changeSkillAudio("dccuixin", "PSshen_dengai2", [
    "ext:PS武将/audio/skill/cuixin_PSshen_dengai21",
    "ext:PS武将/audio/skill/cuixin_PSshen_dengai22",
  ]);
});
