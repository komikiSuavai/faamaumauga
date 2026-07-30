# Water Utility Database Design Document

## Overview

This document outlines the database structure for the Water Utility Management System.

## 1. Customers Table

### Purpose
Stores customer information for the water utility service.

### Key Fields
- **custID** (PK): Unique customer identifier (auto-increment)
- **firstName, lastName**: Customer's name
- **emailAddress**: Unique email for customer login
- **phoneNumber**: Contact phone number
- **addressLine1, addressLine2, city, state, postalCode, country**: Complete address
- **registrationDate**: When customer account was created
- **accountStatus**: Active, Inactive, or Suspended

### Access Control
- Customers can view only records with their own custID
- Staff can view based on permissions and office code

---

## 2. Water Meters Table

### Purpose
Tracks water meters installed at customer locations.

### Key Fields
- **meterID** (PK): Unique meter identifier (auto-increment)
- **custID** (FK): Associated customer
- **meterModel**: Model/type of the meter
- **serialNumber**: Unique serial number (must be unique)
- **installationDate**: When meter was installed
- **lastMaintenanceDate**: Last maintenance performed
- **meterStatus**: Active, Inactive, or Faulty
- **location**: Physical location description

### Relationships
- One customer can have multiple meters
- One meter can have multiple readings

---

## 3. Meter Readings Table

### Purpose
Historical record of water meter readings for billing calculations.

### Key Fields
- **readingID** (PK): Unique reading identifier
- **meterID** (FK): Associated meter
- **custID** (FK): Associated customer (for quick access)
- **readingDate**: Date when reading was taken
- **readingValue**: Actual meter reading
- **previousReadingValue**: Previous reading for reference
- **consumptionUnits**: Calculated consumption (current - previous)
- **readingType**: Manual or Automatic

### Unique Constraint
- One reading per meter per date (prevents duplicate readings on same day)

---

## 4. Invoices Table

### Purpose
Billing records for water consumption.

### Key Fields
- **invNo** (PK): Unique invoice number (auto-increment)
- **custID** (FK): Customer being billed
- **meterID** (FK): Meter being billed for
- **invDate**: Invoice issue date
- **dueDate**: Payment due date
- **billingPeriodStart, billingPeriodEnd**: Period covered by invoice
- **previousReading, currentReading**: Meter readings for period
- **consumptionUnits**: Calculated consumption
- **ratePerUnit**: Price per unit of water
- **baseAmount**: Cost of consumption (consumption × rate)
- **taxAmount**: Applicable taxes
- **otherCharges**: Additional charges (service fees, etc.)
- **totalAmount**: Final amount due
- **invoiceStatus**: Draft, Issued, Partially Paid, Paid, Overdue, Cancelled

### Business Logic
- totalAmount = baseAmount + taxAmount + otherCharges
- invoiceStatus updates based on receipt activity

---

## 5. Receipts Table

### Purpose
Payment records for invoices.

### Key Fields
- **receiptNo** (PK): Unique receipt number (auto-increment)
- **invNo** (FK): Associated invoice
- **custID** (FK): Customer making payment
- **paymentDate**: Date of payment
- **paymentTime**: Time of payment
- **payAmount**: Amount paid
- **paymentMethod**: Cash, Check, Bank Transfer, Card, Other
- **referenceNumber**: Bank/check reference (for reconciliation)
- **receiptStatus**: Verified, Pending, or Cancelled
- **processedBy**: User ID of staff who processed receipt

### Business Logic
- One invoice can have multiple receipts (partial payments)
- Receipt amount can be less than invoice total (partial payment)
- Full payment when sum of receipts >= invoice total

---

## 6. Users Table

### Purpose
Staff user accounts with role-based access control.

### Key Fields
- **userID** (PK): Unique user identifier
- **username**: Unique login name
- **passwordHash**: Hashed password (never store plain text)
- **firstName, lastName**: User's full name
- **emailAddress**: User's email (unique)
- **officeCode**: Numeric office location code
- **department**: Department name
- **userRole**: Admin, Manager, Operator, or Viewer
- **accountStatus**: Active, Inactive, or Suspended
- **lastLoginDate**: Track user activity
- **passwordChangedDate**: Track password changes

