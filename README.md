# CrediFlow - Major Project (UNLOX)

**Project Name:** CrediFlow - Loan & Interest Manager
**Client/Company:** Trivion Technology
**Authors:** Rakshith Raghavendra and Athish Kashyappa
**Training Program:** UNLOX November 2025 Batch

## Overview
CrediFlow is a comprehensive Loan and Interest Management application supporting both Simple and Compound interest calculations, customer management, secure authentication, and payment tracking with dynamic light/dark theme support.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS (Context API for state)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)

---

## How to Run the Project Locally

### Prerequisites
- Node.js installed on your machine.
- MongoDB connection (Variables provided in `.env` for out-of-the-box evaluation).

### 1. Setup Backend
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure the `.env` file is present in the `backend/` directory. (Note: For this evaluation, the `.env` file containing the test database credentials has been included so the project works immediately).
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *(The backend runs on http://localhost:5000)*

### 2. Setup Frontend
1. Open a *new* terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. Open the link provided in the terminal (usually `http://localhost:5173`) in your web browser.

---

## Testing the Application
- You can create a new account using the "Create Account" page.
- Once logged in, you can add Customers, create Loans, and record Payments.
- The Dashboard will reflect the live statistics.
- Use the toggle in the Navbar to test the robust Dark/Light theme switching.

Thank you for your time reviewing our project!
