import styled from "styled-components";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Router from "next/router";
import {auth} from "../firebase";
import {Button} from '@mui/material';
import ProfileContainer from "../components/ProfileContainer";
import Head from "next/head";

function profile() {
    // const router = useRouter();
    console.log(auth);
    return (
        <div>
            <Head>
                <title>Profile</title>
                <meta name="description" content="Profile Page" />
                <link rel="icon" href="/whatsappimg.png" />
            </Head>
            <Container>
                <Header>
                    <ArrowIcon onClick={ () => Router.push('/')}></ArrowIcon>
                    <Heading>Profile</Heading>
                </Header>

                <ProfileContainer />
                
                <SignOutButton  variant="contained" onClick={() => auth.signOut()}>Sign Out </SignOutButton>


            </Container>
        </div>
    )
}

export default profile;


const Container = styled.div`
background-color: #111b21;
height: 100vh;
    
`;
const ArrowIcon = styled(ArrowBackIcon)`
    margin: 10px; 
    color: #8696a0;
`;
const Header = styled.div`
    display: flex;
    height: 60px;
    align-items: center;
    background-color: #202c33;
    border-bottom: 1px solid rgba(134,150,160,0.15);
`;

const Heading = styled.h2`
    margin: 5px 10px;
    color: white;
`;

const SignOutButton = styled(Button)`
display: block !important;
width: 200px;
    margin: 20px auto !important;
`;
