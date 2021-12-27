import Head from 'next/head';
import Sidebar from '../components/Sidebar';

export default function Home() {
  return (
    <div >
      <Head>
        <title>Whatsapp Clone</title>
        <meta name="description" content="Created with love❤️" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />

      
    </div>
  )
}
