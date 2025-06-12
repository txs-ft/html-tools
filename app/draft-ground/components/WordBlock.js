const COLORS = ['noun', 'verb', 'adj', 'prep', 'adv', 'other'];
const DRAG_THRESHOLD = 10;
const TAP_DELAY = 300; // 點擊最大延時

export default class WordBlock {
  constructor(text, container) {
    this.text = text;
    this.container = container;
    this.colorIndex = 0;
    this.isDragging = false;
    this.offset = { x: 0, y: 0 };
    this.position = this.getRandomPosition();
    this.inverseMatrix = null;
    this.dragStartPosition = { x: 0, y: 0 };
    this.dragStartTime = 0;
    
    // 事件處理器綁定
    this.handleClick = this.handleClick.bind(this);
    this.handleTap = this.handleTap.bind(this);
    this.startDrag = this.startDrag.bind(this);
    this.drag = this.drag.bind(this);
    this.endDrag = this.endDrag.bind(this);
    this.createElement();
    this.initEventListeners();
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.className = 'word-block';
    this.element.classList.add(`color-${COLORS[this.colorIndex]}`);
    this.element.textContent = this.text;
    this.element.style.left = `${this.position.x}px`;
    this.element.style.top = `${this.position.y}px`;
    this.container.appendChild(this.element);
  }

  getRandomPosition() {
    return {
      x: (Math.random() * 2 - 1) * window.innerWidth / 4 + window.innerWidth / 2,
      y: (Math.random() * 2 - 1) * window.innerHeight / 4 + window.innerHeight / 2
    };
  }

  getInverseMatrix() {
    const style = window.getComputedStyle(this.container);
    const transform = style.transform === 'none' 
      ? 'matrix(1, 0, 0, 1, 0, 0)' 
      : style.transform;
    
    const matrix = new DOMMatrix(transform);
    return matrix.isIdentity ? matrix : matrix.inverse();
  }

  viewportToContainer(x, y) {
    if (!this.inverseMatrix) return { x, y };
    
    const point = new DOMPoint(x, y);
    const transformed = point.matrixTransform(this.inverseMatrix);
    return { x: transformed.x, y: transformed.y };
  }

  initEventListeners() {
    // PC端使用click事件
    this.element.addEventListener('click', this.handleClick);
    
    // 移動端使用自定義tap事件
    this.element.addEventListener('touchstart', this.handleTap, { passive: false });
    this.element.addEventListener('touchend', this.handleTap, { passive: false });
    
    // 拖動事件
    this.element.addEventListener('mousedown', this.startDrag);
    this.element.addEventListener('touchstart', this.startDrag, { passive: false });
  }


  handleClick(e) {
    if (this.isDragging) return;
    this.cycleColor();
  }

  handleTap(e) {
    e.preventDefault();
    
    switch(e.type) {
      case 'touchstart':
        this.tapStartTime = Date.now();
        this.tapPosition = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
        break;
        
      case 'touchend':
        if (!this.tapStartTime) return;
        
        const duration = Date.now() - this.tapStartTime;
        const dx = e.changedTouches[0].clientX - this.tapPosition.x;
        const dy = e.changedTouches[0].clientY - this.tapPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 判斷是否為有效點擊
        if (duration < TAP_DELAY && distance < DRAG_THRESHOLD) {
          this.cycleColor();
        }
        
        this.tapStartTime = null;
        break;
    }
  }

  startDrag(e) {
    // 阻止移動端點擊事件觸發
    if (e.type === 'touchstart' && e.touches.length > 1) return;
    
    e.preventDefault();
    this.isDragging = true;
    
    this.inverseMatrix = this.getInverseMatrix();
    
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    this.dragStartPosition = { x: clientX, y: clientY };
    
    const containerPoint = this.viewportToContainer(clientX, clientY);
    this.offset = {
      x: containerPoint.x - this.position.x,
      y: containerPoint.y - this.position.y
    };
    document.addEventListener('mousemove', this.drag);
    document.addEventListener('touchmove', this.drag, { passive: false });
    document.addEventListener('mouseup', this.endDrag);
    document.addEventListener('touchend', this.endDrag);
  }

  drag(e) {
    if (!this.isDragging) return;
    
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    const dx = clientX - this.dragStartPosition.x;
    const dy = clientY - this.dragStartPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > DRAG_THRESHOLD) {
      this.element.style.pointerEvents = 'none';
    }
    
    const containerPoint = this.viewportToContainer(clientX, clientY);
    this.position = {
      x: containerPoint.x - this.offset.x,
      y: containerPoint.y - this.offset.y
    };
    
    this.updatePosition();
  }

  endDrag() {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    this.element.style.pointerEvents = 'auto';
    
    document.removeEventListener('mousemove', this.drag);
    document.removeEventListener('touchmove', this.drag);
    document.removeEventListener('mouseup', this.endDrag);
    document.removeEventListener('touchend', this.endDrag);
  }

  updatePosition() {
    this.element.style.left = `${this.position.x}px`;
    this.element.style.top = `${this.position.y}px`;
  }

  cycleColor() {
    this.element.classList.remove(`color-${COLORS[this.colorIndex]}`);
    this.colorIndex = (this.colorIndex + 1) % COLORS.length;
    this.element.classList.add(`color-${COLORS[this.colorIndex]}`);
  }

  resetPosition() {
    this.position = this.getRandomPosition();
    this.updatePosition();
  }

  destroy() {
    // 解除所有事件監聽
    this.element.removeEventListener('click', this.handleClick);
    this.element.removeEventListener('mousedown', this.startDrag);
    this.element.removeEventListener('touchstart', this.startDrag);
    this.endDrag(); // 確保解除全局事件
    this.element.remove();
  }
}
