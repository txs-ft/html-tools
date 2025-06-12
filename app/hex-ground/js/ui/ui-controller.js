import { MapRenderer } from './map-renderer.js';
import { HexMap } from '../core/hex-map.js';
import { ThemeManager } from './theme-manager.js';
import stateManager from '../state/state-manager.js';

/**
 * 路徑：hex-ground/js/ui/ui-controller.js
 * UI控制器，负责用户交互和状态管理
 */
export class UIController {
    /**
     * 创建UI控制器
     * @param {HTMLCanvasElement} canvas - 画布元素
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new MapRenderer(canvas);
        
        // 状态变量
        this.scale = 1.0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.startX = 0;
        this.startY = 0;
        this.isDragging = false;
        this.initialPinchDistance = null;
        this.initialScale = 1.0;
        this.hexMap = null;
        
        // 配置参数
        this.BASE_HEX_SIZE = 60;
        this.MIN_SCALE = 0.3;
        this.MAX_SCALE = 10.0;
        this.SCALE_MULTIPLIER = 2.0;
        
        // 绑定方法以确保正确的this上下文
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseMoveHover = this.handleMouseMoveHover.bind(this);

        this.adjustZoom = this.adjustZoom.bind(this);
        this.resetView = this.resetView.bind(this);
        this.initLoadMap = this.initLoadMap.bind(this);
        this.initSaveMap = this.initSaveMap.bind(this);
        this.editMap = this.editMap.bind(this);

        this.registerModes();
        stateManager.switchMode('game');

    }
    
    /**
     * 设置当前地图
     * @param {HexMap} hexMap - 六边形地图实例
     */
    setMap(hexMap) {
        this.hexMap = hexMap;
        this.renderer.setMap(hexMap);
    }
    
    /**
     * 初始化UI控制器
     */
    init() {
        // 添加控件事件
        document.getElementById('resetView').addEventListener('click', this.resetView);
        document.getElementById('loadMap').addEventListener('click', this.initLoadMap);
        document.getElementById('saveMap').addEventListener('click', this.initSaveMap);
        document.getElementById('editMap').addEventListener('click', this.editMap);
        
        // 添加事件监听器
        this.setupEventListeners();

        // 添加主题切换功能
        this.addThemeSwitcher(); 
        
        // 初始绘制
        this.draw();
        
        // 5秒后淡出信息提示
        setTimeout(() => {
            document.querySelector('.info').style.opacity = '0';
        }, 5000);
    }

    registerModes() {

        stateManager.registerMode('game', {
            onEnter: () => {
                document.getElementById('editMap').classList.remove('active');
                document.getElementById('modeIndicator').textContent = '游戏模式';
                document.getElementById('modeIndicator').classList.remove('edit');
                document.getElementById('instructions').style.display = 'none';
                document.getElementById('instructions').style.opacity = '1';
            },
            onMouseDown: (e) => this.handleMouseDown(e),
            onMouseMove: (e) => this.handleMouseMove(e),
            onMouseUp: (e) => this.handleMouseUp(e),
            onWheel: (e) => this.handleWheel(e),
            onTouchStart: (e) => this.handleTouchStart(e),
            onTouchMove: (e) => this.handleTouchMove(e),
            onTouchEnd: (e) => this.handleTouchEnd(e)
            //onClick: undefined, // 因為在遊戲模式下，暫無需處理點擊事件

        })

        stateManager.registerMode('edit', {
            onEnter: () => {
                document.getElementById('editMap').classList.add('active');
                document.getElementById('modeIndicator').textContent = '编辑模式';
                document.getElementById('modeIndicator').classList.add('edit');
                document.getElementById('instructions').style.display = 'block';
                
                // 5秒后淡出说明
                setTimeout(() => {
                    document.getElementById('instructions').style.opacity = '0';
                }, 5000);
            },
            onMouseDown: (e) => this.handleMouseDown(e),
            onMouseMove: (e) => this.handleMouseMove_Edit(e),
            onMouseUp: (e) => this.handleMouseUp(e),
            onWheel: (e) => this.handleWheel(e),
            onTouchStart: (e) => this.handleTouchStart(e),
            onTouchMove: (e) => this.handleTouchMove(e),
            onTouchEnd: (e) => this.handleTouchEnd(e),
            onClick: (e) => this.handleClick(e),
        });
        
    }

    /**
     * 初始化加载地图
     */
    initLoadMap() {
        // 触发隐藏的文件输入
        document.getElementById('fileInput').click();
    }

