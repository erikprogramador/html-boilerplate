toolbox.options.debug = true;

toolbox.precache([
  '/',
  '/css/main.css',
  '/js/main.js'
]);

toolbox.router.get('/', toolbox.fastest);
toolbox.router.get('main.css', toolbox.fastest);
toolbox.router.get('main.js', toolbox.fastest);
