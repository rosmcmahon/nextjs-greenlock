// const Prometheus = require('prom-client')
import Prometheus from 'prom-client'


const testReg = async() => {
	let array = await Prometheus.register.getMetricsAsArray()
	if(array.length > 0){
		return
	}
	// Prometheus.collectDefaultMetrics({
	// 	// prefix: 'tcannon_',
	// })
	new Prometheus.Counter({
		name: 'my_counter_name',
		help: 'my_counter_help',
	})
}
testReg()


export const register = Prometheus.register
