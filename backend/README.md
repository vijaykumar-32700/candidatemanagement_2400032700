# Candidate Management System — Backend

Spring Boot REST API with PostgreSQL.

## Requirements
- Java 21
- Maven (or use `mvnw.cmd` if the Maven wrapper is added)
- PostgreSQL running locally
- Database named `soataskdb`

## Configure the database
Edit `src/main/resources/application.properties` and replace `CHANGE_ME` with your PostgreSQL password, or set environment variables:
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

Never commit a real password.

## Run in Eclipse/STS
1. Extract this ZIP.
2. Choose **File → Import → Maven → Existing Maven Projects**.
3. Select the extracted `CandidateProject` folder containing `pom.xml`.
4. Finish and wait for Maven dependencies to download.
5. Create the PostgreSQL database `soataskdb` in pgAdmin.
6. Set the PostgreSQL password in `application.properties`.
7. Run `CandidateProjectApplication.java` as **Java Application** or **Spring Boot App**.

## URLs
- API base: `http://localhost:2026/api/candidates`
- Swagger UI: `http://localhost:2026/swagger-ui/index.html`

## API endpoints
- `GET /api/candidates`
- `GET /api/candidates/{id}`
- `POST /api/candidates`
- `PUT /api/candidates/{id}`
- `DELETE /api/candidates/{id}`
- `GET /api/candidates/search/name?value=...`
- `GET /api/candidates/search/type?value=...`
- `GET /api/candidates/search/status?value=...`

Example POST JSON:
```json
{
  "name": "Ananya Rao",
  "type": "Full Time",
  "status": "Active",
  "location": "Vijayawada"
}
```

Hibernate creates/updates the `candidate_table` table after connecting successfully. It does not migrate old MySQL data.
