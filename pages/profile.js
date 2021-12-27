import styled from "styled-components";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Router from "next/router";
import {auth} from "../firebase";
import {Button} from '@mui/material';
import ProfileContainer from "../components/ProfileContainer";

function profile() {
    // const router = useRouter();
    console.log(auth);
    return (
        <div>
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

`;
const ArrowIcon = styled(ArrowBackIcon)`
    margin: 10px;
`;
const Header = styled.div`
    display: flex;
    border-bottom: 2px solid whitesmoke;
`;

const Heading = styled.h2`
    margin: 5px 20px;
`;

const SignOutButton = styled(Button)`
display: block !important;
width: 200px;
    margin: 20px auto !important;
`;
