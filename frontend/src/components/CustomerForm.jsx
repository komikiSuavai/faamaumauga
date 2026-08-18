// src/components/CustomerForm.jsx
// Data-entry form for creating customers. Posts form data to POST /api/customers.
// Includes basic success/error messaging and resets the form after a successful submission.
import React, { useState } from 'react'
import { TextField, Button, Box, Alert } from '@mui/material'
import api from '../services/api'

export default function CustomerForm(){
  // form state maps to API fields expected by the backend
  const [form,setForm] = useState({ firstName:'', lastName:'', emailAddress:'', phoneNumber:'', addressLine1:'', city:'', accountStatus:'Active' })
  const [msg,setMsg] = useState(null)

  // generic input handler
  const handle = e => setForm({...form,[e.target.name]:e.target.value})

  const submit = async e =>{
    e.preventDefault()
    setMsg(null)
    try{
      // send POST request; backend should validate and return created resource
      const res = await api.post('/customers', form)
      setMsg({type:'success', text:'Customer created (ID: '+res.data.id+')'})
      // reset form for next entry
      setForm({ firstName:'', lastName:'', emailAddress:'', phoneNumber:'', addressLine1:'', city:'', accountStatus:'Active' })
    }catch(err){
      setMsg({type:'error', text:err?.response?.data?.message || 'Error'})
    }
  }

  return (
    <Box component="form" onSubmit={submit} sx={{maxWidth:640}}>
      {msg && <Alert severity={msg.type} sx={{mb:2}}>{msg.text}</Alert>}
      <TextField name="firstName" label="First name" value={form.firstName} onChange={handle} fullWidth sx={{mb:2}} />
      <TextField name="lastName" label="Last name" value={form.lastName} onChange={handle} fullWidth sx={{mb:2}} />
      <TextField name="emailAddress" label="Email" value={form.emailAddress} onChange={handle} fullWidth sx={{mb:2}} />
      <TextField name="phoneNumber" label="Phone" value={form.phoneNumber} onChange={handle} fullWidth sx={{mb:2}} />
      <TextField name="addressLine1" label="Address" value={form.addressLine1} onChange={handle} fullWidth sx={{mb:2}} />
      <TextField name="city" label="City" value={form.city} onChange={handle} fullWidth sx={{mb:2}} />
      <Button type="submit" variant="contained">Create Customer</Button>
    </Box>
  )
}
