/* jshint camelcase: false */
'use strict';
var User = require('../user/user_model.js')
  , Solve = require('../solve/solve_model.js')
  ;
module.exports = exports = {
  create: function (req, res, next) {
    var newCategory = req.params.category;
    var user = req.user;
    user.categories = user.categories || [];
    if (user.categories.indexOf(newCategory) >= 0) {
      next('Category already exists');
    } else {
      User.findByIdAndUpdate(
        user._id,
        { $push: {
            categories: newCategory
          }
        },
        { select: {
            'googleAccount.token.refresh_token': 0
          }
        }
      ).exec().then(function (updatedUser) {
        res.json(updatedUser);
      }, function (reason) {
        next(reason);
      });
    }
  },
  delete: function (req, res, next) {
    var deleteCategory = req.params.category;
    var user = req.user;
    user.categories = user.categories || [];
    if (user.categories.indexOf(deleteCategory) < 0) {
      next('Category ' + deleteCategory + ' does not exist');
    } else {
      // delete solves mapped to this category
      var removeSolves = Solve.remove({category: deleteCategory});
      // delete the category
      var removeCategory = User.findByIdAndUpdate(
        { _id: user._id },
        { $pull: {
          categories: deleteCategory
        }
      });

      removeSolves.exec()
        .then(removeCategory.exec()
          .then(function(updatedUser) {
            res.json(updatedUser);
          }, function(reason) {
            next(reason);
          })
        );
    }
  },
  verifyUserParam: function(req, res, next) {
    if (!req.user) {
      next('User not set');
      return;
    }
    if (req.user._id.toString() !== req.params.user.toString()) {
      next('User ids do not match');
      return;
    }
    next();
  }
};
