const express = require('express');
const mysql = require('mysql');

const router = express.Router();
const app = express();

let DBconnection;
SelectAllElements = () => {
	return new Promise((resolve, reject) => {
		DBconnection.query('SELECT * FROM kategorie_tbl', (error, elements) => {
			if (error) {
				return reject(error);
			}
			return resolve(elements);
		});
	});
};

function DatenbankverbindungHerstellen() {
	const DBconnection = mysql.createConnection({
		host: 'localhost',
		port: 3306,
		user: 'root',
		password: '',
		database: 'uShop',
	});
	DBconnection.connect((err) => {
		err == null ? console.log('Kein Fehler beim Verbinden ') : console.log('Fehler beim Verbinden');
	});

	return DBconnection;
}

function DatenbankverbindungTrennen(dbcon) {
	dbcon.end((err) => {
		err == null ? console.log('Kein Fehler beim Trennen ') : console.log('Fehler beim Trennen');
	});
}

//Begrüssung wenn sich ein User einloggt
router.post('/loginAdmin', (req, res) => {
	const email = req.body.email;
	const password = req.body.passwort;
	const DBconnection = DatenbankverbindungHerstellen();

	DBconnection.query(
		`SELECT * FROM kunden_tbl WHERE Email = ${email}; `,
		(err, results, fields) => {
			console.log(`Datenbank: ${results}`);
		},
	);

	//DB trennen
	DatenbankverbindungTrennen(DBconnection);
});

//Produkte aus der Datenbank
router.get('/getProducts', (req, res) => {
	//Verbinden mit DB
	DBconnection = DatenbankverbindungHerstellen();

	//Bekommene Produkte + weiterschicken zum Frontend
	DBconnection.query(
		`SELECT ProduktID, Name, Preis, Bewertung, Kurzbeschreibung, KategorieName AS 'Kategorie', Link3D FROM produkt_tbl
  JOIN kategorie_tbl kt on kt.Kategorie_ID = produkt_tbl.Kategorie_FK;`,
		(err, results, fields) => {
			res.send(results);
		},
	);

	//Datenbankverbindung trennen
	DatenbankverbindungTrennen(DBconnection);
});

//Kategorien aus der Datenbank
router.get('/getCategories', (req, res) => {
	//Verbinden mit DB
	DBconnection = DatenbankverbindungHerstellen();

	//Bekommene Produkte + weiterschicken zum Frontend
	DBconnection.query('SELECT * FROM kategorie_tbl', (err, results, fields) => {
		res.send(results);
	});

	//Datenbankverbindung trennen
	DatenbankverbindungTrennen(DBconnection);
});

router.post('/UpdateProduct', async (req, res) => {
	//verbindung herstellen
	DBconnection = DatenbankverbindungHerstellen();

	const body = req.body;

	const ID = body.ProduktID;
	const Name = body.Name;
	const Preis = body.Preis;
	const Bewertung = body.Preis;
	const Kurzbeschreibung = body.Kurzbeschreibung;
	let Kategorie_ID;
	// const Link3D = body.Link3D

	//Name ID match finden
	const Kategories = await SelectAllElements();
	Kategories.forEach((element) => {
		// console.log(`ID: ${element.Kategorie_ID} | Name: ${element.KategorieName}`)
		//Sucht zu dem Input die ID
		if (element.KategorieName == ID) {
			console.log(`Die Kategorie ist ${kategorieInput}, die ID ist ${element.Kategorie_ID}`);
			Kategorie_ID = element.Kategorie_ID;
		}
	});

	let str = `UPDATE produkt_tbl SET Name = ?, Preis = ?, Bewertung = ?, Kurzbeschreibung = ?, Kategorie_FK = ? WHERE ProduktID = ?;`;
	DBconnection.query(
		str,
		[Name, Preis, Bewertung, Kurzbeschreibung, Kategorie_ID, ID],
		(err, result, fields) => {
			if (!err) {
				console.log('Success');
				res.send('Success');
			} else {
				console.log(err);
				res.send('error');
			}
		},
	);
	//Datenbank trennen
	DatenbankverbindungTrennen(DBconnection);
});

//Funktioniert, Link3D muss noch angepasst werden
router.post('/AddProduct', async (req, res) => {
	DBconnection = DatenbankverbindungHerstellen();
	const body = req.body;
	const kategorieInput = body.Kategorie;
	let kategorieID;

	//Kategorien aus der DB bekommen
	const Kategories = await SelectAllElements();
	Kategories.forEach((element) => {
		// console.log(`ID: ${element.Kategorie_ID} | Name: ${element.KategorieName}`)
		//Sucht zu dem Input die ID
		if (element.KategorieName == kategorieInput) {
			console.log(`Die Kategorie ist ${kategorieInput}, die ID ist ${element.Kategorie_ID}`);
			kategorieID = element.Kategorie_ID;
		}
	});

	//Todo Insert new Product
	const str = `INSERT INTO produkt_tbl (Name, Preis, Bewertung, Kurzbeschreibung, Kategorie_FK) VALUES (?,?,?,?,?); `;
	DBconnection.query(
		str,
		[body.Name, body.Preis, body.Bewertung, body.Kurzbeschreibung, kategorieID],
		(err, result, fields) => {
			if (!err) {
				res.send('Success');
				console.log('Success');
			} else {
				res.send(err);
				console.log(err);
			}
		},
	);

	//Datenbank trennen
	DatenbankverbindungTrennen(DBconnection);
});

//Delete Fertig
router.post('/DeleteProduct', (req, res) => {
	//Verbinung starten
	DBconnection = DatenbankverbindungHerstellen();

	const body = req.body;
	const kategorieToDelete = body.ProduktID;

	console.log(kategorieToDelete);
	console.log(body);

	let str = `DELETE FROM produkt_tbl WHERE ProduktID = ?; `;
	DBconnection.query(str, [kategorieToDelete], (err, result, fields) => {
		if (!err) {
			console.log('deleted');
			res.send('Deleted');
		} else {
			console.log(err);
			res.send(err);
		}
	});

	//Verbinung trennen
	DatenbankverbindungTrennen(DBconnection);
});

module.exports = router;
