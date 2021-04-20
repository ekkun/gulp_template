/**
 * APPS
 */

const Apps = () => {
  const $body = document.body;
  const dataApp = $body.dataset.app;
  if (!dataApp) {
    return false;
  }
  return dataApp;
};
export default Apps;
