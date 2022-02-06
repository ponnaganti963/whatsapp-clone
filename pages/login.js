import styled from 'styled-components';
import Head from 'next/head';
import {Button, Chip, Divider, FilledInput, FormControl, FormHelperText, IconButton, Input, InputAdornment, InputLabel} from '@mui/material';
import {auth, provider } from '../firebase';
import {useState, useEffect} from 'react';
import { Box } from '@mui/system';
import EmailIcon from '@mui/icons-material/Email';
import AccountCircle from '@mui/icons-material/AccountCircle';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Login() {
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [showPassword,setShowPassword] = useState(false);
    const [signuptoggle,setSignuptoggle] = useState(false);
    const signIn = () =>{
        auth.signInWithPopup(provider).catch(alert);
    }

    const signUpWithEmail = () =>{
        localStorage.setItem('displayName',name);
        auth.createUserWithEmailAndPassword(email, password).catch(alert); 
    }

    const signInWithEmail = () =>{
        auth.signInWithEmailAndPassword(email, password).catch(alert);
    }

    

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
      };
    return (
        <Container>
            <Head>
                <title>Login</title>
                <meta name="description" content="LogIn Page" />
                <link rel="icon" href="/whatsappimg.png" />
            </Head>

            <LoginContainer>

                <Logo src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" />
                
                <Box sx={{display: 'flex', alignItems: 'center',flexDirection: 'column'}}> 
                {

                    signuptoggle && 
                    <FormControl style={{marginBottom: '15px',width: '100%'}}>
                    <Input 
                    id="Name-input" 
                    placeholder="Name"
                    autoFocus
                    aria-describedby="my-helper-text"
                    onChange={(e) => setName(e.target.value)} 
                    startAdornment={
                        <InputAdornment position="start">
                            <AccountCircle />
                        </InputAdornment>
                    }
                    />
                    </FormControl>
                }
                
               <FormControl style={{marginBottom: '15px',width: '100%'}}>
                    <Input 
                    id="email-input"
                    placeholder="Email" 
                    aria-describedby="my-helper-text" 
                    onChange={(e) => setEmail(e.target.value)}
                    startAdornment={<InputAdornment position="start"><EmailIcon /></InputAdornment>}
                    />
               </FormControl>
               <FormControl style={{marginBottom: '15px',width: '100%'}}>
                    <Input 
                    id="password-input" 
                    placeholder="password"
                    aria-describedby="my-helper-text" 
                    startAdornment={<InputAdornment position="start"><VpnKeyIcon/></InputAdornment>}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        >
                         {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                    }
                    />
               </FormControl>

               {
                   signuptoggle 
                   ? 
                   <Button  variant="contained" onClick={signUpWithEmail}>Sign Up</Button>
                   :
                   <Button  variant="contained" onClick={signInWithEmail}>Sign In</Button>

               }

              

                </Box>

                <p style={{color: 'gray',margin: '10px auto'}}>{!signuptoggle ? "Doesn't have an account?" : "Already have an account?"}<ToggleSignOption onClick={() => setSignuptoggle(!signuptoggle)}>{!signuptoggle ? "Sign Up" : "Sign In"}</ToggleSignOption></p>

                <Divider>
                    <Chip label="Or" style={{marginTop: '20px',marginBottom: '20px'}}/>
                </Divider>
              

                <Button  variant="outlined" onClick={signIn}>Sign in with Google </Button>
            </LoginContainer>
            
        </Container>
    )
}

export default Login;

const Container  = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    background-color: whitesmoke;
`;
const LoginContainer = styled.div`
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    padding: 25px;
    background-color: white;
    border-radius:5px;
    box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
    @media (max-width: 768px) {
        max-width: 350px;
    }
`;

const InputWrap = styled.div`
    margin: 10px auto;

    >h3{
        margin: 0;
    }
`;
const Logo  = styled.img`
    height: 200px;
    width: 200px;
    margin: 20px auto;

`;

const ToggleSignOption = styled.h3`
    /* margin-left: 10px;   */
    display: inline-block;
    cursor: pointer;
    color: black;
    margin: 0 10px;


`;