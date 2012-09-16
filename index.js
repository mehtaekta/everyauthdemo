var everyAuth = require('everyauth')
var connect = require('connect')
var express = require('express')

everyAuth.debug = true;

console.log('Authenticate')
everyAuth.googlehybrid
	.myHostname('http://nexusplus.devapp.com:5000')
	.consumerKey('nexusplus.herokuapp.com')
	.consumerSecret('QQZy6f24BjIOYQkE_fnRAbK6')
	.scope(['https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile'])
	.findOrCreateUser(function(session, userAttributes) {
			console.log('findOrCreateUser')
			console.log('userAttributes', userAttributes)
			return usersByGoogleHybridId[userAttributes.claimedIdentifier] || (usersByGoogleHybridId[userAttributes.claimedIdentifier] = addUser('googlehybrid', userAttributes))

	})
	.redirectPath('/')

app = module.exports = express.createServer();
app.configure(function(){
	// # Register view engine
	app.register('.html', require('ejs'))
	
	// # App Configuration
	app.set('views', __dirname + "/public")
	app.set('view engine', 'html')
	app.set('view options', { layout: false, pretty: true })

		

	// # Middleware
	app.use(express.static(__dirname + '/public'))
	app.use(express.bodyParser())
	// app.use(express.router())
	app.use(everyAuth.middleware())
	
});

app.get('/', function (req, res) {
  res.render('login');
});

port = process.env.PORT || 2000
app.listen(port)
console.log("Express server listening on port %d in %s mode", port, app.settings.env)