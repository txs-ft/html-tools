// 路徑： draft-ground/script.js

import MapManager from './components/MapManager.js';
import WordBlock from './components/WordBlock.js';
import InputPanel from './components/InputPanel.js';

document.addEventListener('DOMContentLoaded', () => {
  // 初始化核心模块
  const mapManager = new MapManager('map-grid');
  const inputPanel = new InputPanel('input-panel', 'toggle-input');
  const wordBlocks = [];
  
  // 默认句子
  const DEFAULT_SENTENCE = "The quick brown fox / jumps / over / the lazy dog / , / and / falls / into / a rubbish bin";
  
  // 设置默认句子到输入框
  document.getElementById('sentence-input').value = DEFAULT_SENTENCE;
  
  // 生成默认词条
  const generateDefaultBlocks = () => {
    const parts = DEFAULT_SENTENCE.split('/').filter(p => p.trim());
    
    // 清除旧词条
    wordBlocks.forEach(block => block.destroy());
    wordBlocks.length = 0;
    
    // 创建新词条
    parts.forEach(part => {
      const block = new WordBlock(part.trim(), mapManager.container);
      wordBlocks.push(block);
    });
    
    inputPanel.hide();
  };
  
  // 页面加载时生成默认词条
  generateDefaultBlocks();
  
  // 生成词条事件
  document.getElementById('generate-blocks').addEventListener('click', () => {
    const input = document.getElementById('sentence-input').value;
    const parts = input.split('/').filter(p => p.trim());
    
    // 清除旧词条
    wordBlocks.forEach(block => block.destroy());
    wordBlocks.length = 0;
    
    // 创建新词条
    parts.forEach(part => {
      const block = new WordBlock(part.trim(), mapManager.container);
      wordBlocks.push(block);
    });
    
    inputPanel.hide();
  });
  
  // 重置所有
  document.getElementById('reset-all').addEventListener('click', () => {
    mapManager.resetView();
    wordBlocks.forEach(block => block.resetPosition());
  });
});