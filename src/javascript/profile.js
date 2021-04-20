/**
 * PROFILE
 */

window.addEventListener('load', () => {
  const $body = document.body;
  const dataApp = $body.dataset.app;
  if (!dataApp) {
    return false;
  }
  if (dataApp == 'profile') {
    // body のデータ属性が一致した場合 js を処理
    contact();
  }
});

const contact = () => {
  console.log('プロフィールページは静的なページです...');
};
