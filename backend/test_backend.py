#!/usr/bin/env python3
"""
Simple test script to verify backend functionality
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    response = requests.get(f"{BASE_URL}/")
    print("Health Check:", response.json())

def test_submit_case():
    case_data = {
        "patient": {
            "fullName": "Test Patient",
            "age": 35,
            "gender": "male",
            "phone": "1234567890",
            "email": "test@example.com"
        },
        "manifestations": {
            "complaint": "Patient reports chest pain and shortness of breath",
            "symptoms": ["chest pain", "shortness of breath", "fatigue"]
        },
        "history": {
            "files": [],
            "manualHistory": "No significant medical history"
        }
    }
    
    response = requests.post(f"{BASE_URL}/cases", json=case_data)
    print("Submit Case:", response.json())
    return response.json().get("case_id")

def test_list_cases():
    response = requests.get(f"{BASE_URL}/cases")
    print("List Cases:", response.json())

def test_chat():
    chat_data = {
        "message": "Patient has chest pain and difficulty breathing",
        "session_id": "test_session"
    }
    
    response = requests.post(f"{BASE_URL}/chat", json=chat_data)
    print("Chat Response:", response.json())

def test_dashboard_stats():
    response = requests.get(f"{BASE_URL}/dashboard/stats")
    print("Dashboard Stats:", response.json())

if __name__ == "__main__":
    print("Testing MedRAG Backend...")
    
    try:
        test_health()
        test_dashboard_stats()
        case_id = test_submit_case()
        test_list_cases()
        test_chat()
        print("\n✅ All tests passed!")
    except Exception as e:
        print(f"\n❌ Test failed: {e}")