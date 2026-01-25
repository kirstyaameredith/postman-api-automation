/**
 * Authentication Helper
 * Reusable authentication and token management functions
 */

const AuthHelper = {
    /**
     * Generate a mock authentication token
     * In real scenarios, this would call an auth endpoint
     */
    generateToken: function() {
        const timestamp = new Date().getTime();
        const randomString = Math.random().toString(36).substring(7);
        return `Bearer ${timestamp}-${randomString}`;
    },

    /**
     * Set authentication header in environment
     */
    setAuthHeader: function() {
        const token = this.generateToken();
        pm.environment.set('authToken', token);
        console.log('✅ Auth token generated and set');
        return token;
    },

    /**
     * Validate token exists
     */
    validateToken: function() {
        const token = pm.environment.get('authToken');
        if (!token) {
            console.error('❌ No auth token found');
            return false;
        }
        console.log('✅ Auth token validated');
        return true;
    },

    /**
     * Clear authentication
     */
    clearAuth: function() {
        pm.environment.unset('authToken');
        console.log('🗑️ Auth token cleared');
    }
};

// Make available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthHelper;
}