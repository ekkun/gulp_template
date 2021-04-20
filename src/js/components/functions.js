/**
 * FUNCTIONS
 */

window.addEventListener('load', () => {});
window.addEventListener('DOMContentLoaded', () => {});
const App = () => {
  const $body = document.body;
  const dataApp = $body.dataset.app;
  if (!dataApp) {
    return false;
  }
  return dataApp;
};
export default App;
