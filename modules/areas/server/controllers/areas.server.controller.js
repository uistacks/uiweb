'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Area = mongoose.model('Area'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an area
 */
exports.create = function (req, res) {
  var area = new Area(req.body);
  area.user = req.user;
  area.content = { type: 'Polygon', coordinates: req.body.content };

  area.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(area);
    }
  });
};

/**
 * Show the current area
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var area = req.area ? req.area.toJSON() : {};

  // Add a custom field to the Area, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Area model.
  area.isCurrentUserOwner = !!(req.user && area.user && area.user._id.toString() === req.user._id.toString());

  res.json(area);
};

/**
 * Update an area
 */
exports.update = function (req, res) {
  var area = req.area;

  area.title = req.body.title;
  area.content = { type: 'Polygon', coordinates: req.body.content };

  area.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(area);
    }
  });
};

/**
 * Delete an area
 */
exports.delete = function (req, res) {
  var area = req.area;

  area.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(area);
    }
  });
};

/**
 * List of Areas
 */
exports.list = function (req, res) {
  Area.find().sort('-created').populate('user', 'displayName').exec(function (err, areas) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(areas);
    }
  });
};

/**
 * Area middleware
 */
exports.areaByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Area is invalid'
    });
  }

  Area.findById(id).populate('user', 'displayName').exec(function (err, area) {
    if (err) {
      return next(err);
    } else if (!area) {
      return res.status(404).send({
        message: 'No area with that identifier has been found'
      });
    }
    req.area = area;
    next();
  });
};
