require('dotenv').config();
const open = require('open');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const stripe = require('stripe')(process.env.STRIPE_SECRET);

//VARIABLEN:
let DBconnection;

//Globale Funktionen einbinden
const {
	DatenbankverbindungHerstellen,
	DatenbankverbindungTrennen,
} = require('../globale_Dinger.js');

//#region Nodemailer

const oauth2Client = new OAuth2(
	'674951647718-soho8qm58h7verirgpkbr2rp6bj4ee3j.apps.googleusercontent.com',
	'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',
	'https://developers.google.com/oauthplayground',
);

oauth2Client.setCredentials({
	refresh_token:
		'1//04ovGHAJDtAogCgYIARAAGAQSNwF-L9IrCe0F1-nEJKDxVh-TZe1XPl-8ooCZh1uGtqJvgZvyqVbb23iDJlMX_Zpy_OWBjCTNnDA',
});
const accessToken = oauth2Client.getAccessToken();

const smtpTransport = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		type: 'OAuth2',
		user: 'ushop.htlww@gmail.com',
		clientId: '674951647718-soho8qm58h7verirgpkbr2rp6bj4ee3j.apps.googleusercontent.com',
		clientSecret: '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',
		refreshToken:
			'1//04ovGHAJDtAogCgYIARAAGAQSNwF-L9IrCe0F1-nEJKDxVh-TZe1XPl-8ooCZh1uGtqJvgZvyqVbb23iDJlMX_Zpy_OWBjCTNnDA',
		accessToken: accessToken,
	},
	tls: {
		rejectUnauthorized: false,
	},
});

//#endregion

//#region Funktionen
const payment = async (req, res) => {
	//get Data from the user
	const { warenkorb, aktiveruser } = req.body;
	let arr = [];
	let summe = 0;
	for (const iterator of warenkorb) {
		summe += iterator.Preis * iterator.Anzahl;
		let price_data = {
			price_data: {
				currency: 'EUR',
				product_data: {
					name: iterator.Name,
				},
				unit_amount: iterator.Preis * 100,
			},
			quantity: iterator.Anzahl,
		};

		arr.push(price_data);
	}
	//create session
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: arr,
		mode: 'payment',
		// success_url: 'https://ushop-htlww.herokuapp.com',
		// cancel_url: 'https://ushop-htlww.herokuapp.com',
		success_url: 'http://localhost:8080/#/success?allowed=true',
		cancel_url: 'http://localhost:8080/#/cancle?allowed=true',
	});
	console.log(session);
	open(session.url);

	//send MAIL
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

	//smtpTransport soll Handlebars verwenden
	smtpTransport.use('compile', hbs(handlebarOptions));

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
	smtpTransport.sendMail(mailoptions, (error, response) => {
		error ? console.log(error) : console.log(response);
		smtpTransport.close();
	});

	res.status(200).send('Success');
};

const getOrders = (req, res) => {
	const KundenID = req.body.KundenID;
	console.log(KundenID);

	//Datenbankverbindung herstellen
	DBconnection = DatenbankverbindungHerstellen();

	let str = `SELECT Kunden_ID, Kunden_ID, Vorname, Nachname, bestell_ID, Name, Anzahl, Preis, Datum, ProduktID
	from bestellung_detail
			 JOIN bestellung b on b.bestell_ID = bestellung_detail.fk_bestell_ID
			 JOIN kunden_tbl kt on kt.Kunden_ID = b.Kunden_FK
			 JOIN produkt_tbl pt on pt.ProduktID = bestellung_detail.fk_produkt_ID WHERE Kunden_ID = ?;`;

	DBconnection.query(str, [KundenID], (err, result, fields) => {
		if (!err) {
			console.log('Success');
			res.send(result);
		} else {
			console.log(err);
		}
	});
	DatenbankverbindungTrennen(DBconnection);
};

const addOrder = (req, res) => {
	const { warenkorb, aktiveruser } = req.body;
	console.log(aktiveruser);
	let bestellID;

	//Summe des Einkaufs berechnen
	let summe = 0;
	warenkorb.forEach((elem) => (summe += elem.Preis * elem.Anzahl));

	//Datum holen
	let date = new Date().toISOString().slice(0, 10);

	//Datenbankverbindung herstellen
	DBconnection = DatenbankverbindungHerstellen();

	//String bauen
	const strInsert = `INSERT INTO bestellung (Kunden_FK, Datum, SUMME) VALUES (?,?,?); `;

	//ausfuehren vom INSERT
	DBconnection.query(strInsert, [aktiveruser.Kunden_ID, date, summe], (err, result, fields) => {
		if (!err) {
			console.log('Success');
		} else {
			console.log(err);
			res.send('error');
		}
	});

	let strGetOrderID = `SELECT bestell_ID from bestellung WHERE SUMME = ? AND Datum = ? AND Kunden_FK = ?; `;
	DBconnection.query(strGetOrderID, [summe, date, aktiveruser.Kunden_ID], (err, result, fields) => {
		if (!err) {
			let length = result.length;
			bestellID = result[length - 1].bestell_ID;
		} else {
			console.log(err);
		}
	});

	setTimeout(() => {
		let strInsertDetail = `INSERT INTO bestellung_detail (fk_bestell_ID, fk_produkt_ID, Anzahl) VALUES (?, ?, ?)`;
		for (const iterator of warenkorb) {
			console.log(`Bestell ID: ${bestellID}`);
			DBconnection.query(
				strInsertDetail,
				[bestellID, iterator.ID, iterator.Anzahl],
				(err, result, fields) => {
					if (!err) {
						console.log('Success');
					} else {
						console.log(err);
					}
				},
			);
		}

		DatenbankverbindungTrennen(DBconnection);
	}, 1000);

	
};

//#endregion

module.exports = { payment, getOrders, addOrder };
