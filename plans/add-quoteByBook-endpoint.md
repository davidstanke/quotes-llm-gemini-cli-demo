# Feature Implementation Plan: Add Quote by Book Endpoint

## 📋 Todo Checklist
- [x] Update `QuoteRepository` with find by book query
- [x] Update `QuoteService` to expose book search
- [x] Update `QuoteController` with new REST endpoint and improved logging
- [x] Update `QuoteEndpoint` (Hilla) with new functionality
- [x] Final Review and Manual Verification

## 🔍 Analysis & Investigation

### Codebase Structure
The application follows a standard Spring Boot architecture with a layered design:
- **Domain Layer (`src/main/java/com/example/quotes/domain`)**: Contains the `Quote` entity, `QuoteRepository` (JPA), and `QuoteService`.
- **Web Layer (`src/main/java/com/example/quotes/web`)**: Contains `QuoteController` (REST API) and `QuoteEndpoint` (Vaadin Hilla API).
- **Tests**: `QuotesControllerTest` uses `MockMvc` and `Testcontainers` for integration testing.

### Current Architecture
- The `Quote` entity already contains a `book` field.
- `QuoteRepository` extends `JpaRepository` and currently has a custom finder for authors (`findByAuthorContainingIgnoreCase`).
- `QuoteController` handles REST requests but currently uses `System.out.println` for exception logging, which violates best practices.
- `QuoteEndpoint` provides a direct TypeScript-to-Java bridge for the Hilla frontend.

### Dependencies & Integration Points
- **Spring Data JPA**: For database queries.
- **Spring Web**: For REST endpoints.
- **Vaadin Hilla**: For frontend-backend communication.
- **SLF4J**: Available for logging (already instantiated in `QuoteController`).

### Considerations & Challenges
- **Logging**: The requirement specifically asks to "handle and log any exceptions properly". The existing controller uses `System.out.println` in catch blocks. This must be replaced with the existing `Logger` instance.
- **Consistency**: The new endpoint should match the behavior of the existing `quoteByAuthor` endpoint (e.g., returning 404 if no quotes are found).

## 📝 Implementation Plan

### Prerequisites
- Ensure local Postgres or H2 database is available for manual verification if running locally.

### Step-by-Step Implementation

1. **Step 1: Update Repository**
   - Files to modify: `src/main/java/com/example/quotes/domain/QuoteRepository.java`
   - Changes needed:
     - Add method definition: `List<Quote> findByBookContainingIgnoreCase(String book);`
   - **Status**: ✅ Completed

2. **Step 2: Update Service Layer**
   - Files to modify: `src/main/java/com/example/quotes/domain/QuoteService.java`
   - Changes needed:
     - Add method `public List<Quote> getByBook(String book)`
     - Implementation should call `quoteRepository.findByBookContainingIgnoreCase(book)`
   - **Status**: ✅ Completed

3. **Step 3: Update REST Controller**
   - Files to modify: `src/main/java/com/example/quotes/web/QuoteController.java`
   - Changes needed:
     - Add `@GetMapping("/quotes/book/{book}")` endpoint.
     - Implement logic similar to `quoteByAuthor`:
       - Call `quoteService.getByBook(book)`.
       - Return `ResponseEntity` with list and `HttpStatus.OK` if found, or `HttpStatus.NOT_FOUND` if empty.
       - **Crucial**: Update existing catch blocks and the new one to use `logger.error("Error message", e)` instead of `System.out.println`.
   - **Status**: ✅ Completed

4. **Step 4: Update Hilla Endpoint**
   - Files to modify: `src/main/java/com/example/quotes/web/QuoteEndpoint.java`
   - Changes needed:
     - Add method `public List<Quote> quoteByBook(String book)`.
     - Delegate to `quoteService.getByBook(book)`.
   - **Status**: ✅ Completed

### Testing Strategy
- **Manual Verification Only**:
    - Build and run the application (`./mvnw spring-boot:run`).
    - Manually invoke the endpoint using `curl` or the browser: `http://localhost:8080/quotes/book/The%20Glass%20Menagerie`.
    - Verify the JSON response contains the expected quotes.
    - Test error handling by checking logs when triggering an exception (if feasible to force one) or simply verifying normal operation logs.

## 🎯 Success Criteria
- [ ] New endpoint `/quotes/book/{book}` returns JSON list of quotes.
- [ ] Searching for a non-existent book returns 404.
- [ ] Exceptions are logged to the console via SLF4J logger, not `System.out.println`.