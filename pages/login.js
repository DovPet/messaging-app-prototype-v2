import React from 'react';
import Head from 'next/head'
import styled from 'styled-components';
import { Button } from '@mui/material';
import { auth, provider } from '../firebase'

function Login() {

const signIn = () => {
    auth.signInWithPopup(provider).catch(alert)
}

  return (
    <Container>
        <Head>
            <title>Login</title>
        </Head>
        <LoginContainer>
            <Logo src="https://cdn.iconscout.com/icon/free/png-256/message-672-675248.png" />
            <Button onClick={signIn} variant="outlined" >Sign In With Google</Button>
        </LoginContainer>
    </Container>
  )
}

export default Login;

const Container = styled.div`
    display: grid;
    place-content: center;
    height: 100vh;
    background-color: whitesmoke;
`
const LoginContainer = styled.div`
    padding: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius: 50px;
`
const Logo = styled.img`
    height: 200px;
    width: 200px;
    margin-bottom: 50px;
`