import { NextApiRequest, NextApiResponse } from 'next'
import { Counter } from 'prom-client'
import { register } from '../../prometheus'

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    let c = register.getSingleMetric('my_counter_name') as Counter<string>
    c.inc()

		res.setHeader('Content-Type', 'text/plain')
    res.status(200).send('incremented myCounter')
		
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
