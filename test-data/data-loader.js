/**
 * Test Data Loader Utility
 * Use this in your Postman pre-request scripts to load test data
 */

const fs = require('fs');
const path = require('path');

class TestDataLoader {
    constructor() {
        this.dataPath = path.join(__dirname);
    }

    /**
     * Load valid test data
     */
    loadValidData() {
        const data = fs.readFileSync(path.join(this.dataPath, 'valid-users.json'), 'utf8');
        return JSON.parse(data);
    }

    /**
     * Load invalid payload data
     */
    loadInvalidData() {
        const data = fs.readFileSync(path.join(this.dataPath, 'invalid-payloads.json'), 'utf8');
        return JSON.parse(data);
    }

    /**
     * Load edge cases
     */
    loadEdgeCases() {
        const data = fs.readFileSync(path.join(this.dataPath, 'edge-cases.json'), 'utf8');
        return JSON.parse(data);
    }

    /**
     * Get random valid user
     */
    getRandomValidUser() {
        const data = this.loadValidData();
        const users = data.users;
        return users[Math.floor(Math.random() * users.length)];
    }

    /**
     * Get random valid post
     */
    getRandomValidPost() {
        const data = this.loadValidData();
        const posts = data.posts;
        return posts[Math.floor(Math.random() * posts.length)];
    }

    /**
     * Get random invalid user scenario
     */
    getRandomInvalidUser() {
        const data = this.loadInvalidData();
        const scenarios = data.invalidUsers;
        return scenarios[Math.floor(Math.random() * scenarios.length)];
    }
}

module.exports = TestDataLoader;