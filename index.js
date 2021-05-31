const fastify = require('fastify')();
const path = require('path');
const gen = require('./epub-generator');

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public')
});

fastify.get('/generate', async function(request, reply) {
  gen.run(reply);
});

fastify.listen(3005, function(err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
