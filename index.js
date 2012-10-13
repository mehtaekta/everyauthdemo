var everyAuth = require('everyauth'),
	connect = require('connect'),
	express = require('express'),
	Promise = everyAuth.Promise,
	config = require('./config')

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
	.redirectPath('/home')

everyAuth.google
	.myHostname('http://www.everyauthdemo.com:5000')
	.appId(config.google.clientId)
	.appSecret(config.google.clientSecret)
	.scope('https://www.googleapis.com/auth/userinfo.profile https://www.google.com/m8/feeds/') // What you want access to
	.findOrCreateUser( function (sess, accessToken, extra, googleUser) {
		console.log('##################', sess);
		var promise = this.Promise(); 
        promise.fulfill('test'); 
        return promise; 
		// googleUser.refreshToken = extra.refresh_token;
		// googleUser.expiresIn = extra.expires_in;
		// return usersByGoogleId[googleUser.id] || (usersByGoogleId[googleUser.id] = addUser('google', googleUser));
	})
	.redirectPath('/home');

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
	app.use(express.cookieParser())
	app.use(express.session({ secret: 'everyauthdemo'})) 
	//htuayreve evernodedemo
	app.use(everyAuth.middleware())
	
});

app.get('/auth/google/callback', function(req, res) {
	console.log('user authenticated');
});

app.get('/', function (req, res) {
	res.render('login');
});

app.get('/home', function (req, res) {
	res.render('home');
});

port = process.env.PORT || 5000
app.listen(port)
console.log("Express server listening on port %d in %s mode", port, app.settings.env)

