# MedRAG - Medical Diagnosis Assistant

AI-powered medical diagnosis system using Retrieval-Augmented Generation (RAG) with clinical case database.

## 🏗️ Project Structure

```
MedRAG_App/
├── backend/          # FastAPI backend with RAG engine
├── frontend/         # Next.js 14 frontend
└── README.md         # This file
```

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Start Redis
docker run -d -p 6379:6379 redis:7-alpine

# Start Celery worker
celery -A app.core.tasks worker --loglevel=info

# Start API server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with backend URL

# Start development server
npm run dev
```

## 📚 Documentation

- **Backend**: See [backend/README.md](backend/README.md)
- **Frontend**: See [frontend/README.md](frontend/README.md)
- **Deployment**: See [backend/DEPLOYMENT.md](backend/DEPLOYMENT.md)

## 🔑 Environment Variables

### Backend (.env)
```env
PERPLEXITY_API_KEY=your-api-key
REDIS_URL=redis://localhost:6379/0
FAISS_INDEX_PATH=../medrag_outputs/faiss_index.bin
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🛠️ Tech Stack

### Backend
- FastAPI
- Celery + Redis
- FAISS (vector search)
- Perplexity AI
- NetworkX (knowledge graphs)

### Frontend
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

## 📦 Features

- ✅ Clinical wizard for patient case submission
- ✅ Real-time AI diagnosis with medical reasoning
- ✅ Interactive chat interface
- ✅ Vector similarity search (FAISS)
- ✅ Knowledge graph traversal
- ✅ File upload (PDF, DOCX, JSON, DICOM)
- ✅ Background task processing
- ✅ JWT authentication
- ✅ Prometheus metrics

## 🐳 Docker Deployment

```bash
# Backend
cd backend
docker-compose up -d

# Frontend
cd frontend
docker build -t medrag-frontend .
docker run -p 3000:3000 medrag-frontend
```

## 📊 API Endpoints

- `POST /api/v1/diagnosis/start` - Start diagnosis
- `GET /api/v1/diagnosis/{sessionId}` - Get results
- `POST /api/v1/upload` - Upload medical files
- `GET /api/v1/health` - Health check
- `GET /docs` - API documentation

## 🔒 Security

- JWT authentication
- Rate limiting
- Input validation
- CORS configuration
- Secret management

## 📝 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📞 Support

- GitHub Issues
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/api/v1/health
