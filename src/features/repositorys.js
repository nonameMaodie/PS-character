import { info } from "../info.js"
import { setConfig } from "../utils/hooks.js"

setConfig({
    "repository": {
        clear: true,
        name: `<ins style="color:#fe7300">Gitee仓库地址</ins>`,
        async onclick() {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(info.diskURL);
                alert('复制成功！');
            } else {
                alert('复制失败！');
            }
        }
    },
    "repository2": {
        clear: true,
        name: `<ins style="color:#ff79c6">Github仓库地址</ins>`,
        async onclick() {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(info.forumURL);
                alert('复制成功！');
            } else {
                alert('复制失败！');
            }
        }
    },
})