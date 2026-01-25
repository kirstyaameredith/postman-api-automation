/**
 * Custom Newman Reporter
 * Provides detailed test metrics and trends
 */

const fs = require('fs');
const path = require('path');

class CustomReporter {
    constructor(emitter, reporterOptions, collectionRunOptions) {
        this.reporterOptions = reporterOptions;
        this.collectionRunOptions = collectionRunOptions;
        
        // Initialize metrics
        this.metrics = {
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            skippedTests: 0,
            totalRequests: 0,
            failedRequests: 0,
            totalTime: 0,
            averageResponseTime: 0,
            minResponseTime: Infinity,
            maxResponseTime: 0,
            responseTimes: [],
            startTime: Date.now(),
            endTime: null
        };

        this.requests = [];
        this.failures = [];

        // Listen to Newman events
        emitter.on('start', () => {
            console.log('\n🚀 Starting API Tests...\n');
        });

        emitter.on('beforeRequest', (err, args) => {
            const requestName = args.request.name || 'Unnamed Request';
            console.log(`📤 Executing: ${requestName}`);
        });

        emitter.on('request', (err, args) => {
            this.metrics.totalRequests++;
            const responseTime = args.response.responseTime;
            
            this.metrics.responseTimes.push(responseTime);
            this.metrics.minResponseTime = Math.min(this.metrics.minResponseTime, responseTime);
            this.metrics.maxResponseTime = Math.max(this.metrics.maxResponseTime, responseTime);

            this.requests.push({
                name: args.request.name,
                method: args.request.method,
                url: args.request.url.toString(),
                status: args.response.code,
                responseTime: responseTime,
                size: args.response.size().total
            });

            if (err || args.response.code >= 400) {
                this.metrics.failedRequests++;
            }
        });

        emitter.on('assertion', (err, args) => {
            this.metrics.totalTests++;
            
            if (err) {
                this.metrics.failedTests++;
                this.failures.push({
                    test: args.assertion,
                    request: args.cursor.ref,
                    error: err.message
                });
                console.log(`   ❌ ${args.assertion}: ${err.message}`);
            } else {
                this.metrics.passedTests++;
                console.log(`   ✅ ${args.assertion}`);
            }
        });

        emitter.on('done', () => {
            this.metrics.endTime = Date.now();
            this.metrics.totalTime = this.metrics.endTime - this.metrics.startTime;
            this.metrics.averageResponseTime = 
                this.metrics.responseTimes.reduce((a, b) => a + b, 0) / this.metrics.responseTimes.length;

            this.generateReport();
            this.displaySummary();
        });
    }

