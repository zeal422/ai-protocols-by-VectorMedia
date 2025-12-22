###############################################################################
# Protocol Validation Script (PowerShell)
# Verifies AI Development Protocols setup on Windows
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

Write-Color "`n🔍 AI Development Protocols Validation`n" "Cyan"

# Check core files
Write-Color "📋 Core Files:" "Cyan"
Test-FileExists "MASTER_PROTOCOL.md"
Test-FileExists "README.md"
Test-FileExists "IMPLEMENT_IMPROVEMENTS_PLAN.md"

# Check BRAIN protocols
Write-Color "`n🧠 BRAIN Protocols:" "Cyan"
$protocols = @(
    "code_review_protocol.md",
    "debug_protocol.md",
    "error_fix_protocol.md",
    "test_automation_protocol.md",
    "moreFRONTend-PROTOCOL.md",
    "FRONTandBACKend-PROTOCOL.md",
    "security_audit_protocol.md",
    "accessibility_protocol.md",
    "performance_protocol.md"
)

$protocolCount = 0
foreach ($protocol in $protocols) {
    $script:total++
    if (Test-Path "BRAIN\$protocol") {
        $protocolCount++
        $script:score++
    }
}
Write-Color "  $protocolCount/$($protocols.Count) protocols present" "Green"

# Check documentation
Write-Color "`n📚 Documentation:" "Cyan"
Test-FileExists "docs\COMMANDS.md"
Test-FileExists "docs\QUICK_REFERENCE.md"
Test-FileExists "docs\CHANGELOG.md"

# Check examples
Write-Color "`n💡 Examples:" "Cyan"
if (-not (Test-FileExists "examples\node-express\package.json")) {
    Write-Color "  ⚠️  Node.js example incomplete" "Yellow"
}
if (-not (Test-FileExists "examples\react-typescript\package.json")) {
    Write-Color "  ⚠️  React example incomplete" "Yellow"
}

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

$status = if ($percentage -ge 80) {
    "Green"; "✅ GOOD"
} elseif ($percentage -ge 60) {
    "Yellow"; "⚠️  NEEDS IMPROVEMENT"
} else {
    "Red"; "❌ INCOMPLETE"
}

Write-Host "`nValidation Score: $score/$total ($percentage%)"
Write-Color "Status: $($status[1])`n" $status[0]

# Recommendations
if ($issues.Count -gt 0) {
    Write-Color "💡 Recommendations:" "Yellow"
    foreach ($issue in $issues) {
        Write-Color "  • $issue" "Yellow"
    }
    Write-Host ""
}

# Exit with appropriate code
if ($percentage -ge 80) {
    exit 0
} else {
    exit 1
}
