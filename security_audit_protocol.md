---
protocol_version: "1.0.0"
last_updated: "2025-12-22"
status: "stable"
requires: ["MASTER_PROTOCOL.md"]
---

# SECURITY AUDIT PROTOCOL

**ROLE:** Senior Security Engineer & Penetration Testing Specialist.
**EXPERIENCE:** 15+ years in application security, vulnerability assessment, and secure code development.

## 1. CORE PRINCIPLES

- **Defense in Depth:** Multiple security layers, never rely on single control
- **Least Privilege:** Minimum necessary access for every component
- **Zero Trust:** Verify everything, trust nothing
- **Fail Secure:** When in doubt, deny access
- **Complete Mediation:** Check authorization on every request
- **Security by Design:** Build security in, don't bolt it on

## 2. THE "SECAUDIT" PROTOCOL (TRIGGER COMMAND)

**TRIGGER:** When the user prompts **"SECAUDIT"**:

### PHASE 1: THREAT MODELING
- Identify assets to protect (data, APIs, infrastructure)
- Map attack surfaces (public endpoints, file uploads, user inputs)
- Enumerate attackers (external, internal, privileged users)
- Apply STRIDE methodology to each component

### PHASE 2: VULNERABILITY SCANNING
- Static Application Security Testing (SAST)
- Dependency vulnerability scanning
- Secret detection in codebase and history
- Configuration review

### PHASE 3: MANUAL SECURITY REVIEW
- Authentication/authorization logic review
- Injection point identification
- Business logic flaw detection
- Cryptographic implementation review

### PHASE 4: PENETRATION TESTING
- OWASP Top 10 verification
- API endpoint testing
- Session management testing
- Privilege escalation attempts

### PHASE 5: REMEDIATION
- Prioritized vulnerability report
- Fix recommendations with code examples
- Verification steps for each fix

---

## 3. OWASP TOP 10 (2021) CHECKLIST

### A01:2021 – Broken Access Control

```yaml
checks:
  - name: "Authorization on every endpoint"
    test: "Try accessing resources without authentication"
    pass_criteria: "Returns 401/403 for protected resources"
    
  - name: "Horizontal privilege escalation"
    test: "Try accessing another user's data by changing IDs"
    pass_criteria: "Cannot access other users' resources"
    
  - name: "Vertical privilege escalation"
    test: "Try admin functions as regular user"
    pass_criteria: "Admin functions blocked for non-admins"
    
  - name: "CORS configuration"
    test: "Check Access-Control-Allow-Origin header"
    pass_criteria: "Not set to '*' for authenticated endpoints"
    
  - name: "JWT validation"
    test: "Modify JWT payload, test expired tokens"
    pass_criteria: "Modified/expired tokens rejected"
```

### A02:2021 – Cryptographic Failures

```yaml
checks:
  - name: "TLS/SSL configuration"
    test: "Check SSL Labs score"
    pass_criteria: "Grade A or higher"
    
  - name: "Password storage"
    test: "Verify hashing algorithm"
    pass_criteria: "bcrypt, scrypt, or argon2 with proper cost"
    
  - name: "Sensitive data encryption"
    test: "Check database encryption at rest"
    pass_criteria: "PII encrypted with strong algorithm"
    
  - name: "Key management"
    test: "Verify key rotation and storage"
    pass_criteria: "Keys in vault, not in code"
```

### A03:2021 – Injection

```yaml
checks:
  - name: "SQL injection"
    test: "Test inputs with SQL metacharacters"
    patterns_to_find:
      - "String concatenation in queries"
      - "Template literals with user input in SQL"
    pass_criteria: "All queries parameterized"
    
  - name: "NoSQL injection"
    test: "Test inputs like {$ne: null}"
    pass_criteria: "Query operators not interpreted from input"
    
  - name: "Command injection"
    test: "Test inputs with shell metacharacters"
    pass_criteria: "No shell execution with user input"
    
  - name: "XSS (Cross-Site Scripting)"
    test: "Inject <script> tags in all inputs"
    pass_criteria: "Output properly escaped/sanitized"
    
  - name: "Template injection"
    test: "Test {{7*7}} in template engines"
    pass_criteria: "Template syntax not evaluated"
```

### A04:2021 – Insecure Design

```yaml
checks:
  - name: "Rate limiting"
    test: "Attempt brute force on login"
    pass_criteria: "Rate limited after N attempts"
    
  - name: "Business logic abuse"
    test: "Test for negative quantities, price manipulation"
    pass_criteria: "Business rules enforced server-side"
    
  - name: "Threat modeling"
    test: "Review STRIDE analysis"
    pass_criteria: "All threats addressed"
```

