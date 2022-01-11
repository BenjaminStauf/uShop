require('dotenv').config();
const mysql = require('mysql');


function DatenbankverbindungHerstellen() {
	const DBconnection = mysql.createConnection({
		//Gehostete Datenbank
		// host: 'eu-cdbr-west-01.cleardb.com',
		// port: 3306,
		// user: 'bead1d001b93b1',
		// password: '5f567e48',
		// database: 'heroku_14c734bdf1dfa98',

		//Locale Datenbank
		host: 'localhost',
		port: 3306,
		user: 'root',
		password: '',
		database: 'ushop',
	});
	DBconnection.connect((err) => {
		err == null
			? console.log('Kein Fehler beim Verbinden ')
			: console.log('Fehler beim Verbinden' + err);
	});

	return DBconnection;
}

function DatenbankverbindungTrennen(dbcon) {
	dbcon.end((err) => {
		err == null ? console.log('Kein Fehler beim Trennen ') : console.log('Fehler beim Trennen');
	});
}

module.exports = { DatenbankverbindungHerstellen, DatenbankverbindungTrennen };
