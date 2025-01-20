# Startup Circle - University of Cincinnati Innovation Hub

## 🎯 Project Overview
A platform connecting University of Cincinnati students across departments for collaborative projects and innovation.

## 🏗 Technical Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod validation
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Date Handling**: date-fns

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime

### Development Tools
- **Testing**: Vitest + React Testing Library
- **Type Checking**: TypeScript
- **Linting**: ESLint
- **Code Formatting**: Prettier
- **PWA Support**: Vite PWA Plugin

## 📱 Core Features

### 1. Authentication System
- UC Email-based registration
- Department-specific signup
- Profile management
- Secure session handling

### 2. Project Management
- Create and manage projects
- Project categorization by tags
- Project status tracking
- File attachments and images
- Team collaboration

### 3. Department Organization
- Department-based grouping
- Student listings by department
- Project showcase by department
- Cross-department collaboration

### 4. Real-time Features
- Live chat system
- Project updates
- Notifications
- Collaborative features

### 5. User Profiles
- Customizable profiles
- Skills and interests
- Project portfolio
- Connection system

## 🏛 Database Schema

### Tables
1. **profiles**
   - User information
   - Department association
   - Profile details

2. **projects**
   - Project details
   - Owner association
   - Status tracking
   - Tags and categorization

3. **departments**
   - Department information
   - Student associations
   - Project grouping

4. **messages**
   - Real-time chat
   - User communications
   - Project discussions

## 🔐 Security Features

1. **Row Level Security (RLS)**
   - User data protection
   - Project access control
   - Department-specific permissions

2. **Authentication**
   - UC email validation
   - Secure password handling
   - Session management

## 📱 Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop layouts
- Progressive Web App (PWA)

## 🔄 State Management
- Centralized stores
- Real-time synchronization
- Optimistic updates
- Cache management

## 📂 Project Structure
```
src/
├── components/         # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and configurations
├── pages/             # Route components
├── stores/            # Zustand state management
├── types/             # TypeScript type definitions
└── tests/             # Test files
```

## 🚀 Deployment
- Netlify hosting
- Automatic deployments
- Environment configuration
- Build optimization

## 🔧 Development Practices
- Component-based architecture
- Type-safe development
- Modular code organization
- Comprehensive testing
- Real-time data synchronization