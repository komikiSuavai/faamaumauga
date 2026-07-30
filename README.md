# Water Utility Management System

An online database system for managing water customer registrations, meter readings, invoicing, and payment receipts.

## Features

- **Customer Management**: Register and manage customer information with unique custID
- **Water Meter Tracking**: Track water meters with readings and associations
- **Invoice Management**: Generate invoices based on meter readings and customer consumption
- **Receipt Management**: Record payment receipts and payment tracking
- **User Management**: Multi-user system with role-based access control (OfficeCode)
- **Customer Portal**: Customers can view only their own information and reports
- **Admin Portal**: Users can perform CRUD operations based on their office code permissions

## Technology Stack

- **Backend**: Node.js/Express (or your choice)
- **Database**: SQL (MySQL, PostgreSQL, or SQL Server)
- **Frontend**: React/Vue.js or similar framework
- **Authentication**: JWT-based user authentication

## Project Structure

water-utility-db/ ├── database/ │ ├── schema.sql │ └── initial-data.sql ├── backend/ │ ├── models/ │ ├── routes/ │ ├── controllers/ │ ├── middleware/ │ └── config/ ├── frontend/ │ ├── public/ │ ├── src/ │ └── package.json ├── docs/ │ └── database-design.md └── README.md

Code

## Getting Started

See documentation in the `docs/` directory for detailed setup and deployment instructions.