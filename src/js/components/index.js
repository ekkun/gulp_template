/**
 * INDEX
 */
import App from './functions.js';

window.addEventListener('DOMContentLoaded', () => {
  if (App() == 'index') {
    // body のデータ属性が一致した場合 js を処理
    console.log('INDEXページでーす！');
  }
});
