import styled from "styled-components";
import {Avatar } from "@mui/material";
import getRecipientEmail from "../Utils/getRecipientEmail";
import  {auth,db } from '../firebase';
import {useCollection} from "react-firebase-hooks/firestore";
import {useAuthState} from "react-firebase-hooks/auth";
import { useRouter} from "next/router";
import moment from 'moment';
import { Suspense } from "react";

function Chat({id, users, lastseen, lastmessage}) {
    const router = useRouter();
    const [user] = useAuthState(auth); 
    const recipientEmail = getRecipientEmail(users, user);
    const [recipientSnapshot] = useCollection(db.collection('users').where('email',"==",recipientEmail));
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const enterChat = () => {
        console.log('sadfsadf',id);
        router.push(`/chat/${id}`);
    }
    return (
        <Container onClick={enterChat}>
            {
                recipient ? (
                    <UserAvatar src={recipient?.photoURL}/>
                ) : (
                    <UserAvatar>{recipientEmail[0]}</UserAvatar>
                )
            }
            <Suspense fallback={`Loading`}>
                <EmailWrapper>
                    <RecipientEmail>{recipient?.displayName}</RecipientEmail>
                    { lastmessage && <SpanLastMessage>{lastmessage}</SpanLastMessage> }
                    <Spantime>{lastseen ? moment(lastseen).format('LT') : '...'}</Spantime>
                </EmailWrapper>
            </Suspense>
            
 
          
        </Container>
    )
}

export default Chat;

const Container = styled.div`
    display: flex;
    height: 65px;
    align-items: center;
    cursor: pointer;
    padding: 0 10px;
    
    :hover{
        background-color: #2a3942;
    }
`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
    width: 50px !important;
    height: 50px !important;
    background-color: #6a7175 !important;
    object-fit: contain !important;

`;

const RecipientEmail = styled.p`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: white;
    margin: 5px 0 2px;
    max-width: 200px;
    @media (max-width: 768px)  and (min-width: 400px)  {
        max-width: 80%;
    }
    @media (max-width: 400px){
        max-width: 150px;
    }

`;

const EmailWrapper = styled.div`
    flex: 1;
    height: 100%;
    border-bottom: 0.1px solid rgba(134,150,160,0.15);
    position: relative;
`;

const SpanLastMessage = styled.p`
    margin: 0;
    color: #d1d7db;
    width: 180px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    @media (max-width: 750px) {
        width: 50%;
    }
    @media (max-width: 400px){
        width: 200px;
    }
`;


const Spantime = styled.span`
    position: absolute;
    right: 0;
    top: 5px;
    color: #586e74;
`;