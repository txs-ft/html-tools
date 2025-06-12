// 路径：hex-ground/js/app.js
import {UIController} from './ui/ui-controller.js';
import { HexMap } from './core/hex-map.js';
import stateManager from './state/state-manager.js';

// 配置参数
const BASE_HEX_SIZE = 60; // 基础六边形大小
const DEFAULT_COLS = 5;
const DEFAULT_ROWS = 3;

// 创建默认地图
function createDefaultHexMap() {
    const hexMap = new HexMap(DEFAULT_COLS, DEFAULT_ROWS, BASE_HEX_SIZE);
    
    // 默认启用一些门
    const doorsToEnable = [
        {room1: {c:0, r:0}, room2: {c:1, r:0}},
        {room1: {c:0, r:0}, room2: {c:0, r:1}},
        {room1: {c:1, r:0}, room2: {c:1, r:1}},
        {room1: {c:0, r:1}, room2: {c:1, r:1}},
        {room1: {c:1, r:1}, room2: {c:2, r:1}}
    ];
    
    for (const doorData of doorsToEnable) {
        const room1 = hexMap.getRoom(doorData.room1.c, doorData.room1.r);
        const room2 = hexMap.getRoom(doorData.room2.c, doorData.room2.r);
        
        if (room1 && room2) {
            // 查找连接这两个房间的门
            const door = hexMap.doors.find(d => 
                (d.room1 === room1 && d.room2 === room2) || 
                (d.room1 === room2 && d.room2 === room1)
            );
            
            if (door) {
                door.isUsable = true;
            }
        }
    }
    
    return hexMap;
}

// 初始化应用程序
function initApp() {
    const canvas = document.getElementById('gridCanvas');
    
    // 创建渲染器并设置默认地图
    const defaultMap = createDefaultHexMap();
    
    // 创建UI控制器
    const uiController = new UIController(canvas);
    
    // 设置状态
    stateManager.setMap(defaultMap);
    uiController.setMap(defaultMap);
    
    // 初始化UI控制器
    uiController.init();

    
    // 订阅状态变化
    stateManager.subscribe((newState, oldState) => {
        // 当状态变化时重绘
        if (newState.hexMap || newState.scale !== oldState.scale || 
            newState.offset !== oldState.offset || newState.mode !== oldState.mode) {
            uiController.renderer.draw(
                newState.mode, 
                newState.offset.x, 
                newState.offset.y, 
                newState.scale
            );
        }
    });
    
    // 初始绘制
    uiController.renderer.draw(
        stateManager.get('mode'),
        stateManager.get('offset').x,
        stateManager.get('offset').y,
        stateManager.get('scale')
    );
}

// 页面加载完成后启动应用
window.addEventListener('DOMContentLoaded', initApp);