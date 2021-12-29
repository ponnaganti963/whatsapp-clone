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
          
            <RecipientEmail onClick={enterChat}>{recipientEmail}</RecipientEmail>
            </EmailWrapper>
 
          
        </Container>
    )
}

export default Chat;

const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0 15px;

    :hover{
        background-color: #e9eaeb;
    }
`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;

const RecipientEmail = styled.p`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

`;

const EmailWrapper = styled.div`
    flex: 1;
    border-bottom: 0.1px solid rgb(0,0,0,0.1);
`;
