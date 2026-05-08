# CalTrack Backend

A Spring Boot backend for the CalTrack calorie tracking app.

## Requirements

- Java 17 or Java 21
- Maven
- MongoDB Atlas credentials are already configured in `src/main/resources/application.properties`

## Available Endpoints

- `GET /api/health` → `{ "status": "OK", "database": "MongoDB" }`
- `GET /api/entries?date=YYYY-MM-DD` → list of saved entries
- `POST /api/entries` → save an entry
- `DELETE /api/entries/{id}` → delete an entry
- `GET /api/summary?date=YYYY-MM-DD` → return totalConsumed, totalBurned, netCalories

## Run locally

1. Open a terminal in `CalTrack-Backend`
2. Build the project:
   ```powershell
   mvn clean package
   ```
3. Run the application:
   ```powershell
   mvn spring-boot:run
   ```

The backend will start on `http://localhost:8080`.

## Notes

- CORS allows requests from `http://localhost:5500`, `http://localhost:3000`, and `http://localhost:8080`
- Dates are handled as `LocalDate`; `createdAt` is automatically set as `LocalDateTime`
- If Maven is not installed, install it and ensure `mvn` is on your PATH
