# 🧠 Code Execution Backend

This backend system powers a code editor platform that supports **Python, C++, Java, and JavaScript**. It executes user-submitted code in isolated Docker containers and returns the output. It is designed for educational or coding practice platforms.

---
## ⚙️ Microservices Architecture

Each language is handled by a **separate service**, enabling better scalability, isolation, and easier deployments. All services communicate through a centralized **API Gateway**.

---
## 📁 Project Structure
```
backend/
├── gateway/     # Main API gateway to route execution requests
├── service/
    ├── cpp      # Executes C++ code using Docker
    ├── python   # Executes Python code using Docker
    ├── java     # Executes Java code using Docker
    ├── js       # Executes JavaScript code using Docker
```
---

## 🛠️ Technologies Used

- **Node.js + Express** – For building all backend services
- **Docker** – To isolate code execution securely
- **Axios** – For internal service communication
- **CORS & Body-parser** – For API request handling
- **Railway and Render** – For cloud deployment of all services

---

## 🌐 Gateway API

**POST /run**

**Request Body:**
```json
{
  "language": "cpp",
  "code": "#include<iostream>\nint main() { int a,b; std::cin >> a >> b; std::cout << a+b; return 0; }",
  "input": "3 4"
}
```
**Response:**
```json
{
  "output": "7\n"
}
```
## 👨‍💻 Author

Built by **Yash Shukla** to provide a scalable, secure, and modular code execution backend using **microservices**.
