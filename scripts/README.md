# Reusable Scripts

This folder contains reusable JavaScript modules for Postman collections.

## Pre-request Scripts

Located in `pre-request/` folder - used before requests are sent.

### auth-helper.js
Authentication and token management functions.
```javascript
// Usage in Postman pre-request script:
eval(pm.globals.get('authHelper'));
AuthHelper.setAuthHeader();
```

### data-generator.js
Generate dynamic test data for requests.
```javascript
// Usage in Postman pre-request script:
eval(pm.globals.get('dataGenerator'));
const user = DataGenerator.generateUser();
pm.environment.set('newUser', JSON.stringify(user));
```

### request-helper.js
Utility functions for building and managing requests.
```javascript
// Usage in Postman pre-request script:
eval(pm.globals.get('requestHelper'));
RequestHelper.setCommonHeaders();
RequestHelper.logRequest();
```

## Test Scripts

Located in `test/` folder - used to validate responses.

### common-assertions.js
Reusable assertion functions for API tests.
```javascript
// Usage in Postman test script:
eval(pm.globals.get('commonAssertions'));
CommonAssertions.assertSuccess();
CommonAssertions.assertResponseTime(2000);
CommonAssertions.assertRequiredFields(['id', 'userId', 'title']);
```

## How to Use These Scripts

### Method 1: Copy and Paste (Simple)
Copy the contents of any script directly into your Postman pre-request or test script tab.

### Method 2: Global Variables (Advanced)
1. Create a Postman environment
2. Add global variables for each script
3. Set the variable value to the entire script content
4. Use `eval()` to load the script in your requests

### Method 3: External Files (Local Development)
When running with Newman locally, these scripts can be loaded as separate files if needed.

## Best Practices

- Keep scripts focused and single-purpose
- Document all functions with JSDoc comments
- Use console.log for debugging
- Handle errors gracefully
- Make functions reusable across multiple tests