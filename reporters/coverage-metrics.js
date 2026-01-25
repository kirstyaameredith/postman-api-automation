/**
 * Test Coverage Metrics
 * Tracks API endpoint coverage and test distribution
 */

const fs = require('fs');
const path = require('path');

class CoverageMetrics {
    constructor() {
        this.endpoints = {
            '/users': { methods: ['GET'], tested: [] },
            '/users/:id': { methods: ['GET'], tested: [] },
            '/posts': { methods: ['GET', 'POST'], tested: [] },
            '/posts/:id': { methods: ['GET', 'PUT', 'PATCH', 'DELETE'], tested: [] },
            '/comments': { methods: ['GET', 'POST'], tested: [] },
            '/comments/:id': { methods: ['GET', 'DELETE'], tested: [] },
            '/albums': { methods: ['GET'], tested: [] },
            '/photos': { methods: ['GET'], tested: [] },
            '/todos': { methods: ['GET'], tested: [] }
        };
    }

    recordTest(method, endpoint) {
        // Normalize endpoint (replace IDs with :id)
        const normalizedEndpoint = endpoint.replace(/\/\d+/g, '/:id');
        
        if (this.endpoints[normalizedEndpoint]) {
            if (!this.endpoints[normalizedEndpoint].tested.includes(method)) {
                this.endpoints[normalizedEndpoint].tested.push(method);
            }
        }
    }

    generateReport() {
        let totalMethods = 0;
        let testedMethods = 0;

        const coverage = Object.keys(this.endpoints).map(endpoint => {
            const endpointData = this.endpoints[endpoint];
            const methods = endpointData.methods;
            const tested = endpointData.tested;
            
            totalMethods += methods.length;
            testedMethods += tested.length;

            return {
                endpoint,
                totalMethods: methods.length,
                testedMethods: tested.length,
                coverage: ((tested.length / methods.length) * 100).toFixed(2) + '%',
                untested: methods.filter(m => !tested.includes(m))
            };
        });

        const overallCoverage = ((testedMethods / totalMethods) * 100).toFixed(2);

        const report = {
            summary: {
                totalEndpoints: Object.keys(this.endpoints).length,
                totalMethods,
                testedMethods,
                overallCoverage: overallCoverage + '%'
            },
            endpoints: coverage,
            timestamp: new Date().toISOString()
        };

        // Save report
        fs.writeFileSync(
            path.join('reports', 'coverage.json'),
            JSON.stringify(report, null, 2)
        );

        this.displayCoverage(report);
    }

    displayCoverage(report) {
        console.log('\n' + '='.repeat(60));
        console.log('📈 API COVERAGE REPORT');
        console.log('='.repeat(60));
        console.log(`Overall Coverage:     ${report.summary.overallCoverage}`);
        console.log(`Total Endpoints:      ${report.summary.totalEndpoints}`);
        console.log(`Total Methods:        ${report.summary.totalMethods}`);
        console.log(`Tested Methods:       ${report.summary.testedMethods}`);
        console.log('-'.repeat(60));
        
        report.endpoints.forEach(ep => {
            console.log(`${ep.endpoint.padEnd(20)} ${ep.coverage.padStart(7)}`);
            if (ep.untested.length > 0) {
                console.log(`  ⚠️  Untested: ${ep.untested.join(', ')}`);
            }
        });
        
        console.log('='.repeat(60) + '\n');
    }
}

module.exports = CoverageMetrics;