/**
 * ekkun.com
 * @version 0.1.0
 * @author eiji@ekkun.com
 * @license -
 */
$(function () {
  const $body = document.body;
  const dataApp = $body.dataset.app;
  if (!dataApp) { return false }
  if (dataApp == 'contact') { // body のデータ属性が一致した場合 js を処理
    contact();
  }
});

const contact = () => {
  console.log('CONTACT');
}
