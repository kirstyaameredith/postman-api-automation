/**
 * Request Helper
 * Utility functions for building and managing requests
 */

const RequestHelper = {
    /**
     * Set common headers
     */
    setCommonHeaders: function() {
        pm.request.headers.add({
            key: 'Content-Type',
            value: 'application/json'
        });
        pm.request.headers.add({
            key: 'Accept',
            value: 'application/json'
        });
        console.log('✅ Common headers set');
    },

    /**
     * Add timestamp to request
     */
    addTimestamp: function() {
        pm.environment.set('requestTimestamp', new Date().toISOString());
        console.log('⏰ Request timestamp:', pm.environment.get('requestTimestamp'));
    },

    /**
     * Log request details
     */
    logRequest: function() {
        console.log('📤 REQUEST DETAILS:');
        console.log('   Method:', pm.request.method);
        console.log('   URL:', pm.request.url.toString());
        console.log('   Headers:', pm.request.headers.toObject());
        if (pm.request.body && pm.request.body.raw) {
            console.log('   Body:', pm.request.body.raw);
        }
    },

    /**
     * Validate request body
     */
    validateRequestBody: function(requiredFields) {
        if (!pm.request.body || !pm.request.body.raw) {
            console.error('❌ No request body found');
            return false;
        }
        
        try {
            const body = JSON.parse(pm.request.body.raw);
            const missingFields = requiredFields.filter(field => !body.hasOwnProperty(field));
            
            if (missingFields.length > 0) {
                console.error('❌ Missing required fields:', missingFields);
                return false;
            }
            
            console.log('✅ Request body validated');
            return true;
        } catch (error) {
            console.error('❌ Invalid JSON in request body:', error);
            return false;
        }
    },

    /**
     * Build query parameters
     */
    buildQueryParams: function(params) {
        const url = pm.request.url;
        Object.keys(params).forEach(key => {
            url.query.add({
                key: key,
                value: params[key]
            });
        });
        console.log('✅ Query parameters added:', params);
    },

    /**
     * Set environment variable from request
     */
    saveToEnvironment: function(key, value) {
        pm.environment.set(key, value);
        console.log(`💾 Saved to environment: ${key} = ${value}`);
    }
};

// Make available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RequestHelper;
}