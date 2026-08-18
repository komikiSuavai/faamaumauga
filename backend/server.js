// backend/server.js
// Minimal backend mock for local smoke testing of the frontend.
// - Loads environment from .env if present
// - Tries to connect to MySQL using mysql2 if DB env vars are set
// - If DB is available, uses it for inserts/queries; otherwise falls back to an in-memory store
// - Implements the endpoints the frontend expects: /api/auth/login, /api/customers, /api/meters, /api/readings, /api/invoices, /api/receipts

const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// Try to load .env from backend directory if present
dotenv.config({ path: __dirname + '/.env' })

const mysql = require('mysql2/promise')

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret'

let dbPool = null
let useDb = false

// Simple in-memory stores when DB is not available
const stores = {
  customers: [],
  meters: [],
  readings: [],
  invoices: [],
  receipts: [],
  users: [
    // default demo user
    { id: 1, username: 'operator1', password: bcrypt.hashSync('password123', 8), role: 'Operator', custID: null }
  ]
}

async function tryConnectDb(){
  const host = process.env.DB_HOST
  const user = process.env.DB_USER
  const password = process.env.DB_PASSWORD
  const database = process.env.DB_NAME
  if(!host || !user || !database) return
  try{
    dbPool = mysql.createPool({ host, user, password, database, waitForConnections: true, connectionLimit: 10, queueLimit: 0 })
    // quick test
    const [rows] = await dbPool.query('SELECT 1')
    useDb = true
    console.log('Connected to MySQL database')
  }catch(err){
    console.warn('Could not connect to DB, falling back to in-memory store:', err.message)
    useDb = false
  }
}

// Utility: sign a JWT with user info
function signToken(user){
  // include minimal claims (id, username, role, custID if any)
  const payload = { userID: user.id || user.userID, username: user.username, userRole: user.role || user.userRole, custID: user.custID || null }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION || '8h' })
}

// Auth endpoint - simplistic: checks DB users table if available, otherwise checks in-memory users
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body
  if(!username || !password) return res.status(400).json({ success:false, message: 'username and password required' })

  try{
    if(useDb){
      const [rows] = await dbPool.execute('SELECT id, username, password, role, cust_id as custID FROM users WHERE username = ?', [username])
      const user = rows[0]
      if(!user) return res.status(401).json({ success:false, message: 'Invalid credentials' })
      const ok = await bcrypt.compare(password, user.password)
      if(!ok) return res.status(401).json({ success:false, message: 'Invalid credentials' })
      const token = signToken({ id: user.id, username: user.username, role: user.role, custID: user.custID })
      return res.json({ success:true, token, user: { id: user.id, username: user.username, role: user.role } })
    }else{
      const user = stores.users.find(u => u.username === username)
      if(!user) return res.status(401).json({ success:false, message: 'Invalid credentials' })
      const ok = await bcrypt.compare(password, user.password)
      if(!ok) return res.status(401).json({ success:false, message: 'Invalid credentials' })
      const token = signToken(user)
      return res.json({ success:true, token, user: { id: user.id, username: user.username, role: user.role } })
    }
  }catch(err){
    console.error('Login error', err)
    return res.status(500).json({ success:false, message: 'Server error' })
  }
})

// Helper to insert into DB or in-memory
async function insertResource(table, payload){
  if(useDb){
    // very simple mapping: assumes table columns match payload keys
    const keys = Object.keys(payload)
    const cols = keys.map(k => `\`${k}\``).join(', ')
    const placeholders = keys.map(()=>'?').join(', ')
    const sql = `INSERT INTO \`${table}\` (${cols}) VALUES (${placeholders})`
    const vals = keys.map(k => payload[k])
    const [result] = await dbPool.execute(sql, vals)
    return result.insertId || null
  }else{
    const id = (stores[table] ? stores[table].length : 0) + 1
    const record = { id, ...payload }
    if(!stores[table]) stores[table] = []
    stores[table].push(record)
    return id
  }
}

