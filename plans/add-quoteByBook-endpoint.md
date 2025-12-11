# Feature Implementation Plan: add-quoteByBook-endpoint

## 📋 Todo Checklist
- [x] Add `findByBookContainingIgnoreCase` to `QuoteRepository`.
- [x] Add `getByBook` to `QuoteService`.
- [x] Add `quoteByBook` to `QuoteEndpoint` with exception handling and logging.
- [x] Add `quoteByBook` REST endpoint to `QuoteController` with exception handling and logging.
- [x] Final Review.

## 🔍 Analysis & Investigation

### Codebase Structure
The application follows a standard layered architecture:
-   **Web Layer**: `src/main/java/com/example/quotes/web/` contains both `QuoteController` (REST) and `QuoteEndpoint` (Vaadin Hilla).
-   **Service Layer**: `src/main/java/com/example/quotes/domain/QuoteService.java` handles business logic.
-   **Repository Layer**: `src/main/java/com/example/quotes/domain/QuoteRepository.java` handles data access using Spring Data JPA.
-   **Domain Model**: `src/main/java/com/example/quotes/domain/Quote.java` is the entity, which already includes a `book` field.

### Current Architecture
-   **Data Access**: `QuoteRepository` extends `JpaRepository` and uses `@Query` or derived query methods.
-   **Service**: `QuoteService` acts as a pass-through to the repository, with some transaction management.
-   **Frontend Integration**: `QuoteEndpoint` exposes methods directly to the Hilla frontend.
-   **REST API**: `QuoteController` exposes standard REST endpoints.

### Dependencies & Integration Points
-   **Spring Data JPA**: For repository methods.
-   **Vaadin Hilla**: For generating frontend endpoints from `QuoteEndpoint`.
-   **SLF4J**: For logging.

### Considerations & Challenges
-   **Consistency**: The new `quoteByBook` functionality should mirror the existing `quoteByAuthor` implementation across all layers.
-   **Exception Handling**: The requirement specifies proper handling and logging. Current `QuoteController` uses `System.out.println` for some error logging, which should be improved to use the SLF4J `logger`. `QuoteEndpoint` currently lacks explicit exception handling in read methods, so this must be added.

## 📝 Implementation Plan

### Prerequisites
-   Ensure the development environment is set up (Maven, Java 21).

### Step-by-Step Implementation

1.  **Step 1**: Update Repository
    -   Files to modify: `src/main/java/com/example/quotes/domain/QuoteRepository.java`
    -   Changes needed: Add the method `List<Quote> findByBookContainingIgnoreCase(String book);`. Add `@Transactional(readOnly = true)` and `@Cacheable(value = "quoteCache", key = "#book")` annotations to match existing patterns.
    -   **Status**: ✅ Completed

2.  **Step 2**: Update Service
    -   Files to modify: `src/main/java/com/example/quotes/domain/QuoteService.java`
    -   Changes needed: Add a `public List<Quote> getByBook(String book)` method that calls `quoteRepository.findByBookContainingIgnoreCase(book)`.
    -   **Status**: ✅ Completed

3.  **Step 3**: Update Hilla Endpoint
    -   Files to modify: `src/main/java/com/example/quotes/web/QuoteEndpoint.java`
    -   Changes needed:
        -   Add a `public List<Quote> quoteByBook(String book)` method.
        -   Implement a `try-catch` block within this method to catch exceptions.
        -   Log any exceptions using `logger.error(...)`.
        -   Rethrow the exception or return an empty list/appropriate error state as per application standards (though rethrowing or returning empty list is common for endpoints to let the frontend handle it, the requirement emphasizes logging).
    -   **Status**: ✅ Completed

4.  **Step 4**: Update REST Controller
    -   Files to modify: `src/main/java/com/example/quotes/web/QuoteController.java`
    -   Changes needed:
        -   Add a `@GetMapping("/quotes/book/{book}")` endpoint.
        -   Method signature: `public ResponseEntity<List<Quote>> quoteByBook(@PathVariable("book") String book)`.
        -   Call `quoteService.getByBook(book)`.
        -   Handle `EmptyResultDataAccessException` or empty lists by returning `HttpStatus.NOT_FOUND`.
        -   Wrap in `try-catch`, logging errors with `logger.error(...)` (replace `System.out.println` if modifying existing code or ensure new code uses `logger`).
        -   Return `HttpStatus.INTERNAL_SERVER_ERROR` on generic exceptions.
    -   **Status**: ✅ Completed

### Testing Strategy

4.  **Step 4**: Update REST Controller
    -   Files to modify: `src/main/java/com/example/quotes/web/QuoteController.java`
    -   Changes needed:
        -   Add a `@GetMapping("/quotes/book/{book}")` endpoint.
        -   Method signature: `public ResponseEntity<List<Quote>> quoteByBook(@PathVariable("book") String book)`.
        -   Call `quoteService.getByBook(book)`.
        -   Handle `EmptyResultDataAccessException` or empty lists by returning `HttpStatus.NOT_FOUND`.
        -   Wrap in `try-catch`, logging errors with `logger.error(...)` (replace `System.out.println` if modifying existing code or ensure new code uses `logger`).
        -   Return `HttpStatus.INTERNAL_SERVER_ERROR` on generic exceptions.

### Testing Strategy
-   **Automated Tests**: Skipped for this feature as per specific instructions.
-   **Manual Verification**:
    -   Run the application using `./mvnw spring-boot:run`.
    -   Use `curl` to test the new REST endpoint: `curl http://localhost:8080/quotes/book/someBookName`.
    -   Verify the Hilla endpoint generation by checking if the TypeScript client code is updated (this usually happens automatically during the build/run process).

## 🎯 Success Criteria
-   `QuoteRepository` has a working method to find quotes by book.
-   `QuoteService` exposes this functionality.
-   `QuoteEndpoint` exposes `quoteByBook` to the frontend, with proper error logging.
-   `QuoteController` exposes `GET /quotes/book/{book}`, with proper error logging and HTTP status codes.
-   All code compiles without errors.