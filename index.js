const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const avocado = require('./avo-shopper')
const pg = require("pg");
const Pool = pg.Pool;

const app = express();
const PORT =  process.env.PORT || 3019;

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local){
    useSSL = true;
} 

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:codex123@localhost:5432/avo_shop';

const pool = new Pool({
    connectionString,
    ssl:{ rejectUnauthorized: false}    
  });

  const avocadoShop = avocado(pool)

// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// let counter = 0;

app.get('/', async function(req, res) {
	

	// await avocadoShop.createShop(name);
	res.render('index', {
		// add: await avocadoShop.createShop(),
		output: await avocadoShop.listShops(req.body.name)
	})
});

app.get('/shopList', async function(req, res) {
	var name = req.body.theShops
	console.log(name)
	// console.log(topFiveShops)
	let listShops = await avocadoShop.listShops()	
	res.render('shopList', 
	{ listOfAllShops: listShops}
	)
});

app.post('/', async function(req, res) {
	var name = req.body.theShops
	console.log(name)
	// console.log(topFiveShops)
	// let listShops = await avocadoShop.listShops()	
	res.render('index', 
	//{ listOfAllShops: listShops}
	)
});

// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function() {
	console.log(`AvoApp started on port ${PORT}`)
});