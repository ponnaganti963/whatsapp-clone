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
import dynamic from 'next/dynamic';

// import Picker from 'emoji-picker-react';

function ChatScreen({chat, messages}) {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState('');
    const [show,setShow] = useState(false);
    const endOfMessagesRef =useRef(null);
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const router = useRouter();
    const [openEmoji,setOpenEmoji] = useState(false);
    const [messageSnapshot] = useCollection(db.collection('chats').doc(router.query.id).collection('messages').orderBy('timestamp','asc'));

    const [recipientSnapshot] = useCollection(
        db
        .collection('users')
        .where("email", "==" , getRecipientEmail(chat.users,user))  
    );
    const ITEM_HEIGHT = 48;
    const Picker = dynamic(() => import('emoji-picker-react'), {ssr: false});

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
        if(window.innerWidth <= '1000'){
        if(show === true) {
            ref1.current.style.display = "none";
        }else{
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
            lastmessage: input
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

    const onemojiclick = (e, emojiObject) => {
        setInput(input+emojiObject.emoji);
    }

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users,user);
    

    return (
        <Container>
            <ChatScreenWrapper>
                <Leftpart ref={ref1}>
                    <Header>
                        <IconButton onClick={ () => router.push('/')}>
                            <ArrowIcon></ArrowIcon>
                        </IconButton>
                        
                        <AvatarDiv>
                            {
                                recipient ? (
                                    <Avatar src={recipient?.photoURL}/>
                                ) : (
                                    <Avatar>{recipientEmail[0]}</Avatar>
                                )
                            }

                        </AvatarDiv>
                    
                
                        <HeaderInformation onClick={ () => setShow(!show)}>
                            <h3>{recipient?.displayName}</h3>
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
                            <MoreVertIcon style={{color: '#8696a0'}}/>
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
                                <MenuItem key='Info' onClick={() => {setShow(true); handleClose();}} >
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
                        { openEmoji && <PickerContainer><Picker onEmojiClick={onemojiclick}  pickerStyle={{width: '100%'}} disableAutoFocus/></PickerContainer> }
                        <InputWrapper>
                        <InsertEmoticonIcon style={{color: '#8696a0'}} onClick={() => setOpenEmoji(!openEmoji)}/>
                        <AttachFileIconBlock />
                        <Input placeholder="Type a message" value={input} onChange={e => setInput(e.target.value)} autoFocus/>
                        {
                            input ?
                            (<Button style={{display: !input}}  type="submit" onClick={sendMessage}><SendIcon /></Button>)
                            :
                            (<MicNoneIconWrap></MicNoneIconWrap>)
                        }
                        </InputWrapper>
                        
                    </InputContainer>
                </Leftpart>
                {
                    show && (
                        <RightPart ref={ref2}>
                            <RightPartHeader>
                                <IconButton onClick={() => setShow(false)}><CloseIconblock  /></IconButton>
                                
                                <Heading>Contact Info</Heading>
                            </RightPartHeader>
                            
                            <Userprofile phtoturl ={recipient?.photoURL} email ={recipientEmail} name = {recipient?.displayName}/>
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
    color: #8696a0;
`;

const RightPartHeader = styled.div`
    padding-left: 10px;
    display: flex;
    align-items : center;
    position: fixed;
    top: 0;
    height: 60px;
    width: 100%; 
    background-color: #202c33;
`;
const CloseIconblock = styled(CloseIcon)`
 color: #8696a0;
`;

const Container = styled.div`
    display: relative;
`;

const ChatScreenWrapper = styled.div`
    display: flex;
    transition: all 1s linear;
`;


const Leftpart = styled.div`
    flex: 1;
    border-right: 0.1px solid #8696a0;;
    
`;

const RightPart = styled.div`
    width: 25vw;
    height: 100vh;

    position: sticky;
    top: 0;
    right: 0;
    background-color: #111b21;
    
    @media (max-width: 1000px){
        width: 100vw;
    }

`;

const Heading = styled.h3`
    display: inline-block;
    margin-left: 10px;
    color: white
`;

const Header = styled.div`
    position: sticky;
    background-color: #202c33;
    z-index: 100;
    top:0;
    display: flex;
    padding: 0 5px;
    height: 60px;
    align-items: center;
    border-bottom: 0.5px solid rgba(134,150,160,0.15);
`;

const AvatarDiv = styled.div``;

const ArrowIcon = styled(ArrowBackIcon)`
    margin-right: 5px ;
    color: #8696a0;
    @media (min-width: 750px){
        display: none !important;
    }
`;

const Button = styled.button`
    border: none !important ;
    background: transparent !important;
    color: #8696a0;
`;

const MicNoneIconWrap = styled(MicNoneIcon)`
  color: #8696a0;
  font-size: 25px !important;
  width: 37px !important;
`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;
    height: 100%;
    cursor:  pointer;
    padding: 0 5px;

    >h3{
        margin-top: 7px;
        margin-bottom: 0;
        color: white;
    }

    >p{
        font-size: 14px;
        color: grey;
        margin: 0;
    }

    @media (max-width: 750px){
        margin-left: 10px;
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
    flex-direction: column;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: #202c33;
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
    font-size: 15px;
    color: #e9edef;
    background-color: #2a3942;
    margin-left: 15px;
    margin-right: 5px;
    border-radius: 5px;

    ::placeholder{
        color: #8696a0;
    }
`;

const PickerContainer = styled.div`
    margin-bottom: 20px;
`;

const InputWrapper = styled.div`
display: flex;
flex: 1;
width: 100%; 
align-items: center;
`;