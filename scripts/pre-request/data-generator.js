/**
 * Test Data Generator
 * Generates dynamic test data for API requests
 */

const DataGenerator = {
    /**
     * Generate random user data
     */
    generateUser: function() {
        const timestamp = new Date().getTime();
        return {
            name: `Test User ${timestamp}`,
            username: `testuser${timestamp}`,
            email: `testuser${timestamp}@example.com`,
            phone: this.generatePhone(),
            website: `testuser${timestamp}.com`
        };
    },

    /**
     * Generate random post data
     */
    generatePost: function(userId = null) {
        const timestamp = new Date().getTime();
        return {
            userId: userId || Math.floor(Math.random() * 10) + 1,
            title: `Test Post ${timestamp}`,
            body: `This is a test post created at ${new Date().toISOString()}. Random content: ${Math.random()}`
        };
    },

    /**
     * Generate random comment data
     */
    generateComment: function(postId = null) {
        const timestamp = new Date().getTime();
        return {
            postId: postId || Math.floor(Math.random() * 100) + 1,
            name: `Test Comment ${timestamp}`,
            email: `commenter${timestamp}@example.com`,
            body: `This is a test comment created at ${new Date().toISOString()}.`
        };
    },

    /**
     * Generate random phone number
     */
    generatePhone: function() {
        const areaCode = Math.floor(Math.random() * 900) + 100;
        const prefix = Math.floor(Math.random() * 900) + 100;
        const lineNumber = Math.floor(Math.random() * 9000) + 1000;
        return `1-${areaCode}-${prefix}-${lineNumber}`;
    },

    /**
     * Generate random email
     */
    generateEmail: function() {
        const timestamp = new Date().getTime();
        const random = Math.random().toString(36).substring(7);
        return `test${timestamp}${random}@example.com`;
    },

    /**
     * Generate random ID within valid range
     */
    generateValidId: function(min = 1, max = 100) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Generate random string
     */
    generateRandomString: function(length = 10) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
};

// Make available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataGenerator;
}