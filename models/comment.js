module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
  	'Comment',
    { texto: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta Comentario"}}
      },
      publicado: {
      	type: DataTypes.BOOLEAN,
      	defaultValue: false
      }
    }    
 ,
  {
    classMethods: {
	  //Preguntas con comentario
      countCommentedQuizes: function () {
        return this.aggregate('QuizId', 'count', { distinct: true }).then('success', function(count) {
			return count;
    })
      }
    }
  });
};
