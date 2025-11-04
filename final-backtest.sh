#!/bin/bash

echo "�� COMPREHENSIVE BACKTEST - FindMyFade"
echo "======================================"
echo ""

# Test 1: Database Connection
echo "📝 TEST 1: Database Connection"
node test-db-connection.js 2>&1 | grep -E "(✅|❌|🎉)" | head -10
echo ""

# Test 2: Health API
echo "📝 TEST 2: Health API"
curl -s "http://localhost:3000/api/health?t=$(date +%s)" | python3 -c "import sys, json; data=json.load(sys.stdin); print(f\"✅ Status: {data['status']}\"); print(f\"✅ Database: {data['database']}\"); print(f\"✅ Type: {data['databaseType']}\"); print(f\"✅ Users: {data['stats']['users']}, Barbers: {data['stats']['barbers']}\")"
echo ""

# Test 3: Authentication
echo "📝 TEST 3: Authentication System"
node test-auth.js 2>&1 | grep -E "(✅|❌|TEST|Passed|Failed)" | tail -15
echo ""

# Test 4: Barbers API
echo "📝 TEST 4: Barbers API"
curl -s http://localhost:3000/api/barbers | python3 -c "import sys, json; data=json.load(sys.stdin); print(f\"✅ API Response: {len(data['barbers'])} barbers found\")"
echo ""

echo "======================================"
echo "🎉 BACKTEST COMPLETE"
echo "======================================"
