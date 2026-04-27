window.addEventListener('load', () => {
  if (typeof live2dDriver === 'function') {
    live2dDriver();
  } else {
    console.error('[Live2D] live2dDriver() not found. Check src/main.js load order.');
  }
});