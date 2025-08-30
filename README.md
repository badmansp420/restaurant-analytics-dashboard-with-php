# Restaurant Order Trends – Full-Stack Assignment
### 🍽️ Restaurant Orders API (PHP + MySQL + Redis + Docker)

This project is a **Dockerized REST API** that manages **restaurants** and **orders**, built with:

- **PHP 8.2 (Apache)**
- **MySQL 8.0**
- **Redis 7.4** (for caching)
- **Docker & Docker Compose**

It demonstrates how to integrate a **PHP backend** with **MySQL** while using **Redis caching** to improve performance.  

---

## 📌 Features
- ✅ PHP 8.2 with Apache in Docker
- ✅ MySQL for data persistence
- ✅ Redis for caching responses
- ✅ REST API endpoints for restaurants & orders
- ✅ CORS enabled (React)
- ✅ Pagination for orders
- ✅ Debug info showing whether data came from **MySQL** or **Redis**

---

## ⚙️ Tech Stack

| Layer          | Technology         |
|----------------|--------------------|
| **Language**   | PHP 8.2            |
| **Framework**  | Native PHP (no framework, lightweight) |
| **Frontend**   | ReactJs (lightweight) |
| **Database**   | MySQL 8.0          |
| **Cache**      | Redis 7.4          |
| **Server**     | Apache (via PHP Docker image) |
| **Container**  | Docker, Docker Compose |

---


## 🚀 Setup & Run

### 1️⃣ Clone the repository
```bash
https://github.com/badmansp420/restaurant-analytics-dashboard-with-php.git
cd restaurant-analytics-dashboard-with-php
```
## Environment Variables

Create a `.env` file in the project root with the following content:

##### Database configuration
```env
MYSQL_ROOT_PASSWORD=supersecretroot
MYSQL_DATABASE=appdb
MYSQL_USER=appuser
MYSQL_PASSWORD=apppass
MYSQL_HOST=db
```
## Project Structure

```

├── backend
│ └── public
│   └──index.php
│   └──.htaccess 
│ └── services
│   └── OrederService.php
│   └── RestaurantsService.php
│ └── config.php
│ └── Dockerfile
│ └── vhost.conf
├── db
├── frontend #(Our ReactJs client side) 
├── .env
├── docker-compose.yml
├── package.json
└── README.md 
```

# 🚀 Project Setup Guide

This document describes how to start and stop the project along with the running ports of each service.

---

## 🖥️ System Requirements

Before starting, make sure you have the following installed:

- **Docker** (latest version recommended)  
- **Docker Compose** (comes with Docker Desktop)  
- **Node.js v22+**  
- **npm** (comes with Node.js)

---

## 📦 Scripts

### Start Project
```bash
npm run db:up
```

### 🔌 Running Services & Ports
| Service                 | Port     | Description            | Links                  |
| ----------------------- | -------- | ---------------------- |----------------------  |
| Client (React/Frontend) | **3000** | Frontend Application   |http://localhost:3000   
| Backend (PHP)           | **8080** | API / Backend Server   |http://localhost:8080
| phpMyAdmin              | **8081** | Database Management UI |http://localhost:8081
| Redis                   | **6379** | Caching Layer          |
| MySQL Database          | **3306** | Main Database          |



### Stop Project
```bash
npm run db:down
```
