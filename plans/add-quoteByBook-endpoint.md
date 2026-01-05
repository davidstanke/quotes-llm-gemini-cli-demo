# Feature Implementation Plan: Add quoteByBook Endpoint

## 📋 Todo Checklist
- [x] Update `QuoteRepository` to support searching by book.
- [x] Update `QuoteService` to expose the book search functionality.
- [x] Update `QuoteController` to add the REST endpoint `/quotes/book/{book}`.
- [x] Update `QuoteEndpoint` to expose the functionality to the Hilla frontend.
- [ ] Final Review and Manual Testing.

## 🔍 Analysis & Investigation

### Codebase Structure
The application follows a standard Spring Boot layered architecture:
- **Domain Layer**: `Quote` entity, `QuoteRepository` (Data Access), `QuoteService` (Business Logic).
- **Web Layer**: `QuoteController` (REST API), `QuoteEndpoint` (Hilla UI Endpoint).

### Current Architecture
- **Data Access**: Spring Data JPA is used. `QuoteRepository` extends `JpaRepository` and `JpaSpecificationExecutor`.
- **API**: REST endpoints are defined in `QuoteController` using Spring Web MVC annotations (`@GetMapping`, `@PostMapping`, etc.).
- **Frontend Integration**: Vaadin Hilla is used, with `QuoteEndpoint` annotated with `@BrowserCallable` to make backend methods available to the TypeScript frontend.
- **Error Handling**: `QuoteController` currently catches generic `Exception`, prints the message to `System.out`, and returns appropriate HTTP status codes (500, 404, etc.).

### Dependencies & Integration Points
- **Database**: PostgreSQL (prod) / H2 (dev/test). The `Quote` entity already has a `book` field.
- **Logging**: SLF4J is available (`LoggerFactory`), though currently underutilized in exception blocks in `QuoteController`.

### Considerations & Challenges
- **Error Handling**: The existing controller uses `System.out.println` for exception logging. The new endpoint should improve on this by using the existing `logger` instance, while still maintaining the existing return structure.
- **Consistency**: The new endpoint structure should mirror the existing `quoteByAuthor` endpoint for consistency.
- **Testing**: Per user instructions, automated tests for this specific functionality will be skipped. Verification will rely on manual testing and compilation checks.

## 📝 Implementation Plan

### Prerequisites
- None.

### Step-by-Step Implementation

1. **Step 1: Update Repository**
   - **Files to modify**: `src/main/java/com/example/quotes/domain/QuoteRepository.java`
   - **Changes needed**: Add the method definition `List<Quote> findByBookContainingIgnoreCase(String book);` with the `@Transactional(readOnly = true)` and `@Cacheable(value = "quoteCache", key = "#book")` annotations, mirroring the `findByAuthorContainingIgnoreCase` method.

2. **Step 2: Update Service**
   - **Files to modify**: `src/main/java/com/example/quotes/domain/QuoteService.java`
   - **Changes needed**: Add a `public List<Quote> getByBook(String book)` method that delegates to `quoteRepository.findByBookContainingIgnoreCase(book)`.

3. **Step 3: Update REST Controller**
   - **Files to modify**: `src/main/java/com/example/quotes/web/QuoteController.java`
   - **Changes needed**:
     - Add a new method `quoteByBook` annotated with `@GetMapping("/quotes/book/{book}")`.
     - Arguments: `@PathVariable("book") String book`.
     - Logic: Call `quoteService.getByBook(book)`.
     - Return: `ResponseEntity<List<Quote>>`.
       - If list is not empty: `HTTP 200 OK`.
       - If list is empty: `HTTP 404 Not Found`.
     - Error Handling: Wrap in `try-catch`. Log exception using `logger.error(...)` (improving on `System.out`) and return `HTTP 500 Internal Server Error`.

4. **Step 4: Update Hilla Endpoint**
   - **Files to modify**: `src/main/java/com/example/quotes/web/QuoteEndpoint.java`
   - **Changes needed**: Add `public List<Quote> quoteByBook(String book)` method that delegates to `quoteService.getByBook(book)`.

### Testing Strategy
- **Manual Verification**: After deployment, use a tool like `curl` or a browser to access `/quotes/book/{book}` and verify the JSON response.
- **Build Verification**: Run `./mvnw compile` to ensure the code changes do not break the build.

## 🎯 Success Criteria
- The application compiles without errors.
- `GET /quotes/book/{book}` returns the expected JSON list of quotes for a valid book when tested manually.
- `GET /quotes/book/{unknown_book}` returns 404.
- Exceptions during this call are logged properly and return 500.