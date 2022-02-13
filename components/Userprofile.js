import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import EmailIcon from '@mui/icons-material/Email';
import {db} from '../firebase';
import PhoneIcon from '@mui/icons-material/Phone';
import Phone from '@mui/icons-material/Phone';


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
  console.log(user,user.phoneNumber);

  return (
      <Container>
        <ProfileWrapper>
            <Avatar 
              src={phtoturl ? phtoturl : 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png'}>
            </Avatar>
            <DetailsDiv>
                
                    <h3>{name}</h3>
                    <h3>{email}</h3>
                    { 
                      user.phoneNumber ? 
                      <MailTO>
                      <Phone/>
                    </MailTO>:
                    ''
                    }
                    
                    <MailTO href={`mailto: ${email}`}> 
                    <EmailIcon style={{height:'50px',width:'50px'}} />
                    <p style={{margin:0}}>Email</p>
                    </MailTO>
                    
            </DetailsDiv>
        </ProfileWrapper>
                
        </Container>

    
  )
}

export default Userprofile;


const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: grid;
  place-items: center;
 padding-top: 60px;
`;

const ProfileWrapper = styled.div`
  color: white;
  margin-top: -300px;
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
    margin: 100px auto 20px;
    width: 200px;
    height: 200px;
    object-fit: contain;
    


    @media (max-width:900px) {
        width: 180px;
        height: 180px;
    }

`;

const DetailsDiv = styled.div`
    /* max-width: 500px; */
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;

    >h3{
      text-align: center;
      margin: 0;
    }
   
`;
