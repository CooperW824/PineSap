# PineSap: A Request, Inventory, and Budget Management System for University Clubs

PineSap is a web application designed to help university clubs manage their requests, inventory, and budgets efficiently. It provides a user-friendly interface for club members to submit requests, track inventory, and manage budgets while ensuring proper authorization and access control.

## Features

- **Request Management**: Club members can submit requests for items or services, which can be reviewed and approved by authorized personnel.
- **Inventory Management**: Keep track of club inventory, including items available, quantities, and locations.
- **Budget Management**: Manage club budgets, track expenses, and ensure financial accountability.
- **User Roles and Permissions**: Different user roles (e.g., club members, administrators) with specific permissions to ensure secure access to features.
- **Pagination and Filtering**: Efficiently handle large datasets with pagination and filtering options for requests, inventory, and budgets.
- **Responsive Design**: Accessible on various devices, including desktops, tablets, and smartphones.

## Technologies Used

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth
- **Authorization**: Custom role-based access control

## Project Structure

- `app/`: Contains the frontend components and pages.
  - `app/api/`: Contains API route handlers for requests, inventory, and budget management.
- `lib/server`: Contains server-side logic, including database models, authorization policies, and utility functions.
- `lib/client`: Contains client-side utilities and hooks for data fetching and state management.
- `prisma/`: Contains Prisma schema and migration files for database management.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/CooperW824/pinesap.git
   cd pinesap
   ```
2. Install Docker and Docker Compose [Docker](https://docs.docker.com/get-started/get-docker/) if you haven't already.

3. Start the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```
4. Access the application at `http://localhost:3000`.

## Development Environment

To use the local NextJS server for development, follow these steps:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables in a `.env` file based on the provided `.env.example`.
3. Start the database using Docker Compose:
   ```bash
   docker-compose up -d database
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```
5. Start the NextJS development server:
   ```bash
   npm run dev
   ```
6. Access the application at `http://localhost:3000`.