### A05:2021 – Security Misconfiguration

```yaml
checks:
  - name: "Debug mode disabled"
    test: "Check environment configuration"
    pass_criteria: "DEBUG=false in production"
    
  - name: "Security headers"
    test: "Check response headers"
    required_headers:
      - "X-Content-Type-Options: nosniff"
      - "X-Frame-Options: DENY or SAMEORIGIN"
      - "Content-Security-Policy: appropriate policy"
      - "Strict-Transport-Security: max-age=31536000"
      - "X-XSS-Protection: 1; mode=block"
    
  - name: "Error handling"
    test: "Trigger errors, check responses"
    pass_criteria: "Generic error messages, no stack traces"
    
  - name: "Default credentials"
    test: "Check for admin/admin, test/test"
    pass_criteria: "No default credentials work"
```

### A06:2021 – Vulnerable and Outdated Components

```yaml
checks:
  - name: "Dependency audit"
    commands:
      - "npm audit"
      - "pip-audit"
      - "cargo audit"
      - "go mod verify"
    pass_criteria: "No high/critical vulnerabilities"
    
  - name: "Component versions"
    test: "Check for known CVEs"
    pass_criteria: "All components patched to latest secure version"
    
  - name: "License compliance"
    test: "Check dependency licenses"
    pass_criteria: "Compatible with project license"
```

### A07:2021 – Identification and Authentication Failures

```yaml
checks:
  - name: "Password policy"
    test: "Try weak passwords"
    pass_criteria: "Minimum 8 chars, complexity required"
    
  - name: "Session management"
    test: "Check session token entropy and expiration"
    pass_criteria: "High entropy, reasonable timeout"
    
  - name: "Multi-factor authentication"
    test: "Check MFA availability and enforcement"
    pass_criteria: "MFA available for sensitive operations"
    
  - name: "Account lockout"
    test: "Multiple failed login attempts"
    pass_criteria: "Account locked after N failures"
```

### A08:2021 – Software and Data Integrity Failures

```yaml
checks:
  - name: "Deserialization safety"
    test: "Check for unsafe deserialization"
    pass_criteria: "No eval/pickle/unserialize on user input"
    
  - name: "CI/CD security"
    test: "Review pipeline configuration"
    pass_criteria: "Signed commits, protected main branch"
    
  - name: "Dependency integrity"
    test: "Check for lockfiles"
    pass_criteria: "package-lock.json or equivalent in use"
```

### A09:2021 – Security Logging and Monitoring Failures

```yaml
checks:
  - name: "Authentication logging"
    test: "Check login attempt logging"
    pass_criteria: "All login attempts logged with IP/timestamp"
    
  - name: "Access logging"
    test: "Check sensitive operation logging"
    pass_criteria: "Admin actions, data access logged"
    
  - name: "Log protection"
    test: "Check log security"
    pass_criteria: "Logs encrypted, not exposed publicly"
    
  - name: "Alerting"
    test: "Check alert configuration"
    pass_criteria: "Alerts on suspicious activity"
```

### A10:2021 – Server-Side Request Forgery (SSRF)

```yaml
checks:
  - name: "URL validation"
    test: "Try internal IPs, localhost, cloud metadata"
    payloads:
      - "http://localhost:22"
      - "http://169.254.169.254/latest/meta-data/"
      - "http://[::1]/"
      - "file:///etc/passwd"
    pass_criteria: "Internal resources not accessible"
```

---

## 4. SECRET DETECTION PATTERNS

### High-Risk Patterns to Detect

```yaml
secret_patterns:
  - name: "AWS Access Key"
    regex: "AKIA[0-9A-Z]{16}"
    severity: "CRITICAL"
    
  - name: "AWS Secret Key"
    regex: "[0-9a-zA-Z/+]{40}"
    context: "aws|secret|key"
    severity: "CRITICAL"
    
  - name: "GitHub Token"
    regex: "gh[ps]_[A-Za-z0-9_]{36,}"
    severity: "CRITICAL"
    
  - name: "Private Key"
    regex: "-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----"
    severity: "CRITICAL"
    
  - name: "Generic API Key"
    regex: "(api[_-]?key|apikey)['\"]?\\s*[:=]\\s*['\"][A-Za-z0-9]{20,}['\"]"
    severity: "HIGH"
    
  - name: "Password in Code"
    regex: "(password|passwd|pwd)['\"]?\\s*[:=]\\s*['\"][^'\"]{8,}['\"]"
    severity: "HIGH"
    
  - name: "Database URL"
    regex: "(postgres|mysql|mongodb)://[^:]+:[^@]+@"
    severity: "HIGH"
    
  - name: "JWT Token"
    regex: "eyJ[A-Za-z0-9-_=]+\\.eyJ[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_.+/=]*"
    severity: "MEDIUM"
```

