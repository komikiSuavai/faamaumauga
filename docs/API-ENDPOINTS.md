# Water Utility API Endpoints

## Authentication

### POST /api/auth/login
User login endpoint
```json
{
  "username": "operator1",
  "password": "password123"
}
Response: JWT token, user info, permissions

POST /api/auth/customer-login
Customer login endpoint

JSON
{
  "email": "customer@email.com",
  "password": "password123"
}
Customers
GET /api/customers/:custID
Get customer details (customers see own, staff see based on permissions)

POST /api/customers
Create new customer (Admin/Manager only)

JSON
{
  "firstName": "John",
  "lastName": "Doe",
  "emailAddress": "john@email.com",
  "phoneNumber": "555-1234",
  "addressLine1": "123 Main St",
  "city": "Springfield",
  "accountStatus": "Active"
}
PUT /api/customers/:custID
Update customer information

GET /api/customers/:custID/invoices
Get all invoices for customer

GET /api/customers/:custID/consumption
Get consumption history/report

Water Meters
GET /api/meters/:meterID
Get meter details and status

POST /api/meters
Register new meter (Operator/Manager)

JSON
{
  "custID": 1,
  "meterModel": "Model A-100",
  "serialNumber": "SN-005-2024",
  "installationDate": "2024-01-15",
  "location": "Front Yard"
}
PUT /api/meters/:meterID
Update meter information

GET /api/meters/:meterID/readings
Get all readings for meter

Meter Readings
POST /api/readings
Record new meter reading

JSON
{
  "meterID": 1,
  "custID": 1,
  "readingDate": "2024-03-10",
  "readingValue": 250.00,
  "readingType": "Manual"
}
GET /api/readings/:readingID
Get reading details

GET /api/readings/meter/:meterID
Get all readings for a meter

Invoices
POST /api/invoices
Create new invoice (Manager/Operator)

JSON
{
  "custID": 1,
  "meterID": 1,
  "invDate": "2024-03-01",
  "dueDate": "2024-04-01",
  "previousReading": 200.00,
  "currentReading": 250.00,
  "ratePerUnit": 2.50
}
GET /api/invoices/:invNo
Get invoice details

GET /api/invoices/customer/:custID
Get all invoices for customer

GET /api/invoices/overdue
Get all overdue invoices (Manager+)

PUT /api/invoices/:invNo
Update invoice (before issued)

Receipts
POST /api/receipts
Record payment receipt

JSON
{
  "invNo": 1,
  "custID": 1,
  "paymentDate": "2024-03-15",
  "payAmount": 137.50,
  "paymentMethod": "Bank Transfer",
  "referenceNumber": "BT-2024-001"
}
GET /api/receipts/:receiptNo
Get receipt details

GET /api/receipts/invoice/:invNo
Get all receipts for invoice

GET /api/receipts/customer/:custID
Get all receipts for customer

Reports
GET /api/reports/consumption/:custID
Customer consumption history

GET /api/reports/account-statement/:custID?month=MM&year=YYYY
Monthly account statement

GET /api/reports/overdue-invoices
List all overdue invoices (Manager+)

GET /api/reports/office-performance/:officeCode
Office-level performance metrics (Manager+)

GET /api/reports/daily-receipts?date=YYYY-MM-DD
Daily receipt summary

Users (Admin Only)
GET /api/users
List all users

POST /api/users
Create new user

PUT /api/users/:userID
Update user details

PUT /api/users/:userID/password
Change user password

DELETE /api/users/:userID
Deactivate user account

Error Responses
All endpoints follow consistent error response format:

JSON
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}
Common Status Codes
200: Success
201: Created
400: Bad Request (validation error)
401: Unauthorized (not authenticated)
403: Forbidden (insufficient permissions)
404: Not Found
500: Server Error
Code
docs/DEPLOYMENT.md

md
# Deployment Guide

## Prerequisites

- Node.js 16+ and npm
- MySQL 5.7+ or MariaDB
- Nginx or Apache (for reverse proxy)
- SSL certificate

## Local Development Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd water-utility-db
2. Install Dependencies
bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
3. Configure Database
bash
# Create database
mysql -u root -p < database/schema.sql
mysql -u root -p water_utility_db < database/initial-data.sql
4. Environment Configuration
bash
cd backend
cp .env.example .env
# Edit .env with your configuration
5. Run Development Servers
bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start
Production Deployment
1. Server Setup (Ubuntu/Debian)
bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server

# Install PM2 (process manager)
sudo npm install -g pm2
2. Database Setup
bash
# Create database user
mysql -u root -p

CREATE DATABASE water_utility_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'water_utility'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON water_utility_db.* TO 'water_utility'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Load schema
mysql -u water_utility -p water_utility_db < database/schema.sql
mysql -u water_utility -p water_utility_db < database/initial-data.sql
3. Application Deployment
bash
# Clone repository
cd /opt
sudo git clone <repository-url>
cd water-utility-db

# Install dependencies
cd backend
npm install --production

# Configure environment
cp .env.example .env
# Edit .env with production settings

# Start with PM2
pm2 start server.js --name "water-utility-api"
pm2 save
pm2 startup
4. Nginx Configuration
Nginx
server {
    listen 80;
    server_name water-utility.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name water-utility.example.com;

    ssl_certificate /etc/letsencrypt/live/water-utility.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/water-utility.example.com/privkey.pem;

    client_max_body_size 10M;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        root /opt/water-utility-db/frontend/build;
        try_files $uri /index.html;
    }
}
5. SSL Certificate (Let's Encrypt)
bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d water-utility.example.com
Database Backup & Recovery
Daily Backup
bash
#!/bin/bash
# /opt/backup-db.sh
BACKUP_DIR="/backups/water_utility"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
mysqldump -u water_utility -p water_utility_db > $BACKUP_DIR/backup_$DATE.sql
gzip $BACKUP_DIR/backup_$DATE.sql

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
Restore Database
bash
gzip -d backup_YYYYMMDD_HHMMSS.sql.gz
mysql -u water_utility -p water_utility_db < backup_YYYYMMDD_HHMMSS.sql
Monitoring & Logs
PM2 Monitoring
bash
pm2 monit              # Real-time monitoring
pm2 logs               # View logs
pm2 logs --lines 100   # Last 100 lines
pm2 restart all        # Restart all processes
Log Rotation (Logrotate)
Code
# /etc/logrotate.d/water-utility
/var/log/water-utility/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
Security Checklist
 Change all default passwords
 Enable SSL/HTTPS
 Configure firewall (UFW/iptables)
 Set up fail2ban for brute-force protection
 Enable database encryption
 Configure regular backups
 Set up monitoring and alerts
 Enable audit logging
 Configure rate limiting
 Use strong JWT secrets
 Enable CORS restrictions
 Implement input validation
 Use environment variables for secrets
 Regular security updates
Performance Optimization
Database Indexes: Already configured in schema
Connection Pooling: Use mysql2/promise pool
Caching: Implement Redis for frequently accessed data
API Rate Limiting: Use express-rate-limit
Compression: Enable gzip compression
CDN: Serve static assets through CDN
Troubleshooting
Port Already in Use
bash
lsof -i :3000
kill -9 <PID>
Database Connection Issues
bash
# Check MySQL service
sudo systemctl status mysql
sudo systemctl restart mysql

# Test connection
mysql -u water_utility -p -h localhost water_utility_db
PM2 Issues
bash
pm2 kill
pm2 start server.js
pm2 save
Code
.gitignore

gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Build
build/
dist/
.next/
out/

# Logs
logs/
*.log

# Database
*.sql
!database/schema.sql
!database/initial-data.sql

# OS
.DS_Store
Thumbs.db

# Cache
.cache/
.parcel-cache/

# Testing
coverage/
.nyc_output/