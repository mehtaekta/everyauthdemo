var everyAuth = require('everyauth'),
	connect = require('connect'),
	express = require('express'),
	Promise = everyAuth.Promise;

everyAuth.debug = true;

// https://github.com/bnoguchi/everyauth/issues/184
everyAuth.googlehybrid
	.myHostname('http://www.everyauthdemo.com:5000')
	.consumerKey('nexusplus.herokuapp.com')
	.consumerSecret('QQZy6f24BjIOYQkE_fnRAbK6')
	.scope(['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'])
	.findOrCreateUser(function(session, userAttributes) {
			console.log('findOrCreateUser')
			console.log('userAttributes', userAttributes)
			var promise = new Promise();
			promise.fulfill(userAttributes);
			return promise;
			// usersByGoogleHybridId[userAttributes.claimedIdentifier] || (usersByGoogleHybridId[userAttributes.claimedIdentifier] = addUser('googlehybrid', userAttributes))

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

app.get('/auth/googlehybrid/callback', function(req, res) {
	console.log('user authenticated');
});

app.get('/', function (req, res) {
  res.render('login');
});

port = process.env.PORT || 5000
app.listen(port)
console.log("Express server listening on port %d in %s mode", port, app.settings.env)