    generateReport() {
        const report = {
            summary: {
                totalTests: this.metrics.totalTests,
                passed: this.metrics.passedTests,
                failed: this.metrics.failedTests,
                passRate: ((this.metrics.passedTests / this.metrics.totalTests) * 100).toFixed(2) + '%',
                totalRequests: this.metrics.totalRequests,
                failedRequests: this.metrics.failedRequests,
                totalTime: (this.metrics.totalTime / 1000).toFixed(2) + 's',
                averageResponseTime: this.metrics.averageResponseTime.toFixed(2) + 'ms',
                minResponseTime: this.metrics.minResponseTime + 'ms',
                maxResponseTime: this.metrics.maxResponseTime + 'ms',
                timestamp: new Date().toISOString()
            },
            requests: this.requests,
            failures: this.failures,
            performance: {
                responseTimes: this.metrics.responseTimes,
                percentiles: this.calculatePercentiles()
            }
        };

        // Save detailed JSON report
        const reportPath = path.join('reports', 'detailed-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        // Update trends
        this.updateTrends(report.summary);

        // Generate HTML dashboard
        this.generateHtmlDashboard(report);
    }

    calculatePercentiles() {
        const sorted = [...this.metrics.responseTimes].sort((a, b) => a - b);
        return {
            p50: sorted[Math.floor(sorted.length * 0.5)],
            p75: sorted[Math.floor(sorted.length * 0.75)],
            p90: sorted[Math.floor(sorted.length * 0.9)],
            p95: sorted[Math.floor(sorted.length * 0.95)],
            p99: sorted[Math.floor(sorted.length * 0.99)]
        };
    }

    updateTrends(summary) {
        const trendsPath = path.join('reports', 'trends.json');
        let trends = [];

        if (fs.existsSync(trendsPath)) {
            trends = JSON.parse(fs.readFileSync(trendsPath, 'utf8'));
        }

        trends.push(summary);

        // Keep only last 30 runs
        if (trends.length > 30) {
            trends = trends.slice(-30);
        }

        fs.writeFileSync(trendsPath, JSON.stringify(trends, null, 2));
    }

    generateHtmlDashboard(report) {
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Test Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; }
        .header h1 { font-size: 2em; margin-bottom: 10px; }
        .header p { opacity: 0.9; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .metric-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .metric-card h3 { color: #666; font-size: 0.9em; margin-bottom: 10px; text-transform: uppercase; }
        .metric-card .value { font-size: 2em; font-weight: bold; color: #333; }
        .metric-card.success .value { color: #4caf50; }
        .metric-card.danger .value { color: #f44336; }
        .metric-card.info .value { color: #2196f3; }
        .section { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px; }
        .section h2 { margin-bottom: 15px; color: #333; }
        table { width: 100%; border-collapse: collapse; }
        table th { background: #f5f5f5; padding: 12px; text-align: left; font-weight: 600; color: #666; }
        table td { padding: 12px; border-top: 1px solid #eee; }
        .status-200 { color: #4caf50; font-weight: bold; }
        .status-201 { color: #4caf50; font-weight: bold; }
        .status-400 { color: #ff9800; font-weight: bold; }
        .status-404 { color: #f44336; font-weight: bold; }
        .status-500 { color: #f44336; font-weight: bold; }
        .method { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 0.85em; font-weight: bold; }
        .method-GET { background: #e3f2fd; color: #1976d2; }
        .method-POST { background: #e8f5e9; color: #388e3c; }
        .method-PUT { background: #fff3e0; color: #f57c00; }
        .method-PATCH { background: #f3e5f5; color: #7b1fa2; }
        .method-DELETE { background: #ffebee; color: #c62828; }
        .failure { background: #ffebee; padding: 10px; border-left: 4px solid #f44336; margin-bottom: 10px; border-radius: 4px; }
        .failure-test { font-weight: bold; color: #c62828; }
        .failure-error { color: #666; margin-top: 5px; }
        .percentile { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .percentile-label { color: #666; }
        .percentile-value { font-weight: bold; color: #333; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 API Test Dashboard</h1>
            <p>JSONPlaceholder API Automation Results</p>
            <p style="font-size: 0.9em; margin-top: 5px;">Generated: ${new Date().toLocaleString()}</p>
        </div>

        <div class="metrics">
            <div class="metric-card success">
                <h3>Pass Rate</h3>
                <div class="value">${report.summary.passRate}</div>
            </div>
            <div class="metric-card ${report.summary.failed > 0 ? 'danger' : 'success'}">
                <h3>Tests Passed</h3>
                <div class="value">${report.summary.passed}/${report.summary.totalTests}</div>
            </div>
            <div class="metric-card info">
                <h3>Total Requests</h3>
                <div class="value">${report.summary.totalRequests}</div>
            </div>
            <div class="metric-card info">
                <h3>Avg Response Time</h3>
                <div class="value">${report.summary.averageResponseTime}</div>
            </div>
        </div>

        <div class="section">
            <h2>📊 Performance Metrics</h2>
            <div class="percentile">
                <span class="percentile-label">Minimum:</span>
                <span class="percentile-value">${report.summary.minResponseTime}</span>
            </div>
            <div class="percentile">
                <span class="percentile-label">50th Percentile (Median):</span>
                <span class="percentile-value">${report.performance.percentiles.p50}ms</span>
            </div>
            <div class="percentile">
                <span class="percentile-label">75th Percentile:</span>
                <span class="percentile-value">${report.performance.percentiles.p75}ms</span>
            </div>
            <div class="percentile">
                <span class="percentile-label">90th Percentile:</span>
                <span class="percentile-value">${report.performance.percentiles.p90}ms</span>
            </div>
            <div class="percentile">
                <span class="percentile-label">95th Percentile:</span>
                <span class="percentile-value">${report.performance.percentiles.p95}ms</span>
            </div>
            <div class="percentile">
                <span class="percentile-label">99th Percentile:</span>
                <span class="percentile-value">${report.performance.percentiles.p99}ms</span>
            </div>
            <div class="percentile">
                <span class="percentile-label">Maximum:</span>
                <span class="percentile-value">${report.summary.maxResponseTime}</span>
            </div>
        </div>

        ${report.failures.length > 0 ? `
        <div class="section">
            <h2>❌ Failures (${report.failures.length})</h2>
            ${report.failures.map(f => `
                <div class="failure">
                    <div class="failure-test">${f.test}</div>
                    <div class="failure-error">${f.error}</div>
                    <div style="color: #999; font-size: 0.9em; margin-top: 5px;">Request: ${f.request}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <div class="section">
            <h2>📝 Request Details</h2>
            <table>
                <thead>
                    <tr>
                        <th>Request</th>
                        <th>Method</th>
                        <th>Status</th>
                        <th>Response Time</th>
                        <th>Size</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.requests.map(r => `
                        <tr>
                            <td>${r.name}</td>
                            <td><span class="method method-${r.method}">${r.method}</span></td>
                            <td class="status-${r.status}">${r.status}</td>
                            <td>${r.responseTime}ms</td>
                            <td>${(r.size / 1024).toFixed(2)} KB</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>`;

        fs.writeFileSync(path.join('reports', 'dashboard.html'), html);
    }

    displaySummary() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 TEST EXECUTION SUMMARY');
        console.log('='.repeat(60));
        console.log(`Total Tests:          ${this.metrics.totalTests}`);
        console.log(`Passed:               ${this.metrics.passedTests} ✅`);
        console.log(`Failed:               ${this.metrics.failedTests} ❌`);
        console.log(`Pass Rate:            ${((this.metrics.passedTests / this.metrics.totalTests) * 100).toFixed(2)}%`);
        console.log('-'.repeat(60));
        console.log(`Total Requests:       ${this.metrics.totalRequests}`);
        console.log(`Failed Requests:      ${this.metrics.failedRequests}`);
        console.log('-'.repeat(60));
        console.log(`Total Time:           ${(this.metrics.totalTime / 1000).toFixed(2)}s`);
        console.log(`Avg Response Time:    ${this.metrics.averageResponseTime.toFixed(2)}ms`);
        console.log(`Min Response Time:    ${this.metrics.minResponseTime}ms`);
        console.log(`Max Response Time:    ${this.metrics.maxResponseTime}ms`);
        console.log('='.repeat(60));
        console.log(`\n📄 Reports generated in: reports/`);
        console.log(`   - dashboard.html`);
        console.log(`   - detailed-report.json`);
        console.log(`   - trends.json`);
        console.log('\n');
    }
}

module.exports = CustomReporter;