#!/bin/bash
API="http://localhost:3000/api"

echo "=== Login as Admin ==="
ADMIN_RES=$(curl -s -X POST $API/auth/login -H "Content-Type: application/json" -d '{"nim":"admin","password":"admin123"}')
ADMIN_TOKEN=$(echo $ADMIN_RES | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
echo "Admin token: ${ADMIN_TOKEN:0:20}..."

echo ""
echo "=== Admin accessing /reports/stats ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $API/reports/stats -H "Authorization: Bearer $ADMIN_TOKEN")
echo "HTTP $HTTP_CODE"
if [ "$HTTP_CODE" = "200" ]; then echo "  ✅ Admin can access stats"; else echo "  ❌ Expected 200"; fi

echo ""
echo "=== Login as Mahasiswa ==="
MHS_RES=$(curl -s -X POST $API/auth/login -H "Content-Type: application/json" -d '{"nim":"test123","password":"admin123"}')
MHS_TOKEN=$(echo $MHS_RES | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
echo "MHS token: ${MHS_TOKEN:0:20}..."

echo ""
echo "=== Mahasiswa accessing /reports (all) - should be forbidden ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $API/reports -H "Authorization: Bearer $MHS_TOKEN")
echo "HTTP $HTTP_CODE"
if [ "$HTTP_CODE" = "403" ]; then echo "  ✅ Mahasiswa correctly blocked from /reports"; else echo "  ❌ Expected 403 got $HTTP_CODE"; fi

echo ""
echo "=== Mahasiswa accessing /reports/stats - should be forbidden ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $API/reports/stats -H "Authorization: Bearer $MHS_TOKEN")
echo "HTTP $HTTP_CODE"
if [ "$HTTP_CODE" = "403" ]; then echo "  ✅ Mahasiswa correctly blocked from /stats"; else echo "  ❌ Expected 403 got $HTTP_CODE"; fi

echo ""
echo "=== Mahasiswa accessing /reports/my - should work ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $API/reports/my -H "Authorization: Bearer $MHS_TOKEN")
echo "HTTP $HTTP_CODE"
if [ "$HTTP_CODE" = "200" ]; then echo "  ✅ Mahasiswa can access /reports/my"; else echo "  ❌ Expected 200 got $HTTP_CODE"; fi

echo ""
echo "=== Login rate limiter test ==="
for i in $(seq 1 12); do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $API/auth/login \
    -H "Content-Type: application/json" \
    -d '{"nim":"admin","password":"wrongpass"}')
  if [ "$CODE" = "429" ]; then
    echo "  ✅ Rate limited after $i attempts (HTTP 429)"
    break
  fi
  if [ $i -eq 12 ]; then
    echo "  ❌ Rate limiter did not trigger after 12 attempts"
  fi
done
