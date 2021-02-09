const expressRateLimit = require('express-rate-limit')


export const limiter = expressRateLimit({
	windowMs: 5 * 60 * 1000,
	max: 3,
	message: "Sorry, you have made too many requests.",
	headers: false,
})
