# CalTrack — Full Project

A calorie tracking full-stack application built for a Data Structures course.

---

## What's Inside

```
CalTrack-Full/
├── CalTrack-Standalone.html   ← Open this in any browser. No install needed.
├── frontend/
│   ├── website.html           ← Original HTML (needs backend running)
│   ├── app.js                 ← Original JavaScript
│   └── styles.css             ← Original CSS
└── backend/                   ← Spring Boot (Java) + MongoDB
    ├── pom.xml
    └── src/...
```

---

## Option A — Just open the app (no install)

1. Double-click `CalTrack-Standalone.html`
2. Done. Works in Chrome, Firefox, Edge, Safari.

---

## Option B — Run the full backend (Spring Boot + MongoDB)

### Requirements
- Java 21+
- Maven 3.8+
- MongoDB Atlas account (free tier works)

### Steps

1. Open `backend/src/main/resources/application.properties`
2. Replace the MongoDB URI with your own Atlas connection string:
   ```
   spring.data.mongodb.uri=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/caltrack
   ```
3. From the `backend/` folder, run:
   ```bash
   mvn spring-boot:run
   ```
4. Open `frontend/website.html` in your browser.

The backend runs on `http://localhost:8080` by default.

---

## API Endpoints

| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| GET    | /api/health          | Server health check      |
| GET    | /api/entries         | Get all entries          |
| GET    | /api/entries?date=X  | Filter entries by date   |
| POST   | /api/entries         | Add a new entry          |
| DELETE | /api/entries/{id}    | Delete an entry by ID    |
| GET    | /api/summary?date=X  | Get daily calorie summary|

---

## Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Java 21, Spring Boot 3, Spring Data MongoDB
- **Database:** MongoDB Atlas
- **Build:** Maven
