###############################################################################
# Protocol Validation Script (PowerShell)
# Verifies ai-protocols setup on Windows
###############################################################################

$score = 0
$total = 0
$issues = @()

function Write-Color {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Test-FileExists {
    param([string]$Path)
    $script:total++
    if (Test-Path $Path) {
        Write-Color "  ✅ $Path" "Green"
        $script:score++
        return $true
    } else {
        Write-Color "  ❌ $Path" "Red"
        $script:issues += "Missing file: $Path"
        return $false
    }
}

Write-Color "`n🔍 ai-protocols Validation`n" "Cyan"

# 1. Check core files
Write-Color "📋 Core Files:" "Cyan"
Test-FileExists "README.md"
Test-FileExists "HOW_TO_USE.md"

# 2. Check BRAIN protocols
Write-Color "`n🧠 BRAIN Protocols:" "Cyan"
$protocols = @(
    "MASTER_PROTOCOL.md",
    "mdap_protocol.md",
    "code_review_protocol.md",
    "debug_protocol.md",
    "error_fix_protocol.md",
    "test_automation_protocol.md",
    "moreFRONTend-PROTOCOL.md",
    "FRONTandBACKend-PROTOCOL.md",
    "bigpappa_protocol_reviewANDfixes.md",
    "codebase_indexing_protocol.md",
    "security_audit_protocol.md",
    "accessibility_protocol.md",
    "performance_protocol.md",
    "refactor_protocol.md",
    "api_design_protocol.md",
    "git_workflow_protocol.md",
    "OPTIMIZED_LINT_SETUP.md",
    "aria_accessibility_protocol.md",
    "best_practices_protocol.md"
)

$protocolCount = 0
foreach ($protocol in $protocols) {
    $script:total++
    if (Test-Path "BRAIN\$protocol") {
        $protocolCount++
        $script:score++
    } else {
        $script:issues += "Missing protocol: BRAIN\$protocol"
    }
}
$protocolColor = if ($protocolCount -eq $protocols.Count) { "Green" } else { "Yellow" }
Write-Color "  $protocolCount/$($protocols.Count) protocols present" $protocolColor

# 3. Check documentation
Write-Color "`n📚 Documentation:" "Cyan"
Test-FileExists "docs\COMMANDS.md"
Test-FileExists "docs\UNIVERSAL_INTEGRATION.md"
Test-FileExists "docs\CHANGELOG.md"
Test-FileExists "docs\FAQ.md"
Test-FileExists "docs\TROUBLESHOOTING.md"
Test-FileExists "docs\SCENARIOS.md"
Test-FileExists "docs\CASE_STUDIES.md"
Test-FileExists "docs\QUICK_START.md"
Test-FileExists "docs\QUICK_REFERENCE.md"

# 4. Check examples
Write-Color "`n💡 Examples:" "Cyan"
Test-FileExists "examples\node-express\package.json"
Test-FileExists "examples\react-typescript\package.json"

# 5. Check configurations
Write-Color "`n⚙️  Configuration Templates:" "Cyan"
Test-FileExists "configurations\cursor\.cursorrules"
Test-FileExists "configurations\cline\.clinerules"
Test-FileExists "configurations\eslint.config.js"
Test-FileExists "configurations\prettier.config.js"

# IDE detection
Write-Color "`n🔧 IDE Integration:" "Cyan"
$ideDetected = $false
if (Test-Path ".cursorrules") { 
    Write-Color "  ✅ Cursor (.cursorrules)" "Green"
    $ideDetected = $true
}
if (Test-Path ".clinerules") {
    Write-Color "  ✅ Cline (.clinerules)" "Green"
    $ideDetected = $true
}
if (Test-Path ".github\copilot-instructions.md") { 
    Write-Color "  ✅ GitHub Copilot" "Green"
    $ideDetected = $true
}

if (-not $ideDetected) {
    Write-Color "  ⚠️  No IDE configuration detected" "Yellow"
}

# Summary
Write-Color ("`n" + ("=" * 50)) "Cyan"
$percentage = [math]::Round(($score / $total) * 100)

$statusText = if ($percentage -ge 80) { "✅ GOOD" }
              elseif ($percentage -ge 60) { "⚠️  NEEDS IMPROVEMENT" }
              else { "❌ INCOMPLETE" }
$statusColor = if ($percentage -ge 80) { "Green" }
               elseif ($percentage -ge 60) { "Yellow" }
               else { "Red" }

Write-Host "`nValidation Score: $score/$total ($percentage%)"
Write-Color "Status: $statusText`n" $statusColor

# Recommendations
if ($issues.Count -gt 0) {
    Write-Color "💡 Recommendations:" "Yellow"
    foreach ($issue in $issues) {
        Write-Color "  • $issue" "Yellow"
    }
    Write-Host ""
}

# Exit with appropriate code
if ($percentage -ge 80) { exit 0 } else { exit 1 }