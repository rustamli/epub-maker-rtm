const fastify = require('fastify')();
const gen = require('./epub-generator');

fastify.get('/generate', function(request, reply) {
  gen.run();
  reply.send({ status: 'done' });
});

fastify.get('/', function(request, reply) {
  reply.send('Hello');
});

fastify.listen(3000, function(err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
