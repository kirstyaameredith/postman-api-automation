# Postman API Automation Testing Project

[![API Automation Tests](https://github.com/kirstyaameredith/postman-api-automation/actions/workflows/api-tests.yml/badge.svg)](https://github.com/kirstyaameredith/postman-api-automation/actions/workflows/api-tests.yml)

A comprehensive API automation testing project using Postman and Newman to test the JSONPlaceholder API. This project demonstrates complete CRUD operations, request chaining, data-driven testing, and professional test organization.

## Project Structure

This project contains **4 test suites** with **139 total tests** covering multiple API endpoints:

### 1. Individual Tests (11 requests, ~80 tests)
Independent tests for various HTTP methods with dynamic test data:
- **GET All Users** - Fetches and validates all users
- **GET Single User** - Fetches random user (1-10) with comprehensive validation
- **GET Comments** - Retrieves and validates comment structure
- **GET Photos** - Tests photo endpoint with URL validation
- **GET Albums** - Validates album data and relationships
- **GET Todos** - Tests todo items with completion status checks
- **POST Create New Post** - Creates posts with random userId and unique content
- **POST Create New Comment** - Adds comments with validated email format
- **PUT Update Post** - Updates random posts (1-100) with dynamic data
- **PATCH Post** - Demonstrates partial updates (title only)
- **DELETE Delete Post** - Deletes random posts (1-100)

### 2. CRUD Workflow (5 requests, ~25 tests)
Complete lifecycle demonstration:
1. **GET** - Retrieve an existing post (random ID 1-100)
2. **PUT** - Update that post with new content
3. **GET** - Verify the post still exists
4. **DELETE** - Delete the post
5. **POST** - Create a new post

### 3. User Posts Workflow (4 requests, ~18 tests)
User-centric workflow demonstrating data relationships:
1. **GET User** - Retrieve a random user
2. **GET User's Posts** - Fetch all posts for that user
3. **POST Create Post** - Create a new post for that user
4. **DELETE Post** - Clean up the created post

### 4. Comments Workflow (4 requests, ~16 tests)
Comment management workflow:
1. **GET Post** - Retrieve a random post
2. **GET Comments** - Fetch all comments on that post
3. **POST Add Comment** - Add a new comment to the post
4. **DELETE Comment** - Remove the created comment

## Features

- 🎯 **Dynamic test data generation** - Unique data on every run
- 🔗 **Request chaining** - Variables passed between workflow steps
- 📊 **HTML reporting** - Beautiful visual test reports
- 🧪 **139 comprehensive tests** - Covering all major scenarios
- 📝 **Detailed logging** - Console output at every step
- ✨ **Professional organization** - Clear folder structure
- ✅ **Data validation** - Only valid ID ranges used
- 🔄 **Multiple workflows** - Demonstrating different testing patterns
- 🎨 **PATCH vs PUT** - Shows understanding of partial vs full updates
- 📧 **Email validation** - Regex patterns for format checking

## Prerequisites

- [Node.js](https://nodejs.org/) installed (v14 or higher)
- [Postman](https://www.postman.com/downloads/) (optional, for viewing/editing collections)

## Installation

1. Clone this repository:
```bash
git clone https://github.com/kirstyaameredith/postman-api-automation.git
cd postman-api-automation
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

## Running Tests

### Run all tests (139 tests across 24 requests):
```bash
npm test
```

### Run specific test suites:
```bash
# Individual tests only (~80 tests)
npm run test:individual

# CRUD workflow only (~25 tests)
npm run test:workflow

# User Posts workflow only (~18 tests)
npm run test:user-posts

# Comments workflow only (~16 tests)
npm run test:comments
```

### Run with HTML reports:
```bash
# All tests with report
npm run test:report

# CRUD workflow with report
npm run test:workflow:report
```

The HTML reports will be generated in the `reports/` folder.

### Run with verbose output:
```bash
npm run test:verbose
```
## Reusable Scripts

The project includes reusable scripts in the `scripts/` folder:

**Pre-request Scripts:**
- `auth-helper.js` - Authentication and token management
- `data-generator.js` - Dynamic test data generation
- `request-helper.js` - Request building utilities

**Test Scripts:**
- `common-assertions.js` - Reusable assertion functions

See [scripts/README.md](scripts/README.md) for usage instructions.

### Performance Testing

Run performance tests with multiple iterations to test API under load:
```bash
# Light load (10 iterations)
npm run test:perf:light

# Medium load (50 iterations) - Recommended for regular testing
npm run test:perf

# Heavy load (100 iterations)
npm run test:perf:heavy

# Stress test (200 iterations with 100ms delay between requests)
npm run test:perf:stress
```

**After running a performance test, analyze the results:**
```bash
npm run perf:analyze
```

**Performance Reports Generated:**
- `reports/performance-results.json` - Raw Newman results
- `reports/performance-analysis.json` - Analyzed performance data
- `reports/performance-report.html` - Visual HTML dashboard

**What Gets Measured:**
- Response time percentiles (P50, P95, P99)
- Performance degradation over iterations
- Throughput (requests per second)
- Min/Max/Average response times
- Automated performance recommendations

## Test Coverage

### Individual Tests
- ✅ Status code validation (200, 201, 404 checks)
- ✅ Response time validation (< 2000ms)
- ✅ Data structure validation
- ✅ Field presence verification
- ✅ Data type validation
- ✅ Dynamic test data generation
- ✅ Valid ID range validation
- ✅ Email format validation (regex)
- ✅ URL format validation
- ✅ Nested object structure validation
- ✅ Array length validation
- ✅ Boolean type checking

### Workflow Tests
- ✅ Complete lifecycle testing (GET → UPDATE/CREATE → DELETE)
- ✅ Request chaining with collection variables
- ✅ Data flow validation between requests
- ✅ End-to-end integration testing
- ✅ Comprehensive logging at each step
- ✅ Original vs updated data comparison
- ✅ Resource creation and cleanup
- ✅ Relationship validation (users → posts, posts → comments)

## API Endpoints Tested

| Endpoint | Methods | Tests |
|----------|---------|-------|
| `/users` | GET | User data validation |
| `/posts` | GET, POST, PUT, PATCH, DELETE | Full CRUD operations |
| `/comments` | GET, POST, DELETE | Comment management |
| `/albums` | GET | Album data validation |
| `/photos` | GET | Photo URL validation |
| `/todos` | GET | Todo completion checks |

## API Tested

[JSONPlaceholder](https://jsonplaceholder.typicode.com/) - Free fake REST API for testing and prototyping

**Note:** JSONPlaceholder is a mock API that simulates responses but doesn't persist data. This is acknowledged in the workflow tests.

## Project Highlights

This project demonstrates:
- ✨ Understanding of RESTful API principles (GET, POST, PUT, PATCH, DELETE)
- ✨ Test automation best practices
- ✨ Data-driven testing approach
- ✨ Request chaining and workflow management
- ✨ Professional test organization and documentation
- ✨ Dynamic data generation for realistic testing
- ✨ Proper error handling and validation
- ✨ Multiple testing patterns (individual, workflow, integration)
- ✨ CI/CD integration with GitHub Actions

## CI/CD Integration

This project includes GitHub Actions workflow that:
- ✅ Runs automatically on every push
- ✅ Tests against Node.js 18
- ✅ Executes all 139 tests
- ✅ Generates and uploads HTML reports
- ✅ Provides test status badges

## Folder Structure
```
postman-api-automation/
├── .github/workflows/
├── collections/
├── environments/         
│   ├── dev.postman_environment.json
│   ├── staging.postman_environment.json
│   └── prod.postman_environment.json
├── test-data/           
│   ├── valid-users.json
│   ├── invalid-payloads.json
│   ├── edge-cases.json
│   └── data-loader.js
├── scripts/           
│   ├── pre-request/
│   │   ├── auth-helper.js
│   │   ├── data-generator.js
│   │   └── request-helper.js
│   ├── test/
│   │   └── common-assertions.js
│   └── README.md
├── reports/
├── .gitignore
├── package.json
└── README.md
```

## Learning Resources

- [Postman Learning Center](https://learning.postman.com/)
- [Newman Documentation](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/)
- [JSONPlaceholder Guide](https://jsonplaceholder.typicode.com/guide/)

## Test Statistics

- **Total Requests**: 24
- **Total Tests**: 139
- **Test Suites**: 4
- **API Endpoints**: 6
- **HTTP Methods**: 5 (GET, POST, PUT, PATCH, DELETE)

## Author

Kirsty Meredith QA Engineer/Manager | Over 16+ years QA, PM experience | MSc | PSM 1 | Future SDET

## License

MIT