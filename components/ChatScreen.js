import { useRouter } from 'next/router';
import React, { useState, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth, db } from '../firebase';
import Avatar from '@mui/material/Avatar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import { IconButton } from '@mui/material';
import { useCollection } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app'
import Message from './Message';
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react';

function ChatScreen({chat, messages}) {
  const [user] = useAuthState(auth)
  const router = useRouter()
  const [messagesSnapshot] = useCollection(db.collection('chats').doc(router.query.id).collection('messages').orderBy('timestamp', 'asc'))
  const [input, setInput] = useState()
  const recipientEmail = getRecipientEmail(chat.users, user)
  const [recipientSnapshot] = useCollection(db.collection('users').where('email','==', recipientEmail))
  const recipient = recipientSnapshot?.docs?.[0]?.data()
  const endOfMessagesRef = useRef(null)

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView(
      {
        behavior: 'smooth',
        block: 'start',
      }
    )
  }

  const showMessages = () => {
     if(messagesSnapshot){
       return messagesSnapshot.docs.map(message => (
         <Message 
          key={message.id} 
          user={message.data().user} 
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime()
         }}/>
       ))
     } else{
       return JSON.parse(messages).map(message => (
        <Message 
          key={message.id} 
          user={message.user} 
          message={message}/>
       ))
     }
  }

  const sendMessage = e => {
    e.preventDefault()

    db.collection('users').doc(user.uid).set({
      lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
    }, {merge: true})

    db.collection('chats').doc(router.query.id).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL 
    })

    setInput('')
    scrollToBottom()
  }

  return (
      <Container>
        <Header>
        {recipient ? (
          <UserAvatar src={recipient?.photoURL}/>
        ) : (
          <UserAvatar>{recipientEmail[0].toUpperCase()}</UserAvatar>
        )}
          
          <HeaderInformation>
            <h3>{recipientEmail}</h3>
            {recipientSnapshot ? (
              <p>Last active: {' '}
                {recipient?.lastSeen?.toDate() ? (
                    <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                ) : "Unavailable" }
              </p>
            ) : (
              <p>Loading Last Active...</p>
            )}
          </HeaderInformation>
          <HeaderIcons>
            <IconButton>
              <AttachFileIcon />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </HeaderIcons>
        </Header>
        <MessageContainer>
          {showMessages()}
          <EndOfMessage ref={endOfMessagesRef}/>
        </MessageContainer>
        <InputContainer>
          <InsertEmoticonIcon />
          <Input value={input} onChange={e => setInput(e.target.value)} />
          <button hidden disabled={!input} type='submin' onClick={sendMessage}></button>
          <MicIcon />
        </InputContainer>
      </Container>
  )
}
export default ChatScreen;

const Container = styled.div`

`

const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: gray;
    margin: 0 0 5px 0;
  }
`
const UserAvatar = styled(Avatar)``
const HeaderIcons = styled.div``
const MessageContainer = styled.div`
  padding: 30px;
  background-color: #E5DED8;
  min-height: 90vh;
`
const EndOfMessage = styled.div`
  margin-bottom: 50px;
`
const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;

`
const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 20px;
  margin: 0 15px;
`