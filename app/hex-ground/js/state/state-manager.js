// 路徑：hex-ground/js/state/state-manager.js

import appState from './app-state.js';
import { ModeManager } from '../core/mode-manager.js';

/**
 * 状态管理器，提供状态操作的便捷方法
 */
class StateManager {
    constructor() {
        this.state = appState;
        this.modeManager = new ModeManager();
    }
    
    /**
     * 获取当前状态
     * @param {string} [key] - 可选的状态键
     * @returns {any} 状态值或整个状态对象
     */
    get(key) {
        return this.state.getState(key);
    }
    
    /**
     * 更新应用状态
     * @param {Object} updates - 要更新的状态属性
     */
    set(updates) {
        this.state.updateState(updates);
    }
    
    /**
     * 订阅状态变化
     * @param {Function} callback - 状态变化时的回调函数
     * @returns {Function} 取消订阅的函数
     */
    subscribe(callback) {
        return this.state.subscribe(callback);
    }
    
    /**
     * 重置视图状态
     */
    resetView() {
        this.state.resetView();
    }
    
    /**
     * 切换编辑模式
     */
    toggleEditMode() {
        this.state.toggleEditMode();
    }
    
    /**
     * 设置当前地图
     * @param {HexMap} hexMap - 六边形地图实例
     */
    setMap(hexMap) {
        this.state.setHexMap(hexMap);
    }
    
    /**
     * 更新悬停元素
     * @param {HexDoor|HexRoom|null} element - 悬停的元素
     */
    setHoverElement(element) {
        this.set({ hoverElement: element });
        
        // 更新地图中的悬停状态
        const { hexMap } = this.get();
        if (hexMap) {
            hexMap.clearHover();
            if (element) {
                element.hover = true;
            }
        }
    }
    
    /**
     * 切换门的可用状态
     * @param {HexDoor} door - 要切换状态的门
     */
    toggleDoorState(door) {
        if (!door) return;
        
        door.isUsable = !door.isUsable;
        this.set({}); // 触发状态更新
    }

    /**
     * 注册新模式
     * @param {string} name - 模式名称
     * @param {object} config - 模式配置
     */
    registerMode(name, config) {
        this.modeManager.registerMode(name, config);
    }

    /**
     * 切换到指定模式
     * @param {string} name - 模式名称
     */
    switchMode(name) {
        this.modeManager.switchToMode(name);
        this.set({ mode: name });
    }

    /**
     * 处理点击事件
     * @param {Event} event - 点击事件
     */
    handleClick(event) {
        this.modeManager.handleClick(event);
    }

    /**
     * 处理鼠标移动事件
     * @param {Event} event - 鼠标移动事件
     */
    handleMouseMove(event) {
        this.modeManager.handleMouseMove(event);
    }

    /**
     * 處理鼠標按下事件
     * @param {Event} event - 鼠標按下事件
     */
    handleMouseDown(event) {
        this.modeManager.handleMouseDown(event);
    }

    /**
     * 处理鼠标移动事件
     * @param {Event} event - 鼠标移动事件
     */
    handleMouseMove(event) {
        this.modeManager.handleMouseMove(event);
    }

    /**
     * 處理鼠標鬆開事件
     * @param {Event} event - 鼠標鬆開事件
     */
    handleMouseUp(event) {
        this.modeManager.handleMouseUp(event);
    }

    /**
     * 處理鼠標離開事件
     * @param {Event} event - 鼠標離開事件
     */
    handleMouseLeave(event) {
        this.modeManager.handleMouseLeave(event);
    }

    /**
     * 處理鼠輪事件
     * @param {Event} event - 鼠輪事件
     */
    handleWheel(event) {
        this.modeManager.handleWheel(event);
    }

    /**
     * 處理觸摸開始事件
     * @param {Event} event - 觸摸開始事件
     */
    handleTouchStart(event) {
        this.modeManager.handleTouchStart(event);
    }

    /**
     * 處理觸摸移動事件
     * @param {Event} event - 觸摸移動事件
     */
    handleTouchMove(event) {
        this.modeManager.handleTouchMove(event);
    }

    /**
     * 處理觸摸結束事件
     * @param {Event} event - 觸摸結束事件
     */
    handleTouchEnd(event) {
        this.modeManager.handleTouchEnd(event);
    }
}

// 导出单例实例
const stateManager = new StateManager();
export default stateManager;