### Role Hierarchy
1. **Admin**: Full system access, can manage all users
2. **Manager**: Can manage own office data, generate reports
3. **Operator**: Can create/update records for own office
4. **Viewer**: Read-only access to assigned office data

---

## 7. Office Codes Table

### Purpose
Reference table for office locations and management.

### Key Fields
- **officeCodeID** (PK): Numeric office code
- **officeName**: Name of the office branch
- **officeLocation**: Physical address/location
- **officeManager**: Manager responsible for office
- **contactEmail, contactPhone**: Office contact information

### Usage
- Determines which records a user can access
- Users limited to own officeCode data unless Admin

---

## 8. Permissions Table

### Purpose
Define CRUD and reporting permissions by role and office.

### Key Fields
- **permissionID** (PK): Unique permission record ID
- **userRole**: The role being configured
- **officeCode**: Office code (NULL = all offices)
- **canViewAllRecords**: View permission
- **canCreateRecords**: Create permission
- **canUpdateRecords**: Update permission
- **canDeleteRecords**: Delete permission
- **canGenerateReports**: Report generation
- **canManageUsers**: User management

### Default Configuration
- **Admin**: All permissions = TRUE
- **Manager**: View, Create, Update, Generate Reports = TRUE
- **Operator**: View, Create, Update = TRUE
- **Viewer**: View, Generate Reports = TRUE

---

## 9. Audit Log Table

### Purpose
Track all data modifications for compliance and troubleshooting.

### Key Fields
- **auditID** (PK): Unique audit record ID
- **userID** (FK): User who made the change
- **actionType**: CREATE, UPDATE, DELETE, etc.
- **tableName**: Which table was affected
- **recordID**: Which record was affected
- **oldValue, newValue**: Before and after values
- **actionDate**: When change occurred
- **ipAddress**: IP address from which change was made

### Triggers
Automatic logging on INSERT, UPDATE, DELETE for all customer/financial tables

---

## Security Considerations

### Authentication
- Username/password-based login for staff
- Customer email-based login with password reset capability

### Authorization
- Row-level security: Users see only records for their office code
- Customers see only their own custID records
- Permissions table controls CRUD capabilities

### Data Protection
- All financial data encrypted at rest
- HTTPS required for all web traffic
- Audit logging on all sensitive data changes
- Regular backups with encryption

### Password Security
- Passwords hashed using bcrypt or similar (minimum 10+ rounds)
- Password change enforced every 90 days
- Minimum 12 characters, complexity requirements
- Prevent password reuse of last 5 passwords

---

## Indexes

### Performance Optimization
- **custID**: Used heavily in joins and filtering
- **meterID**: Used in meter-related queries
- **invDate, dueDate**: Used in date-range queries for reporting
- **officeCode**: Used for user access control filtering
- **accountStatus, invoiceStatus**: Used for filtering active records
- **readingDate, paymentDate**: Used for historical data retrieval

---

## Relationships Summary

Customers ├── 1 ---< WaterMeters │ └── 1 ---< MeterReadings ├── 1 ---< Invoices │ └── 1 ---< Receipts └── 1 ---< Receipts

Users ├── N -> OfficeCodes (via officeCode) └── N -> Receipts (via processedBy)

OfficeCodes └── 1 ---< Permissions

Code

---

## Reporting Queries Examples

### 1. Customer Invoice Status
Show all invoices for a customer with payment status

### 2. Monthly Consumption Report
Group readings by month to show consumption trends

### 3. Overdue Invoice Report
Find invoices past due date with outstanding balance

### 4. Payment Receipt Summary
Daily/weekly/monthly payment collection reports

### 5. Customer Account Statement
Month-end statement showing all transactions for a customer

### 6. Office Performance Report
Office-level metrics: customer count, total receivables, payment rates

---

## Future Enhancements

1. **Water Quality Monitoring**: Add water quality test results
2. **Meter Maintenance Tracking**: Preventive maintenance scheduling
3. **Customer Notifications**: Email/SMS alerts for due dates
4. **Payment Plans**: Allow customers to set up payment agreements
5. **Mobile App**: Mobile-friendly customer portal
6. **Analytics Dashboard**: Real-time business intelligence
7. **Integration APIs**: Connect with accounting and CRM systems
