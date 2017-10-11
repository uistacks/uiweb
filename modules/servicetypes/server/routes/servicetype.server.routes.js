'use strict';

/**
 * Module dependencies
 */
var servicetypesPolicy = require('../policies/servicetypes.server.policy'),
  servicetypes = require('../controllers/servicetypes.server.controller');

module.exports = function (app) {
  // Servicetypes collection routes
  app.route('/api/servicetypes').all(servicetypesPolicy.isAllowed)
    .get(servicetypes.list)
    .post(servicetypes.create);

  // Single servicetype routes
  app.route('/api/servicetypes/:servicetypeId').all(servicetypesPolicy.isAllowed)
    .get(servicetypes.read)
    .put(servicetypes.update)
    .delete(servicetypes.delete);

  // Finish by binding the servicetype middleware
  app.param('servicetypeId', servicetypes.servicetypeByID);
};
