# MedRAG - Medical Diagnosis Assistant

AI-powered medical diagnosis system using Retrieval-Augmented Generation (RAG) with clinical case database.

## Architecture

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python, FAISS vector search
- **Database**: PostgreSQL (AWS RDS)
- **Storage**: AWS S3 (model files)
- **AI**: Google Gemini 2.0, Sentence Transformers

## Features

- Clinical wizard for patient case submission
- Real-time AI diagnosis with medical reasoning
- Interactive chat interface
- Dashboard with analytics
- Email notifications
- Session management (30-min timeout)

## Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Download models from S3
python -c "from s3_loader import download_from_s3; download_from_s3()"

# Run
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://...
S3_BUCKET_NAME=medrag-data-bucket
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
GEMINI_API_KEY=your-key
GMAIL_USER=your-email
GMAIL_APP_PASSWORD=your-password
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Deployment

See `backend/deploy_guide.md` for AWS EC2 deployment instructions.

## Model Files

Large model files (4.4GB FAISS index) are stored in S3 and downloaded on startup.
