# Remitly Project

## Description

This is a **NestJS application** designed to manage SWIFT codes, including adding, retrieving, and deleting SWIFT codes. The application interfaces with a **PostgreSQL database**. The SWIFT codes for the banking system are stored and can be retrieved based on country or specific code. The project also includes a script to seed the database with data from a CSV file.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application with Docker](#running-the-application-with-docker)
- [Running Seed Script](#running-seed-script)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Prerequisites

Before running the project, ensure you have the following installed on your machine:

- **Docker**: for containerization
- **Docker Compose**: to manage multi-container Docker applications
- **Node.js**: for running the NestJS application
- **npm**: for managing Node.js packages

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://your-repository-url.git
   cd remitly-project
   ```

2. **Install the required dependencies:**

   ```bash
   npm install
   ```

---

## Running the Application with Docker

1. **Build and start the Docker containers:**

   Make sure the `.env` file is correctly configured (refer to the [Environment Variables](#environment-variables) section). Then, run the following command:

   ```bash
   docker-compose up --build
   ```

   This will build the Docker images and start both the **NestJS application** and **PostgreSQL database container**.

2. **Access the application:**

   Once the containers are running, you can access the application at:

   ```
   http://localhost:8080
   ```

---

## Running Seed Script

To seed the database with initial data from a CSV file:

1. **Execute the seed script:**

   Run the following command:

   ```bash
   npm run seed
   ```

   This command will execute the `scripts/seed.ts` file and populate the database with data from the CSV file located in the `src/data/` folder.

2. **CSV File:**

   Ensure that the `swift-codes.csv` file is placed in the `src/data/` directory with the proper data.

---

## Environment Variables

The project relies on the following environment variables for configuring the database connection. Ensure these are set in your `.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=swift_db
POSTGRES_USER=user
POSTGRES_PASSWORD=yourpassword
POSTGRES_DB=swift_db
```

---

## API Endpoints

### 1. **POST: `/v1/swift-codes` – Create a new SWIFT code**

**Request Body:**

```json
{
  "swiftCode": "BKSACLRMXXX",
  "bankName": "SCOTIABANK CHILE",
  "address": "AVENIDA COSTANERA SUR 2710, FLOOR 10 EDIFICIO PARQUE TITANIUM SANTIAGO",
  "townName": "SANTIAGO",
  "countryName": "CHILE",
  "timeZone": "Pacific/Easter",
  "isHeadquarter": true
}
```

**Response:**

```json
{
  "message": "Swift code created successfully"
}
```

---

### 2. **GET: `/v1/swift-codes/{swift-code}` – Get details of a specific SWIFT code**

**Response (Headquarter):**

```json
{
  "swiftCode": "BKSACLRMXXX",
  "countryISO2": "CL",
  "bankName": "SCOTIABANK CHILE",
  "address": "AVENIDA COSTANERA SUR 2710, FLOOR 10 EDIFICIO PARQUE TITANIUM SANTIAGO",
  "townName": "SANTIAGO",
  "countryName": "CHILE",
  "timeZone": "Pacific/Easter",
  "isHeadquarter": true,
  "branches": [
    {
      "swiftCode": "BKSACLRM055",
      "bankName": "SCOTIABANK CHILE",
      "address": "SANTIAGO BRANCH",
      "townName": "SANTIAGO",
      "countryISO2": "CL",
      "countryName": "CHILE",
      "timeZone": "Pacific/Easter",
      "isHeadquarter": false
    }
  ]
}
```

---

### 3. **GET: `/v1/swift-codes/country/{countryISO2code}` – Get all SWIFT codes for a specific country**

**Response:**

```json
{
  "countryISO2": "CL",
  "countryName": "CHILE",
  "swiftCodes": [
    {
      "swiftCode": "BKSACLRMXXX",
      "bankName": "SCOTIABANK CHILE",
      "address": "AVENIDA COSTANERA SUR 2710, FLOOR 10 EDIFICIO PARQUE TITANIUM SANTIAGO",
      "townName": "SANTIAGO",
      "countryISO2": "CL",
      "countryName": "CHILE",
      "timeZone": "Pacific/Easter",
      "isHeadquarter": true
    }
  ]
}
```

---

### 4. **DELETE: `/v1/swift-codes/{swift-code}` – Delete a SWIFT code**

**Response:**

```json
{
  "message": "Swift code deleted successfully"
}
```

---

## Troubleshooting

- **Database connection issues:**  
  Ensure that the environment variables in the `.env` file are correctly set for both the application and the database service.

- **Seed script issues:**  
  Make sure that the `swift-codes.csv` file exists in the `src/data/` folder and is formatted correctly.

- **Docker Compose issues:**  
  If you face issues with Docker Compose, check if the environment variables are correctly configured and ensure Docker is running.

---

## License

This project is **unlicensed**.
