const express = require('express')
const ejs = require('ejs')
const path = require('path')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const { Sequelize, DataTypes } = require('sequelize')

const port = 8080
const app = express()

// middleware
app
	.use(favicon(__dirname + '/ico/favicon.ico'))
	.use(express.static(__dirname + '/public'))
	.use(bodyParser.urlencoded({extended:true}))

// Tell Express to render the views from ./views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// Database
const database = 'url_shortener'
const username = 'postgres'
const password = 'azerty123'
const sequelize = new Sequelize(
	database,
	username, 
	password, {
		host: 'localhost',  
		dialect: 'postgres'
	}
)
// Model Url to register in database
const Url = sequelize.define('urls', {
	id: {
		type: DataTypes.BIGINT,
		primaryKey: true,
		autoIncrement: true
	},
	createdAt: {
		type: 'TIMESTAMP',
		defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		allowNull: false
	},
	updatedAt: {
		type: 'TIMESTAMP',
		allowNull: false
	},
	url: {
		type: DataTypes.STRING,
		allowNull: false,
		get() {
			return this.getDataValue('url')
		},
		set(value) {
			this.setDataValue('url', value)
		}
	},
	key: {
		type: DataTypes.STRING,
		get() {
			return this.getDataValue('key')
		},
		set(value) {
			this.setDataValue('key', value)
		}
	}}, {
		timestamps : true,
		createdAt : true,
		updatedAt : true
	})
sequelize.authenticate()
	.then(sucess => console.log('Connection to Database has been established successfully.'))
	.catch(error => console.log('Unable to connect to the database:' + error))

const createdAtYear = 2022;
const dateProject = createdAtYear + '-' + (new Date().getFullYear())

// Routes
app.get('/', (req, res) => {
	const alias = decodeURI(req.query.alias)
	const key = decodeURI(req.query.key)
	const baseURL = req.protocol + '://' + req.headers.host + '/'

	res.render('index.ejs', {
		dateProject : dateProject,
		baseURL : baseURL, 
		alias : alias,
		key : key
	})
})

const { randomString } = require('./helper.js')
app.post('/', (req, res) => {
	if (!req.body.url) {
		res.status(400).send({message: "Url cannot be empty"})
		return
	}
	const url = req.body.url
	const key = randomString(15)
	Url.create({url: url, key: key})
		.then(data => {
			res.redirect(encodeURI('/?alias=' + data.id + '&key=' + data.key))
		}).catch(error => res.status(500).send({
			message: "Error occured " + error
		}))
})

app.get('/:alias&:key', (req, res) => {
	const alias = BigInt(decodeURI(req.params.alias))
	const key = decodeURI(req.params.key)
	if (alias && key) {
		Url.findOne({where : {id : alias}}).then(row => {
			// url found so redirect to url
			res.redirect(row.url)
		}).catch(error => console.log('Error findOne : ' + error))
	} else {
		res.redirect('/404')
	}
})

app.listen(port, () => {
	console.log(`Application listening on port ${port} at http://localhost:${port}`)
})
