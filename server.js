

const greenlock = require('greenlock-express')
const path = require('path')

// server.js
const http = require('http')
const https = require('https')
const { parse } = require('url')
const redirectHttps = require('redirect-https')
const next = require('next')

const port = 3210
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

greenlock
	.init({
		packageRoot: __dirname,
		configDir: './greenlock-manager',
		maintainerEmail: 'rosmcmahon@gmail.com',
		cluster: false,
	})
	.ready(httpsWorker)

function httpsWorker(glx) {
	nextApp.prepare().then(() => {
		// Note:
		// You must ALSO listen on port 80 for ACME HTTP-01 Challenges
		// (the ACME and http->https middleware are loaded by glx.httpServer)
		var httpServer = glx.httpServer(handler);
		httpServer.listen(80, "0.0.0.0", function() {
				console.info("Listening on ", httpServer.address());
		});
		// Get the raw https server:
		var httpsServer = glx.httpsServer(null, handler);

		httpsServer.listen(443, "0.0.0.0", function() {
				console.info("Listening on ", httpsServer.address());
		});
	})
}

const handler = (req, res) => {
	// Be sure to pass `true` as the second argument to `url.parse`.
	// This tells it to parse the query portion of the URL.
	const parsedUrl = parse(req.url, true)
	nextHandler(req, res, parsedUrl)
}





