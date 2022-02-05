import React from 'react';
import styled from "styled-components";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';


function Userprofile({ phtoturl ,email}) {
  return (


<Container>
                <Avatar 
                    src={phtoturl ? phtoturl : 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png'}>
                </Avatar>
                <DetailsDiv>
                    
                        <h3>User Name</h3>
                        <h3>{email}</h3>
                </DetailsDiv>
        </Container>

    
  )
}

export default Userprofile;


const Container = styled.div`
  position: fixed;
  top: 60px;
  width:  100%;
  display: block;
  margin: auto;
  


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
