import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { Counter, register } from 'prom-client'
import Layout from '../components/Layout'

const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1>Hello Next.js 👋</h1>
    <p>
      <Link href="/about">
        <a>About</a>
      </Link>
    </p>
  </Layout>
)
export default IndexPage



export const getServerSideProps: GetServerSideProps = async (_context) => {

  const counterName = 'cannon_claim_counter'
  let counter: Counter<'claim'> = register.getSingleMetric(counterName) as Counter<'claim'>
  if(!counter){
    counter = new Counter({
      name: counterName,
      help: counterName + '_help',
      aggregator: 'sum',
      labelNames: ['claim'],
    })
  }
  counter.inc()


  return{
    props: {}
  }
}