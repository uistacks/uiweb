'use strict';

/**
 * Module dependencies
 */
var areasPolicy = require('../policies/areas.server.policy'),
  areas = require('../controllers/areas.server.controller');

module.exports = function (app) {
  // Areas collection routes
  app.route('/api/areas').all(areasPolicy.isAllowed)
    .get(areas.list)
    .post(areas.create);

  // Single area routes
  app.route('/api/areas/:areaId').all(areasPolicy.isAllowed)
    .get(areas.read)
    .put(areas.update)
    .delete(areas.delete);

  // Finish by binding the area middleware
  app.param('areaId', areas.areaByID);
};
