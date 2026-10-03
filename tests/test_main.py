import os
import pytest
from fastapi.testclient import TestClient
from app.main import app, init_db

# Ensure DB is created for tests
os.environ["DATA_DIR"] = "./data"
init_db()

client = TestClient(app)

def test_healthz():
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json()["ok"] is True

def test_scan_api():
    response = client.post("/api/scan", json={"text": "Please share your OTP.", "lang": "en"})
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "scam"
    assert "OTP" in data["reasons"][0]

def test_drill_api_start():
    response = client.post("/api/drill", json={"scenario": "phishing", "step": 0})
    assert response.status_code == 200
    data = response.json()
    assert data["done"] is False
    assert "Russia" in data["line"]

def test_drill_api_fail():
    response = client.post("/api/drill", json={"scenario": "phishing", "step": 1, "reply": "yes i will"})
    assert response.status_code == 200
    data = response.json()
    assert data["done"] is True
    assert data["passed"] is False

def test_drill_api_pass():
    response = client.post("/api/drill", json={"scenario": "phishing", "step": 1, "reply": "hang up and call my bank"})
    assert response.status_code == 200
    data = response.json()
    assert data["done"] is True
    assert data["passed"] is True

def test_history():
    response = client.get("/api/history")
    assert response.status_code == 200
    assert "verdicts" in response.json()
    assert "drills" in response.json()
