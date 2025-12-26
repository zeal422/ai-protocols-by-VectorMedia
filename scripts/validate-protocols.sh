#!/bin/bash
###############################################################################
# Protocol Validation Script (Bash)
# Verifies ai-protocols setup on Unix-like systems
###############################################################################

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

score=0
total=0
declare -a issues=()

log() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

check_file() {
    local file=$1
    total=$((total + 1))
    if [ -f "$file" ]; then
        log "$GREEN" "  ✅ $file"
        score=$((score + 1))
        return 0
    else
        log "$RED" "  ❌ $file"
        issues+=("Missing file: $file")
        return 1
    fi
}

log "$BLUE" "\n🔍 ai-protocols Validation\n"

# 1. Check core files
log "$BLUE" "📋 Core Files:"
check_file "README.md"
check_file "HOW_TO_USE.md"

# 2. Check BRAIN protocols
log "$BLUE" "\n🧠 BRAIN Protocols:"
protocol_count=0
protocols=(
    "MASTER_PROTOCOL.md"
    "mdap_protocol.md"
    "code_review_protocol.md"
    "debug_protocol.md"
    "error_fix_protocol.md"
    "test_automation_protocol.md"
    "moreFRONTend-PROTOCOL.md"
    "FRONTandBACKend-PROTOCOL.md"
    "bigpappa_protocol_reviewANDfixes.md"
    "codebase_indexing_protocol.md"
    "security_audit_protocol.md"
    "accessibility_protocol.md"
    "performance_protocol.md"
    "refactor_protocol.md"
    "api_design_protocol.md"
    "git_workflow_protocol.md"
    "OPTIMIZED_LINT_SETUP.md"
    "aria_accessibility_protocol.md"
    "best_practices_protocol.md"
)

for protocol in "${protocols[@]}"; do
    total=$((total + 1))
    if [ -f "BRAIN/$protocol" ]; then
        protocol_count=$((protocol_count + 1))
        score=$((score + 1))
    else
        issues+=("Missing protocol: BRAIN/$protocol")
    fi
done
if [ $protocol_count -eq ${#protocols[@]} ]; then
    protocol_color=$GREEN
else
    protocol_color=$YELLOW
fi
log "$protocol_color" "  $protocol_count/${#protocols[@]} protocols present"

# 3. Check documentation
log "$BLUE" "\n📚 Documentation:"
check_file "docs/COMMANDS.md"
check_file "docs/UNIVERSAL_INTEGRATION.md"
check_file "docs/CHANGELOG.md"
check_file "docs/FAQ.md"
check_file "docs/TROUBLESHOOTING.md"
check_file "docs/SCENARIOS.md"
check_file "docs/CASE_STUDIES.md"
check_file "docs/QUICK_START.md"
check_file "docs/QUICK_REFERENCE.md"

# 4. Check examples
log "$BLUE" "\n💡 Examples:"
check_file "examples/node-express/package.json"
check_file "examples/react-typescript/package.json"

# 5. Check configurations
log "$BLUE" "\n⚙️  Configuration Templates:"
check_file "configurations/cursor/.cursorrules"
check_file "configurations/cline/.clinerules"
check_file "configurations/eslint.config.js"
check_file "configurations/prettier.config.js"

# IDE detection
log "$BLUE" "\n🔧 IDE Integration:"
ide_detected=false
[ -f ".cursorrules" ] && { log "$GREEN" "  ✅ Cursor (.cursorrules)"; ide_detected=true; }
[ -f ".clinerules" ] && { log "$GREEN" "  ✅ Cline (.clinerules)"; ide_detected=true; }
[ -f ".github/copilot-instructions.md" ] && { log "$GREEN" "  ✅ GitHub Copilot"; ide_detected=true; }

if [ "$ide_detected" = false ]; then
    log "$YELLOW" "  ⚠️  No IDE configuration detected"
fi

# Summary
log "$BLUE" "\n$(printf '=%.0s' {1..50})"
percentage=$((score * 100 / total))

if [ $percentage -ge 80 ]; then
    status="${GREEN}✅ GOOD${NC}"
elif [ $percentage -ge 60 ]; then
    status="${YELLOW}⚠️  NEEDS IMPROVEMENT${NC}"
else
    status="${RED}❌ INCOMPLETE${NC}"
fi

echo -e "\nValidation Score: $score/$total ($percentage%)"
echo -e "Status: $status\n"

# Exit with appropriate code
[ $percentage -ge 80 ] && exit 0 || exit 1