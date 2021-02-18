import { NextApiRequest, NextApiResponse } from 'next'
import { Counter } from 'prom-client'

const myCounter = new Counter({
  name: "my_counter_example",
  help: 'my_counter_example_help'
})

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    myCounter.inc()

		res.setHeader('Content-Type', 'text/plain')
    res.status(200).send('myCounter.inc(), that\'s all I know')
		
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
