var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres:
var sequelize = new Sequelize(DB_name, user, pwd,
			{dialect: protocol,
		         protocol: protocol,
			 port: port,
			 host: host,
		         storage: storage, // solo SQLite (.env)
			 omitNull: true    // solo Postgres
			}
			);

// Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Importar definicion de la tabla Comment
var Comment = sequelize.import(path.join(__dirname,'comment'));

Comment.belongsTo(Quiz); // parte 1 de la relación
Quiz.hasMany(Comment);   // parte n de la relación

exports.Quiz = Quiz; // exportar definicion de la tabla Quiz
exports.Comment = Comment; // exportar tabla Comment
exports.sequelize = sequelize;//exportamos BD para estadísticas.

// sequelize.sync() crea e inicializa tabla de preguntas en DB
//sequelize.sync().success(function() {
//	// success(...) ejectuta el manejador una vez creada la tabla
//	Quiz.count().success(function (count){
//	  if(count === 0) { // la tabla se inicializa solo si está vacía
//		Quiz.create({ pregunta: 'Capital de Italia',
//			      respuesta: 'Roma'
//			   })
//	        .success(function(){console.log('Base de datos inicializada')});
//	  };
//	});
//});

// sequelize.sync() inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
	// then(...) ejectuta el manejador una vez creada la tabla
	Quiz.count().then(function (count){
	  if(count === 0) { // la tabla se inicializa solo si está vacía
		Quiz.bulkCreate( 
		[ {pregunta: 'Capital de Italia',   respuesta: 'Roma', tema: 'Geografía'},
		  {pregunta: 'Capital de Francia', respuesta: 'Paris', tema: 'Geografía'},
		  {pregunta: 'Bus Universal en Serie', respuesta: 'USB', tema: 'Tecnología'},
		  {pregunta: 'Planeta rojo', respuesta: 'Marte', tema: 'Ciencia'}
		]
                ).then(function(){console.log('Base de datos inicializada')});
	  };
	});
});
