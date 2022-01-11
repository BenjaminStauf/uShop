//#region
//PAYPAL KUNDEN DATEN:
//USER: sb-osykw8452307@personal.example.com
//PASSWORT: jA"h9)ep
//#endregion
require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const open = require('open');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const bcrypt = require('bcrypt');

const router = express.Router();

//VARIABLEN:
let DBconnection;
let BcryptHashSalt = 5;

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

//#region FUNCTIONS

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

function passwortGenerieren() {
  const auswahlStr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!%&$?@';
  let str = '';
  for (let index = 0; index < 8; index++) {
    str += auswahlStr[Math.floor(Math.random() * auswahlStr.length)];
  }
  return str;
}

//#endregion

//-------ROUTER ANSCHRIFTEN-------
//#region KUNDE LOGIN LOGOUT REGISTER SEND-CODE

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

//Authentifikationscode senden (Für Registrieren wichtig)
router.post('/SendCode', (req, res) => {
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
});

router.post('/KundeRegister', (req, res) => {
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
});

router.post('/KundenLogin', (req, res) => {
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
});

router.get('/KundeLogout', LoggedInÜberprüfung, (req, res) => {
  //Session-Dinge löschen
  req.session.destroy();
  res.clearCookie('uShopSession');
  res.end();
});

//#endregion

//#region CRUD Products

//Produkte aus der Datenbank
router.get('/getProducts', (req, res) => {
  //Verbinden mit DB
  DBconnection = DatenbankverbindungHerstellen();

  //Bekommene Produkte + weiterschicken zum Frontend
  DBconnection.query(
    `SELECT ProduktID, Name, Preis, Bewertung, Kurzbeschreibung, KategorieName AS 'Kategorie', Link3D, LinkImage FROM produkt_tbl
  JOIN kategorie_tbl kt on kt.Kategorie_ID = produkt_tbl.Kategorie_FK;`,
    (err, results, fields) => {
      res.send(results);
    },
  );

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

//#endregion

//#region NEW PW

router.post('/newPW', (req, res) => {
  //Variablen zuweisen:
  const email = req.body.email;
  const neuesPW = passwortGenerieren();

  //Email verschicken:
  sendNewPassword(neuesPW, email);

  //Datenbank aktualisieren:
  DBconnection = DatenbankverbindungHerstellen();
  const statement = 'UPDATE kunden_tbl SET Passwort = ? WHERE Email = ?;';
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
  DatenbankverbindungTrennen(DBconnection);
});

//#endregion

//#region PAY

router.post('/payment', async (req, res) => {
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
});

//#endregion

//#region Bestellungen GET POST

router.post('/getOrders', (req, res) => {
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
});

router.post('/addOrder', (req, res) => {
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
      bestellID = result[0].bestell_ID;
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
  }, 1000);
  DatenbankverbindungTrennen(DBconnection);
});
//#endregion

//#region CHANGE PW
router.post('/changePW', (req, res) => {
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
});

// #endregion

//#region BEWERTUNG
router.post('/writeBewertung', (req, res) => {
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
});

router.get('/getBewertung', (req, res) => {
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
});

//#endregion

module.exports = router;
