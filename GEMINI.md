# GEMINI.MD: AI Collaboration Guide

This document provides essential context for AI models interacting with this project. Adhering to these guidelines will ensure consistency and maintain code quality.

## 1. Project Overview & Purpose

*   **Primary Goal:** This is a full-stack "Quotes Service" application. Its main purpose is to serve quotes and demonstrate integration with various Large Language Models (LLMs) like Google Gemini and other models hosted on Vertex AI and GKE. It features a web UI for interaction.
*   **Business Domain:** Generative AI / AI-powered Applications. The project serves as a reference implementation for building production-ready, serverless Java applications on Google Cloud Platform that leverage AI.

## 2. Core Technologies & Stack

*   **Languages:** Java 21, TypeScript.
*   **Frameworks & Runtimes:** Spring Boot 3.4.3, Vaadin Hilla 24.4.13 (which seamlessly integrates the Spring Boot backend with a React frontend), React 18.3.1, Node.js (for frontend build).
*   **Databases:** PostgreSQL (for production/testing), H2 (for local/runtime testing). Database schema migrations are managed by Flyway.
*   **Key Libraries/Dependencies:**
    *   Backend: Spring AI (for LLM integration), Testcontainers (for testing), Caffeine (for caching), Micrometer & Prometheus (for observability).
    *   Frontend: Vite, Lit, React Router.
*   **Package Manager(s):** Maven for the backend, npm for the frontend.

## 3. Architectural Patterns

*   **Overall Architecture:** Monolithic Application. The project uses the Vaadin Hilla framework, which tightly couples the Java backend and the React frontend into a single, cohesive application. This simplifies development and deployment for full-stack features.
*   **Directory Structure Philosophy:**
    *   `/src/main/java`: Contains all primary backend Java source code, following standard Maven conventions.
    *   `/src/main/frontend`: Contains all frontend TypeScript/React source code, including views, components, and generated code from Hilla.
    *   `/src/main/resources`: Holds backend resources, including `application.properties` for configuration and `/db/migration` for Flyway SQL migration scripts.
    *   `/containerize`: Contains various Dockerfiles for building container images of the application (e.g., fat JAR, Jlink).
    *   `/k8s`: Contains Kubernetes deployment manifests (`deployment.yaml`).
    *   `/docker`: Contains configurations for dependent services like Grafana and Prometheus, managed via `docker-compose.yaml`.

## 4. Coding Conventions & Style Guide

*   **Formatting:**
    *   Java: Adheres to the **Google Java Style Guide**, as specified in the project's context files. Indentation is 2 spaces.
    *   TypeScript/React: No explicit linter configuration (`.eslintrc`, `.prettierrc`) was found. Follow existing code patterns: 4-space indentation is prevalent in `.tsx` files.
*   **Naming Conventions:**
    *   `classes` (Java), `components` (React): PascalCase (`QuoteService`, `QuoteCard`).
    *   `methods`, `variables` (Java & TS): camelCase (`getRandomQuote`, `quoteText`).
    *   `files`: PascalCase for components (`QuoteCard.tsx`), PascalCase for Java classes (`Quote.java`).
*   **API Design:** RESTful principles, documented in `openapi.yaml`. Endpoints are resource-oriented (e.g., `/quotes`, `/quotes/{id}`). It uses standard HTTP verbs (GET, POST, PUT, DELETE) and JSON for request/response bodies.
*   **Error Handling:** Primarily uses Spring Boot's built-in exception handling mechanisms. Custom exceptions may be defined for specific business logic failures.

## 5. Key Files & Entrypoints

*   **Main Entrypoint(s):**
    *   Backend: `src/main/java/com/example/quotes/QuotesApplication.java`.
    *   Frontend: `src/main/frontend/views/@index.tsx` is the main application view.
*   **Configuration:**
    *   Backend: `src/main/resources/application.properties` (main config), `pom.xml` (Maven dependencies).
    *   Frontend: `package.json` (npm dependencies), `vite.config.ts` (build configuration).
*   **CI/CD Pipeline:** No CI/CD pipeline configuration (e.g., `.github/workflows`) was found in the repository.

## 6. Development & Testing Workflow

*   **Local Development Environment:** The application can be run locally using the Maven wrapper: `./mvnw spring-boot:run`. The `README.md` also details how to build and run the packaged JAR file. The `docker-compose.yaml` in the `/docker` directory can be used to spin up supporting services like Grafana and Prometheus.
*   **Testing:** Tests are run via `./mvnw test`. The project utilizes JUnit 5 for unit testing and Testcontainers for integration tests, ensuring high-fidelity testing against real dependencies like PostgreSQL. Test files are located in `/src/test/java`.
*   **CI/CD Process:** Not applicable as no CI/CD configuration is present.

## 7. Specific Instructions for AI Collaboration

*   **Contribution Guidelines:** No `CONTRIBUTING.md` file was found. Follow existing patterns and conventions when adding new code.
*   **Infrastructure (IaC):** This project contains infrastructure definitions. Changes to files in `/containerize`, `/k8s`, or `docker-compose.yaml` will modify how the application is built and deployed. These changes must be carefully reviewed.
*   **Security:** Be mindful of security. Do not hardcode secrets or keys in source code; use `application.properties` or environment variables. Ensure any changes to authentication or external API logic are secure.
*   **Dependencies:**
    *   Backend: Add new dependencies to the `pom.xml` file.
    *   Frontend: Add new dependencies to the `package.json` file using `npm install`.
*   **Commit Messages:** Analysis of the git history shows simple, imperative-style commit messages (e.g., "add telemetry", "format"). While there is no strict format like Conventional Commits, messages should be clear and concise.