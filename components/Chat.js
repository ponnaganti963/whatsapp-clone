import styled from "styled-components";
import {Avatar } from "@mui/material";
import getRecipientEmail from "../Utils/getRecipientEmail";
import  {auth,db } from '../firebase';
import {useCollection} from "react-firebase-hooks/firestore";
import {useAuthState} from "react-firebase-hooks/auth";
import { useRouter} from "next/router";

function Chat({id, users}) {
    const router = useRouter();
    const [user] = useAuthState(auth); 
    const recipientEmail = getRecipientEmail(users, user);
    const [recipientSnapshot] = useCollection(db.collection('users').where('email',"==",recipientEmail));
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const enterChat = () => {
        router.push(`/chat/${id}`);
    }
    console.log(recipient);
    return (
        <Container>
            {
                recipient ? (
                    <UserAvatar src={recipient?.photoURL}/>
                ) : (
                    <UserAvatar>{recipientEmail[0]}</UserAvatar>
                )
            }

            <EmailWrapper>
          
            <RecipientEmail onClick={enterChat}>{recipient?.displayName}</RecipientEmail>
            </EmailWrapper>
 
          
        </Container>
    )
}

export default Chat;

const Container = styled.div`
    display: flex;
    height: 70px;
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

`;

const RecipientEmail = styled.p`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: white;

`;

const EmailWrapper = styled.div`
    flex: 1;
    padding-bottom: 14px;
    border-bottom: 0.1px solid rgba(134,150,160,0.15);
`;
