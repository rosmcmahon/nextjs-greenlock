import { NextApiRequest, NextApiResponse } from 'next'
const getMetrics = require('../../prometheus').getMetrics

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const text = await getMetrics()

		res.setHeader('Content-Type', 'text/plain')
    res.status(200).send(text)
		
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
