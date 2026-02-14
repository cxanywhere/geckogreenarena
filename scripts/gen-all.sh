#!/bin/bash
LOG="/tmp/narration-progress.log"

gen_slide() {
  local CID=$1
  local CNAME=$2
  local SLIDE=$3
  local TOTAL=$4
  
  echo "[$(date +%H:%M:%S)] $CNAME slide $((SLIDE+1))/$TOTAL..." | tee -a "$LOG"
  
  for attempt in 1 2 3; do
    RESULT=$(curl -s -m 120 -X POST "http://localhost:5000/api/chapters/$CID/generate-narration/$SLIDE" 2>&1)
    SUCCESS=$(echo "$RESULT" | node -e "try{const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log(d.success?'OK':'FAIL')}catch(e){console.log('ERROR')}" 2>/dev/null)
    
    if [ "$SUCCESS" = "OK" ]; then
      echo "  OK" | tee -a "$LOG"
      return 0
    fi
    
    echo "  Attempt $attempt failed, waiting 5s..." | tee -a "$LOG"
    sleep 5
  done
  
  echo "  FAILED after 3 attempts" | tee -a "$LOG"
  return 1
}

echo "=== Narration Generation $(date) ===" > "$LOG"

declare -A CHAPTERS
CHAPTERS[9e785753-4738-4434-a074-15b143ab8c22]="Buyer Reality & ICP|8"
CHAPTERS[a82486de-e936-4ecd-8d3e-4d2346609814]="Platform Fundamentals|7"
CHAPTERS[11b09918-cc13-4cb7-92e7-2ba109f6c000]="Symphony Personalization|5"
CHAPTERS[2a1a2884-96ec-43a9-a99b-c4cc04b46a9a]="Maestro Experimentation|7"
CHAPTERS[de86a58e-ac50-4a6c-a8bb-42a73fc22f49]="Overture Search|4"
CHAPTERS[649f9115-da4c-45ae-8bdd-4bbfc84396e2]="Concierge Delivery|4"
CHAPTERS[4f1bedb6-d8df-462a-b610-57f1ab140d0e]="Solution Modules|8"
CHAPTERS[fa06eb7c-0584-4e02-93cb-1e43a6df5597]="Vertical Selling|12"
CHAPTERS[0b274306-6ad3-46e4-a832-d96437dc135d]="Competitive Differentiation|4"
CHAPTERS[7653246b-2255-4996-b2d5-5f0f80e5c952]="Deal Execution|7"
CHAPTERS[4f0707f9-4740-4393-9bf4-5ffc05e2eee0]="AI Enablement|3"

ORDER=(
  "9e785753-4738-4434-a074-15b143ab8c22"
  "a82486de-e936-4ecd-8d3e-4d2346609814"
  "11b09918-cc13-4cb7-92e7-2ba109f6c000"
  "2a1a2884-96ec-43a9-a99b-c4cc04b46a9a"
  "de86a58e-ac50-4a6c-a8bb-42a73fc22f49"
  "649f9115-da4c-45ae-8bdd-4bbfc84396e2"
  "4f1bedb6-d8df-462a-b610-57f1ab140d0e"
  "fa06eb7c-0584-4e02-93cb-1e43a6df5597"
  "0b274306-6ad3-46e4-a832-d96437dc135d"
  "7653246b-2255-4996-b2d5-5f0f80e5c952"
  "4f0707f9-4740-4393-9bf4-5ffc05e2eee0"
)

TOTAL_DONE=0
TOTAL_FAIL=0

for CID in "${ORDER[@]}"; do
  IFS='|' read -r CNAME SLIDE_COUNT <<< "${CHAPTERS[$CID]}"
  echo "" | tee -a "$LOG"
  echo "[CHAPTER] $CNAME ($SLIDE_COUNT slides)" | tee -a "$LOG"
  
  for ((s=0; s<SLIDE_COUNT; s++)); do
    gen_slide "$CID" "$CNAME" "$s" "$SLIDE_COUNT"
    if [ $? -eq 0 ]; then
      TOTAL_DONE=$((TOTAL_DONE+1))
    else
      TOTAL_FAIL=$((TOTAL_FAIL+1))
    fi
    sleep 1
  done
done

echo "" | tee -a "$LOG"
echo "=== COMPLETE: $TOTAL_DONE done, $TOTAL_FAIL failed ===" | tee -a "$LOG"
