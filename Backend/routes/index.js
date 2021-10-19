const express = require('express');
const mysql = require('mysql');

const router = express.Router();
const app = express();

let DBconnection;

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

router.post('/UpdateProduct', (req, res) => {
	const erg = req.body;
	console.log(erg);
});

router.post('/AddProduct', (req, res) => {
	// const erg = req.body;
	// const str = `INSERT INTO produkt_tbl (Name, Preis, Bewertung, Kurzbeschreibung, Kategorie_FK, Link3D) VALUES (?,?,?,?); `;
	let Kategorien = getKategorien();

	console.log(Kategorien);

	// console.log(Kategorien)
});

router.post('/DeleteProduct', (req, res) => {
	const erg = req.body;
	console.log(erg);
});

async function getKategorien() {
	DBconnection = DatenbankverbindungHerstellen();

	const erg = await DBconnection.query('SELECT * FROM kategorie_tbl');
	console.log(erg.result);

	DatenbankverbindungTrennen(DBconnection);
}
module.exports = router;
