import os
import json
from datetime import datetime
from typing import Optional, List, Dict
from sqlalchemy import create_engine, Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///medrag.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"sslmode": "require"} if "postgresql" in DATABASE_URL else {}
)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    phone = Column(String)
    email = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Case(Base):
    __tablename__ = "cases"
    id = Column(String, primary_key=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    complaint = Column(Text)
    symptoms = Column(Text)
    history = Column(Text)
    diagnosis = Column(Text)
    confidence = Column(Float)
    status = Column(String, default="pending")
    reasoning = Column(Text)
    matches = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    id = Column(String, primary_key=True)
    messages = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

Base.metadata.create_all(engine)

class Database:
    def create_patient(self, full_name: str, age: int, gender: str, phone: str = None, email: str = None) -> int:
        session = SessionLocal()
        try:
            patient = Patient(full_name=full_name, age=age, gender=gender, phone=phone, email=email)
            session.add(patient)
            session.commit()
            return patient.id
        finally:
            session.close()
    
    def create_case(self, case_id: str, patient_id: int, complaint: str, symptoms: List[str], history: str = None) -> str:
        session = SessionLocal()
        try:
            case = Case(id=case_id, patient_id=patient_id, complaint=complaint, symptoms=json.dumps(symptoms), history=history)
            session.add(case)
            session.commit()
            return case_id
        finally:
            session.close()
    
    def update_case_diagnosis(self, case_id: str, diagnosis: str, confidence: float, reasoning: str, matches: List[str]):
        session = SessionLocal()
        try:
            case = session.query(Case).filter(Case.id == case_id).first()
            if case:
                case.diagnosis = diagnosis
                case.confidence = confidence
                case.reasoning = reasoning
                case.matches = json.dumps(matches)
                case.status = "diagnosed"
                case.updated_at = datetime.utcnow()
                session.commit()
        finally:
            session.close()
    
    def get_cases(self, limit: int = 10, offset: int = 0) -> List[Dict]:
        session = SessionLocal()
        try:
            cases = session.query(Case, Patient).join(Patient).order_by(Case.created_at.desc()).limit(limit).offset(offset).all()
            result = []
            for case, patient in cases:
                result.append({
                    "id": case.id,
                    "patient_id": case.patient_id,
                    "full_name": patient.full_name,
                    "age": patient.age,
                    "gender": patient.gender,
                    "email": patient.email,
                    "complaint": case.complaint,
                    "symptoms": json.loads(case.symptoms) if case.symptoms else [],
                    "history": case.history,
                    "diagnosis": case.diagnosis,
                    "confidence": case.confidence,
                    "status": case.status,
                    "reasoning": case.reasoning,
                    "matches": json.loads(case.matches) if case.matches else [],
                    "created_at": case.created_at.isoformat()
                })
            return result
        finally:
            session.close()
    
    def get_case_by_id(self, case_id: str) -> Optional[Dict]:
        session = SessionLocal()
        try:
            result = session.query(Case, Patient).join(Patient).filter(Case.id == case_id).first()
            if not result:
                return None
            case, patient = result
            return {
                "id": case.id,
                "full_name": patient.full_name,
                "age": patient.age,
                "gender": patient.gender,
                "email": patient.email,
                "complaint": case.complaint,
                "symptoms": json.loads(case.symptoms) if case.symptoms else [],
                "diagnosis": case.diagnosis,
                "confidence": case.confidence,
                "status": case.status
            }
        finally:
            session.close()
    
    def get_cases_count(self) -> int:
        session = SessionLocal()
        try:
            return session.query(Case).count()
        finally:
            session.close()
    
    def create_chat_session(self, session_id: str):
        session = SessionLocal()
        try:
            existing = session.query(ChatSession).filter(ChatSession.id == session_id).first()
            if not existing:
                chat_session = ChatSession(id=session_id, messages=json.dumps([]))
                session.add(chat_session)
                session.commit()
        finally:
            session.close()
    
    def add_chat_message(self, session_id: str, user_message: str, assistant_message: str):
        session = SessionLocal()
        try:
            chat_session = session.query(ChatSession).filter(ChatSession.id == session_id).first()
            if not chat_session:
                self.create_chat_session(session_id)
                chat_session = session.query(ChatSession).filter(ChatSession.id == session_id).first()
            
            messages = json.loads(chat_session.messages) if chat_session.messages else []
            messages.append({"user": user_message, "assistant": assistant_message, "timestamp": datetime.utcnow().isoformat()})
            chat_session.messages = json.dumps(messages)
            chat_session.updated_at = datetime.utcnow()
            session.commit()
        finally:
            session.close()
    
    def get_chat_history(self, session_id: str) -> List[Dict]:
        session = SessionLocal()
        try:
            chat_session = session.query(ChatSession).filter(ChatSession.id == session_id).first()
            return json.loads(chat_session.messages) if chat_session and chat_session.messages else []
        finally:
            session.close()
    
    def get_dashboard_stats(self) -> Dict:
        session = SessionLocal()
        try:
            total = session.query(Case).count()
            pending = session.query(Case).filter(Case.status == "pending").count()
            diagnosed = session.query(Case).filter(Case.status == "diagnosed").count()
            return {"total_cases": total, "pending_cases": pending, "diagnosed_cases": diagnosed, "recent_cases": diagnosed}
        finally:
            session.close()

db = Database()
