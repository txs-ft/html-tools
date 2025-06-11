/**
 * 路徑：hex-ground/js/core/hex-door.js
 * 代表六边形房间的一扇门
 */
export class HexDoor {
    /**
     * 创建一扇门
     * @param {number} x - 门的X坐标
     * @param {number} y - 门的Y坐标
     * @param {number} angle - 门的角度(弧度)
     * @param {HexRoom} room1 - 第一个房间
     * @param {HexRoom} room2 - 第二个房间
     */
    constructor(x, y, angle, room1, room2) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.isUsable = false;
        this.room1 = room1;
        this.room2 = room2;
        this.hover = false;
    }

    /**
     * 检查点击是否在门上
     * @param {number} x - 点击的X坐标
     * @param {number} y - 点击的Y坐标
     * @param {number} threshold - 阈值距离
     * @returns {boolean} 是否点击到门
     */
    isPointInside(x, y, threshold) {
        const dx = this.x - x;
        const dy = this.y - y;
        return Math.sqrt(dx * dx + dy * dy) < threshold;
    }

    /**
     * 创建储存用的数据
     */
    createSaveData() {
        return {
            "room1": { "r": this.room1.row, "c": this.room1.col },
            "room2": { "r": this.room2.row, "c": this.room2.col }
        };
    }
}