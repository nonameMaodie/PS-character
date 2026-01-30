import { ui, lib } from "noname";

class ChangelogShadowDOM {
  static instance = null;

  constructor(hostElement, data, extname, onClose = () => { }) {
    if (ChangelogShadowDOM.instance) {
      ChangelogShadowDOM.instance.close();
      ChangelogShadowDOM.instance = null;
    }
    this.host = hostElement;
    this.data = data;
    this.extname = extname;
    this.onClose = onClose;
    this.shadow = this.host.attachShadow({ mode: "open" });
    this.render();
    ChangelogShadowDOM.instance = this;
  }

  // 创建样式
  createStyles() {
    const style = document.createElement("style");
    style.textContent = `
          ::-webkit-scrollbar {
            display: none;
          }

					.container {
            padding: 30px;
            box-shadow: 0 10px 30px rgb(0 0 0 / 50%);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            position: absolute;
            top: 10%;
            right: 17%;
            width: 60%;
            height: 70%;
            overflow-y: scroll;
            border-radius: 12px;
            background: rgba(0, 0, 0, 0.65);
            z-index: 100;
					}

					header {
						text-align: center;
						margin-bottom: 40px;
						padding-bottom: 20px;
						border-bottom: 1px solid rgba(255, 255, 255, 0.2);
					}

          .close {
            position: fixed;
            top: calc(10% - 12px);
            right: calc(17% - 12px);
            width: 40px;
            height: 40px;
            line-height: 40px;
            z-index: 100;
            text-align: center;
            border-radius: 50%;
            background: #b1b1b1;
            cursor: pointer;
            font-size: 18px;
            transition: background 0.3s ease;
          }

          .close:hover {
            background: #f00;
          }

          .close::before,
          .close:after {
            content: "";
            position: absolute;
            background: #fff;
            width: 70%;
            height: 16%;
            border-radius: 5px;
            left: 15%;
            top: 50%;
            transform: translate(0, -50%) rotate(45deg);
          }

          .close:after {
            transform: translate(0, -50%) rotate(-45deg);
          }

					h1 {
						font-size: 2.5rem;
						margin-bottom: 10px;
						background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
						text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
					}

					.subtitle {
						font-size: 1.1rem;
						color: #aaa;
						margin-top: 10px;
					}

					.timeline {
						position: relative;
					}

					.timeline::before {
						content: '';
						position: absolute;
						left: 30px;
						top: 0;
						bottom: 0;
						width: 2px;
						background: linear-gradient(to bottom, #ff6b6b, #48dbfb);
						border-radius: 2px;
					}

					.version-card {
						position: relative;
						margin-bottom: 40px;
						padding-left: 70px;
						animation: fadeIn 0.6s ease-out forwards;
						opacity: 0;
						transform: translateY(20px);
					}

					@keyframes fadeIn {
						to {
							opacity: 1;
							transform: translateY(0);
						}
					}

					.version-card:nth-child(1) {
						animation-delay: 0.1s;
					}

					.version-card:nth-child(2) {
						animation-delay: 0.2s;
					}

					.version-card:nth-child(3) {
						animation-delay: 0.3s;
					}

					.version-card:nth-child(4) {
						animation-delay: 0.4s;
					}

					.version-card:nth-child(5) {
						animation-delay: 0.5s;
					}

					.version-marker {
						position: absolute;
						left: 22px;
						top: 0;
						width: 20px;
						height: 20px;
						border-radius: 50%;
						background: #ff6b6b;
						border: 3px solid rgba(255, 255, 255, 0.8);
						z-index: 1;
						box-shadow: 0 0 10px rgba(255, 107, 107, 0.7);
					}

					.version-header {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 15px;
					}

					.version-number {
						font-size: 1.5rem;
						font-weight: bold;
						color: #ffd700;
					}

					.version-date {
						color: #aaa;
						font-size: 0.9rem;
					}

					.changes-list {
						list-style-type: none;
						background: rgba(30, 30, 30, 0.7);
						border-radius: 8px;
						padding: 15px;
						border-left: 4px solid #48dbfb;
					}

					.changes-list li {
						padding: 8px 0;
						position: relative;
						padding-left: 25px;
					}

					.changes-list li::before {
						content: '•';
						position: absolute;
						left: 10px;
						color: #ff9ff3;
						font-size: 1.2rem;
					}

					.special-note {
						font-style: italic;
            font-weight: 700;
            color: #ff9ff3;
					}

					footer {
						text-align: center;
						margin-top: 40px;
						padding-top: 20px;
						border-top: 1px solid rgba(255, 255, 255, 0.2);
						color: #888;
						font-size: 0.9rem;
					}

					@media (max-width: 768px) {
						.container {
							padding: 20px;
						}

						h1 {
							font-size: 2rem;
						}

						.timeline::before {
							left: 20px;
						}

						.version-card {
							padding-left: 50px;
						}

						.version-marker {
							left: 12px;
						}

						.version-header {
							flex-direction: column;
							align-items: flex-start;
						}

						.version-date {
							margin-top: 5px;
						}
					}
				`;
    return style;
  }

