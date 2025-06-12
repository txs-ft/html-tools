// 路徑： draft-ground/components/MapManager.js
export default class MapManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scale = 1;
    this.position = { x: 0, y: 0 };
    this.isDragging = false;
    this.lastPos = { x: 0, y: 0 };
    
    this.initEventListeners();
  }

  initEventListeners() {
    // PC端鼠标事件
    this.container.addEventListener('mousedown', this.startDrag.bind(this));
    document.addEventListener('mousemove', this.drag.bind(this));
    document.addEventListener('mouseup', this.endDrag.bind(this));
    this.container.addEventListener('wheel', this.handleZoom.bind(this), { passive: false });
    
    // 移动端触摸事件
    this.container.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.container.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.container.addEventListener('touchend', this.endDrag.bind(this));
  }

  // 鼠标拖拽逻辑
  startDrag(e) {
    if (e.target === this.container) {
      this.isDragging = true;
      this.lastPos = { x: e.clientX, y: e.clientY };
    }
  }

  drag(e) {
    if (!this.isDragging) return;
    
    const dx = e.clientX - this.lastPos.x;
    const dy = e.clientY - this.lastPos.y;
    
    this.position.x += dx;
    this.position.y += dy;
    this.lastPos = { x: e.clientX, y: e.clientY };
    
    this.updateTransform();
  }

  endDrag() {
    this.isDragging = false;
  }

  // 触摸事件处理
  handleTouchStart(e) {
    if (e.touches.length === 1) {
      this.startDrag(e.touches[0]);
    } else if (e.touches.length === 2) {
      this.handlePinchStart(e);
    }
  }

  handleTouchMove(e) {
    if (e.touches.length === 1) {
      this.drag(e.touches[0]);
    } else if (e.touches.length === 2) {
      this.handlePinch(e);
    }
  }

  // 双指缩放逻辑
  handlePinchStart(e) {
    this.pinchStartDistance = this.getTouchDistance(e);
    this.startScale = this.scale;
    this.startPosition = { ...this.position };
    
    // 计算双指中心点
    const t1 = e.touches[0];
    const t2 = e.touches[1];
    this.pinchCenter = {
      x: (t1.clientX + t2.clientX) / 2,
      y: (t1.clientY + t2.clientY) / 2
    };
  }

  handlePinch(e) {
    if (!this.pinchStartDistance || !this.pinchCenter) return;
    
    const currentDistance = this.getTouchDistance(e);
    const scaleFactor = currentDistance / this.pinchStartDistance;
    const newScale = this.startScale * scaleFactor;
    const clampedScale = Math.max(0.5, Math.min(newScale, 3));
    
    // 计算缩放中心在容器内的坐标
    const rect = this.container.getBoundingClientRect();
    const containerX = this.pinchCenter.x - rect.left;
    const containerY = this.pinchCenter.y - rect.top;
    
    // 计算缩放中心的世界坐标
    const worldX = (containerX - this.startPosition.x) / this.startScale;
    const worldY = (containerY - this.startPosition.y) / this.startScale;
    
    // 计算新的位置
    this.position.x = containerX - worldX * clampedScale;
    this.position.y = containerY - worldY * clampedScale;
    this.scale = clampedScale;
    
    this.updateTransform();
  }

  getTouchDistance(e) {
    const t1 = e.touches[0];
    const t2 = e.touches[1];
    return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
  }

  // 滚轮缩放 - 已修复以鼠标为中心缩放
  handleZoom(e) {
    e.preventDefault();
    const zoomIntensity = 0.1;
    const wheelDelta = e.deltaY < 0 ? 1 : -1;
    const newScale = this.scale + wheelDelta * zoomIntensity;
    const clampedScale = Math.max(0.5, Math.min(newScale, 3));
    
    // 获取鼠标在容器内的坐标
    const rect = this.container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // 计算鼠标位置的世界坐标
    const worldX = (mouseX - this.position.x) / this.scale;
    const worldY = (mouseY - this.position.y) / this.scale;
    
    // 计算新的位置
    this.position.x = mouseX - worldX * clampedScale;
    this.position.y = mouseY - worldY * clampedScale;
    this.scale = clampedScale;
    
    this.updateTransform();
  }

  updateTransform() {
    this.container.style.transform = `
      translate(${this.position.x}px, ${this.position.y}px)
      scale(${this.scale})
    `;
  }

  resetView() {
    this.position = { x: 0, y: 0 };
    this.scale = 1;
    this.updateTransform();
  }
}
