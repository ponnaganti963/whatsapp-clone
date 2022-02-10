import styled from "styled-components";
import {auth,db} from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import { IconButton, Input } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useState} from "react";
import SaveIcon from '@mui/icons-material/Save';

function ProfileContainer() {
    const [user] = useAuthState(auth);
    const [editname,setEditname] = useState(user?.displayName);
    const [toggle,setToggle] = useState(false);
    return (
        <Container>
                <Avatar 
                    src={user?.photoURL ? user.photoURL : 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png'}>
                </Avatar>
                
                <DetailsDiv>
                    <Card>
                        <PersonIcon style={{color: '#8696a0'}}/>
                        <Details>
                        <h5>Name</h5>
                        {
                            toggle ?
                            <InputName value={editname} onChange={(e) => setEditname(e.target.value)} />:
                            <h3>{editname}</h3>

                        
                        }
                        
                        
                        </Details>
                        <IconButtonWrap onClick={() =>{
                            
                            setToggle(!toggle);
                            if(toggle) {
                                auth.currentUser.updateProfile({
                                    displayName: editname
                                });
                                db.collection('users').doc(user.uid).set({
                                    displayName: editname,
                                },
                                {merge: true}
                                );
                                console.log(auth.currentUser.displayName);
                            }
                            
                            
                            }}>
                            {
                            toggle ?
                            <SaveIcon style={{color: '#8696a0'}}/> 
                            :
                            <EditIcon style={{color: '#8696a0'}}/>
                            }
                            
                            
                        </IconButtonWrap>
                    </Card>
                    
                    <Card>
                        <EmailIcon style={{color: '#8696a0'}}/>
                        <Details>
                        <h5>Email</h5>
                        <h3>{user?.email}</h3>
                        </Details>
                    </Card>
                    
                </DetailsDiv>
        </Container>
    )
}

export default ProfileContainer;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    *{
        margin: 0;
    }
`;

const InputName = styled.input`
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: 1px solid black;
    font-size: 15px;
    font-weight: bold;
    outline: none;
    background:transparent;
    color:  white;
   
`;

const Avatar = styled.img`
    display: block;
    border-radius: 100%;
    margin: 20px auto;
    width: 200px;
    height: 200px;

    @media (max-width:750px) {
        width: 150px;
        height: 150px;
    }

`;

const IconButtonWrap = styled(IconButton)`
    width: 40px;
    height: 40px;
    position: absolute !important;
    top: 10px;
    right: 0;
    
`;

const DetailsDiv = styled.div`
    max-width: 500px;
    margin: auto;
    display: flex;
    flex-direction: column;

   
`;

const Card = styled.div`
    display: flex;
    border-bottom: 1px solid rgba(134,150,160,0.15);
    position: relative;
    padding: 10px;
`;

const Details = styled.div`
    margin-left: 20px;

    >h5{
        color: rgba(255,255,255,0.3);
    }

    >h3{
        color: white;
    }
    @media (max-width: 750px) {

        >h3{
            font-size: 15px
        }
    }
`;

