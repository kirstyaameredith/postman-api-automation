# Postman API Automation Testing Project

A beginner-friendly API automation testing project using Postman and Newman to test the JSONPlaceholder API.

## Project Structure

This project contains two types of tests:

### 1. Individual API Tests
Independent tests for each HTTP method with dynamic test data:
- **GET All Users** - Fetches all users and validates structure
- **GET Single User** - Fetches a random user (1-10) with comprehensive validation
- **POST Create New Post** - Creates posts with random userId, unique titles, and body content
- **PUT Update Post** - Updates random posts (1-100) with dynamic data
- **DELETE Delete Post** - Deletes random posts (1-100)

### 2. CRUD Workflow
A complete end-to-end workflow demonstrating request chaining:
1. **GET** - Retrieve an existing post (random ID 1-100)
2. **PUT** - Update that post with new content
3. **GET** - Verify the post still exists
4. **DELETE** - Delete the post
5. **POST** - Create a new post

The workflow demonstrates data flow between API calls using collection variables.

## Features

- 🎯 **Dynamic test data generation** (unique on each run)
- 🔗 **Chained API requests** in workflow
- 📊 **HTML reporting** capability
- 🧪 **Comprehensive test assertions** (60-70 tests total)
- 📝 **Detailed console logging**
- ✨ **Professional test organization**
- ✅ **Data validation** using only valid ID ranges

## Prerequisites

- [Node.js](https://nodejs.org/) installed (v14 or higher)
- [Postman](https://www.postman.com/downloads/) (optional, for viewing/editing collections)

## Installation

1. Clone this repository:
``````bash
git clone https://github.com/YOUR_USERNAME/postman-api-automation.git
cd postman-api-automation
``````

2. Install dependencies:
``````bash
npm install
``````

## Running Tests

### Run all tests:
``````bash
npm test
``````

### Run individual tests only:
``````bash
npm run test:individual
``````

### Run CRUD workflow only:
``````bash
npm run test:workflow
``````

### Run with HTML reports:
``````bash
# All tests with report
npm run test:report

# Workflow only with report
npm run test:workflow:report
``````

The HTML reports will be generated in the reports/ folder.

### Run with verbose output:
``````bash
npm run test:verbose
``````

## Test Coverage

### Individual Tests (~40 tests)
- ✅ Status code validation (200, 201, 404 checks)
- ✅ Response time validation
- ✅ Data structure validation
- ✅ Field presence verification
- ✅ Data type validation
- ✅ Dynamic test data generation
- ✅ Valid ID range validation (users 1-10, posts 1-100)
- ✅ Email format validation
- ✅ Nested object structure validation

### CRUD Workflow Tests (~25-30 tests)
- ✅ Complete lifecycle testing (GET → UPDATE → GET → DELETE → CREATE)
- ✅ Request chaining with collection variables
- ✅ Data flow validation between requests
- ✅ End-to-end integration testing
- ✅ Comprehensive logging at each step
- ✅ Original vs updated data comparison

## API Tested

[JSONPlaceholder](https://jsonplaceholder.typicode.com/) - Free fake REST API for testing and prototyping

**Note:** JSONPlaceholder is a mock API that simulates responses but doesn't persist data. This is acknowledged in the workflow tests.

## Project Highlights

This project demonstrates:
- ✨ Understanding of RESTful API principles
- ✨ Test automation best practices
- ✨ Data-driven testing approach
- ✨ Request chaining and workflow management
- ✨ Professional test organization and documentation
- ✨ Dynamic data generation for realistic testing
- ✨ Proper error handling and validation

## Learning Resources

- [Postman Learning Center](https://learning.postman.com/)
- [Newman Documentation](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/)
- [JSONPlaceholder Guide](https://jsonplaceholder.typicode.com/guide/)

## Author

Your Name

## License

MIT
"@ | Out-File -FilePath "README.md" -Encoding UTF8