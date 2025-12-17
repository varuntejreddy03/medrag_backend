# MedRAG Frontend - Medical Diagnosis Interface

Next.js 14 frontend for AI-powered medical diagnosis system with modern UI/UX.

## 🏗️ Architecture

```
frontend/
├── app/                    # Next.js 14 App Router
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   ├── signup/        # Registration page
│   │   └── verify/        # OTP verification
│   ├── dashboard/         # Main dashboard
│   │   └── page.tsx       # Diagnosis history & overview
│   ├── diagnosis/         # Diagnosis workflow
│   │   ├── new/           # Create new diagnosis
│   │   └── [id]/          # View diagnosis results
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── chat-with-diagnosis.tsx # AI chat interface
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── api-client.ts     # Backend API client
│   ├── config.ts         # App configuration
│   └── utils.ts          # Helper functions
├── public/               # Static assets
├── middleware.ts         # Next.js middleware (auth)
└── package.json          # Dependencies
```

## 🚀 Quick Start

### 1. Installation
```bash
cd frontend
npm install
```

### 2. Environment Setup
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=MedRAG
```

### 3. Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

## 🎯 User Flow

### 1. Authentication Flow
```
Landing Page → Sign Up → Email Verification (OTP) → Dashboard
     ↓
Login Page → Dashboard (if already registered)
```

### 2. Diagnosis Flow
```
Dashboard → New Diagnosis → Patient Info Form → Symptoms Form → 
Review → Submit → Real-time Progress → Diagnosis Results → AI Chat
```

### 3. Results & History
```
Dashboard → View Past Diagnoses → Detailed Report → Chat with AI
```

## 📱 Pages & Components

### Authentication Pages

#### `/auth/signup`
- **Purpose**: User registration
- **Features**: Email validation, password strength, form validation
- **Flow**: Email → Password → Send OTP → Redirect to verification

#### `/auth/verify`
- **Purpose**: OTP email verification
- **Features**: 6-digit OTP input, resend functionality, auto-redirect
- **Flow**: Enter OTP → Verify → Auto-login → Dashboard

#### `/auth/login`
- **Purpose**: User login
- **Features**: Email/password, remember me, forgot password link
- **Flow**: Credentials → Validate → JWT storage → Dashboard

### Main Application Pages

#### `/dashboard`
- **Purpose**: Main user hub
- **Features**: 
  - Diagnosis history cards
  - Quick stats (total diagnoses, recent activity)
  - "New Diagnosis" CTA button
  - Recent diagnosis results preview

#### `/diagnosis/new`
- **Purpose**: Create new diagnosis
- **Features**:
  - 3-step wizard (Patient Info → Symptoms → Review)
  - Progress indicator
  - Form validation
  - Real-time loading with progress updates
- **Steps**:
  1. **Patient Info**: Name, email, age, gender
  2. **Symptoms**: Detailed symptom description, medical history
  3. **Review**: Confirm all information before submission

#### `/diagnosis/[id]`
- **Purpose**: View diagnosis results
- **Features**:
  - Comprehensive medical report display
  - Real-time status polling during processing
  - AI chat interface
  - Professional medical report layout
- **Sections**:
  - Primary diagnosis with confidence meter
  - Clinical summary
  - Differential diagnoses with probabilities
  - Treatment plan with urgency indicators
  - Recommended tests with priorities
  - Warning signs and follow-up plans

### Components

#### `ChatWithDiagnosis`
- **Purpose**: AI chat about diagnosis results
- **Features**:
  - Real-time messaging
  - Context-aware responses
  - Chat history persistence
  - Professional medical tone

#### `ui/` Components (shadcn/ui)
- **Button**: Various styles and sizes
- **Input**: Form inputs with validation
- **Card**: Content containers
- **Badge**: Status indicators
- **Progress**: Loading indicators
- **Dialog**: Modal dialogs

## 🎨 Design System

### Color Palette
```css
/* Dark theme with medical accent colors */
--background: zinc-950     /* Main background */
--card: zinc-900          /* Card backgrounds */
--border: zinc-800        /* Borders */
--primary: blue-500       /* Primary actions */
--secondary: cyan-500     /* Secondary actions */
--success: green-500      /* Success states */
--warning: yellow-500     /* Warning states */
--error: red-500          /* Error states */
```

### Typography
- **Headings**: Inter font, various weights
- **Body**: Inter font, regular weight
- **Code**: Mono font for technical content

### Layout Patterns
- **Cards**: Rounded corners, subtle borders, backdrop blur
- **Forms**: Multi-step wizards with progress indicators
- **Loading**: Skeleton screens and progress bars
- **Status**: Color-coded badges and indicators

## 🔧 Technical Implementation

### State Management
- **React State**: Local component state with useState
- **Form State**: Controlled components with validation
- **API State**: Custom hooks for data fetching
- **Auth State**: JWT tokens in localStorage

### API Integration (`lib/api-client.ts`)
```typescript
class APIClient {
  // Authentication
  signup(data) → Promise<{message}>
  verifyOtp(email, otp) → Promise<{access_token}>
  login(data) → Promise<{access_token}>
  
