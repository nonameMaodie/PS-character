import { info } from "../info.js"
import { checkVersion } from "../utils/checkVersion.js"
import { setConfig, onArenaReady } from "../utils/hooks.js"
import { convertMarkdownToHTML, convertBase64ToArrayBuffer, convertNumToSize } from "../utils/convert.js"
import { createProgress, createDialog } from "../utils/dom.js"
import { lib, ui, game } from "noname"

const CONFIG = {
    giteeOwner: 'ninemangos',
    githubOwner: 'nonameMaodie',
    repo: 'PS-character',
    repoTranlate: 'PS武将'
};

/**
 * 创建一个超时请求
 * @param { string } url 请求地址
 * @param { object } options 请求选项
 * @param { number } timeout 超时时间
 * @returns { Promise<Response> }
 */
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
    // 创建 AbortController 实例
    const controller = new AbortController();
    const { signal } = controller;

    // 设置超时定时器
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal, // 传入 signal
        });

        clearTimeout(timeoutId); // 清除定时器

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        clearTimeout(timeoutId); // 确保清除定时器

        if (error.name === 'AbortError') {
            throw new Error(`请求超时 (${timeout}ms)`);
        }

        throw error; // 重新抛出其他错误
    }
}

/**
 * 请求下载文件
 * @param { string } url 下载链接
 * @param { (receivedBytes: number, total: number, filename: string) => void } onProgress 进度更新回调
 * @param { object } options fetch请求配置
 * @returns { Promise<object> } 解析后的JSON数据
 */
