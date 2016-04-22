var path = require('path');

// Postgress DATABASE_URL = postgress://user:passwd@host:port/database
// SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/),
	DB_name = (url[6] || null),
	user = (url[2] || null),
	pwd = (url[3] || null),
	protocol = (url[1] || null),
	dialect = (url[1] || null),
	port = (url[5] || null),
	host = (url[4] || null),
	storage = process.env.DATABASE_STORAGE;

var	Sequelize = require('sequelize');

// Usar BBDD SQLite (ahora secuelize va en minusculas)
var sequelize = new Sequelize(DB_name, user, pwd,
						{
							dialect: protocol,
							protocol: protocol,
							port: port,
							host: host,
							storage: storage //solo SQLite (.env)

						}
					);

// Importar la definicion de la tabla Quiz en quiz.js
var quiz_path = path.join (__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);
exports.Quiz=Quiz; //exportar definicion de tabla Quiz

// sequelize.sync() crea e inicializa tabla de preguntas en la bbdd
sequelize.sync().success(function () {
	// success(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().success (function (count) {
		if (count ===0) { //la tabla se inicializa solo si esta vacia
			Quiz.create ({
				pregunta: 'Capital de Italia',
				respuesta: 'Roma'
			})
			.success(function () {
				console.log('Base de datos inicializada');
			});
		};
	});
});