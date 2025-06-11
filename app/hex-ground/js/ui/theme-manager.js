// 路径：hex-ground/js/ui/theme-manager.js

/**
 * 主题管理器，集中管理所有视觉样式
 */
export class ThemeManager {
    static themes = {
        default: {
            name: "默认主题",
            roomFill: '#ffffff',
            roomFillHover: '#e0f7fa',
            roomBorder: '#3498db',
            roomBorderHover: '#f1c40f',
            roomText: '#2c3e50',
            doorActive: '#2ecc71',
            doorInactive: '#95a5a6',
            doorHover: '#f1c40f',
            backgroundGradient: ['#1a2a6c', '#b21f1f', '#1a2a6c'],
            gridLines: 'rgba(255, 255, 255, 0.1)',
            roomFont: 'Arial',
            doorFont: 'Arial',
            roomFontSize: roomSize => Math.max(12, roomSize / 3),
            doorFontSize: 20
        },
        dark: {
            name: "深色主题",
            roomFill: '#34495e',
            roomFillHover: '#4a6b8a',
            roomBorder: '#1abc9c',
            roomBorderHover: '#f1c40f',
            roomText: '#ecf0f1',
            doorActive: '#27ae60',
            doorInactive: '#7f8c8d',
            doorHover: '#f39c12',
            backgroundGradient: ['#0d1520', '#1d2c3e', '#0d1520'],
            gridLines: 'rgba(200, 200, 200, 0.1)',
            roomFont: 'Arial',
            doorFont: 'Arial',
            roomFontSize: roomSize => Math.max(12, roomSize / 3),
            doorFontSize: 20
        },
        pastel: {
            name: "柔和主题",
            roomFill: '#ffeaa7',
            roomFillHover: '#fdcb6e',
            roomBorder: '#74b9ff',
            roomBorderHover: '#ff7675',
            roomText: '#2d3436',
            doorActive: '#55efc4',
            doorInactive: '#dfe6e9',
            doorHover: '#ff7675',
            backgroundGradient: ['#a29bfe', '#ffeaa7', '#a29bfe'],
            gridLines: 'rgba(45, 52, 54, 0.1)',
            roomFont: 'Comic Sans MS, cursive',
            doorFont: 'Comic Sans MS, cursive',
            roomFontSize: roomSize => Math.max(14, roomSize / 2.5),
            doorFontSize: 22
        }
    };

    static currentTheme = 'default';

    /**
     * 设置当前主题
     * @param {string} themeName - 主题名称
     */
    static setTheme(themeName) {
        if (this.themes[themeName]) {
            this.currentTheme = themeName;
            return true;
        }
        return false;
    }

    /**
     * 获取当前主题配置
     * @returns {Object} 主题配置对象
     */
    static getTheme() {
        return this.themes[this.currentTheme];
    }

    /**
     * 获取可用主题列表
     * @returns {Array} 主题名称列表
     */
    static getAvailableThemes() {
        return Object.keys(this.themes);
    }
}