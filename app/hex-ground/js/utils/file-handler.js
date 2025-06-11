// 路徑：hex-ground/js/utils/file-handler.js

/**
 * 加载JSON文件
 * @param {Function} callback - 文件加载完成后的回调
 */
export function loadJsonFile(callback) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = event => {
            try {
                const data = JSON.parse(event.target.result);
                callback(null, data);
            } catch (error) {
                callback(error);
            }
        };
        reader.onerror = error => callback(error);
        reader.readAsText(file);
    };
    
    input.click();
}

/**
 * 保存JSON文件
 * @param {Object} data - 要保存的数据
 * @param {string} filename - 文件名
 */
export function saveJsonFile(data, filename = 'hex-map.json') {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // 清理
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}