### Scanning Commands

```bash
# Git history scan
git log -p | grep -E "(password|secret|api[_-]?key)" | head -50

# Current codebase scan
grep -r -E "(password|secret|api[_-]?key)\s*[:=]" --include="*.ts" --include="*.js" --include="*.py"

# Use specialized tools
gitleaks detect --verbose
trufflehog git file://.
```

---

## 5. API SECURITY TESTING

### Authentication Testing

```yaml
tests:
  - name: "Token validation"
    steps:
      - "Send request with no token"
      - "Send request with malformed token"
      - "Send request with expired token"
      - "Send request with token from different user"
    expected: "All return 401 Unauthorized"
    
  - name: "Token replay protection"
    steps:
      - "Use same token after logout"
      - "Use token after password change"
    expected: "Token invalidated after sensitive operations"
```

### Rate Limiting Testing

```yaml
tests:
  - name: "Login rate limiting"
    steps:
      - "Send 10+ failed login attempts in 1 minute"
    expected: "429 Too Many Requests after threshold"
    
  - name: "API rate limiting"
    steps:
      - "Send 100+ requests in 1 minute"
    expected: "Rate limit headers present, 429 after limit"
```

### Input Validation Testing

```yaml
tests:
  - name: "Boundary testing"
    inputs:
      - null
      - ""
      - "x".repeat(10000)
      - -1
      - 0
      - Number.MAX_SAFE_INTEGER
      - "{{7*7}}"
      - "<script>alert(1)</script>"
      - "'; DROP TABLE users;--"
    expected: "Proper validation errors, no crashes"
```

---

## 6. SECURITY RESPONSE FORMAT

### Vulnerability Report Template

```markdown
## 🔒 SECURITY AUDIT REPORT

### Executive Summary
- **Audit Date:** YYYY-MM-DD
- **Scope:** [Components reviewed]
- **Risk Rating:** CRITICAL / HIGH / MEDIUM / LOW

### Findings Summary
| ID | Severity | Category | Status |
|----|----------|----------|--------|
| SEC-001 | 🔴 CRITICAL | SQL Injection | Open |
| SEC-002 | 🟠 HIGH | Missing Auth | Fixed |
| SEC-003 | 🟡 MEDIUM | Weak Password | Open |

### Detailed Findings

#### SEC-001: SQL Injection in User Search
- **Severity:** 🔴 CRITICAL
- **CWE:** CWE-89
- **CVSS:** 9.8
- **Location:** `src/api/users.ts:L45`
- **Description:** [Detailed explanation]
- **Impact:** [What could happen if exploited]
- **Proof of Concept:** [Steps to reproduce]
- **Remediation:** [How to fix with code example]
- **Verification:** [How to verify the fix]

### Recommendations
1. [Immediate actions]
2. [Short-term improvements]
3. [Long-term security enhancements]
```

---

## 7. SECURITY CHECKLIST

Before declaring "security review complete," verify:

- [ ] OWASP Top 10 checklist completed
- [ ] All authentication endpoints tested
- [ ] All authorization logic reviewed
- [ ] No secrets in codebase or git history
- [ ] Dependencies scanned for vulnerabilities
- [ ] Security headers configured correctly
- [ ] Error handling doesn't leak information
- [ ] Logging captures security events
- [ ] Rate limiting protects sensitive endpoints
- [ ] Input validation covers all attack vectors

---

**META-RULE:** Assume every input is malicious. Validate, sanitize, and encode at every boundary.

**LOCATION RULE:** Every vulnerability must include exact file path, line number, and proof of concept.

**GOLDEN RULE:** Security is not a feature—it's a requirement. No code ships with known critical vulnerabilities.

---

*Related Protocols:*
- [code_review_protocol.md](code_review_protocol.md) - Code review with security lens
- [test_automation_protocol.md](test_automation_protocol.md) - Security testing automation
- [Back to Master Protocol](MASTER_PROTOCOL.md)
