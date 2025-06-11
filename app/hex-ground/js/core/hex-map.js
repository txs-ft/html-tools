import { HexRoom } from './hex-room.js';
import { HexDoor } from './hex-door.js';

/**
 * 路徑：hex-ground/js/core/hex-map.js
 * 代表一个六边形网格地图
 */
export class HexMap {
    /**
     * 创建一个六边形网格地图
     * @param {number} cols - 列数
     * @param {number} rows - 行数
     * @param {number} hexSize - 六边形大小
     */
    constructor(cols, rows, hexSize) {
        this.cols = cols;
        this.rows = rows;
        this.hexSize = hexSize;
        this.hexWidth = hexSize * 2;
        this.hexHeight = hexSize * Math.sqrt(3);
        this.rooms = [];
        this.doors = [];
        
        this.createGrid();
    }

    /**
     * 创建网格和门
     */
    createGrid() {
        // 创建所有房间
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                // 计算中心点坐标
                const x = c * this.hexWidth * 0.75 + this.hexWidth / 2;
                const y = r * this.hexHeight + (c % 2) * (this.hexHeight / 2) + this.hexHeight / 2;
                
                const room = new HexRoom(c, r, x, y, this.hexSize);
                this.rooms.push(room);
            }
        }
        
        // 创建门（相邻房间之间）
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                // 先处理横轴上的房门
                const room = this.getRoom(c, r);
                if (c < this.cols - 1) {
                    if (c % 2 == 0) { // 双数c
                        const se = this.getRoom(c + 1, r);
                        this.createDoorBetweenRooms(room, se, 0);
                        if (r > 0) { // 非第一行
                            const ne = this.getRoom(c + 1, r - 1);
                            this.createDoorBetweenRooms(room, ne, 0);
                        }
                    } else { // 单数c
                        const ne = this.getRoom(c + 1, r);
                        this.createDoorBetweenRooms(room, ne, 0);
                        if (r < this.rows - 1) {
                            const se = this.getRoom(c + 1, r + 1);
                            this.createDoorBetweenRooms(room, se, 0);
                        }
                    }
                }

                // 再处理纵轴上的房门
                const s = this.getRoom(c, r + 1);
                if (r < this.rows - 1) { 
                    this.createDoorBetweenRooms(room, s, 0); 
                }
            }
        }
    }
    
    /**
     * 在两个房间之间创建一扇门
     * @param {HexRoom} room1 - 第一个房间
     * @param {HexRoom} room2 - 第二个房间
     * @param {number} [angle = 0] - 门的角度
     */
    createDoorBetweenRooms(room1, room2, angle = 0) {
        // 计算两个房间之间的中点
        const midX = (room1.x + room2.x) / 2;
        const midY = (room1.y + room2.y) / 2;
        
        // 创建门
        const door = new HexDoor(midX, midY, angle, room1, room2);
        
        // 添加到两个房间
        room1.addDoor(door);
        room2.addDoor(door);
        
        // 添加到地图门列表
        this.doors.push(door);
    }
    
    /**
     * 获取指定位置的房间
     * @param {number} col - 列索引
     * @param {number} row - 行索引
     * @returns {HexRoom} 房间对象
     */
    getRoom(col, row) {
        if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) {
            return null;
        }
        return this.rooms[row * this.cols + col];
    }

    /**
     * 清除所有悬停状态
     */
    clearHover() {
        this.rooms.forEach(room => room.hover = false);
        this.doors.forEach(door => door.hover = false);
    }
}