import styled from "styled-components";
import {auth,db} from '../firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useRouter} from 'next/router';
import {Avatar , IconButton , Menu , MenuItem} from "@mui/material";
import getRecipientEmail from "../Utils/getRecipientEmail";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {useCollection} from 'react-firebase-hooks/firestore';
import Message from "./Message";
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicNoneIcon from '@mui/icons-material/MicNone';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useState, useRef ,useEffect } from "react";
import firebase from "firebase";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import TimeAgo from "timeago-react";
import Userprofile from "./Userprofile";
import CloseIcon from '@mui/icons-material/Close';

function ChatScreen({chat, messages}) {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState('');
    const [show,setShow] = useState(false);
    const endOfMessagesRef =useRef(null);
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const router = useRouter();
    const [messageSnapshot] = useCollection(db.collection('chats').doc(router.query.id).collection('messages').orderBy('timestamp','asc'));

    const [recipientSnapshot] = useCollection(
        db
        .collection('users')
        .where("email", "==" , getRecipientEmail(chat.users,user))  
    );
    const ITEM_HEIGHT = 48;

    const showMessages = () =>{
        if(messageSnapshot){
            return messageSnapshot.docs.map(message => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate(),
                    }}
                />
            ))
        }else{
            return JSON.parse(messages).map(message => (
                <Message 
                key={message.id} 
                user={message.user} 
                message={message}
                />
            ))
        }
    };

    const ScrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behaviour: "smooth",
            block: "start",
        })
    }

    useEffect(() => {
        console.log('dasdf',window.innerWidth);
        if(window.innerWidth <= '900'){
            console.log(window.innerWidth);
        if(show === true) {
            console.log('truw');
            ref1.current.style.display = "none";
        }else{
            console.log('false');
            ref1.current.style.display = "block";
        }
    }
    },[show])


    const sendMessage = (e) =>{
        e.preventDefault();
        //update last seen
        db.collection('users').doc(user.uid).set({
            lastseen: firebase.firestore.FieldValue.serverTimestamp(),
        },
        {merge: true}
        );

        db.collection('chats').doc(router.query.id)?.set({
            lastseen: firebase.firestore.FieldValue.serverTimestamp(),
        },
        {merge: true}
        );

        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(), 
            message: input,
            user: user.email, 
            photoURL: user.photoURL,
        });

        setInput('');
        ScrollToBottom();
    };

    
    useEffect(() => {
        if(db.collection('chats').doc(router.query.id)?.users) {router.push('/');}
        ScrollToBottom();
    }, [input]);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const deleteChat = () =>{
        db.collection('chats').doc(router.query.id)?.delete();
        db.collection('chats').doc(router.query.id)?.collection('messages').onSnapshot(ref =>{
            ref.docs.forEach(doc=>{
                db.collection('chats').doc(router.query.id)?.collection('messages').doc(doc.id).delete();
            })
        });
        router.push('/');
    }

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    // console.log(recipientSnapshot);
    const recipientEmail = getRecipientEmail(chat.users,user);
    

    return (
        <Container>
            <ChatScreenWrapper>
                <Leftpart ref={ref1}>
                    <Header>
                        <ArrowIcon onClick={ () => router.push('/')}>

                        </ArrowIcon>
                        <AvatarDiv onClick={ () => setShow(!show)}>
                            {
                                recipient ? (
                                    <Avatar src={recipient?.photoURL}/>
                                ) : (
                                    <Avatar>{recipientEmail[0]}</Avatar>
                                )
                            }

                        </AvatarDiv>
                    
                
                        <HeaderInformation>
                            <h3>{getRecipientEmail(chat.users,user)}</h3>
                            {
                                recipientSnapshot ?
                                (
                                <p>Last seen {"  "}
                                    {
                                        recipient?.lastseen?.toDate() ? (
                                            <TimeAgo datetime={recipient.lastseen?.toDate()} />
                                        ) : "Unavilable"
                                    }

                                </p> 
                                ): (
                                    <p>Loading Last active ....</p>
                                )
                            }
                        </HeaderInformation>
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={open ? 'long-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                        >
                            <MoreVertIcon/>
                        </IconButton>
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
                                <MenuItem key='Info' onClick={() => setShow(true)} >
                                    Contact Info
                                </MenuItem>
                            
                                <MenuItem key='Delete' onClick={deleteChat} >
                                    Delete Chat
                                </MenuItem>
                            
                            </Menu>
                    </Header>
                    <MessageContainer>
                        {showMessages()}
                        <EndOfMessages ref={endOfMessagesRef}/>
                    </MessageContainer>
                    <InputContainer>
                        <InsertEmoticonIcon />
                        <AttachFileIconBlock />
                        <Input placeholder="Type a message" value={input} onChange={e => setInput(e.target.value)}/>
                        {
                            input ?
                            (<Button style={{display: !input}}  type="submit" onClick={sendMessage}><SendIcon /></Button>)
                            :
                            (<MicNoneIcon />)
                        }
                        
                        
                    </InputContainer>
                </Leftpart>
                {
                    show && (
                        <RightPart ref={ref2}>
                            <RightPartHeader>
                                <CloseIconblock onClick={() => setShow(false)} />
                                <Heading>Contact Info</Heading>
                            </RightPartHeader>
                            
                            <Userprofile phtoturl ={recipient?.photoURL} email ={recipientEmail}/>
                        </RightPart>
                    )
                }
            
                
            </ChatScreenWrapper>
            
            
        </Container>
    )
}

export default ChatScreen;

const AttachFileIconBlock = styled(AttachFileIcon)`
    margin-left: 10px;
    transform : rotate(-45deg);
`;

const RightPartHeader = styled.div`
    margin-left: 20px;
    display: flex;
    align-items : center;
    position: fixed;
`;
const CloseIconblock = styled(CloseIcon)``;

const Container = styled.div`
    display: relative;
`;

const ChatScreenWrapper = styled.div`
    display: flex;
    transition: all 1s linear;
`;


const Leftpart = styled.div`
    flex: 1;
    
`;

const RightPart = styled.div`
    width: 25vw;
    height: 100vh;
    border-left: 1px solid whitesmoke;

`;

const Heading = styled.h3`
    display: inline-block;
    margin-left: 10px;
`;

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top:0;
    display: flex;
    padding: 11px;
    height: 60px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;

const AvatarDiv = styled.div`
    cursor:  pointer;
`;

const ArrowIcon = styled(ArrowBackIcon)`
    margin-right: 5px ;
    @media (min-width: 750px){
        display: none !important;
    }
`;

const Button = styled.button`
    border: none !important ;
    background-color: white;
`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    >h3{
        margin-top: 10px;
        margin-bottom: 0;
    }

    >p{
        font-size: 14px;
        color: grey;
        margin: 0;
    }

    @media (max-width: 750px){
        >h3{
            max-width: 180px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
    }
`;


const MessageContainer = styled.div`
    padding: 30px;
    background: url('https://wallpaperaccess.com/full/2224368.png');
    background-size: cover;
    min-height: 90vh;

    @media (max-width: 750px){
        padding: 45px 15px;
    }

`;


const EndOfMessages = styled.div`
    margin-bottom: 20px;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`;

const Input = styled.input`
    flex: 1;
    padding: 10px;
    padding-left: 20px;
    outline: 0;
    border: none;
    align-items: center;
    bottom: 0;
    position:sticky;
    background-color: #EDEDED;
    margin-left: 15px;
    margin-right: 5px;
    border-radius: 25px;
`;