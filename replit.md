# Overview

This is a professional headshot transformation web application that uses Google's Gemini AI to enhance uploaded images. The application allows users to upload JPEG/JPG photos and transform them into professional portraits while preserving facial features and identity. It's built as a full-stack TypeScript application with a React frontend and Express.js backend, designed to provide a seamless image processing experience.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript, built using Vite for fast development and optimized builds
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: React Context API for API key management, TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **File Handling**: Built-in File API with drag-and-drop support and image preview functionality
- **Form Validation**: Zod schemas for type-safe data validation

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **File Upload**: Multer middleware for handling multipart form data with 10MB file size limits
- **Image Processing**: Stateless processing using Google Gemini AI API
- **Request Handling**: JSON and URL-encoded body parsing with comprehensive error handling
- **Development**: Hot reload with Vite middleware integration and custom logging

## Database and Storage
- **Database**: PostgreSQL with Drizzle ORM configured but minimal schema usage
- **File Storage**: In-memory processing only - no persistent file storage required
- **Session Management**: Stateless design with no user authentication or persistent sessions

## API Design
- **REST Endpoints**: Single main endpoint `/api/transform-image` for image processing
- **Request Format**: Multipart form data with image file and API key
- **Response Format**: JSON with success/error status and base64 encoded processed image
- **Validation**: Server-side validation using Zod schemas for type safety

## Security and Validation
- **File Type Restrictions**: Only JPEG/JPG files accepted with MIME type validation
- **File Size Limits**: 10MB maximum file size enforced at middleware level
- **API Key Handling**: Client-side API key storage (not persisted) sent with each request
- **Input Sanitization**: Comprehensive validation using Zod schemas on both client and server

## Build and Deployment
- **Development**: Concurrent client/server development with Vite HMR and tsx for TypeScript execution
- **Production Build**: Vite builds optimized frontend bundle, esbuild creates server bundle
- **Static Assets**: Frontend assets served from `/dist/public` in production
- **Environment**: Environment variable configuration for database and API credentials

# External Dependencies

## Core AI Service
- **Google Gemini AI**: Primary image processing service using `@google/genai` SDK
- **Image Analysis**: Advanced AI-powered professional portrait transformation
- **API Integration**: Direct API calls with user-provided API keys

## Database and ORM
- **PostgreSQL**: Primary database via `@neondatabase/serverless` driver
- **Drizzle ORM**: Type-safe database operations with `drizzle-orm` and `drizzle-kit`
- **Migrations**: Database schema versioning through Drizzle migration system

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **Shadcn/ui**: Pre-built component library with consistent design system
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **Vite**: Fast build tool with HMR for development and optimized production builds
- **TypeScript**: Full type safety across frontend, backend, and shared schemas
- **ESBuild**: Fast JavaScript bundler for server-side code compilation
- **Replit Integration**: Development environment optimizations and error handling