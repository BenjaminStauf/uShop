//#region
//PAYPAL KUNDEN DATEN:
//USER: sb-osykw8452307@personal.example.com
//PASSWORT: jA"h9)ep
//#endregion

const express = require('express');
const mysql = require('mysql');
const paypal = require('paypal-rest-sdk');
const open = require('open');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

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

async function SendMailAuthCode(genCode, name, toMail) {
	//Nodemailer Transporter erstellen
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'uShop.HTLWW@gmail.com',
			pass: 'uShop_HTLWW_16',
		},
	});

	//Configure Handlebar
	const handlebarOptions = {
		viewEngine: {
			extName: '.handlebars',
			partialsDir: path.resolve(__dirname, 'templateViews'),
			defaultLayout: false,
		},
		viewPath: path.resolve(__dirname, 'templateViews'),
		extName: '.handlebars',
	};

	//transporter soll Handlebars verwenden
	transporter.use('compile', hbs(handlebarOptions));

	console.log('To-Email: ' + toMail);

	//Mail options
	let mailoptions = {
		from: 'uShop.HTLWW@gmail.com',
		to: toMail,

		// to: "benjamin.stauf11@gmail.com",
		subject: 'Verifizierung',
		template: 'authentification',
		context: {
			Name: name,
			Code: genCode,
		},
	};

	//Email senden
	transporter.sendMail(mailoptions, (err, info) => {
		if (err) console.log(err);
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

router.post('/SendCode', (req, res) => {
	//Daten bekommen
	const { Vorname, Nachname, Email } = req.body;

	//Arrow-Function erstellt den Key (5 Stellig)
	let MakeKey = () => {
		const auswahlStr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let str = '';
		for (let index = 0; index < 6; index++) {
			str += auswahlStr[Math.floor(Math.random() * auswahlStr.length)];
		}
		return str;
	};
	//Key erstellen
	const code = MakeKey();

	//Bestätigungsmail Senden
	SendMailAuthCode(code, Vorname + ' ' + Nachname, Email);

	//Code ausgeben
	res.send(code);
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
	let Found = DBconnection.query(QueryStr, [Email, Passwort], (error, results) => {
		if (!error) {
			let FoundUser = results[0];

			//   Cookie anlegen
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

//Item erstellen welches an Paypal uebergeben wird
bezahlenItem = [];

//Gesammtpreis aufsummieren
let summe = 0;

//Object welches bei aufrufen von pay mitgeschickt wird
let bodyObject = null;

router.post('/pay', (req, res) => {
	bodyObject = req.body;

	const { warenkorb } = req.body;

	//zahlen objekjt erstellen
	for (const iterator of warenkorb) {
		let obj = {
			name: iterator.Name,
			//sku: iterator.ID,
			price: iterator.Preis.toFixed(2),
			currency: 'EUR',
			quantity: iterator.Anzahl,
		};

		bezahlenItem.push(obj);
	}

	//gesmatsumme rechnen
	for (const iterator of bezahlenItem) {
		summe += iterator.price * iterator.quantity;
	}
	//paypal konfigurieren
	paypal.configure({
		mode: 'sandbox',
		client_id: 'AU4vIfPLLUwv8AQTXs1_rIHlVi3AR7Ky-ipawRjYVD9W2wZNO90og-B8Ie4_8woG8GLUxiY2q2eardpQ',
		client_secret:
			'EDGiZ5n_0212_yU84euuekxtqiri7Qmo_VSJAeoneADre6qBxGY5wRazjtaZo4pHiCgsI6OW06ilETqw',
	});

	//JSON zahlung erstellen
	const create_payment_json = {
		intent: 'sale',
		payer: {
			payment_method: 'paypal',
		},
		redirect_urls: {
			return_url: 'http://localhost:2410/success',
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
				description: 'Zahlbeschreibung!',
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

router.get('/success', (req, res) => {
	const payerId = req.query.PayerID;
	const paymentId = req.query.paymentId;

	console.log(req.body);

	const execute_payment_json = {
		payer_id: payerId,
		transactions: [
			{
				amount: {
					currency: 'EUR',
					total: summe,
				},
			},
		],
	};

	// Obtains the transaction details from paypal
	paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
		//When error occurs when due to non-existent transaction, throw an error else log the transaction details in the console then send a Success string reposponse to the user.
		if (error) {
			console.log(error.response);
			throw error;
		} else {
			open('http://localhost:8080');

			//send MAIL
			const { aktiveruser, warenkorb } = bodyObject;

			console.log(warenkorb);

			//Nodemailer Transporter erstellen
			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'uShop.HTLWW@gmail.com',
					pass: 'uShop_HTLWW_16',
				},
			});

			//Configure Handlebar
			const handlebarOptions = {
				viewEngine: {
					extName: '.handlebars',
					partialsDir: path.resolve(__dirname, 'templateViews'),
					defaultLayout: false,
				},
				viewPath: path.resolve(__dirname, 'templateViews'),
				extName: '.handlebars',
			};

			//transporter soll Handlebars verwenden
			transporter.use('compile', hbs(handlebarOptions));

			//String bauen
			//#region
			let stringAnfang = `<nav style="background-color: gray; height: auto">
			<!-- <img src="./uShop_Logo.png" alt="Logo" /> -->
			<!--<img src="./uShop_Logo.svg" alt="Logo" style="height: 15%; width: 15%" /> -->
		</nav>
		<h2 style="text-align: center; padding-top: 2%">Vielen Dank !</h2>

		<h4 style="text-align: center">Hallo ${aktiveruser.Vorname}  ${aktiveruser.Nachname}</h4>
		<br />
		<p style="text-align: center">
			Ihre Bestellung wurde soeben aufgenommen und wird schnellstmöglichen für den Versand an Ihre
			Adresse vorbereitet.
		</p>
		<br />
		<p style="padding-left: 9%">Sie haben bestellt:</p>
		<br />
		<div>
			<table style="border-collapse: collapse; width: 75%; margin-left: auto; margin-right: auto">
				<tr>
					<th style="border: 1px solid #dddddd; text-align: left; padding: 8px">Anzahl</th>
					<th style="border: 1px solid #dddddd; text-align: left; padding: 8px">Produkt Name</th>
					<th style="border: 1px solid #dddddd; text-align: left; padding: 8px">Preis</th>
				</tr>`;

			let stringDyn = '';

			for (let i = 0; i < warenkorb.length; i++) {
				stringDyn += `
			<tr>
				<td style="border: 1px solid #dddddd; text-align: left; padding: 8px">${warenkorb[i].Anzahl}</td>
				<td style="border: 1px solid #dddddd; text-align: left; padding: 8px">${warenkorb[i].Name}</td>
				<td style="border: 1px solid #dddddd; text-align: left; padding: 8px">${warenkorb[i].Preis}€</td>
			</tr>`;
			}

			let stringEnd = `</table>
			</div>
			<p style="text-align: right; padding-right: 12.5%">GESAMT: ${summe}€</p>`;

			//#endregion

			let stringFertig = stringAnfang + stringDyn + stringEnd;

			//Mail options
			let mailoptions = {
				from: 'uShop.HTLWW@gmail.com',
				to: aktiveruser.Email,
				subject: 'Ihre Rechnung von uShop',
				// text: `Hallo ${name}. Sie haben mir diese Nachricht geschickt: ${message}.`,
				html: stringFertig,
			};

			//Email senden
			transporter.sendMail(mailoptions, (err, info) => {
				if (err) console.log(err);
				//else console.log(info);
			});

			//Variablen clearen
			bezahlenItem = [];
			summe = null;
			bodyObject = null;
		}
	});
});

module.exports = router;
