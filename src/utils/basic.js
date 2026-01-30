import { lib, game, ui, get, ai, _status } from 'noname'

let basicPath = lib.init.getCurrentFileLocation(import.meta.url);

const basic = {
  extensionDirectoryPath: basicPath.slice(0, basicPath.lastIndexOf('/src/utils/basic.js')),
  /**
   * 对象深拷贝
   * @param { object } obj 对象
   * @returns { Promise<object> }
   */
  deepClone: function deepClone(obj) {
    return new Promise((resolve) => {
      const { port1, port2 } = new MessageChannel();
      port1.postMessage(obj);
      port2.onmessage = (msg) => {
        resolve(msg.data);
      };
    });
  }
};

export default basic;