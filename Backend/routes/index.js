const express = require('express');
const mysql = require('mysql');
const paypal = require('paypal-rest-sdk');
const open = require('open');

const router = express.Router();
const app = express();

let DBconnection;

//-------WICHTIGE METHODEN-------
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

const LoggedInÜberprüfung = (req, res, next) => {
	req.session.User ? next() : res.send('User nicht eingeloggt');
};

//-------ROUTER ANSCHRIFTEN-------

//Begrüssung wenn sich ein User einloggt

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

router.post('/KundeRegister', (req, res) => {
	//KundenDaten bekommen
	const { Vorname, Nachname, Email, Passwort, Strasse, Plz, Ort, IsAdmin } = req.body;

	//Sich mit der Datenbank verbinden
	DBconnection = DatenbankverbindungHerstellen();
	//Kunde in die Datenbank eintragen
	let QueryStr =
		'INSERT INTO kunden_tbl (Vorname, Nachname, Email, Passwort, StrasseHsnr, Plz, Ort, IsAdmin) VALUES (?,?,?,?,?,?,?,?)';
	DBconnection.query(
		QueryStr,
		[Vorname, Nachname, Email, Passwort, Strasse, Plz, Ort, IsAdmin],
		(err) => {
			!err ? res.send('sucess') : res.send('Fehler');
		},
	);
	//Datenbankverbindung trennen
	DatenbankverbindungTrennen(DBconnection);
});

router.post('/KundenLogin', (req, res) => {
	const { Email, Passwort } = req.body;
	console.log(`Email: ${Email} Passwort: ${Passwort}`);

	//Datenbankverbindung herstellen
	DBconnection = DatenbankverbindungHerstellen();

	//User vergleichen und Cookie setzen
	let QueryStr =
		'SELECT Kunden_ID, Vorname, Nachname, Email, Passwort, StrasseHsnr, Ort, Plz, IsAdmin FROM kunden_tbl WHERE Email LIKE ? && Passwort LIKE ? GROUP BY Kunden_ID, Vorname, Nachname, Email, Passwort, StrasseHsnr, Ort, Plz, IsAdmin;';
	let ResKunde = DBconnection.query(QueryStr, [Email, Passwort], (error, results) => {
		if (!error) {
			let FoundUser = results[0];
			//Cookie anlegen
			req.session.User = FoundUser;
			res.status(200).json({ FoundUser });
			return FoundUser;
		}
	});

	//Datenbankverbindung trennen
	DatenbankverbindungTrennen(DBconnection);
});

router.get('/KundeLogout', LoggedInÜberprüfung, (req, res) => {
	//Session-Dinge löschen
	req.session.destroy();
	res.clearCookie('uShopSession');
	res.end();
});

//Produkt in der Datenbank ändern
router.post('/UpdateProduct', async (req, res) => {
	//verbindung herstellen
	DBconnection = DatenbankverbindungHerstellen();

	const body = req.body;

	const ID = body.ProduktID;
	const Name = body.Name;
	const Preis = body.Preis;
	const Bewertung = body.Bewertung;
	const Kategorie = body.Kategorie;
	const Kurzbeschreibung = body.Kurzbeschreibung;
	let Kategorie_ID;
	// const Link3D = body.Link3D

	//Name ID match finden
	const Kategories = await SelectAllElements();
	Kategories.forEach((element) => {
		//Sucht zu dem Input die ID
		if (element.KategorieName == Kategorie) {
			console.log(`Die Kategorie ist ${Kategorie}, die ID ist ${element.Kategorie_ID}`);
			Kategorie_ID = element.Kategorie_ID;
		}
	});

	console.log(
		`ID: ${ID} |  Name: ${Name} | Preis: ${Preis} | Bewertung: ${Bewertung} | Kurzbeschreibung: ${Kurzbeschreibung} | Kategorie ID:  ${Kategorie_ID}`,
	);

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

//Produkt in die Datenbank hinzufügen
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

	const queryStr = `INSERT INTO produkt_tbl (Name, Preis, Bewertung, Kurzbeschreibung, Kategorie_FK) VALUES (?,?,?,?,?); `;
	DBconnection.query(
		queryStr,
		[body.Name, body.Preis, body.Bewertung, body.Kurzbeschreibung, kategorieID],
		(err, result, fields) => {
			if (!err) {
				console.log('Success');
				res.send('Success');
			} else {
				console.log(err);
				res.send(err);
			}
		},
	);

	//Datenbank trennen
	DatenbankverbindungTrennen(DBconnection);
});

//Produkt aus Datenbank löschen
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

router.post('/pay', (req, res) => {
	const body = req.body;
	console.log(body);

	//paypal konfigurieren
	paypal.configure({
		mode: 'sandbox',
		client_id: 'AU4vIfPLLUwv8AQTXs1_rIHlVi3AR7Ky-ipawRjYVD9W2wZNO90og-B8Ie4_8woG8GLUxiY2q2eardpQ',
		client_secret:
			'EDGiZ5n_0212_yU84euuekxtqiri7Qmo_VSJAeoneADre6qBxGY5wRazjtaZo4pHiCgsI6OW06ilETqw',
	});

	//Item erstellen welches an Paypal uebergeben wird
	bezahlenItem = [];
	for (const iterator of body) {
		let obj = {
			name: iterator.Name,
			//sku: iterator.ID,
			price: iterator.Preis.toFixed(2),
			currency: 'EUR',
			quantity: iterator.Anzahl,
		};

		bezahlenItem.push(obj);
	}

	//Gesammtpreis aufsummieren
	let summe = 0;
	for (const iterator of bezahlenItem) {
		summe += iterator.price * iterator.quantity;
	}

	//JSON zahlung erstellen
	const create_payment_json = {
		intent: 'sale',
		payer: {
			payment_method: 'paypal',
		},
		redirect_urls: {
			return_url: 'http://localhost:8080/success',
			cancel_url: 'http://localhost:8080/#/Basket',
		},
		transactions: [
			{
				item_list: {
					items: bezahlenItem,
				},
				amount: {
					currency: 'EUR',
					total: summe.toFixed(2),
				},
				description: 'Hallo, das ist ein Test',
			},
		],
	};

	//zahlung durchfuehren und weiterleiten zu Paypal
	paypal.payment.create(create_payment_json, (error, payment) => {
		if (error) {
			throw error;
		} else {
			for (let i = 0; i < payment.links.length; i++) {
				if (payment.links[i].rel === 'approval_url') {
					//res.redirect(payment.links[i].href);
					//res.writeHead(200, { Location: payment.links[i].href + '/' });
					//res.redirect(200, 'https://www.orf.at');
					open(payment.links[i].href);
				}
			}
		}
	});
});

module.exports = router;
