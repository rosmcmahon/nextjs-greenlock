import * as greenlock from '@root/greenlock-express'
import { parse } from 'url'
import next from 'next'
import { IncomingMessage, ServerResponse,  } from 'http'

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

const mainHandler = async (req: IncomingMessage, res: ServerResponse) => {
	const parsedUrl = parse(req.url!, true)
	const { pathname, /*query*/ } = parsedUrl

	if(pathname === '/hello'){
		res.writeHead(200, { 'Content-Type': 'text/plain'})
		res.end('Hello, world')
	}
	
	nextHandler(req, res) //, parsedUrl)
}

function httpsWorker(glx: greenlock.glx) {
	nextApp.prepare().then(() => {

		if(dev){
			let httpServer = glx.httpServer(mainHandler)

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
			let httpsServer = glx.httpsServer(null, mainHandler);

			httpsServer.listen(443, "0.0.0.0", function() {
				console.info("Listening on ", httpsServer.address());
			});
		}
	})
}

