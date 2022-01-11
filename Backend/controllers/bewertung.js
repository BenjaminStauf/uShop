require('dotenv').config();

//VARIABLEN:
let DBconnection;

//Globale Funktionen einbinden
const {
	DatenbankverbindungHerstellen,
	DatenbankverbindungTrennen,
} = require('../globale_Dinger.js');

const writeBewertung = (req, res) => {
	const { user, bewertung } = req.body;

	DBconnection = DatenbankverbindungHerstellen();
	const str = `INSERT INTO bewertung ( bewertung_titel, bewertung_Sterne, datum, bewertung_text, fk_Kunde, fk_Produkt) VALUES (?,?,?,?,?,?)`;

	DBconnection.query(
		str,
		[
			bewertung.titel,
			bewertung.bewertung,
			bewertung.datum,
			bewertung.text,
			user.Kunden_ID,
			bewertung.produkt_ID,
		],
		(err, result) => {
			if (!err) {
				console.log('Success');
				res.status(200).send('Success');
			} else {
				console.log(err);
				res.status(500).send('Error');
			}
		},
	);

	DatenbankverbindungTrennen(DBconnection);
};

const getBewertung = (req, res) => {
	DBconnection = DatenbankverbindungHerstellen();

	const str = `SELECT bewertung_ID, bewertung_titel, bewertung_Sterne, datum, Vorname, Nachname, fk_Produkt, bewertung_text
  FROM bewertung
           JOIN kunden_tbl kt on kt.Kunden_ID = bewertung.fk_Kunde`;

	DBconnection.query(str, (err, result, fields) => {
		if (!err) {
			console.log(result);
			res.status(200).send(result);
		} else {
			console.log(err);
			res.status(500).send('error');
		}
	});

	DatenbankverbindungTrennen(DBconnection);
};



module.exports = { writeBewertung, getBewertung };
