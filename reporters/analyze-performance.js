/**
 * Performance Results Analyzer
 * Analyzes Newman performance test results and generates reports
 */

const fs = require('fs');
const path = require('path');

class PerformanceAnalyzer {
    constructor() {
        this.resultsPath = path.join('reports', 'performance-results.json');
        
        if (!fs.existsSync(this.resultsPath)) {
            console.error('❌ No performance results found!');
            console.error('   Run a performance test first: npm run test:perf:light');
            process.exit(1);
        }

        this.results = JSON.parse(fs.readFileSync(this.resultsPath, 'utf8'));
        this.analyze();
    }

    analyze() {
        const executions = this.results.run.executions;
        
        // Group by request name
        const grouped = {};
        executions.forEach(exec => {
            const name = exec.item.name;
            const responseTime = exec.response.responseTime;
            
            if (!grouped[name]) {
                grouped[name] = [];
            }
            grouped[name].push(responseTime);
        });

        // Calculate statistics
        const analysis = Object.keys(grouped).map(name => {
            const times = grouped[name];
            const sorted = [...times].sort((a, b) => a - b);
            
            return {
                endpoint: name,
                iterations: times.length,
                average: (times.reduce((a, b) => a + b, 0) / times.length).toFixed(2),
                min: Math.min(...times),
                max: Math.max(...times),
                median: sorted[Math.floor(sorted.length / 2)],
                p95: sorted[Math.floor(sorted.length * 0.95)] || sorted[sorted.length - 1],
                p99: sorted[Math.floor(sorted.length * 0.99)] || sorted[sorted.length - 1],
                degradation: this.calculateDegradation(times)
            };
        });

        // Overall stats
        const allTimes = executions.map(e => e.response.responseTime);
        const totalTime = this.results.run.timings.completed - this.results.run.timings.started;
        
        const summary = {
            totalRequests: executions.length,
            totalIterations: this.results.run.stats.iterations.total,
            totalTime: (totalTime / 1000).toFixed(2) + 's',
            throughput: (executions.length / (totalTime / 1000)).toFixed(2) + ' req/s',
            averageResponseTime: (allTimes.reduce((a, b) => a + b, 0) / allTimes.length).toFixed(2) + 'ms',
            passedTests: this.results.run.stats.assertions.total - this.results.run.stats.assertions.failed,
            failedTests: this.results.run.stats.assertions.failed
        };

        const report = {
            summary,
            endpointAnalysis: analysis,
            recommendations: this.generateRecommendations(analysis),
            timestamp: new Date().toISOString()
        };

        this.saveReport(report);
        this.displayResults(report);
        this.generateHtmlReport(report);
    }

    calculateDegradation(times) {
        if (times.length < 2) return 0;
        
        const firstQuarter = times.slice(0, Math.floor(times.length / 4)) || [times[0]];
        const lastQuarter = times.slice(-Math.floor(times.length / 4)) || [times[times.length - 1]];
        
        const firstAvg = firstQuarter.reduce((a, b) => a + b, 0) / firstQuarter.length;
        const lastAvg = lastQuarter.reduce((a, b) => a + b, 0) / lastQuarter.length;
        
        return (((lastAvg - firstAvg) / firstAvg) * 100).toFixed(2);
    }

    generateRecommendations(analysis) {
        const recommendations = [];

        analysis.forEach(stat => {
            if (parseFloat(stat.average) > 2000) {
                recommendations.push({
                    severity: 'HIGH',
                    endpoint: stat.endpoint,
                    issue: `Average response time (${stat.average}ms) exceeds 2000ms threshold`,
                    recommendation: 'Consider caching or optimizing this endpoint'
                });
            }

            if (parseFloat(stat.degradation) > 20) {
                recommendations.push({
                    severity: 'MEDIUM',
                    endpoint: stat.endpoint,
                    issue: `Performance degradation of ${stat.degradation}% detected`,
                    recommendation: 'Investigate for memory leaks or resource exhaustion'
                });
            }

            if (stat.max > stat.average * 3) {
                recommendations.push({
                    severity: 'LOW',
                    endpoint: stat.endpoint,
                    issue: `Max response time (${stat.max}ms) is 3x average (${stat.average}ms)`,
                    recommendation: 'Check for intermittent issues or spikes'
                });
            }
        });

        return recommendations;
    }

    saveReport(report) {
        fs.writeFileSync(
            path.join('reports', 'performance-analysis.json'),
            JSON.stringify(report, null, 2)
        );
    }

