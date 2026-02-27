# Better Garage - API Documentation 📚

This document details all available API endpoints, their expected HTTP methods, required headers, and role-based permissions. 

**Base URL**: `http://localhost:3000/api`

---

## 🔒 Authentication (Auth) Routes
Endpoints for registering new users and grabbing access tokens. 
*No authentication token is required for these endpoints.*

| Method | Endpoint | Description | Requires Multipart/Form-Data |
| :--- | :--- | :--- | :---: |
| `POST` | `/auth/register` | Registers a new Customer/User. Returns JWT. | Yes (for `photo`) |
| `POST` | `/auth/login` | Authenticates a user. Returns JWT and user object. | No |

---

## 🧑‍💻 User Routes
Endpoints for managing users within the system.

**Required Header on all endpoints**: `Authorization: Bearer <Token>`

| Method | Endpoint | Description | Role Required | Requires Multipart/Form-Data |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/users` | Retrieves a list of all users. | *Valid Token* | No |
| `GET` | `/users/:id` | Retrieves a single user's detail by ID. | *Valid Token* | No |
| `POST` | `/users` | Creates a new user (Admin assigning roles). | *Valid Token* | Yes (for `photo`) |
| `PUT` | `/users/:id`| Updates an existing user's profile. | *Valid Token* | Yes (for `photo`) |
| `DELETE`| `/users/:id` | Deletes a user from the system. | *Valid Token* | No |

---

## 🏢 Garage Routes
Endpoints for creating and managing auto repair Garages.

**Required Header on all endpoints**: `Authorization: Bearer <Token>`

| Method | Endpoint | Description | Role Required | Requires Multipart/Form-Data |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/garages` | Retrieves all registered Garages. | All Roles | No |
| `GET` | `/garages/my-garage` | Retrieves the Admin's assigned garage including their Services, Spareparts, and Technicians. | **Admin** only | No |
| `GET` | `/garages/:id` | Retrieves details for a specific Garage. | All Roles | No |
| `POST` | `/garages` | Creates a new Garage. (Auto-assigns the Admin to it if they don't have one). | **Admin** only | Yes (for `photo`, `banner`) |
| `PUT` | `/garages/:id` | Updates an existing Garage. Admin must belong to this Garage. | **Admin** only | Yes (for `photo`, `banner`) |
| `DELETE`| `/garages/:id` | Deletes a Garage. Admin must belong to this Garage. | **Admin** only | No |

---

## 🔧 Services Routes
Endpoints for managing the types of services a garage provides (e.g. "Oil Change", "Tire Rotation").

**Required Header on all endpoints**: `Authorization: Bearer <Token>`

| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/services` | Retrieves all Services for the User's Garage. | **Admin, Technician** |
| `GET` | `/services/:id` | Retrieves a specific Service by ID. | **Admin, Technician** |
| `POST` | `/services` | Creates a new Service in the User's Garage. | **Admin** only |
| `PUT` | `/services/:id` | Updates an existing Service in the Admin's Garage. | **Admin** only |
| `DELETE`| `/services/:id` | Deletes a Service in the Admin's Garage. | **Admin** only |

---

## 🔩 Spareparts Routes
Endpoints for managing the inventory of spare parts in a garage (e.g. "Spark Plugs", "Brake Pads").

**Required Header on all endpoints**: `Authorization: Bearer <Token>`

| Method | Endpoint | Description | Role Required | Requires Multipart/Form-Data |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/spareparts` | Retrieves all Spareparts for the User's Garage. | **Admin, Technician** | No |
| `GET` | `/spareparts/:id`| Retrieves a specific Sparepart by ID. | **Admin, Technician** | No |
| `POST` | `/spareparts` | Creates a new Sparepart in the User's Garage. | **Admin, Technician** | Yes (for `photo`) |
| `PUT` | `/spareparts/:id`| Updates an existing Sparepart in the User's Garage. | **Admin, Technician** | Yes (for `photo`) |
| `DELETE`| `/spareparts/:id`| Deletes a Sparepart in the User's Garage. | **Admin, Technician** | No |

---

## 🧾 Transaction Routes
Endpoints for creating and tracking work orders/transactions. Connects Customers to the Services and Spareparts utilized by the Technician.

**Required Header on all endpoints**: `Authorization: Bearer <Token>`

| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/transactions` | Retrieves all Transactions (includes nested `services`, `spareparts`, and `technician`). | All Roles |
| `GET` | `/transactions/:id` | Retrieves a specific Transaction by ID. | All Roles |
| `POST` | `/transactions` | Creates a new Transaction. Connects `serviceIds` and `sparepartIds` and dynamically calculates the total. | **Technician** only |
| `PUT` | `/transactions/:id`| Updates an existing Transaction (e.g., adding spare parts, changing status). Technician must own the transaction. | **Technician** only |
| `DELETE`| `/transactions/:id`| Soft deletes a Transaction (sets `deletedAt` date). | **Admin** only |

---

## 📁 Public File Access
Files are uploaded into the server and made publicly available. You do not need a token to view them via browser.
* **Base URL**: `http://localhost:3000/uploads/...`
* E.g. `http://localhost:3000/uploads/garages/banner-1234.png`

---

## 💾 Database Entities & Schemas

Below is a representation of the data models returned by the API endpoints and expected within JSON payloads. Fields handled internally (like `id`, `createdAt`, `updatedAt`, `deletedAt`) are auto-generated.

### 1. `Role` Entity
Defines the permissions bracket a user sits within.
* `id` (Integer)
* `name` (String) - Usually 'Admin', 'Technician', or 'Customer'

### 2. `User` Entity
* `id` (Integer)
* `fullName` (String) - User's full name
* `email` (String) - Unique identifier for auth
* `password` (String) - BCRYPT Hashed (Not returned in API GET requests)
* `photoUrl` (String) - Static path to their uploaded profile face
* `phone` (String) - User's phone number
* `roleId` (Integer) - Foreign Key to `Role`
* `garageId` (Integer) - Foreign Key to `Garage`, assigns Admins or Technicians to a shop

### 3. `Garage` Entity
* `id` (Integer)
* `name` (String) - Garage Name
* `description` (String)
* `photoUrl` (String) - Static path to their uploaded front/profile image
* `bannerPhoto` (String) - Static path to a large banner image

### 4. `Services` Entity
* `id` (Integer)
* `name` (String) - Short descriptive name
* `description` (String) - Detailed breakdown
* `price` (Integer) - The flat cost of the service
* `garageId` (Integer) - Foreign Key to `Garage`

### 5. `Sparepart` Entity
* `id` (Integer)
* `name` (String)
* `partNumber` (String) - Shop barcode or internal SKU
* `brand` (String) - Manufacturer brand
* `category` (String) - E.g. "Engine", "Brakes"
* `price` (Integer) - Unit cost
* `photoUrl` (String) - Static path to uploaded image
* `garageId` (Integer) - Foreign Key to `Garage`

### 6. `Transaction` Entity
This table serves as the "Work Order" connecting mechanics to customers. Supported by soft deletion.
* `id` (Integer)
* `bookingId` (UUID) - Auto-generated string ID 
* `customerId` (Integer) - Foreign Key to `User` table (the client)
* `technicianId` (Integer) - Foreign Key to `User` table (the assigned mechanic)
* `status` (String) - E.g. "Pending", "In Progress", "Completed"
* `serviceTotal` (Integer) - Total calculated cost from linked many-to-many services
* `sparepartsTotal` (Integer) - Total calculated cost from linked many-to-many spare parts
* `grandTotal` (Integer) - Mathematical total of `serviceTotal` + `sparepartsTotal`
* `deletedAt` (Date) - Handled internally on 'soft delete' operations
