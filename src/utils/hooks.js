const arenaReadyHooks = [];
const contentHooks = [];
const prepareHooks = [];
const precontentHooks = [];
const preConfigObj = {};
const configObj = {};
const helpObj = {};
export const hooks = {
  arenaReadyHooks,
  contentHooks,
  prepareHooks,
  precontentHooks,
  get configObj() {
    return { ...preConfigObj, ...configObj }
  },
  helpObj,
};
export function onArenaReady(func) {
  arenaReadyHooks.push(func);
}
export function onContent(func) {
  contentHooks.push(func);
}
export function onPrepare(func) {
  prepareHooks.push(func);
}
export function onPrecontent(func) {
  precontentHooks.push(func);
}
export function setPreConfig(obj) {
  Object.assign(preConfigObj, obj);
}
export function setConfig(obj) {
  Object.assign(configObj, obj);
}
export function setHelp(obj) {
  Object.assign(helpObj, obj);
}
