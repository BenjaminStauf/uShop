require('dotenv').config();
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const bcrypt = require('bcrypt');



//VARIABLEN:
let BcryptHashSalt = 5;
let DBconnection;


//Globale Funktionen einbinden
const {DatenbankverbindungHerstellen, DatenbankverbindungTrennen} = require('../globale_Dinger.js')


//#region lokale Funktionen
function passwortGenerieren() {
	const auswahlStr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!%&$?@';
	let str = '';
	for (let index = 0; index < 8; index++) {
		str += auswahlStr[Math.floor(Math.random() * auswahlStr.length)];
	}
	return str;
}

async function SendMailAuthCode(genCode, name, toMail) {
	//Nodemailer smtpTransport erstellen

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
	smtpTransport.sendMail(mailoptions, (error, response) => {
		error ? console.log(error) : console.log(response);
		smtpTransport.close();
	});
}

async function sendNewPassword(newPW, toMail) {
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

	console.log('To-Email: ' + toMail);

	//Mail options
	let mailoptions = {
		from: 'uShop.HTLWW@gmail.com',
		to: toMail,

		// to: "benjamin.stauf11@gmail.com",
		subject: 'Neues Passwort für Ihren Account',
		template: 'newPassword',
		context: {
			Passwort: newPW,
		},
	};

	//Email senden
	smtpTransport.sendMail(mailoptions, (error, response) => {
		error ? console.log(error) : console.log(response);
		smtpTransport.close();
	});
}

const LoggedInÜberprüfung = (req, res, next) => {
	req.session.User ? next() : res.send('User nicht eingeloggt');
};

//#endregion

//#region Nodemailer

const oauth2Client = new OAuth2(
	'674951647718-soho8qm58h7verirgpkbr2rp6bj4ee3j.apps.googleusercontent.com',
	'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',
	'https://developers.google.com/oauthplayground',
);

oauth2Client.setCredentials({
	refresh_token:
		'1//047E2oS5MHPY-CgYIARAAGAQSNwF-L9IreZIDaYhJZNxHuw6faeiJGkgwCLOZDTO1ImoENkDCtPvtGuwMuEmJ1B7cRLV7ku3C7SM',
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
			'1//047E2oS5MHPY-CgYIARAAGAQSNwF-L9IreZIDaYhJZNxHuw6faeiJGkgwCLOZDTO1ImoENkDCtPvtGuwMuEmJ1B7cRLV7ku3C7SM',
		accessToken: accessToken,
	},
	tls: {
		rejectUnauthorized: false,
	},
});

//#endregion


//#region Funktionen

const kundeRegister = (req, res) => {
	//KundenDaten bekommen
	const { Vorname, Nachname, Email, Passwort, Strasse, Plz, Ort, IsAdmin } = req.body;

	//Verschlüsselt das Passwort vom User
	let PasswordBcrypted = bcrypt.hashSync(Passwort, BcryptHashSalt);

	//Sich mit der Datenbank verbinden
	DBconnection = DatenbankverbindungHerstellen();

	console.log('Eintrag!');
	DBconnection.query(
		'INSERT INTO kunden_tbl (Vorname, Nachname, Email, Passwort, StrasseHsnr, Plz, Ort, IsAdmin) VALUES (?,?,?,?,?,?,?,?)',
		[Vorname, Nachname, Email, PasswordBcrypted, Strasse, Plz, Ort, IsAdmin],
		(err) => {
			if (err) {
				console.log(err);
			} else {
				res.send('Hat geklappt!');
			}
		},
	);

	DatenbankverbindungTrennen(DBconnection);
}

const kundenLogin = (req, res) => {
	const { Email, Passwort } = req.body;
	console.log(`Email: ${Email} Passwort: ${Passwort}`);

	//Datenbankverbindung herstellen
	DBconnection = DatenbankverbindungHerstellen();

	//User vergleichen und Cookie setzen
	let QueryStr = `SELECT Kunden_ID, Vorname, Nachname, Email, Passwort, StrasseHsnr, Ort, Plz, IsAdmin 
	FROM kunden_tbl WHERE Email LIKE ?
	GROUP BY Kunden_ID, Vorname, Nachname, Email, Passwort, StrasseHsnr, Ort, Plz, IsAdmin;`;

	DBconnection.query(QueryStr, [Email], (error, results) => {
		if (!error) {
			//Wenn er einen registrierten User mit der Email findet
			if (results.length > 0) {
				let FoundUser = results[0];
				console.log(FoundUser);
				if (bcrypt.compareSync(Passwort, FoundUser.Passwort)) {
					//   Cookie anlegen
					req.session.User = FoundUser;
					res.status(200).json({ FoundUser });
				} else {
					res.status(400).send('Passwörter stimmen nicht überein!');
				}
			} else {
				res.status(404).send('Der User ist nicht vorhanden');
			}
		}
	});

	//Datenbankverbindung trennen
	DatenbankverbindungTrennen(DBconnection);
}

const kundeLogout = (req, res) => {
	//Session-Dinge löschen
	req.session.destroy();
	res.clearCookie('uShopSession');
	res.end();
}

const sendCode = (req, res) => {
	DBconnection = DatenbankverbindungHerstellen();

	//Daten bekommen
	const { Vorname, Nachname, Email } = req.body;

	//Sendet Auth-Code wenn die mail noch nicht vorhanden ist
	DBconnection.query(
		'SELECT Email FROM kunden_tbl WHERE Email LIKE ?',
		[Email],
		(error, elements) => {
			if (!error) {
				//Schauen ob die Email schon vorhanden ist
				if (elements.length == 0) {
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
				} else {
					console.log('Vorhanden');
					res.send('vorhanden');
				}
			} else console.log(error);
		},
	);
	DatenbankverbindungTrennen(DBconnection);
}

const changePW = (req, res) => {
	const { newPassword, user } = req.body;

	//Datenbankverbindung
	DBconnection = DatenbankverbindungHerstellen();
	const str = 'UPDATE kunden_tbl SET Passwort = ? WHERE Email = ?;';

	DBconnection.query(
		str,
		[bcrypt.hashSync(newPassword, BcryptHashSalt), user.Email],
		(err, result, fields) => {
			if (!err) {
				console.log('Success');
				res.status(200).send('Success');
			} else {
				console.log(err);
				res.status(500).send('error');
			}
		},
	);

	DatenbankverbindungTrennen(DBconnection);
}

const newPW = (req, res) => {
    //Variablen zuweisen:
	const email = req.body.email;
	const neuesPW = passwortGenerieren();
	let gefunden = false;

	//Email verschicken:
	sendNewPassword(neuesPW, email);

	//Datenbank aktualisieren:
	DBconnection = DatenbankverbindungHerstellen();
	const statement = 'UPDATE kunden_tbl SET Passwort = ? WHERE Email = ?;';
	const str = 'SELECT Email from kunden_tbl; ';

	DBconnection.query(str, (err, result, fields) => {
		if (!err) {
      console.log(result);
			 if (result.some((elem) => elem.Email == email)) gefunden = true;
			 else res.status(404).send('Die Email ist leider nicht vorhanden');
		} else console.log(err);
	});

	if (gefunden == true) {
		DBconnection.query(
			statement,
			[bcrypt.hashSync(neuesPW, BcryptHashSalt), email],
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
	}

	DatenbankverbindungTrennen(DBconnection);
}

//#endregion

module.exports = {kundeRegister, kundenLogin, kundeLogout, sendCode, changePW, newPW,  LoggedInÜberprüfung}