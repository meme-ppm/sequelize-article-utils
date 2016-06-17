var assert = require('chai').assert;
var should = require('chai').should();

var Sequelize = require('sequelize');
var db = new Sequelize('postgresql://test1:test1@localhost/test1');

describe("Test user creation >>", function(){
   it('initialize the DB', function () {
      return db.drop().then(function(){
        return db.sync();
      });
   })
})
