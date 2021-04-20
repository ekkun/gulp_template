/**
 * INDEX
 */
import Apps from './apps.js';

window.addEventListener('DOMContentLoaded', () => {
  if (Apps() == 'index') {
    // body のデータ属性が一致した場合 js を処理
    console.log('INDEXページでーす！');
  }
});
