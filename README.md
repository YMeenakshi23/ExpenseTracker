# 💸 Expense Sharing Application (Splitwise Clone)

A full-stack MERN application designed to simplify shared expenses among groups. This project was developed as a solution for the **Engineering Design Assignment**, focusing on robust backend logic and an intuitive user interface.


---

## 🚀 Objective
The primary goal was to design a backend system that allows users to:
* **Create Groups**: Users can organize expenses by trip, household, or event.
* **Add Shared Expenses**: Supports multiple categories with emoji tagging.
* **Track Balances**: Real-time tracking of "Who owes Whom."
* **Settle Dues**: Functional settlement feature to clear debts from the database.

---

## 🛠️ Key Features

### 1. Advanced Split Types
The application supports the three essential engineering split requirements:
* **Equal Split**: Automatically divides the total amount among all group members.
* **Percentage Split**: Allows users to assign specific percentages to members. The UI includes a validator to ensure the total is exactly 100%.
* **Exact Amount**: Integrated through precise decimal handling in the database.

### 2. Balance Tracking & Optimization
* **Dashboard Summary**: Immediate view of Net Balance, Total Spending, and individual "Owed/Owe" status.
* **Debt Simplification**: Implements logic to reduce the number of transactions required to settle up.
* **Live Split Preview**: A dynamic frontend feature that shows exactly how much each person will owe before the expense is submitted.

---

## 🏗️ Technical Stack
* **Frontend**: React.js, Axios (for API calls).
* **Backend**: Node.js, Express.js.
* **Database**: MySQL (Relational Schema).
* **Authentication**: Persistent user sessions with local storage.

---

## 🚦 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/ExpenseTracker.git
cd ExpenseTracker

**2. Setup the Database**
Run these commands in your MySQL terminal to create the necessary tables:

SQL
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(100), 
    email VARCHAR(100) UNIQUE, 
    password VARCHAR(255)
);

CREATE TABLE expense_groups (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(100), 
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE group_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT,
    user_id INT,
    FOREIGN KEY (group_id) REFERENCES expense_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    group_id INT, 
    description TEXT, 
    total_amount DECIMAL(10,2), 
    category VARCHAR(50), 
    paid_by_id INT,
    FOREIGN KEY (group_id) REFERENCES expense_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (paid_by_id) REFERENCES users(id)
);

CREATE TABLE expense_splits (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    expense_id INT, 
    user_id INT, 
    amount DECIMAL(10,2),
    FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
**3. Install Dependencies**

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

**4. Configuration**
Create a .env file in the server folder:

DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=expense_tracker
PORT=5000



