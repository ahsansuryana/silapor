#!/bin/bash
echo "=== Test 1: Root endpoint ==="
curl -s http://localhost:3000/
echo ""
echo "=== Test 2: Login via localhost ==="
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nim":"test123","password":"admin123"}'
echo ""
echo "=== Done ==="