  // 生成更新日志HTML
  generateChangelog() {
    const container = ui.create.div(".container");

    // 创建header
    const header = document.createElement("header");

    const h1 = document.createElement("h1");
    h1.textContent = `《${this.extname}》更新内容`;
    const subtitle = document.createElement("p");
    subtitle.className = "subtitle";
    subtitle.textContent = "记录每一次更新";

    header.appendChild(h1);
    header.appendChild(subtitle);
    container.appendChild(header);

    // 创建timeline
    const timeline = ui.create.div(".timeline#changelog-timeline");

    const characters = Object.keys(lib.characterPack.PScharacter || {}).concat(
      Object.keys(lib.characterPack.PSsp_character || {})
    );
    this.data.forEach((item, index) => {
      const versionCard = ui.create.div(".version-card");
      versionCard.style.animationDelay = `${0.1 * (index + 1)}s`;

      const marker = ui.create.div(".version-marker");
      const header = ui.create.div(".version-header");
      const versionNumber = ui.create.div(".version-number");
      versionNumber.textContent = item.version;
      const versionDate = ui.create.div(".version-date");
      versionDate.textContent = item.date;

      header.appendChild(versionNumber);
      header.appendChild(versionDate);

      const changesList = document.createElement("ul");
      changesList.className = "changes-list";


      for (let change of item.changes) {
        if (['/setPlayer/', '/setCard/'].includes(change)) continue;
        const listItem = document.createElement("li");

        characters.forEach(j => {
          if ((change.includes('新增') || change.includes('修复') || change.includes('重做')) && change.includes(lib.translate[j])) {
            change = change
              .replace(new RegExp(lib.translate[j], 'g'), `<font color="#ff9800">${lib.translate[j]}</font>`)
          }
        });

        listItem.innerHTML = change;
        changesList.appendChild(listItem);
      }

      versionCard.appendChild(marker);
      versionCard.appendChild(header);
      versionCard.appendChild(changesList);
      timeline.appendChild(versionCard);
    });

    container.appendChild(timeline);

    // 创建footer
    const footer = document.createElement("footer");
    const footerText = document.createElement("p");
    footerText.textContent = "没有更多了";
    footer.appendChild(footerText);
    container.appendChild(footer);

    return container;
  }

  // 生成关闭按钮
  generateCloseButton() {
    const close = ui.create.div(".close");
    close.onclick = () => this.close();
    return close;
  }

  // 渲染方法
  render() {
    // 添加样式
    this.shadow.appendChild(this.createStyles());

    // 添加内容
    this.shadow.appendChild(this.generateChangelog());

    // 添加关闭按钮
    this.shadow.appendChild(this.generateCloseButton());
  }
  close() {
    this.host.remove();
    this.onClose && this.onClose();
  }
}

export function showChangelog(data, extname, onClose = () => { }) {
  const changelog = ui.create.div(ui.window);
  changelog.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
  `;
  new ChangelogShadowDOM(changelog, data, extname, onClose);
}


/**
 * 创建进度条
 * @param { string } [title] 标题
 * @param { string | number } [max] 最大值
 * @param { string } [fileName] 文件名
 * @param { string | number } [value] 当前进度
 * @returns { progress }
 */
export function createProgress(title, max, fileName, value) {
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
export function createDialog(title, prompt, content, buttons = [{ text: "确定" }]) {
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
        ul, ol {
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