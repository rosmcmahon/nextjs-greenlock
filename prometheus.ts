// const Prometheus = require('prom-client')
import Prometheus from 'prom-client'

let unreg = true
if(unreg){
	Prometheus.collectDefaultMetrics({
		prefix: 'tcannon_',
		
	})
	unreg = false
}

export const getMetrics = async() => await Prometheus.register.metrics()
