const path = require('path');
module.exports = {
	outputDir: path.resolve(__dirname, '../Backend/public'),
	transpileDependencies: ['vuetify'],
	devServer: {
		host: 'localhost',
	},
};
