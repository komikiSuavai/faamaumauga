// src/App.jsx
// Top-level application: defines navigation and routes for the data-entry forms.
import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Container, AppBar, Toolbar, Button, Typography } from '@mui/material'
import Login from './components/Login'
import CustomerForm from './components/CustomerForm'
import MeterForm from './components/MeterForm'
import ReadingForm from './components/ReadingForm'
import InvoiceForm from './components/InvoiceForm'
import ReceiptForm from './components/ReceiptForm'
import ProtectedRoute from './components/ProtectedRoute'

export default function App(){
  return (
    <div>
      {/* AppBar with navigation links */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{flexGrow:1}}>Faamaumauga</Typography>
          <Button color="inherit" component={Link} to="/login">Login</Button>
          <Button color="inherit" component={Link} to="/customers/new">Customer</Button>
          <Button color="inherit" component={Link} to="/meters/new">Meter</Button>
          <Button color="inherit" component={Link} to="/readings/new">Reading</Button>
          <Button color="inherit" component={Link} to="/invoices/new">Invoice</Button>
          <Button color="inherit" component={Link} to="/receipts/new">Receipt</Button>
        </Toolbar>
      </AppBar>

      {/* Container holds the routed pages/forms */}
      <Container sx={{mt:4}}>
        <Routes>
          <Route path="/login" element={<Login/>} />

          {/* Protected routes require a valid JWT in localStorage */}
          <Route path="/customers/new" element={<ProtectedRoute><CustomerForm/></ProtectedRoute>} />
          <Route path="/meters/new" element={<ProtectedRoute><MeterForm/></ProtectedRoute>} />
          <Route path="/readings/new" element={<ProtectedRoute><ReadingForm/></ProtectedRoute>} />
          <Route path="/invoices/new" element={<ProtectedRoute><InvoiceForm/></ProtectedRoute>} />
          <Route path="/receipts/new" element={<ProtectedRoute><ReceiptForm/></ProtectedRoute>} />

          <Route path="/" element={<Typography>Welcome to Faamaumauga frontend. Use the top menu to navigate.</Typography>} />
        </Routes>
      </Container>
    </div>
  )
}
