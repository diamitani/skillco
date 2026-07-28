# AWS Security Scanning Infrastructure

## Overview

SkillCo uses AWS-powered security scanning to analyze every skill before it reaches the marketplace. This document outlines the architecture, components, and implementation details.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Skill Upload   │────▶│  S3 Bucket       │────▶│  Lambda Trigger │
│  (Web/App)      │     │  (skill-sources) │     │  (S3 Event)     │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                           │
                                                           ▼
                              ┌──────────────────────────────────────────┐
                              │  Security Scanning Pipeline                │
                              │  ┌─────────────────────────────────────┐   │
                              │  │  1. Dependency Analysis             │   │
                              │  │     - Extract package.json,        │   │
                              │  │       requirements.txt, etc.        │   │
                              │  │     - Scan with Snyk/OWASP         │   │
                              │  └─────────────────────────────────────┘   │
                              │  ┌─────────────────────────────────────┐   │
                              │  │  2. Static Analysis (CodeGuru)    │   │
                              │  │     - Code quality issues          │   │
                              │  │     - Security recommendations     │   │
                              │  └─────────────────────────────────────┘   │
                              │  ┌─────────────────────────────────────┐   │
                              │  │  3. Secret Detection                │   │
                              │  │     - API keys, tokens, passwords  │   │
                              │  │     - Custom regex patterns         │   │
                              │  └─────────────────────────────────────┘   │
                              │  ┌─────────────────────────────────────┐   │
                              │  │  4. AI Code Pattern Analysis        │   │
                              │  │     - Hallucination detection      │   │
                              │  │     - Unsafe code patterns          │   │
                              │  └─────────────────────────────────────┘   │
                              └──────────────────────────────────────────┘
                                                           │
                                                           ▼
                              ┌──────────────────────────────────────────┐
                              │  Results Processing                      │
                              │  - Calculate risk score                  │
                              │  - Generate report                       │
                              │  - Store in DynamoDB                       │
                              └──────────────────────────────────────────┘
                                                           │
                                                           ▼
                              ┌──────────────────────────────────────────┐
                              │  Marketplace Decision                  │
                              │  - Safe/Low: Auto-publish               │
                              │  - Medium: Manual review queue          │
                              │  - High/Critical: Quarantine            │
                              └──────────────────────────────────────────┘
```

## AWS Services Used

| Service | Purpose |
|---------|---------|
| **S3** | Store skill source code |
| **Lambda** | Run scanning pipeline |
| **CodeGuru** | Static code analysis |
| **Inspector** | Vulnerability scanning |
| **DynamoDB** | Store scan results |
| **EventBridge** | Trigger scans, schedule jobs |
| **SQS** | Queue for async processing |
| **SNS** | Notifications for findings |

## Risk Scoring

```typescript
interface RiskScore {
  level: 'safe' | 'low' | 'medium' | 'high' | 'critical'
  score: number // 0-100
  factors: RiskFactor[]
}

interface RiskFactor {
  category: 'dependencies' | 'code_quality' | 'secrets' | 'ai_patterns'
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  count: number
  weight: number
}

// Scoring algorithm
function calculateRiskScore(findings: SecurityFinding[]): RiskScore {
  const weights = {
    critical: 25,
    high: 10,
    medium: 3,
    low: 1,
    info: 0
  }
  
  let totalScore = 0
  const factors: RiskFactor[] = []
  
  // Group findings by category
  const byCategory = groupBy(findings, 'category')
  
  for (const [category, items] of Object.entries(byCategory)) {
    const bySeverity = groupBy(items, 'severity')
    let categoryScore = 0
    let categoryCount = 0
    let maxSeverity: string = 'info'
    
    for (const [severity, sevItems] of Object.entries(bySeverity)) {
      categoryScore += sevItems.length * weights[severity as keyof typeof weights]
      categoryCount += sevItems.length
      if (weights[severity as keyof typeof weights] > (weights[maxSeverity as keyof typeof weights] || 0)) {
        maxSeverity = severity
      }
    }
    
    factors.push({
      category: category as any,
      severity: maxSeverity as any,
      count: categoryCount,
      weight: categoryScore
    })
    
    totalScore += categoryScore
  }
  
  // Map score to level
  let level: RiskScore['level']
  if (totalScore === 0) level = 'safe'
  else if (totalScore <= 5) level = 'low'
  else if (totalScore <= 20) level = 'medium'
  else if (totalScore <= 50) level = 'high'
  else level = 'critical'
  
  return { level, score: Math.min(totalScore, 100), factors }
}
```

## Scanning Rules

### Dependency Vulnerabilities
- Check against CVE database
- Flag outdated dependencies
- Detect known vulnerable packages

### Secret Detection Patterns
```typescript
const secretPatterns = [
  { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/ },
  { name: 'AWS Secret Key', regex: /[0-9a-zA-Z/+=]{40}/ },
  { name: 'GitHub Token', regex: /gh[pousr]_[A-Za-z0-9_]{36,}/ },
  { name: 'Stripe Key', regex: /sk_live_[0-9a-zA-Z]{24,}/ },
  { name: 'Private Key', regex: /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'API Key Generic', regex: /['"\s][a-zA-Z0-9]{32,}['"\s]/ },
]
```

### AI Code Patterns
- Detect code that looks AI-generated but contains obvious errors
- Flag suspicious imports or dependencies
- Check for hardcoded values that should be configurable

## Implementation

### Lambda Function (scan-service)

```typescript
// src/scan-service/index.ts
import { S3Handler, S3Event } from 'aws-lambda'
import { S3 } from 'aws-sdk'
import { CodeGuru } from 'aws-sdk'
import { extractDependencies } from './dependency-analyzer'
import { detectSecrets } from './secret-detector'
import { calculateRiskScore } from './risk-calculator'
import { storeScanResult } from './scan-repository'

export const handler: S3Handler = async (event: S3Event) => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name
    const key = record.s3.object.key
    
    // 1. Download skill from S3
    const skillData = await downloadSkill(bucket, key)
    
    // 2. Extract and analyze dependencies
    const dependencies = await extractDependencies(skillData)
    const vulnFindings = await scanDependencies(dependencies)
    
    // 3. Run CodeGuru analysis
    const codeFindings = await runCodeGuruAnalysis(skillData)
    
    // 4. Detect secrets
    const secretFindings = await detectSecrets(skillData)
    
    // 5. AI pattern analysis
    const aiFindings = await analyzeAIPatterns(skillData)
    
    // 6. Combine and calculate risk
    const allFindings = [...vulnFindings, ...codeFindings, ...secretFindings, ...aiFindings]
    const riskScore = calculateRiskScore(allFindings)
    
    // 7. Store result
    await storeScanResult({
      skillId: extractSkillId(key),
      findings: allFindings,
      riskScore,
      scannedAt: new Date().toISOString(),
    })
    
    // 8. Trigger marketplace update
    await notifyMarketplace(skillId, riskScore)
  }
}
```

### CDK Stack

```typescript
// infrastructure/cdk/scan-service/stack.ts
import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs'
import * as events from 'aws-cdk-lib/aws-events'
import * as targets from 'aws-cdk-lib/aws-events-targets'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'

