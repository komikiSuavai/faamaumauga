// src/components/ProtectedRoute.jsx
// Simple client-side protection: if no token in localStorage, redirect to login.
// Note: real authorization should also be enforced on the server.
import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }){
  const token = localStorage.getItem('token')
  if(!token) return <Navigate to="/login" replace />
  return children
}
