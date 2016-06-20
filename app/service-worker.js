toolbox.options.debug = true;

toolbox.precache([
  '/',
]);

toolbox.router.get('/', toolbox.fastest);
