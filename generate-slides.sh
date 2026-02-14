#!/bin/bash

CHAPTERS=(
  "d3bd8302-38d6-4969-82b2-9390f79c36df:6:Monetate 101"
  "9e785753-4738-4434-a074-15b143ab8c22:8:Buyer Reality"
  "a82486de-e936-4ecd-8d3e-4d2346609814:7:Platform Fundamentals"
  "11b09918-cc13-4cb7-92e7-2ba109f6c000:5:Symphony"
  "2a1a2884-96ec-43a9-a99b-c4cc04b46a9a:7:Maestro"
  "de86a58e-ac50-4a6c-a8bb-42a73fc22f49:4:Overture"
  "649f9115-da4c-45ae-8bdd-4bbfc84396e2:4:Concierge"
  "4f1bedb6-d8df-462a-b610-57f1ab140d0e:8:Solution Modules"
  "fa06eb7c-0584-4e02-93cb-1e43a6df5597:12:Vertical Selling"
  "0b274306-6ad3-46e4-a832-d96437dc135d:4:Competitive"
  "7653246b-2255-4996-b2d5-5f0f80e5c952:7:Deal Execution"
  "4f0707f9-4740-4393-9bf4-5ffc05e2eee0:3:AI Enablement"
)

TOTAL=0
GENERATED=0
SKIPPED=0
FAILED=0

for entry in "${CHAPTERS[@]}"; do
  IFS=':' read -r id count name <<< "$entry"
  echo ""
  echo "=== Chapter: $name ($count slides) ==="
  
  for ((i=0; i<count; i++)); do
    TOTAL=$((TOTAL + 1))
    echo -n "  Slide $((i+1))/$count: "
    
    RESULT=$(curl -s --max-time 120 -X POST "http://localhost:5000/api/chapters/$id/generate-slide/$i" 2>&1)
    
    if echo "$RESULT" | grep -q '"skipped":true'; then
      echo "SKIPPED (already done)"
      SKIPPED=$((SKIPPED + 1))
    elif echo "$RESULT" | grep -q '"success":true'; then
      URL=$(echo "$RESULT" | grep -o '"imageUrl":"[^"]*"' | cut -d'"' -f4)
      echo "OK -> $URL"
      GENERATED=$((GENERATED + 1))
    else
      echo "FAILED: $RESULT"
      FAILED=$((FAILED + 1))
      sleep 10
    fi
    
    sleep 3
  done
done

echo ""
echo "========================================"
echo "COMPLETE: Total=$TOTAL Generated=$GENERATED Skipped=$SKIPPED Failed=$FAILED"
echo "========================================"
