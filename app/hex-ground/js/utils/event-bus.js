// 路徑：hex-ground/js/utils/event-bus.js

/**
 * 事件总线，用于组件间通信
 */
class EventBus {
    constructor() {
        this.listeners = {};
    }

    /**
     * 订阅事件
     * @param {string} eventName - 事件名称
     * @param {Function} callback - 回调函数
     */
    on(eventName, callback) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(callback);
    }

    /**
     * 取消订阅
     * @param {string} eventName - 事件名称
     * @param {Function} callback - 要移除的回调函数
     */
    off(eventName, callback) {
        if (!this.listeners[eventName]) return;
        
        this.listeners[eventName] = this.listeners[eventName].filter(
            listener => listener !== callback
        );
    }

    /**
     * 触发事件
     * @param {string} eventName - 事件名称
     * @param {...any} args - 传递给回调函数的参数
     */
    emit(eventName, ...args) {
        if (!this.listeners[eventName]) return;
        
        this.listeners[eventName].forEach(callback => {
            try {
                callback(...args);
            } catch (error) {
                console.error(`Error in event handler for ${eventName}:`, error);
            }
        });
    }
}

// 导出单例实例
export const eventBus = new EventBus();