/**
 * Common Test Assertions
 * Reusable assertion functions for API tests
 */

const CommonAssertions = {
    /**
     * Assert successful response (2xx status codes)
     */
    assertSuccess: function() {
        pm.test("Status code is successful (2xx)", function() {
            pm.expect(pm.response.code).to.be.oneOf([200, 201, 202, 204]);
        });
    },

    /**
     * Assert response time is acceptable
     */
    assertResponseTime: function(maxTime = 2000) {
        pm.test(`Response time is less than ${maxTime}ms`, function() {
            pm.expect(pm.response.responseTime).to.be.below(maxTime);
        });
    },

    /**
     * Assert content type is JSON
     */
    assertJsonContentType: function() {
        pm.test("Content-Type is application/json", function() {
            pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json');
        });
    },

    /**
     * Assert required fields exist in response
     */
    assertRequiredFields: function(fields) {
        const jsonData = pm.response.json();
        fields.forEach(field => {
            pm.test(`Response has required field: ${field}`, function() {
                pm.expect(jsonData).to.have.property(field);
            });
        });
    },

    /**
     * Assert field types
     */
    assertFieldTypes: function(fieldTypes) {
        const jsonData = pm.response.json();
        Object.keys(fieldTypes).forEach(field => {
            pm.test(`Field '${field}' is of type ${fieldTypes[field]}`, function() {
                pm.expect(jsonData[field]).to.be.a(fieldTypes[field]);
            });
        });
    },

    /**
     * Assert email format
     */
    assertEmailFormat: function(email) {
        pm.test("Email format is valid", function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            pm.expect(emailRegex.test(email)).to.be.true;
        });
    },

    /**
     * Assert URL format
     */
    assertUrlFormat: function(url) {
        pm.test("URL format is valid", function() {
            const urlRegex = /^https?:\/\/.+/;
            pm.expect(urlRegex.test(url)).to.be.true;
        });
    },

    /**
     * Assert array is not empty
     */
    assertArrayNotEmpty: function(array) {
        pm.test("Response array is not empty", function() {
            pm.expect(array).to.be.an('array').that.is.not.empty;
        });
    },

    /**
     * Assert specific status code
     */
    assertStatusCode: function(expectedCode) {
        pm.test(`Status code is ${expectedCode}`, function() {
            pm.response.to.have.status(expectedCode);
        });
    },

    /**
     * Assert error response structure
     */
    assertErrorResponse: function() {
        pm.test("Error response has correct structure", function() {
            const jsonData = pm.response.json();
            pm.expect(jsonData).to.have.property('error');
            // Add more error structure validation as needed
        });
    }
};

// Make available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CommonAssertions;
}