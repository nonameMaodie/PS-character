/**
 * 版本检查
 * @param {string} currentVersion 当前版本
 * @param {string} targetVersion 目标版本
 * @returns {boolean} 如果当前版本小于目标版本，则返回-1；等于目标版本，则返回0；大于目标版本，则返回1
 */
export function checkVersion(currentVersion, targetVersion) {
    // 处理版本号格式，移除可能的 "v" 前缀
    const cleanCurrent = currentVersion.replace(/^v/i, '');
    const cleanTarget = targetVersion.replace(/^v/i, '');

    // 将版本号分割成数组
    const currentParts = cleanCurrent.split('.').map(Number);
    const targetParts = cleanTarget.split('.').map(Number);

    // 找出较长的版本号长度
    const maxLength = Math.max(currentParts.length, targetParts.length);

    // 按位比较版本号
    for (let i = 0; i < maxLength; i++) {
        // 如果某一位不存在，默认为0
        const currentNum = currentParts[i] || 0;
        const targetNum = targetParts[i] || 0;

        if (currentNum > targetNum) {
            return 1; // 当前版本大于目标版本
        } else if (currentNum < targetNum) {
            return -1; // 当前版本小于目标版本
        }
        // 如果相等，继续比较下一位
    }

    // 所有位都相等
    return 0;
}