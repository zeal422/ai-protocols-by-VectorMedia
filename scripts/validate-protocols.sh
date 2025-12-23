#!/bin/bash
###############################################################################
# Protocol Validation Script (Bash)
# Verifies ai-protocols setup on Unix-like systems
###############################################################################

set -e

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

check_dir() {
    local dir=$1
    if [ -d "$dir" ]; then
        return 0
    else
        return 1
    fi
}

log "$BLUE" "\n🔍 ai-protocols Validation\n"

# Check core files
log "$BLUE" "📋 Core Files:"
check_file "MASTER_PROTOCOL.md"
check_file "README.md"
check_file "IMPLEMENT_IMPROVEMENTS_PLAN.md"

# Check BRAIN protocols
log "$BLUE" "\n🧠 BRAIN Protocols:"
protocol_count=0
for protocol in code_review_protocol.md debug_protocol.md error_fix_protocol.md \
                test_automation_protocol.md moreFRONTend-PROTOCOL.md \
                FRONTandBACKend-PROTOCOL.md security_audit_protocol.md \
                accessibility_protocol.md performance_protocol.md; do
    total=$((total + 1))
    if [ -f "BRAIN/$protocol" ]; then
        protocol_count=$((protocol_count + 1))
        score=$((score + 1))
    fi
done
log "$GREEN" "  $protocol_count/15 protocols present"

# Check documentation
log "$BLUE" "\n📚 Documentation:"
check_file "docs/COMMANDS.md" || true
check_file "docs/QUICK_REFERENCE.md" || true
check_file "docs/CHANGELOG.md" || true

# Check examples
log "$BLUE" "\n💡 Examples:"
if check_file "examples/node-express/package.json"; then :; else log "$YELLOW" "  ⚠️  Node.js example incomplete"; fi
if check_file "examples/react-typescript/package.json"; then :; else log "$YELLOW" "  ⚠️  React example incomplete"; fi

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
