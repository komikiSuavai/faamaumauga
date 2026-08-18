// src/components/ReadingForm.jsx
// Form to record meter readings. Usually used by field operators.
import React, { useState } from 'react'
import { TextField, Button, Box, Alert } from '@mui/material'
import api from '../services/api'

export default function ReadingForm(){
  const [form,setForm] = useState({ meterID:'', custID:'', readingDate:'', readingValue:'', readingType:'Manual' })
  const [msg,setMsg] = useState(null)
  const handle = e => setForm({...form,[e.target.name]:e.target.value})
  const submit = async e =>{
    e.preventDefault(); setMsg(null)
    try{
      // POST to readings endpoint; backend will validate and store
      const res = await api.post('/readings', form)
      setMsg({type:'success', text:'Reading recorded'})
      setForm({ meterID:'', custID:'', readingDate:'', readingValue:'', readingType:'Manual' })
    }catch(err){ setMsg({type:'error', text:err?.response?.data?.message || 'Error'}) }
  }

  return (
    <Box component="form" onSubmit={submit} sx={{maxWidth:640}}>
      {msg && <Alert severity={msg.type} sx={{mb:2}}>{msg.text}</Alert>}
      <TextField name="meterID" label="Meter ID" value={form.meterID} onChange={handle} fullWidth sx={{mb:2}} />
      <TextField name="custID" label="Customer ID" value={form.custID} onChange={handle} fullWidth sx={{mb:2}} />
      <TextField name="readingDate" label="Reading Date" type="date" InputLabelProps={{ shrink:true }} name="readingDate" value={form.readingDate} onChange={handle} fullWidth sx={{mb:2}} />
      <TextField name="readingValue" label="Reading Value" value={form.readingValue} onChange={handle} fullWidth sx={{mb:2}} />
      <TextField name="readingType" label="Reading Type" value={form.readingType} onChange={handle} fullWidth sx={{mb:2}} />
      <Button type="submit" variant="contained">Record Reading</Button>
    </Box>
  )
}
