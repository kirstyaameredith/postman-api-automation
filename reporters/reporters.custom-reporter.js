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

         // ⭐ INSERT NEW LOGIC HERE ⭐
        report.thresholds = this.evaluateThresholds(report);
        report.trends = this.compareTrends(report);
        report.chartData = this.buildChartData(report);
        
        // Save detailed JSON report
        const reportPath = path.join('reports', 'detailed-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        // Update trends
        this.updateTrends(report.summary);

        // Generate HTML dashboard
        this.generateHtmlDashboard(report);
    }

    evaluateThresholds(report) {
    const thresholds = {
        p95: 200,               // ms
        max: 500,               // ms
        avg: 150,               // ms
        throughput: 5           // req/s
    };

    const results = {
        passed: [],
        failed: []
    };

    const p95 = report.performance.percentiles.p95;
    const max = parseFloat(report.summary.maxResponseTime);
    const avg = parseFloat(report.summary.averageResponseTime);
    const throughput = report.summary.totalRequests / (parseFloat(report.summary.totalTime) * 1000);

    function check(name, value, limit, comparator = "<") {
        const pass = comparator === "<" ? value <= limit : value >= limit;
        const entry = { name, value, limit, pass };

        if (pass) results.passed.push(entry);
        else results.failed.push(entry);
    }

    check("95th Percentile", p95, thresholds.p95);
    check("Max Response Time", max, thresholds.max);
    check("Average Response Time", avg, thresholds.avg);
    check("Throughput", throughput, thresholds.throughput, ">");

    return results;
}

compareTrends(report) {
    const historyDir = path.join("reports", "history");
    if (!fs.existsSync(historyDir)) fs.mkdirSync(historyDir);

    const files = fs.readdirSync(historyDir).filter(f => f.endsWith(".json"));
    if (files.length === 0) return { message: "No previous runs available" };

    const lastFile = files.sort().reverse()[0];
    const previous = JSON.parse(fs.readFileSync(path.join(historyDir, lastFile)));

    const trends = {
        avgResponseChange: report.summary.averageResponseTime - previous.averageResponseTime,
        maxResponseChange: report.summary.maxResponseTime - previous.maxResponseTime,
        totalRequestsChange: report.summary.totalRequests - previous.totalRequests
    };

    return trends;
}

buildChartData(report) {
    return {
        labels: report.performance.responseTimes.map((_, i) => i + 1),
        responseTimes: report.performance.responseTimes,
        p95: report.performance.percentiles.p95,
        median: report.performance.percentiles.median
    };
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
    <html>
    <head>
        <title>API Test Dashboard</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
            body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
            .card { background: #fff; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            .pass { color: green; font-weight: bold; }
            .fail { color: red; font-weight: bold; }
            h1 { margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { padding: 8px; border-bottom: 1px solid #ddd; text-align: left; }
            th { background: #eee; }
        </style>
    </head>
    <body>

        <h1>📊 API Test Dashboard</h1>

        <div class="card">
            <h2>Summary</h2>
            <p><strong>Total Tests:</strong> ${report.summary.totalTests}</p>
            <p><strong>Passed:</strong> ${report.summary.passed}</p>
            <p><strong>Failed:</strong> ${report.summary.failed}</p>
            <p><strong>Pass Rate:</strong> ${report.summary.passRate}</p>
            <p><strong>Total Requests:</strong> ${report.summary.totalRequests}</p>
            <p><strong>Average Response Time:</strong> ${report.summary.averageResponseTime}</p>
            <p><strong>Max Response Time:</strong> ${report.summary.maxResponseTime}</p>
        </div>

        <div class="card">
            <h2>Threshold Results</h2>
            ${
                report.thresholds.failed.length === 0
                ? `<p class="pass">All thresholds passed ✔</p>`
                : report.thresholds.failed.map(f => `
                    <p class="fail">❌ ${f.name}: ${f.value} (limit ${f.limit})</p>
                `).join("")
            }
        </div>

        <div class="card">
            <h2>Trend Comparison</h2>
            ${
                report.trends.message
                ? `<p>${report.trends.message}</p>`
                : `
                    <p><strong>Avg Response Change:</strong> ${report.trends.avgResponseChange.toFixed(2)}ms</p>
                    <p><strong>Max Response Change:</strong> ${report.trends.maxResponseChange.toFixed(2)}ms</p>
                    <p><strong>Total Requests Change:</strong> ${report.trends.totalRequestsChange}</p>
                `
            }
        </div>

        <div class="card">
            <h2>Response Time Chart</h2>
            <canvas id="responseChart"></canvas>
        </div>

        <script>
            const ctx = document.getElementById('responseChart');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ${JSON.stringify(report.chartData.labels)},
                    datasets: [{
                        label: 'Response Time (ms)',
                        data: ${JSON.stringify(report.chartData.responseTimes)},
                        borderColor: 'blue',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.2
                    }]
                }
            });
        </script>

    </body>
    </html>
    `;

    fs.writeFileSync(path.join('reports', 'performance-report.html'), html);
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