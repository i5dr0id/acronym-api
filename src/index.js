const app = require('./app');

const PORT = 1234
app.listen(PORT, () => {
	console.log(`Listening to port ${PORT}`);
});