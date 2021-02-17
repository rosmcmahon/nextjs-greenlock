import { NextApiRequest, NextApiResponse } from 'next'
import { register } from '../../prometheus'

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const text = await register.metrics()

		res.setHeader('Content-Type', 'text/plain')
    res.status(200).send(text)
		
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
