-- Water Utility Management System Database Schema
-- Version 1.0

-- ============================================
-- CUSTOMERS TABLE
-- ============================================
CREATE TABLE Customers (
    custID INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    emailAddress VARCHAR(150) UNIQUE,
    phoneNumber VARCHAR(20),
    addressLine1 VARCHAR(255) NOT NULL,
    addressLine2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postalCode VARCHAR(20),
    country VARCHAR(100),
    registrationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    accountStatus ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (accountStatus),
    INDEX idx_registration (registrationDate)
);

-- ============================================
-- WATER METER TABLE
-- ============================================
CREATE TABLE WaterMeters (
    meterID INT PRIMARY KEY AUTO_INCREMENT,
    custID INT NOT NULL,
    meterModel VARCHAR(100) NOT NULL,
    serialNumber VARCHAR(100) UNIQUE NOT NULL,
    installationDate DATE NOT NULL,
    lastMaintenanceDate DATE,
    meterStatus ENUM('Active', 'Inactive', 'Faulty') DEFAULT 'Active',
    location VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (custID) REFERENCES Customers(custID) ON DELETE CASCADE,
    INDEX idx_custID (custID),
    INDEX idx_status (meterStatus)
);

-- ============================================
-- METER READINGS TABLE (for historical tracking)
-- ============================================
CREATE TABLE MeterReadings (
    readingID INT PRIMARY KEY AUTO_INCREMENT,
    meterID INT NOT NULL,
    custID INT NOT NULL,
    readingDate DATE NOT NULL,
    readingValue DECIMAL(10, 2) NOT NULL,
    previousReadingValue DECIMAL(10, 2),
    consumptionUnits DECIMAL(10, 2),
    readingType ENUM('Manual', 'Automatic') DEFAULT 'Manual',
    notes VARCHAR(500),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (meterID) REFERENCES WaterMeters(meterID) ON DELETE CASCADE,
    FOREIGN KEY (custID) REFERENCES Customers(custID) ON DELETE CASCADE,
    INDEX idx_meterID (meterID),
    INDEX idx_custID (custID),
    INDEX idx_readingDate (readingDate),
    UNIQUE KEY unique_reading (meterID, readingDate)
);

-- ============================================
-- INVOICES TABLE
-- ============================================
CREATE TABLE Invoices (
    invNo INT PRIMARY KEY AUTO_INCREMENT,
    custID INT NOT NULL,
    meterID INT NOT NULL,
    invDate DATE NOT NULL,
    dueDate DATE NOT NULL,
    billingPeriodStart DATE NOT NULL,
    billingPeriodEnd DATE NOT NULL,
    previousReading DECIMAL(10, 2) NOT NULL,
    currentReading DECIMAL(10, 2) NOT NULL,
    consumptionUnits DECIMAL(10, 2) NOT NULL,
    ratePerUnit DECIMAL(10, 4) NOT NULL,
    baseAmount DECIMAL(12, 2) NOT NULL,
    taxAmount DECIMAL(12, 2) DEFAULT 0,
    otherCharges DECIMAL(12, 2) DEFAULT 0,
    totalAmount DECIMAL(12, 2) NOT NULL,
    invoiceStatus ENUM('Draft', 'Issued', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled') DEFAULT 'Draft',
    notes VARCHAR(500),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (custID) REFERENCES Customers(custID) ON DELETE CASCADE,
    FOREIGN KEY (meterID) REFERENCES WaterMeters(meterID),
    INDEX idx_custID (custID),
    INDEX idx_meterID (meterID),
    INDEX idx_invDate (invDate),
    INDEX idx_status (invoiceStatus),
    INDEX idx_dueDate (dueDate)
);

-- ============================================
-- RECEIPTS TABLE
-- ============================================
CREATE TABLE Receipts (
    receiptNo INT PRIMARY KEY AUTO_INCREMENT,
    invNo INT NOT NULL,
    custID INT NOT NULL,
    paymentDate DATE NOT NULL,
    paymentTime TIME,
    payAmount DECIMAL(12, 2) NOT NULL,
    paymentMethod ENUM('Cash', 'Check', 'Bank Transfer', 'Card', 'Other') NOT NULL,
    referenceNumber VARCHAR(100),
    receiptStatus ENUM('Verified', 'Pending', 'Cancelled') DEFAULT 'Verified',
    notes VARCHAR(500),
    processedBy INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (invNo) REFERENCES Invoices(invNo) ON DELETE CASCADE,
    FOREIGN KEY (custID) REFERENCES Customers(custID) ON DELETE CASCADE,
    FOREIGN KEY (processedBy) REFERENCES Users(userID),
    INDEX idx_invNo (invNo),
    INDEX idx_custID (custID),
    INDEX idx_paymentDate (paymentDate),
    INDEX idx_status (receiptStatus)
);

-- ============================================
-- USERS TABLE (Staff/Administrative)
-- ============================================
CREATE TABLE Users (
    userID INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    emailAddress VARCHAR(150) UNIQUE NOT NULL,
    officeCode INT NOT NULL,
    department VARCHAR(100),
    userRole ENUM('Admin', 'Manager', 'Operator', 'Viewer') DEFAULT 'Operator',
    accountStatus ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
    lastLoginDate DATETIME,
    passwordChangedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_officeCode (officeCode),
    INDEX idx_status (accountStatus),
    INDEX idx_role (userRole),
    UNIQUE KEY unique_username (username)
);

-- ============================================
-- AUDIT LOG TABLE (for tracking changes)
-- ============================================
CREATE TABLE AuditLog (
    auditID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT,
    actionType VARCHAR(50) NOT NULL,
    tableName VARCHAR(100) NOT NULL,
    recordID INT,
    oldValue LONGTEXT,
    newValue LONGTEXT,
    actionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    ipAddress VARCHAR(50),
    FOREIGN KEY (userID) REFERENCES Users(userID),
    INDEX idx_actionDate (actionDate),
    INDEX idx_userID (userID),
    INDEX idx_tableName (tableName)
);

-- ============================================
-- OFFICE CODE REFERENCE TABLE
-- ============================================
CREATE TABLE OfficeCodes (
    officeCodeID INT PRIMARY KEY,
    officeName VARCHAR(150) NOT NULL,
    officeLocation VARCHAR(255),
    officeManager VARCHAR(100),
    contactEmail VARCHAR(150),
    contactPhone VARCHAR(20),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_officeName (officeName)
);

-- ============================================
-- PERMISSIONS TABLE (Role-based access control)
-- ============================================
CREATE TABLE Permissions (
    permissionID INT PRIMARY KEY AUTO_INCREMENT,
    userRole ENUM('Admin', 'Manager', 'Operator', 'Viewer') NOT NULL,
    officeCode INT,
    canViewAllRecords BOOLEAN DEFAULT FALSE,
    canCreateRecords BOOLEAN DEFAULT FALSE,
    canUpdateRecords BOOLEAN DEFAULT FALSE,
    canDeleteRecords BOOLEAN DEFAULT FALSE,
    canGenerateReports BOOLEAN DEFAULT FALSE,
    canManageUsers BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_role_office (userRole, officeCode)
);