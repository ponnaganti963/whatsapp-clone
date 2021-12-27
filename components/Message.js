import styled from "styled-components";
import {auth,db} from '../firebase';
import {useAuthState} from 'react-firebase-hooks/auth'; 
import moment from 'moment';
function Message({user, message}) {
    const [userLoggedIn] = useAuthState(auth);
    const TypeOfMessage = user === userLoggedIn.email ? Sender : Reciever;
    
    return (
        <Container>

            <TypeOfMessage>{message.message}
            <TimeStamp>
            {
                message.timestamp ? moment(message.timestamp).format('LT') : '...'
            }
            </TimeStamp>
            </TypeOfMessage>
        </Container>
    )
}

export default Message;

const Container = styled.div``;

const DATE = styled.p`
    color: white;
`;

const SingleMessage = styled.p`
    width: fit-content;
    padding: 8px 10px;
    border-radius: 8px;
    margin: 10px;
    min-width:60px;
    position: relative;
    text-align: left;

`;

const Sender = styled(SingleMessage)`
    background-color: #dcf8c6;
    margin-left: auto;
    position: relative;
    &:after{
        content: '';
        position: absolute;
        right: -15px;
        top: 0.1px;
        width : 0;
        height : 0;
        border-top: 15px solid #dcf8c6;
        border-right: 20px solid transparent;
    }
`;

const Reciever = styled(SingleMessage)`
    background-color: whitesmoke;
    text-align: left; 
    &:before{
        content: '';
        position: absolute;
        left: -15px;
        top: 0.1px;
        width : 0;
        height : 0;
        border-top: 15px solid whitesmoke;
        border-left: 20px solid transparent;
    }
`;

const TimeStamp = styled.span`
    color: gray;
    position: relative;
    font-size: 11px;
    bottom: -5px;
    right: 0;
    margin-left: 10px;
    text-align: right;
`;
