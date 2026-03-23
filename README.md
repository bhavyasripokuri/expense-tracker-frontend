# Expensio — Personal Expense Tracker

A full stack expense tracking web application built with Spring Boot and React.

## Features
- JWT based user authentication (register and login)
- Add, edit, delete and filter expenses by month
- Category management with custom colors
- Monthly budget limits with progress bars
- Dashboard with spending charts and insights
- Search and sort expenses
- Each user sees only their own data

## Tech Stack

**Backend**
- Java, Spring Boot
- Spring Security + JWT
- Spring Data JPA, Hibernate
- MySQL

**Frontend**
- React, Vite
- Axios, React Router
- Recharts

**Tools**
- Postman, MySQL Workbench
- Git, GitHub
- Spring Tool Suite (STS), VS Code

## Project Structure
```
expense-tracker/
├── expense-tracker/          # Spring Boot backend
│   └── src/main/java/com/expense/tracker/
│       ├── controller/
│       ├── model/
│       ├── repository/
│       ├── service/
│       ├── security/
│       └── dto/
└── expense-tracker-ui/       # React frontend
    └── src/
        ├── api/
        ├── components/
        └── pages/
```

## Setup Instructions

### Backend
1. Create MySQL database
```sql
CREATE DATABASE expense_tracker;
```
2. Update `application.properties` with your MySQL credentials
3. Run `ExpenseTrackerApplication.java` in STS

### Frontend
1. Navigate to `expense-tracker-ui`
2. Install dependencies
```bash
npm install
```
3. Start the app
```bash
npm run dev
```
4. Open `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/expenses` | Get all expenses |
| POST | `/api/expenses` | Add expense |
| PUT | `/api/expenses/{id}` | Update expense |
| DELETE | `/api/expenses/{id}` | Delete expense |
| GET | `/api/categories` | Get all categories |
| POST | `/api/categories` | Add category |
| DELETE | `/api/categories/{id}` | Delete category |
| GET | `/api/budgets` | Get budgets |
| POST | `/api/budgets` | Set budget |
| DELETE | `/api/budgets/{id}` | Delete budget |

## Screenshots
Coming soon

## Author
Bhavya Sri Pokuri
