import Layout from 'components/layout'
import { NextSeo } from 'next-seo'
import { Report, ReportDocument } from '../lib/contentTypes'
import Link from 'next/link'
import Image from 'next/legacy/image'

export default function IndexPage({ preview }: { preview: boolean; reports: Report[]; reportDocuments: ReportDocument[] }) {
  return (
    <Layout preview={preview}>
      <NextSeo
        title={`Integritate pe bune`}
        description={`Pentru că impostura, nepotismul, nesimțirea și corupția sunt coloana vertebrală a clasei noastre politice. Și pentru că putem să îi schimbăm. Pentru că trebuie să o facem. Pentru că avem nevoie de decență, bun simț, meritocrație si oameni care au făcut ceva nu oameni care promit că vor face ceva în politică.`}
        canonical={`https://integritatepebune.ro`}
        openGraph={{
          url: `https://integritatepebune.ro`,
          title: `Integritate pe bune`,
          description: `Pentru că impostura, nepotismul, nesimțirea și corupția sunt coloana vertebrală a clasei noastre politice. Și pentru că putem să îi schimbăm. Pentru că trebuie să o facem. Pentru că avem nevoie de decență, bun simț, meritocrație si oameni care au făcut ceva nu oameni care promit că vor face ceva în politică.`,
          images: [{ url: 'https://integritatepebune.ro/images/profile.png' }],
        }}
      />

      <div className='flex justify-center mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24'>
        <Link href={`/rapoarte/2023`} title={'Integritate pe bune Raport 2'}>
          <Image src={`/images/reports/report-2-launch.png`} height={1200} width={1600} alt={'Integritate pe bune Raport 2'} />
        </Link>
      </div>
    </Layout>
  )
}

export async function getStaticProps({ preview = false }) {
  return {
    props: {
      preview,
    },
  }
}
