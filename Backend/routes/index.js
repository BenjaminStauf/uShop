const express = require('express');
const router = express.Router();

//#region Produkte und Kategorien

//importieren der Funktionen fuer Produkte und Kategorien
const {
	getProducts,
	updateProduct,
	addProduct,
	deleteProduct,
	getCategories,
} = require('../controllers/product_crud.js');

router.get('/getProducts', getProducts);

router.post('/UpdateProduct', updateProduct);

router.post('/AddProduct', addProduct);

router.post('/DeleteProduct', deleteProduct);

router.get('/getCategories', getCategories);

//#endregion

//#region Kundenaktionen
const {
	kundeRegister,
	kundenLogin,
	kundeLogout,
	sendCode,
	changePW,
	newPW,
	LoggedInÜberprüfung,
} = require('../controllers/kunden.js');

router.post('/KundeRegister', kundeRegister);

router.post('/KundenLogin', kundenLogin);

router.get('/KundeLogout', LoggedInÜberprüfung, kundeLogout);

router.post('/SendCode', sendCode);

router.post('/changePW', changePW);

router.post('/newPW', newPW);

//#endregion

//#region Bezahlen und Bestellung
const { payment, getOrders, addOrder } = require('../controllers/pay_order.js');

router.post('/payment', payment);

router.post('/getOrders', getOrders);

router.post('/addOrder', addOrder);

//#endregion

//#region Bewertungen
const { writeBewertung, getBewertung } = require('../controllers/bewertung.js');

router.post('/writeBewertung', writeBewertung);

router.get('/getBewertung', getBewertung);

//#endregion

module.exports = router