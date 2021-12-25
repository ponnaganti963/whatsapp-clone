import styled from "styled-components";
import {auth,db} from '../firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useRouter} from 'next/router';
import {Avatar , IconButton, Button} from "@mui/material";
import getRecipientEmail from "../Utils/getRecipientEmail";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {useCollection} from 'react-firebase-hooks/firestore';
import Message from "./Message";
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicNoneIcon from '@mui/icons-material/MicNone';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useState, useRef } from "react";
import firebase from "firebase";
import TimeAgo from "timeago-react";

function ChatScreen({chat, messages}) {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState('');
    const endOfMessagesRef =useRef(null);
    const router = useRouter();
    const [messageSnapshot] = useCollection(db.collection('chats').doc(router.query.id).collection('messages').orderBy('timestamp','asc'));
    const [recipientSnapshot] = useCollection(
        db
        .collection('users')
        .where("email", "==" , getRecipientEmail(chat.users,user))  
    );

    const showMessages = () =>{
        if(messageSnapshot){
            return messageSnapshot.docs.map(message => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
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

    const sendMessage = (e) =>{
        e.preventDefault();
        //update last seen
        db.collection('users').doc(user.uid).set({
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

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users,user);
    return (
        <Container>
            <Header>
            {
                recipient ? (
                    <Avatar src={recipient?.photoURL}/>
                ) : (
                    <Avatar>{recipientEmail[0]}</Avatar>
                )
            }
           
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
                <HeaderIcon>

                    <MoreVertIcon/>
                </HeaderIcon>
            </Header>
            <MessageContainer>
                {showMessages()}
                <EndOfMessages ref={endOfMessagesRef}/>
            </MessageContainer>
            <InputContainer>
                <InsertEmoticonIcon />
                <AttachFileIconBlock />
                <Input placeholder="Type a message" value={input} onChange={e => setInput(e.target.value)}/>
                <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send message</button>
                <MicNoneIcon />
            </InputContainer>
            
        </Container>
    )
}

export default ChatScreen;

const AttachFileIconBlock = styled(AttachFileIcon)`
    margin-left: 10px;
    transform : rotate(-45deg);
`;

const Container = styled.div``;

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

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    >h3{
        margin-bottom: 3px;
        margin-top: 10px;
    }

    >p{
        font-size: 14px;
        color: grey;
        margin: -5px auto;
    }
`;

const HeaderIcon = styled.div``;

const MessageContainer = styled.div`
    padding: 30px;
    background: url('https://wallpaperaccess.com/full/2224368.png');
    background-size: cover;
    min-height: 90vh;

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
    positiony:sticky;
    background-color: whitesmoke;
    margin-left: 15px;
    margin-right: 15px;
    border-radius: 25px;
`;