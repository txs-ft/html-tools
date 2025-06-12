// 路徑： draft-ground/components/InputPanel.js

export default class InputPanel {
  constructor(panelId, toggleButtonId) {
    this.panel = document.getElementById(panelId);
    this.toggleButton = document.getElementById(toggleButtonId);
    
    this.initEventListeners();
  }

  initEventListeners() {
    this.toggleButton.addEventListener('click', () => {
      if (this.panel.classList.contains('hidden')) {
        this.show();
      } else {
        this.hide();
      }
    });
  }

  show() {
    this.panel.classList.remove('hidden');
  }

  hide() {
    this.panel.classList.add('hidden');
  }
}