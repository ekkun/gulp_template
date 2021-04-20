/**
 * CONTACT
 */
import Apps from './apps.js';

window.addEventListener('DOMContentLoaded', () => {
  if (Apps() == 'contact') {
    // body のデータ属性が一致した場合 js を処理
    console.log('コンタクトページなんです！');
  }
});