    /**
     * 初始化保存地图
     */
    initSaveMap() {
        if (!this.hexMap) {
            alert('地图格式错误，下载失败');
            return;
        }
        
        // 获取当前地图数据
        const mapData = {
            size: {
                w: this.hexMap.cols,
                h: this.hexMap.rows
            },
            doors: []
        };

        // 收集所有门的数据
        for (const door of this.hexMap.doors) {
            if (!door.isUsable) continue;

            mapData.doors.push({
                room1: { r: door.room1.row, c: door.room1.col },
                room2: { r: door.room2.row, c: door.room2.col }
            });
        }

        // 创建JSON文件并下载
        const jsonStr = JSON.stringify(mapData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hex-map.json';
        document.body.appendChild(a);
        a.click();
        
        // 清理
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    }

    /**
     * 切换地图编辑模式
     */
    editMap() {
        if (stateManager.modeManager.currentMode === 'game') {
            stateManager.switchMode('edit');
        } else {
            stateManager.switchMode('game');
        }
        // 清除所有悬停状态
        if (this.hexMap) this.hexMap.clearHover();
        this.draw();
    }
    
    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 鼠标事件
        this.canvas.addEventListener('mousedown', (e) => stateManager.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => stateManager.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => stateManager.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => stateManager.handleMouseLeave(e));
        this.canvas.addEventListener('wheel', (e) => stateManager.handleWheel(e), { passive: false });
        
        // 添加点击事件
        this.canvas.addEventListener('click', (e) => stateManager.handleClick(e));
        // this.canvas.addEventListener('mousemove', this.handleMouseMoveHover);
        
        // 触摸事件
        this.canvas.addEventListener('touchstart', (e) => stateManager.handleTouchStart(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => stateManager.handleTouchMove(e), { passive: false });
        this.canvas.addEventListener('touchend', (e) => stateManager.handleTouchEnd(e));
        
        // 窗口大小变化
        window.addEventListener('resize', () => this.draw());
        
        // 文件上传事件
        document.getElementById('fileInput').addEventListener('input', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    this.loadCustomMap(data);
                } catch (error) {
                    console.error('解析JSON失败', error);
                    alert('加载地图失败：JSON格式错误');
                }
            };
            reader.readAsText(file);
        });
    }
    
    /**
     * 加载自定义地图数据
     * @param {Object} data - 地图数据
     */
    loadCustomMap(data) {
        // 验证数据格式
        if (!data.size || !data.size.w || !data.size.h || 
            !Array.isArray(data.doors)) {
            alert('地图数据格式不正确');
            return;
        }
        
        // 创建新地图
        this.setMap(new HexMap(data.size.w, data.size.h, this.BASE_HEX_SIZE));
        
        // 创建房间位置映射表 (row-col作为键)
        const roomMap = new Map();
        this.hexMap.rooms.forEach(room => {
            const key = `${room.row}-${room.col}`;
            roomMap.set(key, room);
        });
        
        // 处理自定义门数据
        for (const doorData of data.doors) {
            if (!doorData.room1 || !doorData.room2) continue;
            
            // 获取两个房间对象
            const room1Key = `${doorData.room1.r}-${doorData.room1.c}`;
            const room2Key = `${doorData.room2.r}-${doorData.room2.c}`;
            const room1 = roomMap.get(room1Key);
            const room2 = roomMap.get(room2Key);
            
            if (!room1 || !room2) continue;
            
            // 在hexMap.doors中查找对应的门
            const foundDoor = this.hexMap.doors.find(door => 
                (door.room1 === room1 && door.room2 === room2) || 
                (door.room1 === room2 && door.room2 === room1)
            );
            
            // 如果找到对应的门，设置为可用
            if (foundDoor) {
                foundDoor.isUsable = true;
                
                // 同时更新两个房间中的门引用
                room1.doors.forEach(d => {
                    if (d === foundDoor) d.isUsable = true;
                });
                room2.doors.forEach(d => {
                    if (d === foundDoor) d.isUsable = true;
                });
            }
        }
        
        // 重绘
        this.draw();
        alert('地图加载成功！');
        // 重置文件输入
        document.getElementById('fileInput').value = '';
    }
    
    /**
     * 调整缩放
     * @param {number} delta - 缩放变化量
     */
    adjustZoom(delta) {
        const newScale = Math.min(this.MAX_SCALE, Math.max(this.MIN_SCALE, this.scale + delta));
        
        // 以画布中心为缩放中心
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // 调整偏移量，使缩放中心保持不变
        this.offsetX = centerX - (centerX - this.offsetX) * (newScale / this.scale);
        this.offsetY = centerY - (centerY - this.offsetY) * (newScale / this.scale);
        
        this.scale = newScale;
        this.draw();
    }
    
    /**
     * 重置视图
     */
    resetView() {
        this.scale = 1.0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.draw();
    }
    
    /**
     * 执行绘制
     */
    draw() {
        this.renderer.draw(stateManager.modeManager.currentMode, this.offsetX, this.offsetY, this.scale);
    }
    
    // 鼠标按下事件
    handleMouseDown(e) {
        this.isDragging = true;
        this.startX = e.clientX - this.offsetX;
        this.startY = e.clientY - this.offsetY;
        this.canvas.style.cursor = 'grabbing';
    }
    
    // 鼠标移动事件
    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        this.offsetX = e.clientX - this.startX;
        this.offsetY = e.clientY - this.startY;
        this.draw();
    }
    
    // 鼠标释放事件
    handleMouseUp() {
        this.isDragging = false;
        this.canvas.style.cursor = stateManager.modeManager.currentMode === 'edit' ? 'pointer' : 'grab';
    }
    
    // 鼠标滚轮事件
    handleWheel(e) {
        e.preventDefault();
        
        const delta = (e.deltaY > 0 ? -0.1 : 0.1) * this.SCALE_MULTIPLIER;
        const newScale = Math.min(this.MAX_SCALE, Math.max(this.MIN_SCALE, this.scale + delta));
        
        // 计算缩放中心点
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 调整偏移量，使缩放中心保持不变
        this.offsetX = mouseX - (mouseX - this.offsetX) * (newScale / this.scale);
        this.offsetY = mouseY - (mouseY - this.offsetY) * (newScale / this.scale);
        
        this.scale = newScale;
        this.draw();
    }
    
    // 触摸开始事件
    handleTouchStart(e) {
        e.preventDefault();
        
        if (e.touches.length === 1) {
            // 单指触摸 - 开始拖动
            this.isDragging = true;
            this.startX = e.touches[0].clientX - this.offsetX;
            this.startY = e.touches[0].clientY - this.offsetY;
        } else if (e.touches.length === 2) {
            // 双指触摸 - 开始缩放
            this.isDragging = false;
            this.initialPinchDistance = this.getDistance(e.touches[0], e.touches[1]);
            this.initialScale = this.scale;
        }
    }
    
    // 触摸移动事件
    handleTouchMove(e) {
        e.preventDefault();
        
        if (this.isDragging && e.touches.length === 1) {
            // 单指移动 - 拖动
            this.offsetX = e.touches[0].clientX - this.startX;
            this.offsetY = e.touches[0].clientY - this.startY;
            this.draw();
        } else if (e.touches.length === 2) {
            // 双指移动 - 缩放
            const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
            
            if (this.initialPinchDistance !== null) {
                const scaleFactor = currentDistance / this.initialPinchDistance;
                this.scale = Math.min(this.MAX_SCALE, Math.max(this.MIN_SCALE, this.initialScale * scaleFactor));
                
                // 计算缩放中心点
                const rect = this.canvas.getBoundingClientRect();
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
                const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top;
                
                // 调整偏移量，使缩放中心保持不变
                this.offsetX = centerX - (centerX - this.offsetX) * (this.scale / this.initialScale);
                this.offsetY = centerY - (centerY - this.offsetY) * (this.scale / this.initialScale);
                
                this.draw();
            }
        }
    }
    
    // 触摸结束事件
    handleTouchEnd(e) {
        if (e.touches.length === 0) {
            // 所有手指离开
            this.isDragging = false;
            this.initialPinchDistance = null;
        } else if (e.touches.length === 1) {
            // 只剩一根手指，转为拖动模式
            this.isDragging = true;
            this.startX = e.touches[0].clientX - this.offsetX;
            this.startY = e.touches[0].clientY - this.offsetY;
            this.initialPinchDistance = null;
        }
    }
    
    /**
     * 计算两点间距离
     * @param {Touch} touch1 - 第一个触摸点
     * @param {Touch} touch2 - 第二个触摸点
     * @returns {number} 两点间距离
     */
    getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    /**
     * 处理点击事件（编辑模式下）
     * @param {MouseEvent} e - 鼠标事件
     */
    handleClick(e) {
        if (!this.hexMap) return;
        
        // 获取鼠标在画布上的位置
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 转换到地图坐标系（考虑缩放和平移）
        const x = (mouseX - this.offsetX) / this.scale;
        const y = (mouseY - this.offsetY) / this.scale;
        
        // 设定一个阈值（20像素，但考虑缩放）
        const threshold = 20 / this.scale;
        
        // 检查是否点击到了门
        let clickedDoor = null;
        for (const door of this.hexMap.doors) {
            if (door.isPointInside(x, y, threshold)) {
                clickedDoor = door;
                break;
            }
        }
        
        if (clickedDoor) {
            // 切换门的可用状态
            clickedDoor.isUsable = !clickedDoor.isUsable;
            this.draw();
        }
    }

    /**
     * 處理編輯模式下的鼠標移動事件
     * @param {MouseEvent} e - 鼠標事件
     */
    handleMouseMove_Edit(e) {

        if (!this.isDragging) return;
        
        this.offsetX = e.clientX - this.startX;
        this.offsetY = e.clientY - this.startY;

        // 获取鼠标在画布上的位置
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 转换到地图坐标系
        const x = (mouseX - this.offsetX) / this.scale;
        const y = (mouseY - this.offsetY) / this.scale;
        
        // 设定阈值
        const doorThreshold = 20 / this.scale;
        const roomThreshold = this.BASE_HEX_SIZE / this.scale;
        
        // 清除所有悬停状态
        this.hexMap.clearHover();
        
        // 检查门悬停
        let hoverDetected = false;
        for (const door of this.hexMap.doors) {
            if (door.isPointInside(x, y, doorThreshold)) {
                door.hover = true;
                hoverDetected = true;
                this.canvas.style.cursor = 'pointer';
                break;
            }
        }
        
        // 检查房间悬停
        if (!hoverDetected) {
            for (const room of this.hexMap.rooms) {
                if (room.isPointInside(x, y)) {
                    room.hover = true;
                    hoverDetected = true;
                    this.canvas.style.cursor = 'pointer';
                    break;
                }
            }
        }
        
        // 如果没有悬停在可交互元素上
        if (!hoverDetected) {
            this.canvas.style.cursor = this.isDragging ? 'grabbing' : 'grab';
        }
        
        // 重绘以更新悬停效果
        this.draw();
    }
    
    /**
     * [OBSOLETE] 处理鼠标移动悬停效果
     * @param {MouseEvent} e - 鼠标事件
     */
    handleMouseMoveHover(e) {
        if (!this.hexMap || stateManager.modeManager.currentMode !== 'edit') return;
        
        // 获取鼠标在画布上的位置
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 转换到地图坐标系
        const x = (mouseX - this.offsetX) / this.scale;
        const y = (mouseY - this.offsetY) / this.scale;
        
        // 设定阈值
        const doorThreshold = 20 / this.scale;
        const roomThreshold = this.BASE_HEX_SIZE / this.scale;
        
        // 清除所有悬停状态
        this.hexMap.clearHover();
        
        // 检查门悬停
        let hoverDetected = false;
        for (const door of this.hexMap.doors) {
            if (door.isPointInside(x, y, doorThreshold)) {
                door.hover = true;
                hoverDetected = true;
                this.canvas.style.cursor = 'pointer';
                break;
            }
        }
        
        // 检查房间悬停
        if (!hoverDetected) {
            for (const room of this.hexMap.rooms) {
                if (room.isPointInside(x, y)) {
                    room.hover = true;
                    hoverDetected = true;
                    this.canvas.style.cursor = 'pointer';
                    break;
                }
            }
        }
        
        // 如果没有悬停在可交互元素上
        if (!hoverDetected) {
            this.canvas.style.cursor = this.isDragging ? 'grabbing' : 'grab';
        }
        
        // 重绘以更新悬停效果
        this.draw();
    }

    /**
     * 添加主题切换控件
     */
    addThemeSwitcher() {
        const themeContainer = document.createElement('div');
        themeContainer.className = 'theme-switcher';
        themeContainer.style.position = 'absolute';
        themeContainer.style.bottom = '15px';
        themeContainer.style.right = '115px';
        themeContainer.style.zIndex = '10';
        themeContainer.style.display = 'flex';
        themeContainer.style.gap = '10px';
        
        const themes = ThemeManager.getAvailableThemes();
        themes.forEach(themeName => {
            const theme = ThemeManager.themes[themeName];
            const btn = document.createElement('button');
            btn.className = 'theme-btn';
            btn.title = theme.name;
            btn.style.width = '30px';
            btn.style.height = '30px';
            btn.style.borderRadius = '50%';
            btn.style.border = '2px solid white';
            btn.style.cursor = 'pointer';
            btn.style.background = theme.backgroundGradient[1];
            btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
            
            btn.addEventListener('click', () => {
                ThemeManager.setTheme(themeName);
                this.renderer.draw(
                    stateManager.get('mode'),
                    stateManager.get('offset').x,
                    stateManager.get('offset').y,
                    stateManager.get('scale')
                );
                
                // 更新按钮选中状态
                document.querySelectorAll('.theme-btn').forEach(b => {
                    b.style.transform = '';
                    b.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
                });
                btn.style.transform = 'scale(1.2)';
                btn.style.boxShadow = '0 0 10px rgba(255,255,255,0.8)';
            });
            
            themeContainer.appendChild(btn);
        });
        
        document.querySelector('.container').appendChild(themeContainer);
    }
}
