var Sequelize = require('sequelize');

var removeDiacritics = require('./modules/removeDiacritics');
var CommentModel = require('./modules/sequelizeComment');

var _Comment;
var _User;

module.exports.mergeModel = function(model) {
  return Sequelize.Utils._.merge({title: {type:Sequelize.STRING, allowNull:false},
                                  permaLink: {type:Sequelize.STRING, allowNull:false}}, model);
}

module.exports.mergeMethods = function(methods){
  return Sequelize.Utils._.merge({
                                  hooks:{
                                    beforeValidate:function(article){
                                      article.permaLink = removeDiacritics.clean(article.title);
                                    }
                                  },
                                  classMethods:{
                                    findArticle: function(permaLink){
                                      return this.findOne({where: {permaLink:permaLink},
                                        include:[{model:_Comment, include:{model:_User, attributes:{exclude:['password','createdAt','updatedAt','email','emailIsValid']}}},
                                        {model:_User, attributes:{exclude:['password','createdAt','updatedAt','email','emailIsValid']}}]});
                                    }
                                  }
                                }, methods);
}

module.exports.defineRelation=function(db, Article, User, options){
    var prefix = options == null || options.prefix == null ? 'article_' : options.prefix;
    var addComment = options == null?true:options.addComment;
    if(addComment){
      _Comment = db.define(prefix + '_comment', CommentModel.model);
      Article.hasMany(_Comment);
      _Comment.belongsTo(Article);
      User.hasMany(_Comment);
      _Comment.belongsTo(User);
      User.hasMany(Article);
      Article.belongsTo(User);
    }
    _User = User;
    /*var addFavorit = options == null?true:options.addFavorit;
    if(addFavorit){
      UnicAction = db.define(prefix + '_favorit', unicActionModel.model, unicActionModel.methods);
    }*/
    return _Comment;
}
