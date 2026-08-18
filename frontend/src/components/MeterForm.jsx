// src/components/MeterForm.jsx
// Form for registering meters and linking them to customers (custID).
import React, { useState } from 'react'
import { TextField, Button, Box, Alert } from '@mui/material'
import api from '../services/api'

export default function MeterForm(){
  const [form,setForm] = useState({ custID:'', meterModel:'', serialNumber:'', installationDate:'', location:'' })
  const [msg,setMsg] = useState(null)
  const handle = e => setForm({...form,[e.target.name]:e.target.value})
  const submit = async e =>{
    e.preventDefault(); setMsg(null)
    try{
      // Send meter registration to backend
      const res = await api.post('/meters', form)
      setMsg({type:'success', text:'Meter created'})
      setForm({ custID:'', meterModel:'', serialNumber:'', installationDate:'', location:'' })
    }catch(err){ setMsg({type:'error', text:err?.response?.data?.message || 'Error'}) }
  }

  return (
    <Box component="form" onSubmit={submit} sx={{maxWidth:640}}>
      {msg && <Alert severity={msg.type} sx={{mb:2}}>{msg.text}</Alert>}
      <TextField name="custID" label="Customer ID" value={form.custID} onChange={handle} fullWidth sx={{mb:2}} />
      <TextField name="meterModel" label="Meter Model" value={form.meterModel} onChange={handle} fullWidth sx={{mb:2}} />
      <TextField name="serialNumber" label="Serial Number" value={form.serialNumber} onChange={handle} fullWidth sx={{mb:2}} />
      <TextField name="installationDate" label="Installation Date" type="date" InputLabelProps={{ shrink:true }} name="installationDate" value={form.installationDate} onChange={handle} fullWidth sx={{mb:2}} />
      <TextField name="location" label="Location" value={form.location} onChange={handle} fullWidth sx={{mb:2}} />
      <Button type="submit" variant="contained">Register Meter</Button>
    </Box>
  )
}
