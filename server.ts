import greenlock from 'greenlock-express'
import { parse } from 'url'
import next from 'next'
import { register } from 'prom-client'
import http, { IncomingMessage, ServerResponse } from 'http'

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

greenlock
	.init({
		packageRoot: './',//__dirname,
		configDir: './greenlock-manager',
		maintainerEmail: 'rosmcmahon@gmail.com',
		cluster: false,
	})
	.ready(httpsWorker)

// collectDefaultMetrics({
// 	prefix: 'example_prefix_'
// })

const handlerA = async (req: IncomingMessage, res: ServerResponse) => {
	const parsedUrl = parse(req.url!, true)
	const { pathname, /*query*/ } = parsedUrl

	if(pathname === '/custom'){
		res.writeHead(200, { 'Content-Type': 'text/plain'})
		res.end('this a the custom route')
	}
	
	nextHandler(req, res) //, parsedUrl)
}

function httpsWorker(glx: greenlock.glx) {
	nextApp.prepare().then(() => {

		const httpMetrics = http.createServer(async(_req: IncomingMessage, res: ServerResponse) => {
			res.writeHead(200, { 'Content-Type': 'text/plain'})
			res.end(await register.metrics())
		})
		httpMetrics.listen(9100, "0.0.0.0", () => console.log('metrics on http://localhost:9100'))

		if(dev){
			let httpServer = http.createServer(handlerA)

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

