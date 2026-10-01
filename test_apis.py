"""
Test all backend APIs and verify data
"""
import urllib.request
import json

base = "http://127.0.0.1:5000"
endpoints = [
    "/",
    "/api/dashboard/stats",
    "/api/cases",
    "/api/evidence",
    "/api/videos",
    "/api/tamper",
    "/api/timeline/1",
    "/api/custody/1",
    "/api/reports",
    "/api/vendors",
    "/api/audit/stream"
]

print("Testing backend endpoints:")
for ep in endpoints:
    try:
        url = base + ep
        req = urllib.request.urlopen(url)
        data = req.read()
        print(f"[{req.status}] {ep} -> {len(data)} bytes")
        if ep.startswith("/api/"):
            parsed = json.loads(data.decode('utf-8'))
            if isinstance(parsed, list):
                print(f"       items: {len(parsed)}")
            elif isinstance(parsed, dict):
                print(f"       keys: {list(parsed.keys())[:5]}")
    except Exception as e:
        print(f"[FAIL] {ep}: {e}")
