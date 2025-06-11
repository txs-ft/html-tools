// 路徑：hex-ground/js/state/app-state.js

/**
 * 应用状态单例，管理全局状态
 */
class AppState {
    static instance = null;
    
    constructor() {
        if (AppState.instance) {
            return AppState.instance;
        }
        
        // 默认状态
        this.state = {
            mode: 'game', // 'game' 或 'edit'
            scale: 1.0,
            offset: { x: 0, y: 0 },
            hexMap: null,
            activeTool: null,
            selectedDoor: null,
            hoverElement: null,
            mapDimensions: { cols: 10, rows: 7 },
            uiElements: {
                modeIndicator: document.getElementById('modeIndicator'),
                editButton: document.getElementById('editMap'),
                instructions: document.getElementById('instructions')
            }
        };
        
        this.subscribers = [];
        AppState.instance = this;
    }
    
    /**
     * 获取当前状态
     * @param {string} [key] - 可选的状态键
     * @returns {any} 状态值或整个状态对象
     */
    getState(key) {
        return key ? this.state[key] : {...this.state};
    }
    
    /**
     * 更新应用状态
     * @param {Object} updates - 要更新的状态属性
     * @param {boolean} [silent=false] - 是否静默更新（不通知订阅者）
     */
    updateState(updates, silent = false) {
        const oldState = {...this.state};
        this.state = {...this.state, ...updates};
        
        // 更新UI元素状态
        this.updateUIState();
        
        if (!silent) {
            this.notifySubscribers(this.state, oldState);
        }
    }
    
    /**
     * 更新与状态关联的UI元素
     */
    updateUIState() {
        const { mode, uiElements } = this.state;
        
        // 更新模式指示器
        if (uiElements.modeIndicator) {
            uiElements.modeIndicator.textContent = mode === 'game' ? '游戏模式' : '编辑模式';
            uiElements.modeIndicator.classList.toggle('edit', mode === 'edit');
        }
        
        // 更新编辑按钮状态
        if (uiElements.editButton) {
            uiElements.editButton.classList.toggle('active', mode === 'edit');
        }
        
        // 更新说明显示状态
        if (uiElements.instructions) {
            if (mode === 'edit') {
                uiElements.instructions.style.display = 'block';
                setTimeout(() => {
                    uiElements.instructions.style.opacity = '0';
                }, 5000);
            } else {
                uiElements.instructions.style.display = 'none';
                uiElements.instructions.style.opacity = '1';
            }
        }
    }
    
    /**
     * 订阅状态变化
     * @param {Function} callback - 状态变化时的回调函数
     * @returns {Function} 取消订阅的函数
     */
    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }
    
    /**
     * 通知所有订阅者状态已更新
     * @param {Object} newState - 新状态
     * @param {Object} oldState - 旧状态
     */
    notifySubscribers(newState, oldState) {
        this.subscribers.forEach(callback => callback(newState, oldState));
    }
    
    /**
     * 重置视图状态
     */
    resetView() {
        this.updateState({
            scale: 1.0,
            offset: { x: 0, y: 0 }
        });
    }
    
    /**
     * 切换编辑模式
     */
    toggleEditMode() {
        const { mode } = this.state;
        const newMode = mode === 'game' ? 'edit' : 'game';
        
        this.updateState({
            mode: newMode,
            hoverElement: null
        });
    }
    
    /**
     * 设置当前地图
     * @param {HexMap} hexMap - 六边形地图实例
     */
    setHexMap(hexMap) {
        this.updateState({ hexMap });
    }
}

// 导出单例实例
const appState = new AppState();
export default appState;