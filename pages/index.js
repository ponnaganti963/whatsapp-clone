import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import styled from 'styled-components';

export default function Home() {
  return (
    <Container>
      <Head>
        <title>Whatsapp Clone</title>
        <meta name="description" content="Created with love❤️" />
        <link rel="icon" href="/whatsappimg.png" />
      </Head>

      <Sidebar />

      <RightDiv>
      <Image  
                src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png"
                alt="Whatsapp Image"
                ></Image>

      </RightDiv>

      
    </Container>
  )
}

const Container  = styled.div`
  display: flex;
  background-color: rgb(0,0,0,0.1);
`;

const RightDiv = styled.div`
  display: grid;
  height:100vh;
  width:100%;

  @media (max-width: 750px){
    display: none;
  }
`;

const Image = styled.img`
  place-self: center;
  height: 200px;


`;