import { ui } from "noname";

class ChangelogShadowDOM {
  static instance = null;

  constructor(hostElement, data, onClose = () => { }) {
    if (ChangelogShadowDOM.instance) {
      ChangelogShadowDOM.instance.close();
      ChangelogShadowDOM.instance = null;
    }
    this.host = hostElement;
    this.data = data;
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
    h1.textContent = "《PS武将》更新内容";
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

export function showChangelog(data, onClose = () => { }) {
  const changelog = ui.create.div(ui.window);
  changelog.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
  `;
  new ChangelogShadowDOM(changelog, data, onClose);
}