// POST endpoints
app.post('/api/customers', async (req, res) => {
  try{
    const body = req.body
    // map frontend names to DB-friendly names if needed
    const payload = {
      first_name: body.firstName || body.first_name || null,
      last_name: body.lastName || body.last_name || null,
      email: body.emailAddress || body.email || null,
      phone: body.phoneNumber || body.phone || null,
      address_line1: body.addressLine1 || body.address_line1 || null,
      city: body.city || null,
      account_status: body.accountStatus || body.account_status || 'Active'
    }
    const id = await insertResource('customers', payload)
    return res.status(201).json({ success:true, id })
  }catch(err){
    console.error(err)
    return res.status(500).json({ success:false, message: 'Server error' })
  }
})

app.post('/api/meters', async (req, res) => {
  try{
    const body = req.body
    const payload = {
      cust_id: body.custID || body.cust_id || null,
      model: body.meterModel || body.model || null,
      serial_number: body.serialNumber || body.serial_number || null,
      installation_date: body.installationDate || body.installation_date || null,
      location: body.location || null,
      status: body.status || 'Active'
    }
    const id = await insertResource('meters', payload)
    return res.status(201).json({ success:true, id })
  }catch(err){
    console.error(err)
    return res.status(500).json({ success:false, message: 'Server error' })
  }
})

app.post('/api/readings', async (req, res) => {
  try{
    const body = req.body
    const payload = {
      meter_id: body.meterID || body.meter_id || null,
      cust_id: body.custID || body.cust_id || null,
      reading_date: body.readingDate || body.reading_date || null,
      reading_value: body.readingValue || body.reading_value || null,
      reading_type: body.readingType || body.reading_type || 'Manual'
    }
    const id = await insertResource('meter_readings', payload)
    return res.status(201).json({ success:true, id })
  }catch(err){
    console.error(err)
    return res.status(500).json({ success:false, message: 'Server error' })
  }
})

app.post('/api/invoices', async (req, res) => {
  try{
    const body = req.body
    const amount_due = (parseFloat(body.currentReading || 0) - parseFloat(body.previousReading || 0)) * parseFloat(body.ratePerUnit || 0)
    const payload = {
      cust_id: body.custID || body.cust_id || null,
      meter_id: body.meterID || body.meter_id || null,
      inv_date: body.invDate || body.inv_date || null,
      due_date: body.dueDate || body.due_date || null,
      previous_reading: body.previousReading || body.previous_reading || null,
      current_reading: body.currentReading || body.current_reading || null,
      rate_per_unit: body.ratePerUnit || body.rate_per_unit || null,
      amount_due: amount_due || 0
    }
    const id = await insertResource('invoices', payload)
    return res.status(201).json({ success:true, id })
  }catch(err){
    console.error(err)
    return res.status(500).json({ success:false, message: 'Server error' })
  }
})

app.post('/api/receipts', async (req, res) => {
  try{
    const body = req.body
    const payload = {
      inv_no: body.invNo || body.inv_no || null,
      cust_id: body.custID || body.cust_id || null,
      payment_date: body.paymentDate || body.payment_date || null,
      pay_amount: body.payAmount || body.pay_amount || null,
      payment_method: body.paymentMethod || body.payment_method || null,
      reference_number: body.referenceNumber || body.reference_number || null
    }
    const id = await insertResource('receipts', payload)
    return res.status(201).json({ success:true, id })
  }catch(err){
    console.error(err)
    return res.status(500).json({ success:false, message: 'Server error' })
  }
})

// Simple GET health
app.get('/api/health', (req, res) => {
  res.json({ success:true, db: useDb })
})

// Start server after attempting DB connection
tryConnectDb().then(()=>{
  app.listen(PORT, ()=> console.log(`Mock backend listening on port ${PORT} (DB=${useDb})`))
})