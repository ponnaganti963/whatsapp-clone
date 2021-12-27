import Head from "next/head";
import styled from "styled-components";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import {auth, db} from '../../firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import getRecipientEmail from "../../Utils/getRecipientEmail";

function Chat({chat , messages}) {
    const [user] = useAuthState(auth);
    return (
        <Container>
            <Head>
                <title>Chat with {getRecipientEmail(chat.users,user)}</title>
            </Head>
            <SideBar>
                <Sidebar />
            </SideBar>
            <ChatContainter>
                <ChatScreen chat={chat} messages={messages}/>
            </ChatContainter>

        </Container>
    )
}

export default Chat;

export async function getServerSideProps(context) {
    const ref = db.collection('chats').doc(context.query.id);

    const messagesRes  = await ref
        .collection("messages")
        .orderBy("timestamp","asc")
        .get();

    const messages = messagesRes.docs.map(doc => ({
        id : doc.id,
        ...doc.data(),
    })).map(messages => ({
        ...messages,
        timestamp : messages.timestamp.toDate().getTime(),
    }));

    const chatRes = await ref.get();
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    }
    return { 
        props: {
            messages: JSON.stringify(messages),
            chat: chat
        }
    }
}

const Container = styled.div`
    display: flex;
`;

const SideBar = styled.div`
        
        @media (max-width: 750px){
            display: none;
        }
`;

const ChatContainter = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;

    ::-webkit-scrollbar{
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
`;
