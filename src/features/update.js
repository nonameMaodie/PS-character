import { VERSION } from "../version.js"
import { checkVersion } from "../utils/checkVersion.js"
import { setConfig, onArenaReady } from "../utils/hooks.js"
import { lib, ui, game } from "noname"

const CONFIG = {
    giteeOwner: 'ninemangos',
    githubOwner: 'nonameMaodie',
    repo: 'PS-character',
    repoTranlate: 'PS武将',
    access_token: '11e1e5d1930f34c6cec7f3f00086f732'
};

/**
 * 创建进度条
 * @param { string } [title] 标题
 * @param { string | number } [max] 最大值
 * @param { string } [fileName] 文件名
 * @param { string | number } [value] 当前进度
 * @returns { progress }
 */
function createProgress(title, max, fileName, value) {
    /** @type { progress } */
    // @ts-expect-error ignore
    const parent = ui.create.div(ui.window, {
        textAlign: "center",
        width: "300px",
        height: "150px",
        left: "calc(50% - 150px)",
        top: "auto",
        bottom: "calc(50% - 75px)",
        zIndex: "10",
        boxShadow: "rgb(0 0 0 / 40%) 0 0 0 1px, rgb(0 0 0 / 20%) 0 3px 10px",
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))",
        borderRadius: "8px",
        overflow: "hidden scroll",
    });

    // 可拖动
    parent.className = "dialog";
    Object.setPrototypeOf(parent, lib.element.Dialog.prototype);

    const container = ui.create.div(parent, {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
    });

    container.ontouchstart = ui.click.dialogtouchStart;
    container.ontouchmove = ui.click.touchScroll;
    // @ts-expect-error ignore
    container.style.WebkitOverflowScrolling = "touch";
    parent.ontouchstart = ui.click.dragtouchdialog;

    const caption = ui.create.div(container, "", title, {
        position: "relative",
        paddingTop: "8px",
        fontSize: "20px",
    });

    ui.create.node("br", container);

    const tip = ui.create.div(container, {
        position: "relative",
        paddingTop: "8px",
        fontSize: "20px",
        width: "100%",
    });

    const file = ui.create.node("span", tip, "", fileName);
    file.style.width = file.style.maxWidth = "100%";
    ui.create.node("br", tip);
    const index = ui.create.node("span", tip, "", String(value || "0"));
    ui.create.node("span", tip, "", "/");
    const maxSpan = ui.create.node("span", tip, "", String(max || "未知"));

    ui.create.node("br", container);

    const progress = ui.create.node("progress.progress", container);
    progress.setAttribute("value", value || "0");
    progress.setAttribute("max", max);

    parent.getTitle = () => caption.innerText;
    parent.setTitle = title => (caption.innerHTML = title);
    parent.getFileName = () => file.innerText;
    parent.setFileName = name => (file.innerHTML = name);
    parent.getProgressValue = () => progress.value;
    parent.setProgressValue = value => (progress.value = index.innerHTML = value);
    parent.getProgressMax = () => progress.max;
    parent.setProgressMax = max => (progress.max = maxSpan.innerHTML = max);
    parent.autoSetFileNameFromArray = fileNameList => {
        if (fileNameList.length > 2) {
            parent.setFileName(
                fileNameList
                    .slice(0, 2)
                    .concat(`......等${fileNameList.length - 2}个文件`)
                    .join("<br/>")
            );
        } else if (fileNameList.length == 2) {
            parent.setFileName(fileNameList.join("<br/>"));
        } else if (fileNameList.length == 1) {
            parent.setFileName(fileNameList[0]);
        } else {
            parent.setFileName("当前没有正在下载的文件");
        }
    };
    return parent;
}

/**
 * 创建对话框
 * @param { string } title 标题
 * @param { string } prompt 提示
 * @param { string } content 内容
 * @param { Array<{text: string, onclick?: function}> } buttons 按钮数组
 * @returns { object }
 */
function createDialog(title, prompt, content, buttons = [{ text: "确定" }]) {
    const dialog = ui.create.div(ui.window, {
        textAlign: "center",
        width: "500px",
        height: "400px",
        left: "calc(50% - 250px)",
        top: "auto",
        bottom: "calc(50% - 200px)",
        zIndex: "10",
        boxShadow: "rgb(0 0 0 / 40%) 0 0 0 1px, rgb(0 0 0 / 20%) 0 3px 10px",
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))",
        borderRadius: "8px",
        backdropFilter: "blur(5px)"
    });

    // 可拖动
    dialog.className = "dialog";
    Object.setPrototypeOf(dialog, lib.element.Dialog.prototype);

    // 创建dialog标题
    const dialog_title = ui.create.div(dialog, {
        height: "40px",
        width: "100%",
        left: "0",
        paddingTop: "15px",
        boxSizing: "border-box",
        fontWeight: "700",
        fontSize: "1.3em",
    });
    dialog_title.innerHTML = title;

    // 创建dialog提示
    const dialog_prompt = ui.create.div(dialog, {
        height: "30px",
        width: "100%",
        left: "0",
        lineHeight: "30px",
        top: "40px",
        fontSize: "0.92em",
        borderWidth: "0 0 1px",
        borderStyle: "solid",
        borderImage: "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2) 10%, rgba(255, 255, 255, 0.2) 90%, transparent) 0 1 100%"
    });
    dialog_prompt.innerHTML = prompt;

    // 创建dialog内容
    const dialog_content = ui.create.div(dialog, {
        height: "280px",
        width: "100%",
        left: "0",
        top: "70px",
        overflow: "hidden scroll",
    });
    const dialog_content_shadow = dialog_content.attachShadow({ mode: "open" })
    const style = document.createElement("style");
    style.textContent = `
        ul {
            text-align: left;
            line-height: 1.7;
        }`;
    dialog_content_shadow.appendChild(style);
    dialog_content_shadow.innerHTML += content;

    // 创建dialog按钮容器
    const dialog_buttons = ui.create.div(dialog, {
        height: "50px",
        width: "100%",
        left: "0",
        top: "350px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "50px",
    });

    if ((!Array.isArray(buttons)) || !buttons.length) buttons = [{ text: "确定", onclick: () => { } }];

    for (const b of buttons) {
        const btn = ui.create.div(dialog_buttons, {
            background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.35))",
            color: "white",
            borderRadius: "4px",
            padding: "8px 16px",
            cursor: "pointer",
            position: "unset"
        });
        btn.innerHTML = b.text;
        btn.onclick = () => {
            dialog.remove();
            b.onclick && b.onclick();
        };
    }
    return dialog;
}

