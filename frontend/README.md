# MedRAG Frontend

Next.js 14 frontend for the MedRAG medical diagnosis system.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on port 8000

## 🛠️ Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
npm start
```

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js 14 app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── diagnosis/         # Diagnosis pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── chat-with-diagnosis.tsx
├── lib/                   # Utilities
│   ├── api-client.ts     # API client
│   ├── config.ts         # Configuration
│   └── utils.ts          # Helper functions
├── middleware.ts          # Auth middleware
└── public/               # Static assets
```

## 🎨 Features

### Pages
- **Landing Page** (`/`) - Hero section with features
- **Auth** (`/auth`) - Login/Signup with email verification
- **Dashboard** (`/dashboard`) - Patient cases overview
- **New Diagnosis** (`/diagnosis/new`) - Clinical wizard
- **Diagnosis Details** (`/diagnosis/[id]`) - Results with chat

### Components
- Clinical wizard with multi-step form
- Real-time chat interface
- Diagnosis results display
- Patient case cards
- Authentication forms
- Loading states

## 🔧 Configuration

### API Client
Located in `lib/api-client.ts`:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

### Middleware
Auth protection in `middleware.ts`:
```typescript
export const config = {
  matcher: ['/dashboard/:path*', '/diagnosis/:path*']
};
```

## 🎨 Styling

- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **CSS Variables** - Theme customization

### Theme Colors
Edit `app/globals.css`:
```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
}
```

## 📦 Dependencies

### Core
- `next` - React framework
- `react` - UI library
- `typescript` - Type safety

### UI
- `tailwindcss` - Styling
- `@radix-ui/*` - Headless components
- `lucide-react` - Icons

### Utilities
- `axios` - HTTP client
- `clsx` - Class names
- `tailwind-merge` - Merge Tailwind classes

## 🔒 Authentication

### Login Flow
1. User enters credentials
2. API returns JWT token
3. Token stored in localStorage
4. Middleware protects routes

### Protected Routes
- `/dashboard/*`
- `/diagnosis/*`

### Public Routes
- `/`
- `/auth`

## 🌐 API Integration

### Example API Call
```typescript
import { apiClient } from '@/lib/api-client';

const startDiagnosis = async (data) => {
  const response = await apiClient.post('/api/v1/diagnosis/start', data);
  return response.data;
};
```

### Error Handling
```typescript
try {
  const result = await apiClient.get('/api/v1/diagnosis/123');
} catch (error) {
  if (error.response?.status === 401) {
    // Redirect to login
  }
}
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t medrag-frontend .
docker run -p 3000:3000 medrag-frontend
```

### Environment Variables
Set in deployment platform:
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

## 🧪 Testing

```bash
# Run tests (if configured)
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly UI elements

## ⚡ Performance

- Server-side rendering (SSR)
- Static generation where possible
- Image optimization
- Code splitting
- Lazy loading

## 🐛 Troubleshooting

### API Connection Issues
```bash
# Check backend is running
curl http://localhost:8000/api/v1/health

# Verify CORS settings in backend
```

### Build Errors
```bash
# Clear cache
rm -rf .next
npm run build
```

### Type Errors
```bash
# Regenerate types
npm run type-check
```

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Radix UI](https://www.radix-ui.com)

## 🤝 Contributing

1. Follow existing code style
2. Use TypeScript for type safety
3. Add comments for complex logic
4. Test on multiple screen sizes
5. Update documentation

## 📝 License

MIT License
