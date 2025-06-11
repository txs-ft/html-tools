/**
 * 路徑：hex-ground/js/core/hex-room.js
 * 代表一个六边形的房间，最多有六扇门
 */
export class HexRoom {
    /**
     * 创建一个六边形房间
     * @param {number} col - 列索引
     * @param {number} row - 行索引
     * @param {number} x - 中心点X坐标
     * @param {number} y - 中心点Y坐标
     * @param {number} size - 六边形大小
     */
    constructor(col, row, x, y, size) {
        this.col = col;
        this.row = row;
        this.x = x;
        this.y = y;
        this.size = size;
        this.doors = [];
        this.id = `${String.fromCharCode(65 + col)}${row + 1}`;
        this.hover = false;
    }
    
    /**
     * 添加一扇门
     * @param {HexDoor} door - 要添加的门
     */
    addDoor(door) {
        this.doors.push(door);
    }
    
    /**
     * 检查点击是否在房间上
     * @param {number} x - 点击的X坐标
     * @param {number} y - 点击的Y坐标
     * @returns {boolean} 是否点击到房间
     */
    isPointInside(x, y) {
        // 简化为检查点到六边形中心的距离
        const dx = this.x - x;
        const dy = this.y - y;
        return Math.sqrt(dx * dx + dy * dy) < this.size;
    }
}