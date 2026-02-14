#!/bin/bash
LOG="/tmp/narration-gen.log"
echo "=== Starting narration generation ===" > "$LOG"

CHAPTERS=(
  "d3bd8302-38d6-4969-82b2-9390f79c36df"
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

NAMES=(
  "Monetate 101"
  "Buyer Reality & ICP"
  "Platform Fundamentals"
  "Symphony: Personalization"
  "Maestro: Experimentation"
  "Overture: Search & Discovery"
  "Concierge & Delivery"
  "Solution Modules"
  "Vertical Selling"
  "Competitive & Differentiation"
  "Deal Execution"
  "AI Enablement"
)

for i in "${!CHAPTERS[@]}"; do
  CID="${CHAPTERS[$i]}"
  CNAME="${NAMES[$i]}"
  echo "[$(date)] Chapter $((i+1))/12: $CNAME ($CID)" | tee -a "$LOG"
  
  RESULT=$(curl -s -m 300 -X POST "http://localhost:5000/api/chapters/$CID/generate-narration" 2>&1)
  SUCCESS=$(echo "$RESULT" | node -e "try{const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log(d.success?'OK':'FAIL')}catch(e){console.log('ERROR')}")
  CACHED=$(echo "$RESULT" | node -e "try{const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log(d.cached?'YES':'NO')}catch(e){console.log('N/A')}")
  
  echo "  Result: $SUCCESS (cached: $CACHED)" | tee -a "$LOG"
  
  if [ "$SUCCESS" = "FAIL" ] || [ "$SUCCESS" = "ERROR" ]; then
    echo "  Error details: $(echo "$RESULT" | head -c 200)" | tee -a "$LOG"
  fi
  
  sleep 2
done

echo "[$(date)] === ALL DONE ===" | tee -a "$LOG"
