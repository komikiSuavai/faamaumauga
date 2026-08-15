// src/components/Login.jsx
// Simple login form that posts username/password to /api/auth/login
// On success it stores the returned JWT token in localStorage for later requests.
import React, { useState } from 'react'
import { TextField, Button, Box, Alert } from '@mui/material'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState(null)
  const navigate = useNavigate()

  const submit = async e =>{
    e.preventDefault()
    setError(null)
    try{
      // call backend /auth/login endpoint (see docs/API-ENDPOINTS.md)
      const res = await api.post('/auth/login',{ username, password })
      // server should return { token, user }
      const { token } = res.data
      // store token for subsequent requests
      localStorage.setItem('token', token)
      // navigate to home or other protected page
      navigate('/')
    }catch(err){
      setError(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <Box component="form" onSubmit={submit} sx={{maxWidth:480}}>
      {error && <Alert severity="error" sx={{mb:2}}>{error}</Alert>}
      <TextField fullWidth label="Username" value={username} onChange={e=>setUsername(e.target.value)} sx={{mb:2}} />
      <TextField fullWidth label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} sx={{mb:2}} />
      <Button variant="contained" type="submit">Login</Button>
    </Box>
  )
}
