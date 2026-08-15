// src/components/InvoiceForm.jsx
// Create invoices based on readings and rates. Backend is responsible for calculating totals in production.
import React, { useState } from 'react'
import { TextField, Button, Box, Alert } from '@mui/material'
import api from '../services/api'

export default function InvoiceForm(){
  const [form,setForm] = useState({ custID:'', meterID:'', invDate:'', dueDate:'', previousReading:'', currentReading:'', ratePerUnit:'' })
  const [msg,setMsg] = useState(null)
  const handle = e => setForm({...form,[e.target.name]:e.target.value})
  const submit = async e =>{
    e.preventDefault(); setMsg(null)
    try{
      // Post invoice data; backend may compute amount_due using previous/current readings
      const res = await api.post('/invoices', form)
      setMsg({type:'success', text:'Invoice created'})
      setForm({ custID:'', meterID:'', invDate:'', dueDate:'', previousReading:'', currentReading:'', ratePerUnit:'' })
    }catch(err){ setMsg({type:'error', text:err?.response?.data?.message || 'Error'}) }
  }

  return (
    <Box component="form" onSubmit={submit} sx={{maxWidth:640}}>
      {msg && <Alert severity={msg.type} sx={{mb:2}}>{msg.text}</Alert>}
      <TextField name="custID" label="Customer ID" value={form.custID} onChange={handle} fullWidth sx={{mb:2}} />
      <TextField name="meterID" label="Meter ID" value={form.meterID} onChange={handle} fullWidth sx={{mb:2}} />
      <TextField name="invDate" label="Invoice Date" type="date" InputLabelProps={{ shrink:true }} value={form.invDate} name="invDate" onChange={handle} fullWidth sx={{mb:2}} />
      <TextField name="dueDate" label="Due Date" type="date" InputLabelProps={{ shrink:true }} value={form.dueDate} onChange={handle} fullWidth sx={{mb:2}} />
      <TextField name="previousReading" label="Previous Reading" value={form.previousReading} onChange={handle} fullWidth sx={{mb:2}} />
      <TextField name="currentReading" label="Current Reading" value={form.currentReading} onChange={handle} fullWidth sx={{mb:2}} />
      <TextField name="ratePerUnit" label="Rate per Unit" value={form.ratePerUnit} onChange={handle} fullWidth sx={{mb:2}} />
      <Button type="submit" variant="contained">Create Invoice</Button>
    </Box>
  )
}
