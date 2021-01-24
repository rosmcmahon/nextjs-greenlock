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
		if(dev){
			let httpServer = glx.httpServer((req, res) => {
				const parsedUrl = parse(req.url, true)
				nextHandler(req, res, parsedUrl)
			});
			httpServer.listen(3000, "0.0.0.0", function() {
					console.info("Dev mode. Listening on ", httpServer.address());
			});
		} else {

			// Note: You must ALSO listen on port 80 for ACME HTTP-01 Challenges
			// (the ACME and http->https middleware are loaded by glx.httpServer)
			let httpServer = glx.httpServer();
			httpServer.listen(80, "0.0.0.0", function() {
					console.info("Listening on ", httpServer.address(), " but redirecting to https");
			});
			// Get the raw https server:
			let httpsServer = glx.httpsServer(null, (req, res) => {
				const parsedUrl = parse(req.url, true)
				nextHandler(req, res, parsedUrl)
			});

			httpsServer.listen(443, "0.0.0.0", function() {
					console.info("Listening on ", httpsServer.address());
			});
		}
	})
}


