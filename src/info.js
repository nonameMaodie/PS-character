import { lib } from "noname";

/**
* @type {{
*  name: string
*  author: string
*  intro: string
*  version: string
*  minCompatibility: string
*  diskURL: URL
*  forumURL: URL
* }}
*/
export const info = await (await fetch(lib.assetURL + "extension/PS武将/info.json")).json();