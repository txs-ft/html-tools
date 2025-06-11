import { HexMap } from '../core/hex-map.js';
import { ThemeManager } from './theme-manager.js';


/**
 * 路徑：hex-ground/js/ui/map-renderer.js
 * 地图渲染器，负责绘制六边形地图
 */
export class MapRenderer {
    /**
     * 创建地图渲染器
     * @param {HTMLCanvasElement} canvas - 画布元素
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    /**
     * 设置当前地图
     * @param {HexMap} hexMap - 六边形地图实例
     */
    setMap(hexMap) {
        this.hexMap = hexMap;
    }

    /**
     * 绘制整个场景
     * @param {string} mode - 当前模式 ('game' 或 'edit')
     * @param {number} offsetX - X轴偏移量
     * @param {number} offsetY - Y轴偏移量
     * @param {number} scale - 缩放比例
     */
    draw(mode, offsetX, offsetY, scale) {
        // 设置canvas尺寸为窗口大小
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制背景
        this.drawBackground();
        
        // 设置缩放和平移
        this.ctx.save();
        this.ctx.translate(offsetX, offsetY);
        this.ctx.scale(scale, scale);
        
        // 绘制地图
        if (this.hexMap) {
            this.drawHexMap(mode);
        }
        
        // 恢复变换
        this.ctx.restore();
    }

    /**
     * 绘制背景
     */
    drawBackground() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        // 从主题管理器获取背景渐变
        const gradientColors = ThemeManager.getTheme().backgroundGradient;
        
        // 创建渐变背景
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, gradientColors[0]);
        gradient.addColorStop(0.5, gradientColors[1]);
        gradient.addColorStop(1, gradientColors[2]);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // 绘制网格线 - 使用主题颜色
        ctx.strokeStyle = ThemeManager.getTheme().gridLines;
        ctx.lineWidth = 1;
        
        // 绘制网格线
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        // 垂直线
        for (let x = 0; x <= width; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        // 水平线
        for (let y = 0; y <= height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // 添加中心点
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(width/2, height/2, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * 绘制六边形地图
     * @param {string} mode - 当前模式 ('game' 或 'edit')
     */
    drawHexMap(mode) {
        // 绘制所有房间
        this.hexMap.rooms.forEach(room => this.drawHexRoom(room));
        
        // 绘制所有门
        this.hexMap.doors.forEach(door => this.drawHexDoor(door, mode));
    }

    /**
     * 绘制单个六边形房间
     * @param {HexRoom} room - 六边形房间实例
     */
    drawHexRoom(room) {
        const ctx = this.ctx;
        const theme = ThemeManager.getTheme();
        
        // 绘制六边形 - 使用主题颜色
        this.drawHexagon(
            room.x, 
            room.y, 
            room.size, 
            room.hover ? theme.roomFillHover : theme.roomFill,
            room.hover ? theme.roomBorderHover : theme.roomBorder
        );
        
        // 绘制房间编号 - 使用主题字体和颜色
        ctx.fillStyle = theme.roomText;
        ctx.font = `${theme.roomFontSize(room.size)}px ${theme.roomFont}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(room.id, room.x, room.y);
        
        // 鼠标悬停效果
        if (room.hover) {
            ctx.strokeStyle = '#f1c40f';
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = Math.PI / 3 * i;
                const hx = room.x + room.size * Math.cos(angle);
                const hy = room.y + room.size * Math.sin(angle);
                if (i === 0) {
                    ctx.moveTo(hx, hy);
                } else {
                    ctx.lineTo(hx, hy);
                }
            }
            ctx.closePath();
            ctx.stroke();
        }
    }

    /**
     * 绘制单个六边形
     * @param {number} x - 中心点X坐标
     * @param {number} y - 中心点Y坐标
     * @param {number} size - 六边形大小
     * @param {string} fillColor - 填充颜色
     * @param {string} strokeColor - 描边颜色
     */
    drawHexagon(x, y, size, fillColor, strokeColor) {
        const ctx = this.ctx;
        
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = Math.PI / 3 * i;
            const hx = x + size * Math.cos(angle);
            const hy = y + size * Math.sin(angle);
            if (i === 0) {
                ctx.moveTo(hx, hy);
            } else {
                ctx.lineTo(hx, hy);
            }
        }
        ctx.closePath();
        
        if (fillColor) {
            ctx.fillStyle = fillColor;
            ctx.fill();
        }
        
        if (strokeColor) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    /**
     * 绘制六边形门
     * @param {HexDoor} door - 六边形门实例
     * @param {string} mode - 当前模式 ('game' 或 'edit')
     */
    drawHexDoor(door, mode) {
        const ctx = this.ctx;
        const theme = ThemeManager.getTheme();
        
        if (mode === 'game') {
            // 游戏模式下只绘制可用的门
            if (!door.isUsable) return;
        }
        
        ctx.save();
        ctx.translate(door.x, door.y);
        ctx.rotate(door.angle);
        
        // 编辑模式下处理半透明效果
        if (mode === 'edit') {
            if (door.isUsable) {
                ctx.globalAlpha = 1.0;
                ctx.fillStyle = theme.doorActive;
            } else {
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = theme.doorInactive;
            }
            
            // 鼠标悬停效果
            if (door.hover) {
                ctx.shadowColor = theme.doorHover;
                ctx.shadowBlur = 15;
            }
        } else {
            ctx.fillStyle = theme.doorActive;
        }
        
        ctx.font = `${theme.doorFontSize}px ${theme.doorFont}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🚪', 0, 0);
        ctx.restore();
    }
}