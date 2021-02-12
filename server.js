const greenlock = require('greenlock-express')
const { parse } = require('url')
const next = require('next')
const Prometheus = require('prom-client')

Prometheus.collectDefaultMetrics()

const httpRequestDurationMicroseconds = new Prometheus.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500] // buckets for response time from 0.1ms to 500ms
})

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

const handlerA = async (req, res) => {
	const parsedUrl = parse(req.url, true)
	const { pathname, query } = parsedUrl

	if(pathname === '/metrics'){
		res.writeHead(200, { 'Content-Type': 'text/plain'})
		res.end(await Prometheus.register.metrics())
	}
	
	nextHandler(req, res) //, parsedUrl)
}

function httpsWorker(glx) {
	nextApp.prepare().then(() => {

		if(dev){
			let httpServer = glx.httpServer(handlerA)

			httpServer.listen(4000, "0.0.0.0", function() {
				console.info("Dev mode. Listening on ", httpServer.address(), 'http://localhost:4000');
			});
		} else {
			// Note: You must ALSO listen on port 80 for ACME HTTP-01 Challenges
			// (the ACME and http->https middleware are loaded by glx.httpServer)
			let httpServer = glx.httpServer();
			httpServer.listen(80, "0.0.0.0", function() {
				console.info("Listening on ", httpServer.address(), " but redirecting to https");
			});
			// Get the raw https server:
			let httpsServer = glx.httpsServer(null, handlerA);

			httpsServer.listen(443, "0.0.0.0", function() {
				console.info("Listening on ", httpsServer.address());
			});
		}
	})
}

