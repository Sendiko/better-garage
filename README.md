# Better Garage API 🚗🛠️

A robust and scalable backend system for managing mechanic garages, built with **Node.js, Express, Sequelize, and MySQL**. 

This system handles user hierarchies, auto-shops (garages), services, spare parts inventory, and end-to-end customer transactions with dynamic total tracking.

---

## 🏗️ Features

* **Secure Authentication & Authorization**: JWT-based login with deeply integrated Role-Based Access Control (RBAC). 
* **Role Management**: Differentiates access between `Admin` (Shop Owners), `Technician` (Mechanics), and standard `Customer` / `User` roles.
* **Garage Resource Management**: Garage owners can manage their Services and track their Spareparts inventory.
* **Complete Transaction Flow**: Create dynamic service orders bridging Technicians, Services, and Spareparts on behalf of Customers. Calculates totals and manages state.
* **Soft Deletes**: Important data such as transactions is safely soft-deleted using Sequelize `paranoid` configuration.

## 🧑‍🔧 User Roles & Permissions

1. **Admin** 
   * Belongs to a single Garage.
   * Full CRUD permissions for their Garage, Services, and Spareparts.
   * Can soft-delete Transactions within their assigned Garage.
2. **Technician** 
   * Belongs to a single Garage under an Admin.
   * Can read Services and Spareparts for their assigned Garage.
   * Can create and update Transactions bridging customers and vehicles to the shop.
3. **Customer / General User**
   * Default role. 
   * Standard access across read-only endpoints unless specified otherwise.

---

## 🛠️ Tech Stack & Prerequisites

Before deploying the project, ensure you have the following installed on your machine or production server:

* **Node.js** (v18.x or v20.x recommended)
* **npm** (comes with Node.js)
* **MySQL** (v8.0 recommended)

**Frameworks Used:**
* Express.js 
* Sequelize ORM (`sequelize`, `sequelize-cli`, `mysql2`)
* bcrypt (Password Hashing)
* jsonwebtoken (JWT Auth)

---

## 🚦 Local Setup Guide

1. **Clone the repository** (if applicable) and open the directory:
   ```bash
   cd better-garage
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Configure Database Settings:**
   * Open `src/database/config/config.json`.
   * Under the `"development"` key, update the `username`, `password`, and `database` fields to match your local MySQL configuration. 
   * *Note: Ensure your MySQL service is running.*

4. **Create the Database:**
   ```bash
   npx sequelize-cli db:create
   ```

5. **Run Database Migrations & Seeders:**
   Generate the required tables and initial setup data (like default Roles):
   ```bash
   npm run db:migrate
   npm run db:seed:all
   ```

6. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:3000`.*

---

## 🚀 Production Deployment (Step-by-step)

Deploying a Node.js API to standard providers (like AWS EC2, DigitalOcean, or Linux VPS instances) involves creating a reliable, persistent running environment.

### 1. Set File & Environment Keys

Security is critical in production. Rather than putting passwords in `config.json`, use your server environment securely.
Update your `config.json`'s `"production"` block to read directly from environment variables:
```json
"production": {
  "use_env_variable": "DATABASE_URL",
  "dialect": "mysql",
  "logging": false
}
```
*You must set `DATABASE_URL` as a string (`mysql://user:pass@host:port/dbname`) or set up `process.env` files.*

### 2. Install Production Dependencies only

Using `--production` limits dependencies to exactly what is needed to run, shrinking node_modules block sizes.
```bash
npm install --production
```

### 3. Run Production Migrations

Before launching, execute MySQL migrations against your production database using your set configuration.
```bash
NODE_ENV=production npm run db:migrate
```
*If you need your default app Roles seeded in production natively:*
```bash
NODE_ENV=production npm run db:seed:all
```

### 4. Process Management (PM2)

You **should not** run `npm start` directly inside a terminal line for production. Instead, utilize **PM2**, a production process manager that restarts your app if it crashes.

Install PM2 globally on the server:
```bash
npm install -g pm2
```

Start the API:
```bash
NODE_ENV=production pm2 start src/index.js --name "better-garage"
```

Save your process map so PM2 auto-spins up on server reboot:
```bash
pm2 save
pm2 startup
```

### 5. Setup a Reverse Proxy (Optional, Strongly Recommended)

Node APIs typically run on ports like `3000`. Standard internet traffic operates on `80` (HTTP) or `443` (HTTPS). You should place an NGINX proxy in front of Node to safely route web traffic:

* Install Nginx (`sudo apt install nginx`).
* Configure the default server block to act as a proxy pass to `http://localhost:3000`.

---

## 📚 Handful Commands to Remember

We added custom npm commands within `package.json` for rapid workflow:

* **Start server (Prod/Staging):** `npm start`
* **Start local dev (Nodemon):** `npm run dev`
* **Migrate Database:** `npm run db:migrate`
* **Revert Last Migration:** `npm run db:migrate:undo`
* **Restart from Scratch:** `npm run db:migrate:undo:all`
