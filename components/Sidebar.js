import styled from "styled-components";
import {Avatar , IconButton, Button} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import {useCollection } from "react-firebase-hooks/firestore";
import { auth ,db} from '../firebase';
import Chat from "../components/Chat";
import AddIcon from '@mui/icons-material/Add';
import {useRouter} from  'next/router';

function Sidebar() {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const userChatRef = db.collection('chats').where('users','array-contains',user.email);
    const [chatsSnapshots] = useCollection(userChatRef);
    const createChat = () =>{
        const input = prompt("Please Enter for the user you wish to chat");
        if(!input) return null;
        if(EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email){
            db.collection('chats').add({
                users: [user.email, input],

            })
        }
    };
    const chatAlreadyExists = (recipientEmail) => 
        !!chatsSnapshots?.docs.find(
            chat => chat.data().users.find(
                user => user === recipientEmail)?.length > 0
        );
    

    return (
        <Container>
            <Header>
                <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />

                <IconsContainer>
                    <IconButton onClick={createChat}>
                        <AddIcon />
                    </IconButton>
                    
                    <IconButton onClick={() => router.push('/settings')}>
                    <MoreVertIcon />
                    </IconButton>
                    
                </IconsContainer>
            </Header>
            <Search>
                <SearchIcon/>
                <SearchInput placeholder="Search in chat" />
            </Search>
            {
                chatsSnapshots?.docs.map((chat) => (
                    <Chat key={chat.id} id={chat.id} users={chat.data().users} /> 
                ))
            }
        </Container>
    )
}

export default Sidebar;

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y : scroll;

    ::-webkit-scrollbar{
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;

    @media (max-width: 750px){
        width: 500px;
        min-width: 100%;
    }
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    justify-content: space-between;
    height: 60px;
    align-items: center;
    border-bottom: 2.5px solid whitesmoke;
    padding: 15px;

`;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 20px;
    border-radius: 2px;
`;


const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
`;


const UserAvatar = styled(Avatar)`
    cursor: pointer;

    :hover{
        opacity: 0.8;
    }
`;

const IconsContainer = styled.div``;