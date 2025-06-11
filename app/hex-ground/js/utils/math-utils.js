// 路徑：hex-ground/js/utils/math-utils.js

/**
 * 计算两点间距离
 * @param {number} x1 - 点1的X坐标
 * @param {number} y1 - 点1的Y坐标
 * @param {number} x2 - 点2的X坐标
 * @param {number} y2 - 点2的Y坐标
 * @returns {number} 两点间距离
 */
export function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 坐标变换：屏幕坐标转地图坐标
 * @param {number} screenX - 屏幕X坐标
 * @param {number} screenY - 屏幕Y坐标
 * @param {number} offsetX - X轴偏移量
 * @param {number} offsetY - Y轴偏移量
 * @param {number} scale - 缩放比例
 * @returns {Object} 地图坐标 {x, y}
 */
export function screenToMap(screenX, screenY, offsetX, offsetY, scale) {
    return {
        x: (screenX - offsetX) / scale,
        y: (screenY - offsetY) / scale
    };
}

/**
 * 坐标变换：地图坐标转屏幕坐标
 * @param {number} mapX - 地图X坐标
 * @param {number} mapY - 地图Y坐标
 * @param {number} offsetX - X轴偏移量
 * @param {number} offsetY - Y轴偏移量
 * @param {number} scale - 缩放比例
 * @returns {Object} 屏幕坐标 {x, y}
 */
export function mapToScreen(mapX, mapY, offsetX, offsetY, scale) {
    return {
        x: mapX * scale + offsetX,
        y: mapY * scale + offsetY
    };
}

/**
 * 限制值在指定范围内
 * @param {number} value - 输入值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 限制后的值
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}