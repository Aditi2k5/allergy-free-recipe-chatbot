'use client'
import { useState } from "react";
import {Box, Stack, TextField, Button, Typography} from '@mui/material';


const foodBgPattern = `
  data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23d0f0c0' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E
`;

export default function Home() {
  const [messages, setMessages] = useState([{
    role:'assistant',
    content:`Hi! I'm your allergy-free recipe assistant. How can I help you find a delicious and safe recipe today?` 
  }])

  const [message, setMessage] = useState('')

  const sendMessage = async () => {
    if (!message.trim()) return;
    setMessage('')
    setMessages((prevMessages)=>[
      ...prevMessages,
      {role:'user', content: message},
      {role:'assistant' , content:''},
  ]);

  const response = fetch('api/chat', {
    method:'POST' ,
    headers:{
      'Content-Type': 'application/json',
    },
    body:JSON.stringify([...messages, {role:'user', content: message}]),
  }).then(async (res) => {
    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    let result = ''
    return reader.read().then(function processText({done, value}){
      if (done){
        return result
      }
      const text = decoder.decode(value || new Int8Array, {stream: true})
      setMessages((messages) => {
        let lastMessage = messages[messages.length-1]
        let otherMessages = messages.slice(0, messages.length-1)
        return [
          ...otherMessages,
          {
            ...lastMessage,
            content: lastMessage.content + text
          }, 
        ]
      })
      return reader.read().then(processText)
    })
  })
  }
  return (
    <Box
    width='100vw'
    height='100vh'
    display='flex'
    flexDirection='column'
    alignItems='center'
    justifyContent='center'
    sx={{
      backgroundImage: `url("${foodBgPattern}")`,
      backgroundColor: '#f0fff0',
    }}
  >
    <Typography variant="h4" mb={2} color="primary">Allergy-Free Recipe Assistant</Typography>
    <Stack
      direction='column'
      width='600px'
      height='700px'
      border='1px solid #4caf50'
      borderRadius={4}
      p={2}
      spacing={3}
      bgcolor='rgba(255, 255, 255, 0.9)'
      boxShadow={3}
    >
      <Stack
        direction='column'
        spacing={2}
        flexGrow={1}
        overflow='auto'
        maxHeight='100%'
        sx={{
          '&::-webkit-scrollbar': {
            width: '0.4em'
          },
          '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey'
          }
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            display='flex'
            justifyContent={
              message.role === 'assistant' ? 'flex-start' : 'flex-end'
            }
          >
            <Box
              bgcolor={
                message.role === 'assistant' ? '#e8f5e9' : '#e1f5fe'
              }
              color="black"
              borderRadius={16}
              p={2}
              maxWidth="80%"
              sx={{
                boxShadow: 1,
                border: '1px solid',
                borderColor: message.role === 'assistant' ? '#81c784' : '#4fc3f7'
              }}
            >
              <Typography>{message.content}</Typography>
            </Box>
          </Box>
        ))}
      </Stack>
      <Stack
        direction='row'
        spacing={2}
      >
        <TextField
          label='Ask about allergy-free recipes'
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#4caf50',
              },
              '&:hover fieldset': {
                borderColor: '#45a049',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#45a049',
              },
            },
          }}
        />
        <Button 
          variant='contained' 
          onClick={sendMessage}
          sx={{
            bgcolor: '#4caf50',
            '&:hover': {
              bgcolor: '#45a049',
            }
          }}
        >
          Send
        </Button>
      </Stack>
    </Stack>
  </Box>
)}
