import styled from "styled-components";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useRouter} from "next/router";
import {auth,db} from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {Button} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';

function profile() {
    const router = useRouter();
    const [user] = useAuthState(auth);
    console.log(user)

    return (
        <div>
            <Container>
                <Header>
                    <ArrowIcon onClick={ () => router.push('/')}></ArrowIcon>
                    <Heading>Profile</Heading>
                </Header>
                <Avatar 
                    src={user?.photoURL ? user.photoURL : 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png'}>
                </Avatar>
                <DetailsDiv>
                    <Card>
                        <PersonIcon />
                        <Details>
                        <h5>Name</h5>
                        <h3>{user?.displayName}</h3>
                        </Details>
                    </Card>
                    
                    <Card>
                        <EmailIcon />
                        <Details>
                        <h5>Email</h5>
                        <h3>{user?.email}</h3>
                        </Details>
                    </Card>
                    
                </DetailsDiv>
                <SignOutButton  variant="contained" onClick={() => auth.signOut()}>Sign Out </SignOutButton>


            </Container>
        </div>
    )
}

export default profile;


const Container = styled.div`
    *{
        margin: 0;
    }
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

const Avatar = styled.img`
    display: block;
    border-radius: 100%;
    margin: 20px auto;
    width: 200px;
    height: 200px;

    @media (max-width:750px) {
        width: 150px;
        height: 150px;
    }

`;

const DetailsDiv = styled.div`
    max-width: 500px;
    margin: auto;
    display: flex;
    flex-direction: column;
    // align-items: center;

   
`;

const Card = styled.div`
    display: flex;
    border-bottom: 2px solid whitesmoke;
    padding: 10px;
`;

const Details = styled.div`
    margin-left: 20px;

    >h5{
        color: rgba(0,0,0,0.5);
    }

    @media (max-width: 750px) {

        >h3{
            font-size: 15px;
        }
    }
`;

const SignOutButton = styled(Button)`
display: block !important;
width: 200px;
    margin: 20px auto !important;
`;
