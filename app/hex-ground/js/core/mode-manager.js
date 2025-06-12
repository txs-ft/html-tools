// hex-ground/js/core/mode-manager.js
export class ModeManager {
    constructor() {
        this.modes = {};
        this.currentMode = null;
    }

    /**
     * 注册新模式
     * @param {string} name - 模式名称
     * @param {object} config - 模式配置
     * @param {function} config.onEnter - 进入模式时的回调
     * @param {function} config.onExit - 退出模式时的回调
     * @param {function} config.onClick - 点击事件处理
     * @param {function} config.onMouseMove - 鼠标移动事件处理
     * @param {function} config.onMouseDown - 鼠標按下事件
     * @param {function} config.onMouseUp - 鼠標鬆開事件
     * @param {function} config.onMouseLeave - 鼠標離開事件
     * @param {function} config.onWheel - 鼠輪事件
     * @param {function} config.onTouchStart - 觸摸開始事件
     * @param {function} config.onTouchMove - 觸摸移動事件
     * @param {function} config.onTouchEnd - 觸摸結束事件
     * 
     */
    registerMode(name, config) {
        this.modes[name] = config;
    }

    /**
     * 切换模式
     * @param {string} name - 要切换到的模式名称
     */
    switchToMode(name) {
        if (!this.modes[name]) {
            console.error(`未注册的模式: ${name}`);
            return;
        }

        if (this.getCurrentMode() === name) {
            console.warn(`嘗試轉換至同一模式：${name}`);
            return;
        }

        // 退出当前模式
        if (this.currentMode && this.modes[this.currentMode].onExit) {
            this.modes[this.currentMode].onExit();
        }

        // 进入新模式
        this.currentMode = name;

        console.log(`轉換至新模式: ${name}`);
        if (this.modes[name].onEnter) {
            this.modes[name].onEnter();
        }
    }

    /**
     * 获取当前模式配置
     * @returns {object} 当前模式配置
     */
    getCurrentMode() {
        return this.currentMode ? this.modes[this.currentMode] : null;
    }

    /**
     * 處理鼠標按下事件
     * @param {Event} event - 鼠標按下事件
     */
    handleMouseDown(event) {
        const mode = this.getCurrentMode();
        if (mode && mode.onMouseDown) {
            mode.onMouseDown(event);
        }
    }

    /**
     * 处理鼠标移动事件
     * @param {Event} event - 鼠标移动事件
     */
    handleMouseMove(event) {
        const mode = this.getCurrentMode();
        if (mode && mode.onMouseMove) {
            mode.onMouseMove(event);
        }
    }

    /**
     * 處理鼠標鬆開事件
     * @param {Event} event - 鼠標鬆開事件
     */
    handleMouseUp(event) {
        const mode = this.getCurrentMode();
        if (mode && mode.onMouseUp) {
            mode.onMouseUp(event);
        }
    }

    /**
     * 處理鼠標離開事件
     * @param {Event} event - 鼠標離開事件
     */
    handleMouseLeave(event) {
        const mode = this.getCurrentMode();
        if (mode && mode.onMouseLeave) {
            mode.onMouseLeave(event);
        }
    }

    /**
     * 處理鼠輪事件
     * @param {Event} event - 鼠輪事件
     */
    handleWheel(event) {
        const mode = this.getCurrentMode();
        if (mode && mode.onWheel) {
            mode.onWheel(event);
        }
    }

    /**
     * 处理点击事件
     * @param {Event} event - 点击事件
     */
    handleClick(event) {
        const mode = this.getCurrentMode();
        if (mode && mode.onClick) {
            mode.onClick(event);
        }
    }

    /**
     * 處理觸摸開始事件
     * @param {Event} event - 觸摸開始事件
     */
    handleTouchStart(event) {
        const mode = this.getCurrentMode();
        if (mode && mode.onTouchStart) {
            mode.onTouchStart(event);
        }
    }

    /**
     * 處理觸摸移動事件
     * @param {Event} event - 觸摸移動事件
     */
    handleTouchMove(event) {
        const mode = this.getCurrentMode();
        if (mode && mode.onTouchMove) {
            mode.onTouchMove(event);
        }
    }

    /**
     * 處理觸摸結束事件
     * @param {Event} event - 觸摸結束事件
     */
    handleTouchEnd(event) {
        const mode = this.getCurrentMode();
        if (mode && mode.onTouchEnd) {
            mode.onTouchEnd(event);
        }
    }


}