🚀 Postman API Automation & Performance Testing Framework

A complete, production‑grade API automation and performance testing framework built using Postman, Newman, and custom Node.js reporters.
This project demonstrates:
- Full CRUD testing
- Workflow‑based scenarios
- Dynamic data generation
- HTML reporting
- Performance dashboards
- Threshold validation
- Trend analysis
- CI/CD integration
Designed for real‑world QA engineering, SDET practice, and portfolio demonstration.

📁 Project Overview
This framework tests the JSONPlaceholder REST API using four structured test suites:
1. Individual Tests
11 requests • ~80 tests
Covers GET/POST/PUT/PATCH/DELETE with dynamic data, validation, and schema checks.
2. CRUD Workflow
5 requests • ~25 tests
End‑to‑end lifecycle: GET → UPDATE → VERIFY → DELETE → CREATE.
3. User Posts Workflow
4 requests • ~18 tests
User → Posts → Create → Cleanup.
4. Comments Workflow
4 requests • ~16 tests
Post → Comments → Add → Delete.
Total: 139 tests across 24 requests.

✨ Key Features
🔧 Automation Features
- Dynamic test data generation
- Request chaining across workflows
- Reusable pre‑request and test scripts
- Detailed logging and assertions
- Email, URL, ID, and schema validation
- Professional folder structure

📊 Reporting Features
- Beautiful HTML test reports
- Environment‑specific reports (dev/staging/prod)
- Custom performance dashboard
- Trend analysis across runs
- Threshold validation (P95, max, avg, throughput)
- Response time charts (Chart.js)
- Historical performance snapshots

🚀 CI/CD Features
- GitHub Actions pipeline
- Automated test execution
- HTML report artifacts
- Status badges
- Node.js 18 compatibility

🏗️ Project Structure
postman-api-automation/
├── collections/               # Postman collections (4 suites)
├── environments/              # Dev, staging, prod environments
├── scripts/                   # Pre-request & test scripts
├── reporters/                 # Custom Newman reporters
│   ├── reporters.custom-reporter.js
│   ├── analyze-performance.js
│   └── coverage-metrics.js
├── reports/                   # HTML & JSON reports
├── test-data/                 # Dynamic & static test data
├── .github/workflows/         # CI/CD pipeline
└── README.md

⚙️ Installation
git clone https://github.com/kirstyaameredith/postman-api-automation.git
cd postman-api-automation
npm install --legacy-peer-deps

🧪 Running Tests

Run all tests: 
npm test

Run specific suites:
npm run test:individual
npm run test:workflow
npm run test:user-posts
npm run test:comments

Run with HTML reports:
npm run test:report

Verbose mode:
npm run test:verbose

Reports are generated in: /reports

⚡ Performance Testing

Run performance tests:
npm run test:perf:light     # 10 iterations
npm run test:perf           # 50 iterations
npm run test:perf:heavy     # 100 iterations
npm run test:perf:stress    # 200 iterations + delay

Analyze performance:
npm run perf:analyze

Performance Reports Generated
| File | Description  | 
| performance-results.json | Raw Newman output | 
| performance-analysis.json | Percentiles, throughput, degradation | 
| performance-report.html | Full dashboard (thresholds, trends, charts) | 
| history/*.json | Historical snapshots for trend comparison | 

📈 Advanced Performance Dashboard
Custom reporter generates a full performance engineering dashboard including:


