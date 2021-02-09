import { NextApiRequest, NextApiResponse } from 'next'
import { sampleUserData } from '../../../utils/sample-data'
import nc from 'next-connect'
import expressRateLimit from 'express-rate-limit'

const handlerA = (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!Array.isArray(sampleUserData)) {
      throw new Error('Cannot find user data')
    }

    res.status(200).json(sampleUserData)
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

// export default handler

const limiter = expressRateLimit({
	windowMs: 5 * 60 * 1000,
	max: 3,
	message: "Sorry, you have made too many requests.",
	headers: false,
})

// Helper method to wait for a middleware to execute before continuing
// function runMiddleware(req: NextApiRequest, res: any, fn: any) {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result: any) => {
//       if (result instanceof Error) {
//         return reject(result)
//       }

//       return resolve(result)
//     })
//   })
// }

//runMiddleware(request, response, apiLimiter)

const handler = nc<NextApiRequest, NextApiResponse>()
handler.use(limiter).use(handlerA)

export default handler