    displayResults(report) {
        console.log('\n' + '='.repeat(70));
        console.log('🚀 PERFORMANCE TEST RESULTS');
        console.log('='.repeat(70));
        console.log(`Total Requests:       ${report.summary.totalRequests}`);
        console.log(`Total Iterations:     ${report.summary.totalIterations}`);
        console.log(`Total Time:           ${report.summary.totalTime}`);
        console.log(`Throughput:           ${report.summary.throughput}`);
        console.log(`Avg Response Time:    ${report.summary.averageResponseTime}`);
        console.log(`Tests Passed:         ${report.summary.passedTests}`);
        console.log(`Tests Failed:         ${report.summary.failedTests}`);
        console.log('-'.repeat(70));
        
        console.log('\n📊 ENDPOINT ANALYSIS:');
        report.endpointAnalysis.forEach(stat => {
            console.log(`\n${stat.endpoint}:`);
            console.log(`  Iterations:     ${stat.iterations}`);
            console.log(`  Average:        ${stat.average}ms`);
            console.log(`  Min:            ${stat.min}ms`);
            console.log(`  Max:            ${stat.max}ms`);
            console.log(`  Median:         ${stat.median}ms`);
            console.log(`  95th %ile:      ${stat.p95}ms`);
            console.log(`  Degradation:    ${stat.degradation}%`);
        });

        if (report.recommendations.length > 0) {
            console.log('\n⚠️  RECOMMENDATIONS:');
            report.recommendations.forEach((rec, index) => {
                console.log(`\n${index + 1}. [${rec.severity}] ${rec.endpoint}`);
                console.log(`   Issue: ${rec.issue}`);
                console.log(`   Action: ${rec.recommendation}`);
            });
        } else {
            console.log('\n✅ No performance issues detected!');
        }

        console.log('\n' + '='.repeat(70));
        console.log('📄 Detailed report saved to: reports/performance-analysis.json');
        console.log('📄 HTML report saved to: reports/performance-report.html');
        console.log('='.repeat(70) + '\n');
    }

    generateHtmlReport(report) {
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Performance Test Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; }
        .header h1 { font-size: 2em; margin-bottom: 10px; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .metric-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .metric-card h3 { color: #666; font-size: 0.9em; margin-bottom: 10px; text-transform: uppercase; }
        .metric-card .value { font-size: 1.8em; font-weight: bold; color: #333; }
        .metric-card.success .value { color: #4caf50; }
        .metric-card.danger .value { color: #f44336; }
        .section { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px; }
        .section h2 { margin-bottom: 15px; color: #333; }
        table { width: 100%; border-collapse: collapse; }
        table th { background: #f5f5f5; padding: 12px; text-align: left; font-weight: 600; }
        table td { padding: 12px; border-top: 1px solid #eee; }
        .recommendation { padding: 15px; border-left: 4px solid; margin-bottom: 10px; border-radius: 4px; }
        .recommendation.high { background: #ffebee; border-color: #f44336; }
        .recommendation.medium { background: #fff3e0; border-color: #ff9800; }
        .recommendation.low { background: #e8f5e9; border-color: #4caf50; }
        .severity { font-weight: bold; }
        .severity.high { color: #f44336; }
        .severity.medium { color: #ff9800; }
        .severity.low { color: #4caf50; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Performance Test Report</h1>
            <p>Load and stress testing results</p>
            <p style="font-size: 0.9em; margin-top: 5px;">Generated: ${new Date().toLocaleString()}</p>
        </div>

        <div class="metrics">
            <div class="metric-card">
                <h3>Total Requests</h3>
                <div class="value">${report.summary.totalRequests}</div>
            </div>
            <div class="metric-card">
                <h3>Iterations</h3>
                <div class="value">${report.summary.totalIterations}</div>
            </div>
            <div class="metric-card">
                <h3>Total Time</h3>
                <div class="value">${report.summary.totalTime}</div>
            </div>
            <div class="metric-card">
                <h3>Throughput</h3>
                <div class="value">${report.summary.throughput}</div>
            </div>
            <div class="metric-card">
                <h3>Avg Response</h3>
                <div class="value">${report.summary.averageResponseTime}</div>
            </div>
            <div class="metric-card ${report.summary.failedTests > 0 ? 'danger' : 'success'}">
                <h3>Tests Passed</h3>
                <div class="value">${report.summary.passedTests}/${report.summary.passedTests + report.summary.failedTests}</div>
            </div>
        </div>

        <div class="section">
            <h2>📊 Endpoint Performance Analysis</h2>
            <table>
                <thead>
                    <tr>
                        <th>Endpoint</th>
                        <th>Iterations</th>
                        <th>Avg (ms)</th>
                        <th>Min (ms)</th>
                        <th>Max (ms)</th>
                        <th>Median (ms)</th>
                        <th>P95 (ms)</th>
                        <th>Degradation (%)</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.endpointAnalysis.map(stat => `
                        <tr>
                            <td><strong>${stat.endpoint}</strong></td>
                            <td>${stat.iterations}</td>
                            <td>${stat.average}</td>
                            <td>${stat.min}</td>
                            <td>${stat.max}</td>
                            <td>${stat.median}</td>
                            <td>${stat.p95}</td>
                            <td>${stat.degradation}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        ${report.recommendations.length > 0 ? `
        <div class="section">
            <h2>⚠️ Recommendations</h2>
            ${report.recommendations.map(rec => `
                <div class="recommendation ${rec.severity.toLowerCase()}">
                    <div class="severity ${rec.severity.toLowerCase()}">[${rec.severity}] ${rec.endpoint}</div>
                    <div style="margin-top: 5px;"><strong>Issue:</strong> ${rec.issue}</div>
                    <div style="margin-top: 5px;"><strong>Recommendation:</strong> ${rec.recommendation}</div>
                </div>
            `).join('')}
        </div>
        ` : '<div class="section"><h2>✅ No Performance Issues Detected</h2><p>All endpoints are performing within acceptable thresholds.</p></div>'}
    </div>
</body>
</html>`;

        fs.writeFileSync(path.join('reports', 'performance-report.html'), html);
    }
}

// Run the analyzer
new PerformanceAnalyzer();