/**
 * 将文件大小转换为易读的格式
 * @param { number } limit 字节数
 * @returns 
 */
function parseSize(limit) {
    let size = "";
    if (limit < 1 * 1024) {
        // 小于1KB，则转化成B
        size = limit.toFixed(2) + "B";
    } else if (limit < 1 * 1024 * 1024) {
        // 小于1MB，则转化成KB
        size = (limit / 1024).toFixed(2) + "KB";
    } else if (limit < 1 * 1024 * 1024 * 1024) {
        // 小于1GB，则转化成MB
        size = (limit / (1024 * 1024)).toFixed(2) + "MB";
    } else {
        // 其他转化成GB
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    }

    // 转成字符串
    let sizeStr = size + "";
    // 获取小数点处的索引
    let index = sizeStr.indexOf(".");
    // 获取小数点后两位的值
    let dou = sizeStr.slice(index + 1, 2);
    // 判断后两位是否为00，如果是则删除00
    if (dou == "00") {
        return sizeStr.slice(0, index) + sizeStr.slice(index + 3, 2);
    }
    return size;
}

/**
 * 将Markdown转换为HTML
 * @param { string } text Markdown字符串
 * @returns { Promise<string> }
 */
async function markdownToHTML(text) {
    const response = await fetch("https://gitee.com/api/v5/markdown", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
    })
    const html = await response.json();
    return html;
}

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
 * @returns { Promise<ArrayBuffer> }
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
    let filename;
    try {
        // @ts-expect-error ignore
        filename = response.headers.get("Content-Disposition").split(";")[1].split("=")[1];
    } catch {
        /* empty */
    }
    let receivedBytes = 0;
    let chunks = [];

    while (true) {
        // 使用ReadableStream来获取部分数据并计算进度
        const { done, value } = await reader.read();

        if (done) {
            break;
        }

        chunks.push(value);
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

    // 合并所有数据块
    const array = new Uint8Array(receivedBytes);
    let offset = 0;

    for (const chunk of chunks) {
        array.set(new Uint8Array(chunk), offset);
        offset += chunk.byteLength;
    }
    const { buffer } = array

    // 返回ArrayBuffer
    return buffer;
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
            miniCompatibility: data.name?.split('-')?.at(-1), // 最低适配版本号
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
        const localVersion = VERSION;

        // 2. 获取远程版本
        const remoteInfo = await getRemoteLatestVersion();
        if (!remoteInfo) return { updated: false };
        const { remoteVersion, text, miniCompatibility, created_at } = remoteInfo;

        const { giteeOwner, repo, repoTranlate, access_token } = CONFIG;
        if (checkVersion(localVersion, remoteVersion) < 0) {
            const html = await markdownToHTML(text);

            const result = await new Promise((resolve) => {
                createDialog("发现新版本，是否更新？", `（更新时间：${created_at}，最低适配：${miniCompatibility}）`, html, [
                    { text: "取消", onclick: () => { resolve(false) } },
                    { text: "更新", onclick: () => { resolve(true) } },
                ])
            });

            if (result) {

                // 3. 获取差异文件列表
                const files = await getTagsDiffFiles(localVersion, remoteVersion);
                // 4. 删除已删除的文件
                for (const file of files) {
                    if (file.status === 'removed') {
                        files.remove(file);
                        try {
                            await game.promises.removeFile(`${lib.assetURL}extension/${repoTranlate}/${file.filename}`)
                            console.log("已删除文件：", `【${file.filename}】`);
                        } catch {/*empty*/ }
                    }
                }
                // 5. 下载新增或被修改的文件
                for (const file of files) {
                    const { filename } = file;
                    const progress = createProgress("正在下载：\n", 1, filename);
                    const downoal_url = `https://gitee.com/api/v5/repos/${giteeOwner}/${repo}/raw/${filename}?access_token=${access_token}&ref=${remoteVersion}`;
                    const buffer = await request(downoal_url, (receivedBytes, total, filename) => {
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
                    await game.promises.writeFile(buffer, `${lib.assetURL}extension/${repoTranlate}`, filename).catch(async e => { throw e });
                    console.log(`下载【${filename}】完成. 文件大小: ${parseSize(buffer.byteLength)}`);
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