export class SecurityScanStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    
    // S3 bucket for skill sources
    const skillBucket = new s3.Bucket(this, 'SkillSources', {
      bucketName: 'skillco-skill-sources',
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
    })
    
    // DynamoDB table for scan results
    const scanTable = new dynamodb.Table(this, 'ScanResults', {
      tableName: 'skillco-scan-results',
      partitionKey: { name: 'skillId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'scanId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    })
    
    // Lambda function for scanning
    const scanFunction = new lambda.NodejsFunction(this, 'ScanFunction', {
      functionName: 'skillco-security-scanner',
      entry: './src/scan-service/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.minutes(5),
      memorySize: 2048,
      environment: {
        SCAN_TABLE_NAME: scanTable.tableName,
      },
    })
    
    // Grant permissions
    skillBucket.grantRead(scanFunction)
    scanTable.grantWriteData(scanFunction)
    
    // S3 event trigger
    scanFunction.addEventSource(new events.S3EventSource(skillBucket, {
      events: [s3.EventType.OBJECT_CREATED],
      filters: [{ prefix: 'uploads/' }],
    }))
  }
}
```

## API Endpoints

```typescript
// API routes for security scanning

// POST /api/scan/trigger
// Trigger a scan for a skill
// Body: { skillId: string }

// GET /api/scan/:skillId
// Get scan results for a skill
// Response: SecurityScan

// GET /api/scan/:skillId/report
// Get detailed scan report
// Response: { findings: SecurityFinding[], summary: object }

// POST /api/scan/webhook
// Webhook for CodeGuru/Inspector results
```

## Security Badge System

```typescript
// Risk level badges displayed in UI
const riskBadges = {
  safe: {
    color: 'bg-success/10 text-success',
    icon: CheckCircle,
    label: 'Security Verified',
  },
  low: {
    color: 'bg-success/10 text-success',
    icon: CheckCircle,
    label: 'Low Risk',
  },
  medium: {
    color: 'bg-warning/10 text-warning',
    icon: AlertTriangle,
    label: 'Medium Risk',
  },
  high: {
    color: 'bg-error/10 text-error',
    icon: AlertTriangle,
    label: 'High Risk',
  },
  critical: {
    color: 'bg-error/10 text-error',
    icon: AlertTriangle,
    label: 'Critical Issues',
  },
}
```

## Cost Estimation

| Component | Monthly Cost (estimated) |
|-----------|-------------------------|
| Lambda invocations | $50-100 |
| CodeGuru scans | $100-200 |
| S3 storage | $20-50 |
| DynamoDB | $30-50 |
| Inspector | $50-100 |
| **Total** | **$250-500** |

## Monitoring

- CloudWatch logs for all Lambda executions
- Metrics for scan duration, findings count, error rate
- Alerts for failed scans
- Dashboard for scan statistics

## Future Enhancements

1. **Deep Scan Mode**: Optional deeper analysis for enterprise customers
2. **Custom Rules**: Allow users to define their own security rules
3. **Auto-fix**: Suggest and apply automatic fixes for common issues
4. **Compliance**: SOC 2, GDPR, HIPAA compliance checks
5. **Integration**: Connect to external scanners (Snyk, SonarQube)

---

*Document Version: 1.0*
*Last Updated: 2026-07-28*
