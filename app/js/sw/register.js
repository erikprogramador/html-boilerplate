const navigator = window.navigator;
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
  .then(() => console.log("Service Worker is running!"))
  .catch(e => console.error('Error during service worker registration:', e));
}