  // Diagnosis
  createDiagnosis(data) → Promise<{id, session_id}>
  getDiagnosis(id) → Promise<DiagnosisResponse>
  getDiagnosisStatus(id) → Promise<{status, message, progress}>
  chatWithDiagnosis(id, message) → Promise<{response}>
}
```

### Real-time Features
- **Status Polling**: 2-second intervals during diagnosis processing
- **Progress Updates**: Real-time progress bar and status messages
- **Auto-refresh**: Automatic result loading when diagnosis completes

### Form Validation
- **Client-side**: Immediate feedback with TypeScript validation
- **Required Fields**: Visual indicators and error messages
- **Email Validation**: RFC-compliant email format checking
- **Password Strength**: Real-time strength indicator

### Loading States
- **Skeleton Screens**: Content placeholders during loading
- **Progress Indicators**: Step-by-step progress visualization
- **Status Messages**: Descriptive loading messages
- **Error Handling**: User-friendly error messages

## 🔒 Security Features

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Token Storage**: localStorage with automatic cleanup
- **Route Protection**: Middleware-based auth checking
- **Auto-logout**: Token expiration handling

### Data Protection
- **Input Sanitization**: XSS prevention
- **HTTPS Enforcement**: Secure data transmission
- **CORS Handling**: Proper cross-origin configuration
- **Error Boundaries**: Graceful error handling

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (single column, touch-optimized)
- **Tablet**: 768px - 1024px (adapted layouts)
- **Desktop**: > 1024px (full multi-column layouts)

### Mobile Optimizations
- **Touch Targets**: Minimum 44px touch areas
- **Viewport**: Proper viewport meta configuration
- **Performance**: Optimized images and lazy loading
- **Navigation**: Mobile-friendly navigation patterns

## 🚀 Performance Optimizations

### Next.js Features
- **App Router**: Latest Next.js routing system
- **Server Components**: Reduced client-side JavaScript
- **Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic route-based splitting

### Loading Optimizations
- **Lazy Loading**: Components loaded on demand
- **Prefetching**: Link prefetching for faster navigation
- **Caching**: Proper HTTP caching headers
- **Compression**: Gzip/Brotli compression

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks

### Development Tools
- **Hot Reload**: Instant updates during development
- **Error Overlay**: Detailed error information
- **DevTools**: React and Next.js debugging tools

## 📦 Dependencies

### Core Framework
- `next` - React framework
- `react` - UI library
- `typescript` - Type safety

### UI & Styling
- `tailwindcss` - Utility-first CSS
- `@radix-ui/*` - Headless UI components
- `lucide-react` - Icon library
- `class-variance-authority` - Component variants

### Utilities
- `clsx` - Conditional classes
- `tailwind-merge` - Tailwind class merging
- `next-themes` - Theme management

## 🌐 Deployment

### Build Process
```bash
npm run build
npm run start
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://api.medrag.com
NEXT_PUBLIC_APP_NAME=MedRAG
```

### Deployment Platforms
- **Vercel**: Recommended (seamless Next.js integration)
- **Netlify**: Static site deployment
- **Docker**: Containerized deployment
- **AWS/GCP**: Cloud platform deployment

## 🔍 Monitoring & Analytics

### Error Tracking
- **Error Boundaries**: React error boundaries
- **Console Logging**: Development debugging
- **User Feedback**: Error reporting mechanisms

### Performance Monitoring
- **Core Web Vitals**: Performance metrics
- **Bundle Analysis**: Code splitting analysis
- **Loading Times**: Page load performance

## 🎯 Future Enhancements

### Planned Features
- **Offline Support**: PWA capabilities
- **Push Notifications**: Real-time updates
- **Multi-language**: Internationalization
- **Advanced Analytics**: User behavior tracking
- **Mobile App**: React Native version