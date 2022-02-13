import styled from "styled-components";
import {auth,db, storage} from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import { IconButton, Input } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useState,useRef,useEffect} from "react";
import SaveIcon from '@mui/icons-material/Save';

function ProfileContainer() {
    const ProfilePicRef = useRef(null);
    const [user] = useAuthState(auth);
    const [editname,setEditname] = useState(user?.displayName);
    const [toggle,setToggle] = useState(false);
    const [Image,setImage] = useState(null);
    const [ImageUrl,setImageUrl] = useState(user?.photoURL);
    const [uploading,setUploading] = useState(false);

    const uploadImage = () => {
        setUploading(true);
        const ref = storage.ref(`/images/${Image.name}`)
        const uploadTask = ref.put(Image);
        uploadTask.on('state_changed', 
        console.log, 
        console.error,
        ()=>{
        ref.getDownloadURL()
            .then(fireBaseUrl => {
                setImage('');
                setImageUrl(fireBaseUrl);
                auth.currentUser.updateProfile({ 
                    photoURL: fireBaseUrl
                })
                db.collection('users').doc(user.uid).set({
                    photoURL: fireBaseUrl,
                },
                {merge: true}
                );
            })
            setUploading(false);
    
        })

        
        
    }

    const cancleUpload = () => {
        setImageUrl(user.photoURL);
        setImage(null);
    }
    
    return (
        <Container>
            <ImageWrapper>
                <Avatar 
                    src={user.photoURL ?  ImageUrl : 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png'}>
                </Avatar>
                <IconButtonFile>
                     <EditIconFile style={{color: '#8696a0'}}>
                     
                     </EditIconFile>
                     <FileInput type="file" accept="image/png, image/jpeg" onChange={(e) =>{
                if(e.target.files){
                    setImage(e.target.files[0]);
                    let reader = new FileReader();
                    let objectURL = reader.readAsDataURL(e.target.files[0]);
                    reader.onload = () => {
                        setImageUrl(reader.result);
                    }
                    e.target.value = null;
                }
                }}></FileInput>
                     
                </IconButtonFile>

            </ImageWrapper>

            <ButtonWrapper>
                <button onClick={uploadImage} disabled={!Image}>{uploading ? "uploading..." : "upload"}</button>
                <button onClick={cancleUpload} disabled={!Image}>Cancel</button>
            </ButtonWrapper>
                
                
                
            
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

const ImageWrapper = styled.div`
    display: block;
    margin: 20px auto;
    background-color: #16242e;
    border-radius:100%;
    width: 200px;
    height: 200px;
    position: relative;
    @media (max-width:750px) {
        width: 150px;
        height: 150px;
    }
`;

const IconButtonFile = styled(IconButton)`
    position: absolute !important;
    right: -10% !important;
    bottom: 0 !important;
    border-radius: 5px 80% 100% 80%  !important;
    background-color: #1f2b34 !important;
`;

const EditIconFile = styled(EditIcon)`
    position: relative;
    
`;


const FileInput = styled.input`
    opacity: 0;
    width: 40px;
    height: 40px;
    position: absolute;
    top: 0;
    left:0;
    z-index: 1000;

`;

const ButtonWrapper = styled.div`
    align-self: center;
    max-width: 500px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    button{
        /* background-color: ; */
        padding: 10px 20px;
        border-radius: 5px;
        border: none;
        cursor: pointer;

        :disabled{
            cursor: not-allowed;

        }
    }
`;
const Avatar = styled.img`
    border-radius: 100%;
    width: 100%;
    height: 100%;
    object-fit: contain;
`;

const IconButtonWrap = styled(IconButton)`
    width: 40px;
    height: 40px;
    position: absolute !important;
    top: 10px;
    right: 0;
    
`;

const DetailsDiv = styled.div`
    max-width: 40%;
    width: 100%;
    margin: auto;
    display: flex;
    flex-direction: column;
    @media (max-width: 750px){
        max-width: 90%;
    }

   
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
            font-size: 15px;
            padding-right: 15px;
        }
    }
`;

