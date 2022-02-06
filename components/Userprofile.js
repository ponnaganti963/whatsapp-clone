import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import EmailIcon from '@mui/icons-material/Email';
import {db} from '../firebase';


function Userprofile({ phtoturl ,email, name}) {
  const [user,setUSer] = useState({});
  useEffect(() => {
    db.collection('users').onSnapshot((snap)=> {
      snap.docs.map(doc => {
        if (doc.email === email) {
          setUSer(doc.data());
        }
      })
    });
  },[email])

  return (
      <Container>
                <Avatar 
                    src={phtoturl ? phtoturl : 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png'}>
                </Avatar>
                <DetailsDiv>
                    
                        <h3>{name}</h3>
                        <h3>{email}</h3>
                        <MailTO href={`mailto: ${email}`}> 
                        <EmailIcon style={{height:'50px',width:'50px'}} />
                        <p style={{margin:0}}>Email</p>
                        </MailTO>
                        
                </DetailsDiv>
        </Container>

    
  )
}

export default Userprofile;


const Container = styled.div`

  width: 25vw;
  display: block;
  margin: 60px auto;
 


`;

const MailTO = styled.a`
  margin: 20px auto 0;
  height: 50px;
  display:flex;
  flex-direction: column;
  align-items: center;
  color: #07c342ed;
`;

const Avatar = styled.img`
    display: block;
    border-radius: 100%;
    margin: 20px auto;
    width: 200px;
    height: 200px;


    @media (max-width:900px) {
        width: 120px;
        height: 120px;
    }

`;

const DetailsDiv = styled.div`
    /* max-width: 500px; */
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    >h3{

      margin: 0;
    }
   
`;
