-- Initial Data for Water Utility Management System

-- ============================================
-- INSERT OFFICE CODES
-- ============================================
INSERT INTO OfficeCodes (officeCodeID, officeName, officeLocation, officeManager, contactEmail, contactPhone) VALUES
(1, 'Main Office', 'Downtown', 'John Smith', 'main@waterutility.com', '555-0001'),
(2, 'North Branch', 'North District', 'Jane Doe', 'north@waterutility.com', '555-0002'),
(3, 'South Branch', 'South District', 'Bob Johnson', 'south@waterutility.com', '555-0003');

-- ============================================
-- INSERT USERS (Example Staff Members)
-- ============================================
INSERT INTO Users (username, passwordHash, firstName, lastName, emailAddress, officeCode, department, userRole, accountStatus) VALUES
('admin', 'HASH_PASSWORD_HERE', 'Administrator', 'System', 'admin@waterutility.com', 1, 'IT', 'Admin', 'Active'),
('manager1', 'HASH_PASSWORD_HERE', 'Maria', 'Garcia', 'maria@waterutility.com', 1, 'Billing', 'Manager', 'Active'),
('operator1', 'HASH_PASSWORD_HERE', 'Carlos', 'Rodriguez', 'carlos@waterutility.com', 1, 'Billing', 'Operator', 'Active'),
('operator2', 'HASH_PASSWORD_HERE', 'Sarah', 'Williams', 'sarah@waterutility.com', 2, 'Field', 'Operator', 'Active'),
('viewer1', 'HASH_PASSWORD_HERE', 'James', 'Brown', 'james@waterutility.com', 3, 'Accounting', 'Viewer', 'Active');

-- ============================================
-- INSERT PERMISSIONS
-- ============================================
INSERT INTO Permissions (userRole, officeCode, canViewAllRecords, canCreateRecords, canUpdateRecords, canDeleteRecords, canGenerateReports, canManageUsers) VALUES
('Admin', NULL, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE),
('Manager', 1, TRUE, TRUE, TRUE, FALSE, TRUE, FALSE),
('Operator', 1, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE),
('Viewer', 3, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE);

-- ============================================
-- INSERT SAMPLE CUSTOMERS
-- ============================================
INSERT INTO Customers (firstName, lastName, emailAddress, phoneNumber, addressLine1, city, state, postalCode, accountStatus) VALUES
('Robert', 'Taylor', 'robert.taylor@email.com', '555-1001', '123 Main Street', 'Springfield', 'State', '12345', 'Active'),
('Emily', 'Johnson', 'emily.johnson@email.com', '555-1002', '456 Oak Avenue', 'Springfield', 'State', '12346', 'Active'),
('Michael', 'Chen', 'michael.chen@email.com', '555-1003', '789 Pine Road', 'Springfield', 'State', '12347', 'Active'),
('Lisa', 'Martinez', 'lisa.martinez@email.com', '555-1004', '321 Elm Street', 'Springfield', 'State', '12348', 'Active');

-- ============================================
-- INSERT SAMPLE WATER METERS
-- ============================================
INSERT INTO WaterMeters (custID, meterModel, serialNumber, installationDate, meterStatus, location) VALUES
(1, 'Model A-100', 'SN-001-2023', '2023-01-15', 'Active', 'Front Yard'),
(2, 'Model A-100', 'SN-002-2023', '2023-02-20', 'Active', 'Front Yard'),
(3, 'Model B-200', 'SN-003-2023', '2023-03-10', 'Active', 'Side Yard'),
(4, 'Model A-100', 'SN-004-2023', '2023-04-05', 'Active', 'Front Yard');

-- ============================================
-- INSERT SAMPLE METER READINGS
-- ============================================
INSERT INTO MeterReadings (meterID, custID, readingDate, readingValue, previousReadingValue, consumptionUnits, readingType) VALUES
(1, 1, '2024-01-10', 150.00, 100.00, 50.00, 'Manual'),
(1, 1, '2024-02-10', 200.00, 150.00, 50.00, 'Manual'),
(2, 2, '2024-01-15', 300.00, 250.00, 50.00, 'Manual'),
(2, 2, '2024-02-15', 350.00, 300.00, 50.00, 'Manual');

-- ============================================
-- INSERT SAMPLE INVOICES
-- ============================================
INSERT INTO Invoices (custID, meterID, invDate, dueDate, billingPeriodStart, billingPeriodEnd, previousReading, currentReading, consumptionUnits, ratePerUnit, baseAmount, taxAmount, totalAmount, invoiceStatus) VALUES
(1, 1, '2024-01-20', '2024-02-20', '2024-01-01', '2024-01-31', 100.00, 150.00, 50.00, 2.50, 125.00, 12.50, 137.50, 'Issued'),
(1, 1, '2024-02-20', '2024-03-20', '2024-02-01', '2024-02-29', 150.00, 200.00, 50.00, 2.50, 125.00, 12.50, 137.50, 'Paid'),
(2, 2, '2024-01-25', '2024-02-25', '2024-01-01', '2024-01-31', 250.00, 300.00, 50.00, 2.50, 125.00, 12.50, 137.50, 'Issued');

-- ============================================
-- INSERT SAMPLE RECEIPTS
-- ============================================
INSERT INTO Receipts (invNo, custID, paymentDate, payAmount, paymentMethod, referenceNumber, receiptStatus, processedBy) VALUES
(2, 1, '2024-02-18', 137.50, 'Bank Transfer', 'BT-2024-001', 'Verified', 3),
(3, 2, '2024-02-20', 137.50, 'Cash', 'CASH-2024-001', 'Verified', 3);
