# 🌉 BridgeAI Frontend

<div align="center">

**The World's First AI-Native Requirements Engineering Platform**

*Transform conversations into professional CRS documents with intelligent automation*

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Core Features](#-core-features)
- [Architecture & Flow](#-architecture--flow)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Key Modules](#-key-modules)
- [API Integration](#-api-integration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**BridgeAI** is a revolutionary platform that bridges the gap between clients and Business Analysts through AI-powered automation. It eliminates ambiguity in software requirements by using multi-agent AI systems to clarify, structure, and generate professional Client Requirements Specification (CRS) documents.

### The Problem We Solve

Traditional requirements gathering is:
- ⏱️ **Time-consuming**: Manual documentation takes days or weeks
- 🔍 **Error-prone**: Missing critical details and ambiguities
- 📝 **Inconsistent**: Lack of standardization across projects
- 🔄 **Inefficient**: Multiple back-and-forth communication cycles

### Our Solution

BridgeAI delivers:
- ⚡ **95% Faster** requirements documentation
- 🤖 **AI-Powered** ambiguity detection and clarification
- 📊 **Professional** industry-standard CRS documents
- 🔄 **Real-time** collaboration and updates
- ✅ **Complete** audit trails and version control

---

## ✨ Core Features

### 🎭 Dual-Role System

#### For Clients
- 💬 **Natural Conversation Interface**: Chat with AI to describe your software vision
- 🔄 **Real-time CRS Updates**: Watch your requirements take shape as you talk
- 📊 **Progress Tracking**: Monitor completeness percentage and missing fields
- 📤 **Multi-format Export**: Download as PDF, Markdown, or CSV
- 🔔 **Smart Notifications**: Stay informed about approval status and feedback
- 🔍 **Version History**: Access complete conversation and document audit trails

#### For Business Analysts
- 📋 **Centralized Dashboard**: Review all CRS documents in one place
- 💭 **Inline Comments**: Add detailed feedback on specific requirements
- ✅ **One-Click Actions**: Approve or reject CRS with reasoning
- 🔍 **Advanced Filtering**: Sort by status, team, project, and date
- 👥 **Multi-Team Management**: Handle multiple projects across different teams
- 📈 **Analytics Dashboard**: Track team performance and project metrics

### 🤖 AI-Powered Intelligence

#### Multi-Agent System
- **Neural Extraction Engine**: Converts natural language into structured requirements
- **Ambiguity Detection**: Proactively identifies unclear or incomplete information
- **Clarification Agent**: Asks targeted questions to fill knowledge gaps
- **Semantic Analysis**: Deep-reasoning loops to verify intent
- **Template Filler**: Auto-populates 15+ CRS sections with extracted data
- **Quality Validator**: Ensures completeness and consistency

#### Real-time Streaming
- **WebSocket Integration**: Live updates during CRS generation
- **Progress Indicators**: Visual feedback on extraction progress
- **Streaming Insights**: See requirements being analyzed in real-time
- **Error Recovery**: Automatic retry with exponential backoff
- **Patch Application**: Fast JSON Patch updates for minimal data transfer

### 📄 CRS Document Management

#### Industry-Standard Templates
Support for 4 major requirement specification patterns:
- **ISO/IEC/IEEE 29148**: International standard for requirements engineering
- **IEEE 830**: Software requirements specification standard
- **BABOK**: Business Analysis Body of Knowledge format
- **Agile User Stories**: Modern agile-friendly format

#### Comprehensive Structure
Every CRS includes 15+ specialized sections:
- Project Title & Description
- Executive Summary & Objectives
- Functional Requirements (ID, priority, description)
- Non-Functional Requirements (performance, security, scalability)
- Target Users & Stakeholders
- Technology Stack (frontend, backend, database, integrations)
- Constraints (budget, timeline, technical)
- Success Metrics & Acceptance Criteria
- Assumptions, Risks & Out-of-Scope items
- Additional Notes & Documentation

#### Document Lifecycle
- **Draft**: Initial AI-generated document
- **Under Review**: Submitted to Business Analyst
- **Approved**: BA approved for implementation
- **Rejected**: Returned with feedback for revision

### 👥 Team & Project Management

#### Team Features
- **Team Creation**: Set up collaborative workspaces
- **Member Invitations**: Email-based invitation system with role assignment
- **Role Management**: Owner, Admin, Member, Viewer permissions
- **Team Dashboard**: Overview of all team projects and activity
- **Member Settings**: Configure roles and access control

#### Project Features
- **Project Initialization**: Create projects within teams
- **Status Tracking**: Pending, Approved, Rejected, Active, Completed, Archived
- **Project Approval**: BA review and approval workflow
- **Multi-Project Support**: Handle unlimited projects per team
- **Project Settings**: Configure CRS patterns and preferences

### 💬 Advanced Chat System

#### Chat Interface
- **AI Chat Partner**: Intelligent conversation flow management
- **Message Types**: User, BA, and AI messages with distinct styling
- **Typing Indicators**: Real-time typing status for AI and users
- **Connection Status**: WebSocket connection monitoring
- **Message History**: Complete transcript with timestamps
- **Auto-scroll**: Smart scroll management for new messages

#### Chat Features
- **Inline CRS Preview**: Side-by-side chat and document view
- **Swappable Layout**: Switch between left/right document positioning
- **Resizable Panels**: Customizable workspace layout
- **Chat Export**: Download conversation transcripts
- **Message Search**: Find specific discussions quickly
- **Rich Media**: Support for markdown and formatted content

### 📤 Export & Integration

#### Export Formats
- **PDF Export**: Professional corporate-styled documents
- **Markdown Export**: Plain text format for version control
- **CSV Export**: Structured data for analysis and integration
- **Requirements-Only CSV**: Filtered export of just requirements

#### Export Features
- **Custom Formatting**: Professional styling with company branding
- **Version Stamping**: Automatic version numbers in filenames
- **Batch Export**: Export multiple documents at once
- **Download Management**: Browser-based download handling

### 🔔 Notifications & Activity

#### Notification Types
- **Project Approval**: Project status changes
- **Team Invitations**: Join team requests
- **CRS Created**: New document generation
- **CRS Updated**: Document modifications
- **CRS Status Changed**: Draft → Review → Approved/Rejected
- **CRS Comment Added**: New feedback received
- **Review Assignments**: New review tasks

#### Notification Features
- **Real-time Updates**: Instant notification delivery
- **Unread Counter**: Track new notifications
- **Mark as Read**: Manage notification status
- **Notification History**: Complete activity log
- **Action Links**: Direct navigation to relevant content

### 💭 Comments & Feedback

#### Comment System
- **Inline Comments**: Add feedback on specific CRS sections
- **Threaded Discussions**: Reply to comments for context
- **User Attribution**: Track who said what
- **Timestamps**: Complete audit trail
- **Edit & Delete**: Manage your own comments
- **Markdown Support**: Rich formatting in comments

### 🔐 Authentication & Security

#### Authentication Methods
- **Google OAuth**: Sign in with Google
- **Email/Password**: Traditional authentication
- **JWT Tokens**: Secure session management
- **Token Refresh**: Automatic session renewal
- **Remember Me**: Persistent login option

#### Security Features
- **Protected Routes**: Middleware-based route protection
- **Role-Based Access**: Permission-based feature access
- **API Token Management**: Secure token storage
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Client-side data validation

### 🎨 User Experience

#### Design System
- **Radix UI Components**: Accessible, customizable components
- **Tailwind CSS 4**: Modern utility-first styling
- **Framer Motion**: Smooth animations and transitions
- **Responsive Design**: Mobile-first, works on all devices
- **Dark Mode Ready**: Prepared for theme switching
- **Custom Fonts**: Optimized Geist font family

#### UI Components
- **Modals & Dialogs**: Professional modal system
- **Toast Notifications**: Non-intrusive alerts (Sonner)
- **Loading States**: Skeleton screens and spinners
- **Empty States**: Helpful onboarding messages
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time input validation

---

## 🏗️ Architecture & Flow

### Application Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT JOURNEY                               │
└─────────────────────────────────────────────────────────────────┘

1️⃣ Authentication
   └─> User logs in via Google OAuth or Email/Password
   └─> JWT token stored securely
   └─> Redirected to Dashboard

2️⃣ Team & Project Setup
   └─> Create or join a team via invitation
   └─> Create a new project within the team
   └─> Project enters "pending" status awaiting BA approval

3️⃣ BA Approval
   └─> Business Analyst reviews pending projects
   └─> Approves project to enable CRS generation
   └─> Client receives notification

4️⃣ AI Chat Session
   └─> Client opens project chat
   └─> WebSocket connection established
   └─> Client describes software vision in natural language
   └─> AI asks clarification questions to detect ambiguities
   └─> Real-time CRS preview shows extraction progress

5️⃣ CRS Generation
   └─> Background streaming generates CRS in real-time
   └─> Multi-agent system populates 15+ CRS sections
   └─> Completeness percentage tracked
   └─> Client sees live updates in side panel

6️⃣ Review & Submission
   └─> Client reviews generated CRS document
   └─> Submits CRS for BA review (Draft → Under Review)
   └─> Notification sent to assigned Business Analyst

7️⃣ BA Review Process
   └─> BA opens CRS dashboard
   └─> Reviews submitted documents
   └─> Adds inline comments and feedback
   └─> Approves OR Rejects with reasoning

8️⃣ Final Outcomes
   ├─> If Approved:
   │   └─> CRS marked as approved
   │   └─> Available for export (PDF/Markdown/CSV)
   │   └─> Immutable audit trail created
   │   └─> Client can proceed to development
   │
   └─> If Rejected:
       └─> Client receives rejection notification
       └─> Reviews BA comments and feedback
       └─> Regenerates CRS with updates
       └─> Resubmits for review

9️⃣ Export & Handoff
   └─> Download professional CRS as PDF/Markdown/CSV
   └─> Share with development team
   └─> Complete version history available
   └─> Project moves to implementation
```

### Data Flow Architecture

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend   │ ◄─────► │   API Layer  │ ◄─────► │   Backend    │
│   (Next.js)  │  HTTP   │  (Services)  │   WS    │   (FastAPI)  │
└──────────────┘         └──────────────┘         └──────────────┘
       │                        │                        │
       │                        │                        │
       ▼                        ▼                        ▼
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  UI State    │         │  DTO Layer   │         │  AI Agents   │
│  Management  │         │  Validation  │         │  Processor   │
└──────────────┘         └──────────────┘         └──────────────┘
       │                        │                        │
       │                        │                        │
       ▼                        ▼                        ▼
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  React Hook  │         │  Token Mgmt  │         │   ChromaDB   │
│   Patterns   │         │  Auth Flow   │         │    MySQL     │
└──────────────┘         └──────────────┘         └──────────────┘
```

### Real-time CRS Generation Flow

```
Client Message
      │
      ▼
┌─────────────────┐
│  WebSocket Send │
└─────────────────┘
      │
      ▼
┌─────────────────────────────────────────────┐
│         Backend AI Pipeline                  │
├─────────────────────────────────────────────┤
│  1. Intent Detection                         │
│  2. Ambiguity Analysis                       │
│  3. Clarification (if needed)                │
│  4. Knowledge Extraction                     │
│  5. Template Mapping                         │
│  6. CRS Generation (Streaming)               │
└─────────────────────────────────────────────┘
      │
      ▼
┌─────────────────┐
│  JSON Patch     │ ◄─── Fast incremental updates
│  Stream Events  │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  Frontend Hook  │
│  (useCRSStream) │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  CRS Panel      │ ◄─── Real-time UI update
│  (Live Preview) │
└─────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 15.5** - React framework with App Router
- **React 19.2** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **@tailwindcss/typography** - Beautiful typography plugin
- **@tailwindcss/postcss** - PostCSS integration
- **Radix UI** - Headless accessible components
  - Dialog, Dropdown, Tabs, Toast, Accordion, Select, Scroll Area
- **Framer Motion 12** - Animation library
- **Lucide React** - Modern icon set
- **class-variance-authority** - Component variants
- **tailwind-merge** - Utility class merging
- **clsx** - Conditional classNames

### Authentication
- **@react-oauth/google** - Google OAuth integration
- **JWT** - Token-based authentication

### Real-time Communication
- **WebSocket** - Live chat and CRS updates
- **EventSource (SSE)** - Server-sent events for streaming

### Data Management
- **fast-json-patch** - Efficient JSON patching for CRS updates
- **date-fns** - Modern date utility library

### Markdown & Rich Content
- **react-markdown** - Markdown rendering
- **Markdown to HTML** - Export formatting

### UI Enhancements
- **Sonner** - Toast notifications
- **react-resizable-panels** - Resizable layout panels
- **tw-animate-css** - Additional Tailwind animations

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript Compiler** - Type checking

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20 or higher
- **npm**, **yarn**, **pnpm**, or **bun**
- **Backend API** running (BridgeAI Backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KhaledJamalKwaik/bridgeai-frontend.git
   cd bridgeai-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Configuration**
   
   Create a `.env.local` file in the root directory:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   NEXT_PUBLIC_WS_URL=ws://127.0.0.1:8000
   
   # Google OAuth (Optional)
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   
   # Application
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm run start
```

---

## 📁 Project Structure

```
bridgeai-frontend/
├── app/                          # Next.js App Router
│   ├── api/                      # API route handlers
│   ├── auth/                     # Authentication pages (login, register)
│   ├── chats/                    # Chat interface pages
│   ├── crs-dashboard/            # BA CRS review dashboard
│   ├── invite/                   # Team invitation handling
│   ├── notifications/            # Notifications page
│   ├── pending-requests/         # BA project approval queue
│   ├── profile/                  # User profile management
│   ├── projects/                 # Project pages
│   │   └── [id]/                 # Dynamic project routes
│   ├── teams/                    # Team management pages
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
│
├── components/                   # React components
│   ├── auth/                     # Authentication components
│   ├── chats/                    # Chat UI components
│   │   ├── ChatUI.tsx            # Main chat interface
│   │   ├── ChatMessage.tsx       # Message rendering
│   │   ├── ChatHeader.tsx        # Chat header with actions
│   │   ├── CRSPanel.tsx          # Side-by-side CRS preview
│   │   ├── CRSDraftDialog.tsx    # CRS review modal
│   │   └── CRSGenerateDialog.tsx # CRS generation modal
│   ├── comments/                 # Comment system components
│   ├── crs-dashboard/            # BA dashboard components
│   ├── dashboard/                # Client dashboard components
│   ├── header/                   # Global header/navigation
│   ├── landing/                  # Landing page sections
│   │   ├── Hero.tsx              # Hero section
│   │   ├── ValueProposition.tsx  # Features overview
│   │   ├── Workflow.tsx          # Process visualization
│   │   ├── RoleFeatures.tsx      # Client vs BA features
│   │   ├── Pricing.tsx           # Pricing plans
│   │   ├── FAQ.tsx               # Frequently asked questions
│   │   └── TechStack.tsx         # Technology showcase
│   ├── my-crs-requests/          # Client CRS management
│   ├── notifications/            # Notification components
│   ├── pending-requests/         # BA approval queue UI
│   ├── profile/                  # Profile components
│   ├── projects/                 # Project components
│   ├── providers/                # Context providers
│   │   └── GoogleAuthProvider.tsx
│   ├── shared/                   # Shared/reusable components
│   │   ├── CRSContentDisplay.tsx # CRS document renderer
│   │   ├── CRSExportButton.tsx   # Export functionality
│   │   └── CRSStatusBadge.tsx    # Status indicators
│   ├── sidebar/                  # Navigation sidebar
│   ├── teams/                    # Team management UI
│   ├── ui/                       # Radix UI components
│   ├── ClientLayout.tsx          # Client-side layout wrapper
│   ├── LayoutWrapper.tsx         # Layout orchestrator
│   └── TeamSettingsGrid.tsx      # Team settings
│
├── contexts/                     # React Context
│   └── ModalManagerContext.tsx   # Modal state management
│
├── dto/                          # Data Transfer Objects
│   ├── auth.dto.ts               # Authentication types
│   ├── chat.dto.ts               # Chat message types
│   ├── crs.dto.ts                # CRS document types
│   ├── invitations.dto.ts        # Team invitation types
│   ├── notifications.dto.ts      # Notification types
│   ├── profile.dto.ts            # User profile types
│   ├── projects.dto.ts           # Project types
│   ├── teams.dto.ts              # Team types
│   └── index.ts                  # DTO exports
│
├── hooks/                        # Custom React Hooks
│   ├── auth/                     # Authentication hooks
│   ├── chats/                    # Chat-related hooks
│   │   ├── useChatCRS.ts         # CRS state management
│   │   ├── useChatInput.ts       # Chat input handling
│   │   ├── useChatMessages.ts    # Message management
│   │   ├── useChatScroll.ts      # Auto-scroll logic
│   │   ├── useChatState.ts       # Chat UI state
│   │   ├── useChatWebSocket.ts   # WebSocket connection
│   │   ├── useCRSPatchApplicator.ts # JSON Patch updates
│   │   └── useCRSStream.ts       # Real-time CRS streaming
│   ├── crs/                      # CRS hooks
│   │   └── useCRSExport.ts       # Export functionality
│   ├── header/                   # Header hooks
│   ├── invitations/              # Invitation hooks
│   ├── notifications/            # Notification hooks
│   ├── pending-requests/         # Approval queue hooks
│   ├── profile/                  # Profile hooks
│   ├── projects/                 # Project hooks
│   ├── shared/                   # Shared hooks
│   ├── teams/                    # Team hooks
│   └── index.ts                  # Hook exports
│
├── lib/                          # Utility libraries
│   ├── api.ts                    # Base API client
│   ├── api-crs.ts                # CRS API functions
│   ├── utils.ts                  # Helper utilities
│   └── websocket.ts              # WebSocket utilities
│
├── services/                     # API Service Layer
│   ├── auth.service.ts           # Authentication API
│   ├── chat.service.ts           # Chat API
│   ├── chats.service.ts          # Chat sessions API
│   ├── chatWebSocket.service.ts  # WebSocket service
│   ├── crs.service.ts            # CRS API
│   ├── errors.service.ts         # Error handling
│   ├── invitations.service.ts    # Invitation API
│   ├── notifications.service.ts  # Notification API
│   ├── profile.service.ts        # Profile API
│   ├── projects.service.ts       # Project API
│   ├── teams.service.ts          # Team API
│   ├── teamMembers.service.ts    # Team member API
│   ├── token.service.ts          # Token management
│   └── index.ts                  # Service exports
│
├── types/                        # TypeScript Types
│   └── crs-template.ts           # CRS template structure
│
├── utils/                        # Utility functions
│
├── public/                       # Static assets
│   ├── avatars/                  # User avatars
│   └── logo.png                  # App logo
│
├── docs/                         # Documentation
│
├── components.json               # shadcn/ui config
├── constants.ts                  # App constants
├── Dockerfile                    # Production Docker image
├── fonts.ts                      # Font configuration
├── middleware.ts                 # Next.js middleware (auth)
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies
├── postcss.config.mjs            # PostCSS config
├── tailwind.config.ts            # Tailwind configuration (implied)
├── tsconfig.json                 # TypeScript config
└── README.md                     # This file
```

---

## 🧩 Key Modules

### 1. Authentication System
- **Location**: `app/auth/`, `services/auth.service.ts`
- **Features**: Google OAuth, Email/Password, JWT management
- **Components**: Login, Register, Password Reset forms

### 2. Chat System
- **Location**: `app/chats/`, `components/chats/`, `hooks/chats/`
- **Features**: Real-time messaging, AI responses, WebSocket connection
- **Key Files**: 
  - `ChatUI.tsx` - Main chat interface
  - `useChatWebSocket.ts` - WebSocket management
  - `useChatMessages.ts` - Message state

### 3. CRS Management
- **Location**: `components/chats/CRSPanel.tsx`, `hooks/chats/useChatCRS.ts`
- **Features**: Real-time generation, preview, export, versioning
- **Key Files**:
  - `useCRSStream.ts` - Streaming CRS updates
  - `useCRSPatchApplicator.ts` - Efficient updates
  - `CRSContentDisplay.tsx` - Document rendering

### 4. Dashboard Systems
- **Client Dashboard**: Review your CRS documents
- **BA Dashboard**: Approve/reject CRS submissions
- **Pending Requests**: BA project approval queue

### 5. Team & Project Management
- **Location**: `app/teams/`, `app/projects/`, `components/teams/`
- **Features**: Create teams, invite members, manage projects
- **Key Files**:
  - `teams.service.ts` - Team API
  - `projects.service.ts` - Project API
  - `invitations.service.ts` - Invitation system

### 6. Notification System
- **Location**: `app/notifications/`, `components/notifications/`
- **Features**: Real-time notifications, read status, action links
- **Service**: `notifications.service.ts`

### 7. Export System
- **Location**: `components/shared/CRSExportButton.tsx`, `hooks/crs/useCRSExport.ts`
- **Features**: PDF, Markdown, CSV export
- **Service**: `crs.service.ts` - Export functions

---

## 🔌 API Integration

### Base Configuration

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
```

### Service Pattern

All API calls follow a consistent service pattern:

```typescript
// services/[resource].service.ts
import { getAuthToken } from './token.service';

export async function fetchResource() {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/resource`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}
```

### WebSocket Integration

```typescript
// services/chatWebSocket.service.ts
const wsUrl = `${WS_URL}/api/projects/${projectId}/chats/${chatId}/ws?token=${token}`;
const ws = new WebSocket(wsUrl);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle real-time updates
};
```

### DTO Layer

All API responses are typed using DTOs:

```typescript
// dto/crs.dto.ts
export interface CRSDTO {
  id: number;
  project_id: number;
  content: string;
  status: CRSStatus;
  version: number;
  // ...
}
```

---

## 🚢 Deployment

### Docker Deployment

```bash
# Build production image
docker build -f Dockerfile -t bridgeai-frontend .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.bridgeai.com \
  bridgeai-frontend
```

### Environment Variables

Production environment requires:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_WS_URL` - WebSocket URL
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `NEXT_PUBLIC_APP_URL` - Frontend URL

### Vercel Deployment

BridgeAI is optimized for Vercel deployment:

1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically on push

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Keep components under 300 lines
- Write descriptive variable names
- Add comments for complex logic

---

## 📄 License

This project is part of a Graduation Project. All rights reserved.

---

## 📞 Support

For questions or support:
- **GitHub Issues**: [Report bugs or request features](https://github.com/KhaledJamalKwaik/bridgeai-frontend/issues)
- **Email**: support@bridgeai.com (if available)

---

<div align="center">

**Made with ❤️ by the BridgeAI Team**

*Transforming Requirements Engineering with AI*

</div>
