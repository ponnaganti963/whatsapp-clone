import styled from "styled-components";
import {Avatar , IconButton, Menu , MenuItem ,Divider } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import {useCollection } from "react-firebase-hooks/firestore";
import { auth ,db} from '../firebase';
import Chat from "../components/Chat";
import AddIcon from '@mui/icons-material/Add';
import {useRouter} from 'next/router';
import getRecipientEmail from "../Utils/getRecipientEmail";
import {useEffect, useState} from "react";
import firebase from "firebase";

function Sidebar() {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [chats,setChats] = useState([]);
    const userChatRef = db.collection('chats').where('users','array-contains',user.email);
    const [chatsSnapshots] = useCollection(userChatRef);
    const ITEM_HEIGHT = 48;
    const userRef = db.collection('users');
    const [userSnapshots] = useCollection(userRef);
    
    const createChat = () =>{
        const input = prompt("Please Enter for the user you wish to chat");
        if(!input) return null;
        if(EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
            if(AccountExists(input)) {
                db.collection('chats').add({
                    users: [user.email, input],
                    lastseen: firebase.firestore.FieldValue.serverTimestamp(),
                })
            }else{
                alert("Account doesn't exists")
            }
           console.log(AccountExists(input));
        }
    };

    function AccountExists(input){
        let found = false;
        userSnapshots?.forEach(doc => {
            if (doc.data().email === input) {
                console.log('aa',new Date().getTime())
                found = true;
                
            }
        })
        return found;
    }
    const chatAlreadyExists = (recipientEmail) => 
        !!chatsSnapshots?.docs.find(
            chat => chat.data().users.find(
                user => user === recipientEmail)?.length > 0
        );

    
    
    const filterusers = (e) =>{
        let filterchats = chatsSnapshots?.docs.filter(doc => 
            getRecipientEmail(doc.data().users, user)
            .split('@')[0].includes(e.target.value))
        setChats(filterchats);
    }
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
        <Container>
            <Header>
                <UserAvatar src={user.photoURL} onClick={() => router.push('/profile')}/>

                <IconsContainer>
                    <IconButton onClick={createChat}>
                        <AddIcon style={{color: '#8696a0'}}/>
                    </IconButton>
                    <IconButton 
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                    <MoreVertIcon style={{color: '#8696a0'}}/>
                    </IconButton >
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                        'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '20ch',
                        },
                        }}
                    >
                        <MenuItem key='profile' onClick={() => router.push('/profile')}>
                         
                        <UserAvatar src={user.photoURL} /> <ListItems>Profile</ListItems>
                        </MenuItem>
                        <Divider />

                        <MenuItem key="Setting">
                            <ListItemIcon>
                                <Settings fontSize="small"/> 
                            </ListItemIcon>
                            <ListItems>Settings</ListItems>
                        </MenuItem>
                        <MenuItem key="logout" onClick={() => auth.signOut()}>
                            <ListItemIcon>
                                <Logout fontSize="small"/> 
                            </ListItemIcon>
                            <ListItems>Logout</ListItems>
                        </MenuItem>
                     
                    </Menu>
                    
                </IconsContainer>
            </Header>
            <SearchWrapper>
                <Search>
                    <SearchIcon style={{ color: '#8696a0'}}/>
                    <SearchInput placeholder="Search in chat" onChange={filterusers}/>
                </Search>
            </SearchWrapper>
           
            {
                !document.querySelector('input')?.value ?

                 chatsSnapshots?.docs.length > 0 ? 

                    chatsSnapshots?.docs.map((chat) => (
                        <Chat key={chat.id} id={chat.id} users={chat.data().users} lastseen={chat.data()?.lastseen?.toDate().getTime()} lastmessage={chat.data().lastmessage} /> 
                    )):
                    <NoResults>Start a New Chat</NoResults>
                :  
                    chats?.length > 0 ?

                    
                    chats.map(chat => (
                        <Chat key={chat.id} id={chat.id} users={chat.data().users} lastseen={chat.data()?.lastseen?.toDate().getTime()} lastmessage={chat.data().lastmessage} /> 
                    ))
                    : 
                     <NoResults>No results found</NoResults>       
               
            }
        </Container>
    )
}

export default Sidebar;

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid rgba(134,150,160,0.15);
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y : scroll;
    background-color: #111b21;
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
    background-color: #202c33;
    z-index: 1;
    justify-content: space-between;
    height: 60px;
    align-items: center;
    border-bottom: 1px solid rgba(134,150,160,0.15);
    padding: 15px;

`;
const SearchWrapper = styled.div`
    border-bottom: 1px solid rgba(134,150,160,0.15);
    position: sticky;
    top: 60px;
    padding: 8px 0;
    background-color: #111b21;
    z-index:  100;
`;

const Search = styled.div`
    display: flex;
    align-items: center;
    margin: auto 10px;
    padding: 5px 10px;
    border-radius: 5px;
    background-color: #202c33;
`;


const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    font-size: 15px;
    flex: 1;
    padding-left: 10px;
    background: transparent;
    color: white;
`;


const UserAvatar = styled(Avatar)`
    cursor: pointer;

    :hover{
        opacity: 0.8;
    }
    >p{
        color: black;
    }
`;

const IconsContainer = styled.div``;

const NoResults = styled.p`
    display: block;
    margin: 50px auto;
    color: rgb(0,0,0,0.5);
    text-align: center;
    width: 200px;
    color: whitesmoke;
`;

const ListItems = styled.p`
    margin: 0;
    padding-left: 10px;
`;