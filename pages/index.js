import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import styled from 'styled-components';

export default function Home() {
  return (
    <Container>
      <Head>
        <title>Whatsapp Clone</title>
        <meta name="description" content="Created with love❤️" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />

      
    </Container>
  )
}

const Container  = styled.div`
  background-color: rgb(0,0,0,0.1);
`;
