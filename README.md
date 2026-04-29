# 📚 Flashcard Web App

A modern flashcard web application inspired by Anki, helping users learn effectively with spaced repetition, typing practice, and deck management.

---

## 🚀 Demo

* 🌐 Frontend: https://your-vercel-link.vercel.app
* ⚙️ Backend API: https://your-render-link.onrender.com

---

## 🧠 Features

* 📦 Create & manage decks
* 📝 Add, edit, delete flashcards
* 🔁 Shuffle & reverse cards
* ⌨️ Typing mode (practice writing answers)
* 📊 Study mode with progress tracking
* 🔐 User authentication (login/register)
* ☁️ Deploy online (Vercel + Render)

---

## 🛠️ Tech Stack

### Frontend

* ReactJS
* React Router
* Axios
* Tailwind CSS

### Backend

* Spring Boot
* Spring Security
* REST API

### Database

* PostgreSQL

### Deployment

* Vercel (Frontend)
* Render (Backend + Database)

---

## ⚙️ Installation & Setup

### 1. Clone repository

```bash
git clone https://github.com/your-username/flashcard-web.git
cd flashcard-web
```

---

### 2. Backend Setup (Spring Boot)

```bash
cd backend
```

Update `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/flashcard
spring.datasource.username=postgres
spring.datasource.password=123456
```

Run backend:

```bash
mvn spring-boot:run
```

---

### 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

---

## 🌐 Environment Variables

Frontend `.env`:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

---

## 📁 Project Structure

```
flashcard-web/
│
├── backend/        # Spring Boot API
├── frontend/       # React App
├── README.md
```
---

## 🔥 Future Improvements

* 🧠 Spaced Repetition Algorithm (SM-2)
* 📱 Mobile responsive improvements
* 📈 Learning analytics dashboard
* 🤖 AI-generated flashcards
---

## 👨‍💻 Author

* GitHub: https://github.com/Ziewyyyy
