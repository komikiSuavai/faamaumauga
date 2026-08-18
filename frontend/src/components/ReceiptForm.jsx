// src/components/ReceiptForm.jsx
// Record payments against invoices. Backend must validate invoice exists and update payment status.
import React, { useState } from 'react'
import { TextField, Button, Box, Alert } from '@mui/material'
import api from '../services/api'

export default function ReceiptForm(){
  const [form,setForm] = useState({ invNo:'', custID:'', paymentDate:'', payAmount:'', paymentMethod:'Bank Transfer', referenceNumber:'' })
  const [msg,setMsg] = useState(null)
  const handle = e => setForm({...form,[e.target.name]:e.target.value})
  const submit = async e =>{
    e.preventDefault(); setMsg(null)
    try{
      // POST payment/receipt to backend
      const res = await api.post('/receipts', form)
      setMsg({type:'success', text:'Receipt recorded'})
      setForm({ invNo:'', custID:'', paymentDate:'', payAmount:'', paymentMethod:'Bank Transfer', referenceNumber:'' })
    }catch(err){ setMsg({type:'error', text:err?.response?.data?.message || 'Error'}) }
  }

  return (
    <Box component="form" onSubmit={submit} sx={{maxWidth:640}}>
      {msg && <Alert severity={msg.type} sx={{mb:2}}>{msg.text}</Alert>}
      <TextField name="invNo" label="Invoice No" value={form.invNo} onChange={handle} fullWidth sx={{mb:2}} />
      <TextField name="custID" label="Customer ID" value={form.custID} onChange={handle} fullWidth sx={{mb:2}} />
      <TextField name="paymentDate" label="Payment Date" type="date" InputLabelProps={{ shrink:true }} value={form.paymentDate} onChange={handle} fullWidth sx={{mb:2}} />
      <TextField name="payAmount" label="Amount" value={form.payAmount} onChange={handle} fullWidth sx={{mb:2}} />
      <TextField name="paymentMethod" label="Method" value={form.paymentMethod} onChange={handle} fullWidth sx={{mb:2}} />
      <TextField name="referenceNumber" label="Reference No" value={form.referenceNumber} onChange={handle} fullWidth sx={{mb:2}} />
      <Button type="submit" variant="contained">Record Payment</Button>
    </Box>
  )
}
