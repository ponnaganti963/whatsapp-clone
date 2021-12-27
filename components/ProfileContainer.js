import styled from "styled-components";
import {auth} from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';

function ProfileContainer() {
    const [user] = useAuthState(auth);
    return (
        <Container>
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
        </Container>
    )
}

export default ProfileContainer;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    *{
        margin: 0;
    }
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

