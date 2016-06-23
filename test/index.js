var assert = require('chai').assert;
var should = require('chai').should();
var Sequelize = require('sequelize');

var db = new Sequelize('postgresql://test1:test1@localhost/test1');

var UserModel = require('sequelize-user');
var User = UserModel.define(db, 'user', {email:{
                                            smtp:"smtp://test:test@ssl0.test.net",
                                            send:false
                                          }
                                      });

var ArticleModel = require('../index.js');
var Article = db.define('article', ArticleModel.mergeModel({}), ArticleModel.mergeMethods({}));

var Comment = ArticleModel.defineRelation(db, Article, User);


describe("Test user creation >>", function(){
   it('initialize the DB', function () {
      return db.drop().then(function(){
        return db.sync();
      });
   })
   it('create user, article, comment and test to find One', function(){
      var userPr = User.createUser({login:"tarama", email:"tarama@gmail.com", password:"totototo"})
      var articlePr = userPr.then(function(user){
       should.exist(user);
       var article = {title: "this is a title of an article!", userId: user.id};
       return Article.create(article)
     })
     var user2Pr = articlePr.then(function(article){
       should.exist(article);
       article.should.be.an('object');
       assert.equal(article.title, 'this is a title of an article!');
       should.exist(article.permaLink);
       return User.createUser({login:"tarama2", email:"taram2a@gmail.com", password:"totototo"});
     })
     var commentPr = user2Pr.then(function(user){
       should.exist(user);
       var article = articlePr.value();
       var comment = {articleId: article.id, userId: user.id, comment:'this is a comment!'};
       return Comment.create(comment);
     })
     var findPr = commentPr.then(function(comment){
       should.exist(comment);
       comment.should.be.an('object');
       assert.equal(comment.comment, 'this is a comment!');
       should.exist(comment.isValid, false);
       var article = articlePr.value();
       return Article.findArticle(article.permaLink);
     })

     return findPr.then(function(article){
       should.exist(article);
       var article = article.get({plain:true});
       console.log(article);
     }).catch(function(error){
       console.log("error ", error);
       should.not.exist(error);
     })
   });
})
