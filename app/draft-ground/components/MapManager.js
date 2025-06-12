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
    this.container.addEventListener('wheel', this.handleZoom.bind(this));
    
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
  }

  handlePinch(e) {
    if (!this.pinchStartDistance) return;
    
    const currentDistance = this.getTouchDistance(e);
    const scaleFactor = currentDistance / this.pinchStartDistance;
    this.scale = this.startScale * scaleFactor;
    this.scale = Math.max(0.5, Math.min(this.scale, 3)); // 限制缩放范围
    
    this.updateTransform();
  }

  getTouchDistance(e) {
    const t1 = e.touches[0];
    const t2 = e.touches[1];
    return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
  }

  // 滚轮缩放
  handleZoom(e) {
    e.preventDefault();
    const zoomIntensity = 0.1;
    const wheelDelta = e.deltaY < 0 ? 1 : -1;
    this.scale += wheelDelta * zoomIntensity;
    this.scale = Math.max(0.5, Math.min(this.scale, 3)); // 限制缩放范围
    
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