async function request(url, onProgress, options = {}) {
    const response = await fetch(
        url,
        Object.assign({
            // 告诉服务器我们期望得到范围请求的支持
            headers: { Range: "bytes=0-" },
        }, options)
    );

    if (!response.ok) {
        console.error(response);
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    // @ts-expect-error ignore
    let total = parseInt(response.headers.get("Content-Length"), 10);
    // 如果服务器未返回Content-Length，则无法准确计算进度
    // @ts-expect-error ignore
    if (isNaN(total)) { total = null; }
    // @ts-expect-error ignore
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let jsonString = '';
    let filename;
    try {
        // @ts-expect-error ignore
        filename = response.headers.get("Content-Disposition").split(";")[1].split("=")[1];
    } catch {
        /* empty */
    }
    let receivedBytes = 0;

    try {
        while (true) {
            // 使用ReadableStream来获取部分数据并计算进度
            const { done, value } = await reader.read();
            if (done) break;

            jsonString += decoder.decode(value, { stream: true });

            receivedBytes += value.length;
            if (typeof onProgress == "function") {
                if (total) {
                    // const progress = (receivedBytes / total) * 100;
                    onProgress(receivedBytes, total, filename);
                } else {
                    onProgress(receivedBytes, void 0, filename);
                }
            }
        }

        jsonString += decoder.decode();
        return JSON.parse(jsonString);
    } finally {
        reader.releaseLock();
    }
}

/**
 * 获取远程最新版本
 * @returns { Promise<{remoteVersion: string; text: string; created_at: string;} | null> }
 */
async function getRemoteLatestVersion() {
    const tryGetRemoteLatestVersion = async function (url) {
        const response = await fetchWithTimeout(url, null, 3000);
        const data = await response.json();
        return {
            remoteVersion: data.tag_name, // 版本号，如：v1.0.0
            text: data.body, // 更新内容，markdown格式
            minCompatibility: data.name?.split('-')?.at(-1), // 最低适配版本号
            created_at: (new Date(data.created_at)).toLocaleDateString('zh-CN') // 更新时间
        };
    };
    try {
        const { giteeOwner, githubOwner, repo } = CONFIG;
        try {
            return await tryGetRemoteLatestVersion(`https://gitee.com/api/v5/repos/${giteeOwner}/${repo}/releases/latest`);
        } catch (error) {
            console.error('获取Gitee远程版本失败：', error);
            return await tryGetRemoteLatestVersion(`https://api.github.com/repos/${githubOwner}/${repo}/releases/latest`);
        }
    } catch (error) {
        console.error('获取Github远程版本失败：', error);
        alert('无法连接到服务器：' + error.message);
        return null;
    }
}

/**
 * 获取两个标签之间的差异文件列表
 * @param { string } baseTag 起始标签
 * @param { string } headTag 结束标签
 * @returns { Promise<Array<{ filename: string, status: string }>> } 差异文件列表
 */
async function getTagsDiffFiles(baseTag, headTag) {
    const { giteeOwner, repo } = CONFIG;

    const diffResponse = await fetch(`https://gitee.com/api/v5/repos/${giteeOwner}/${repo}/compare/${baseTag}...${headTag}`)
    const { files } = await diffResponse.json();

    return files
}

let checking = false;
/**
 * 检查更新
 * @returns { {updated: boolean, newVersion: string | undefined} }
 */
async function checkForUpdates(showAlert = true) {
    try {
        if (checking) {
            alert("正在检查更新中，请勿重复操作");
            return { updated: false };
        }
        checking = true;
        if (["http://localhost:8080/", "http://127.0.0.1:8080/"].includes(location.href)) {
            if (!confirm("检测到你在以开发模式运行游戏，请先在vite.config.ts里关闭热重载，避免写入文件失败（若你已关闭，此提示可以忽略）。是否继续？")) return { updated: false };
        }
        // 1. 获取本地版本
        const localVersion = info.version;

        // 2. 获取远程版本
        const remoteInfo = await getRemoteLatestVersion();
        if (!remoteInfo) return { updated: false };
        const { remoteVersion, text, minCompatibility, created_at } = remoteInfo;

        const { giteeOwner, repo, repoTranlate } = CONFIG;
        if (checkVersion(localVersion, remoteVersion) < 0) {
            const html = await convertMarkdownToHTML(text);

            const setChoiceList = function (resolve) {
                const result = [
                    { text: "取消", onclick: () => { resolve(false) } },
                    { text: "更新", onclick: () => { resolve(true) } },
                ];
                if (!showAlert && game.getExtensionConfig(CONFIG.repoTranlate, "autoCheckForUpdates")) {
                    result.unshift({
                        text: "不再提醒",
                        onclick: () => {
                            game.saveExtensionConfig(CONFIG.repoTranlate, "autoCheckForUpdates", false);
                            resolve(false);
                        }
                    })
                }
                return result;
            }
            const result = await new Promise((resolve) => {
                createDialog("发现新版本，是否更新？", `（更新时间：${created_at}，最低适配：${minCompatibility}）`, html, setChoiceList(resolve))
            });

            if (result) {

                // 3. 获取差异文件列表
                const files = await getTagsDiffFiles(localVersion, remoteVersion);
                // 4. 删除最新版本已被删除的文件
                for (const file of files) {
                    if (file.status === 'removed') {
                        files.remove(file);
                        try {
                            await game.promises.removeFile(`${lib.assetURL}extension/${repoTranlate}/${file.filename}`)
                            console.log("已删除文件：", `【${file.filename}】`);
                        } catch {/*empty*/ }
                    }
                }
                // 5. 下载最新版本的新增或被修改的文件
                for (const file of files) {
                    const { filename } = file;
                    const progress = createProgress("正在下载：\n", 1, filename);
                    const url = `https://gitee.com/api/v5/repos/${giteeOwner}/${repo}/contents/${filename}?ref=${remoteVersion}`;
                    const data = await request(url, (receivedBytes, total, filename) => {
                        if (typeof filename == "string") {
                            progress.setFileName(filename);
                        }
                        let received = 0,
                            max = 0;
                        if (total) {
                            max = +(total / (1024 * 1024)).toFixed(1);
                        } else {
                            max = 1000;
                        }
                        received = +(receivedBytes / (1024 * 1024)).toFixed(1);
                        if (received > max) {
                            max = received;
                        }
                        progress.setProgressMax(max);
                        progress.setProgressValue(received);
                    });
                    if (data.content && typeof data.content === "string") {
                        const buffer = await convertBase64ToArrayBuffer(data.content);
                        await game.promises.writeFile(buffer, `${lib.assetURL}extension/${repoTranlate}`, filename).catch(async e => { throw e });
                        console.log(`下载【${filename}】完成. 文件大小: ${convertNumToSize(data.size ?? buffer.byteLength)}`);
                    }
                    progress.remove();
                }

                // 6. 提示更新完成，是否重启
                if (confirm("更新完成，是否重启？")) {
                    game.reload();
                }
            }
            return { updated: true, newVersion: remoteVersion };
        } else {
            console.log(`当前已是最新版本`);
            if (showAlert) alert(`当前已是最新版本`);
            return { updated: false };
        }
    } catch (error) {
        console.error('更新检查失败:', error.message);
        if (showAlert) alert(`检查更新失败：${error.message}`);
        return { updated: false };
    } finally {
        checking = false;
    }
}

setConfig({
    checkForUpdates: {
        clear: true,
        name: '<button>检查更新</button>',
        onclick: checkForUpdates,
    }
})

setConfig({
    autoCheckForUpdates: {
        name: "自动检查更新",
        intro: "开启后每次启动游戏时检查更新",
        onclick(item) {
            game.saveExtensionConfig(CONFIG.repoTranlate, "autoCheckForUpdates", item);
        },
    },
});

onArenaReady(function () {
    if (game.getExtensionConfig(CONFIG.repoTranlate, "autoCheckForUpdates")) checkForUpdates(false);
})
