# CaptRAW Documents

*A modern technical blog and documentation management system focused on knowledge sharing and technical content.*

![CaptRAW Documents Banner](https://github.com/hex-0xd4c0/CaptRAW-Documents/blob/94c4cbcd3801a06c1ed7823977460de62f8d7b57/README_Reference/20260401%E6%95%88%E6%9E%9C%E9%A2%84%E8%A7%88%E5%9B%BE.png)

---

## 🚀 Project Overview

**CaptRAW Documents** is a full-featured blog system that provides user management, article management, and content browsing capabilities. The project adopts a modern technology stack with strong emphasis on code quality, security, and user experience.

### ✨ Core Features

* 📝 **Article Management System** – Supports writing and publishing articles in Markdown format
* 🎨 **Modern UI Design** – Responsive design with dark/light theme support
* 🔐 **User Authentication System** – Complete registration, login, and profile management
* 🏷️ **Tag & Category System** – Flexible tagging and categorization of articles
* 📊 **Analytics** – Tracks views, likes, and comments
* 🔧 **Configuration-Driven Architecture** – Flexible configuration system supporting multi-environment deployment
* 🛡️ **Security-Oriented Design** – Sensitive configuration isolation and secure resource access control

---

## 📊 Project Status

* **Current Version**: v0.5.0
* **Development Phase**: Phase 1 – Frontend Development (90% complete) + Backend Foundation (80% complete)
* **Last Updated**: April 2024

### ✅ Completed Features

1. **Project Foundation** – Complete monorepo structure and development environment
2. **Layout System** – Header, Footer, Layout components with responsive design
3. **Homepage Features** – BannerCarousel (auto-rotating), NoticeBoard, ArticleTimeline with pagination
4. **Configuration System** – Secure YAML configuration with frontend runtime loading
5. **Data Layer** – Modular API services (articles, banners, notices, tags, auth, files)
6. **Backend Foundation** – PostgreSQL database, MinIO/S3 object storage, asset signing service
7. **Asset Management** – Signed URL generation, asset registry with database fallback
8. **UI Components** – AssetImage, ThemeToggle, UserAvatar with federation support
9. **Custom Hooks** – useArticles, useAssetUrl, useBanners, useNotices, useTags
10. **Project Documentation** – Complete module documentation across all directories

### 🚧 Features in Progress

1. **Article Detail Page** – Markdown rendering with syntax highlighting
2. **Comment System** – Nested comments with reactions
3. **User Authentication** – Login, registration, OAuth2 integration
4. **Admin Dashboard** – Article, user, and content management
5. **Search Functionality** – Full-text search with filters
6. **API Documentation** – OpenAPI/Swagger specification

---

## 🛠️ Tech Stack

### Frontend

* **Framework**: React 19.2.4 + TypeScript 4.9.5
* **Routing**: React Router DOM 7.13.2
* **State Management**: @tanstack/react-query 5.95.2
* **Styling**: Tailwind CSS 3.4.19
* **HTTP Client**: Axios 1.14.0
* **Build Tool**: Create React App 5.0.1
* **Configuration**: js-yaml 4.1.1
* **Testing**: React Testing Library, Jest

### Backend

* **Runtime**: Node.js + Express 5.2.1
* **Database**: PostgreSQL 16 + pg 8.20.0
* **Object Storage**: @aws-sdk/client-s3 (S3 compatible, MinIO support)
* **Asset Management**: Signed URL generation with expiry, asset registry
* **Database Operations**: Connection pooling, transactions, health checks
* **Configuration**: Unified YAML configuration with environment variable overrides
* **Containerization**: Docker Compose for development environment

---

## 📁 Project Structure

```
CaptRAW-Documents/
├── frontend/                    # Frontend project (React + TypeScript + Tailwind)
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── layout/         # Layout components (Header, Footer, Layout)
│   │   │   ├── ui/             # UI components (AssetImage, ThemeToggle, UserAvatar)
│   │   │   ├── home/           # Homepage components (BannerCarousel, NoticeBoard, ArticleTimeline)
│   │   │   └── articles/       # Article components (ArticleCard)
│   │   ├── pages/              # Page components (HomePage)
│   │   ├── hooks/              # React Hooks (useArticles, useAssetUrl, etc.)
│   │   ├── services/           # API services (modular service architecture)
│   │   ├── config/             # Configuration module (runtimeConfig, urls)
│   │   ├── data/               # Data files (articles, notices, banners JSON)
│   │   ├── types/              # TypeScript definitions
│   │   └── utils/              # Utility functions (assetUrl)
│   ├── public/                 # Static assets
│   ├── scripts/                # Build scripts (config synchronization)
│   └── package.json            # Dependencies
├── backend/                    # Backend project (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── database/          # Database module (PostgreSQL connection pool)
│   │   ├── storage/           # Storage module (S3 compatible client)
│   │   ├── assetRegistry.ts   # Asset registry with database fallback
│   │   ├── assetSignRoute.ts  # Asset signing route handler
│   │   ├── config.ts          # Configuration management
│   │   └── server.ts          # Express server
│   ├── scripts/                # Utility scripts (asset upload)
│   ├── init-db.sql            # Database initialization script
│   └── package.json            # Dependencies
├── Reference/                  # Project documentation and resources
├── scripts/                    # Global scripts (MinIO initialization)
├── config.yaml                 # Main configuration file
├── docker-compose.yml          # Docker configuration (PostgreSQL + MinIO)
└── .gitignore                  # Git ignore file
```

---

## 🚀 Quick Start

### Requirements

* Node.js 18+
* npm 9+ or yarn 1.22+
* Git

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd CaptRAW-Documents
   ```

2. **Install dependencies**

   ```bash
   # Frontend dependencies
   cd frontend
   npm install
   
   # Backend dependencies
   cd ../backend
   npm install
   ```

3. **Start infrastructure services**

   ```bash
   # Start PostgreSQL and MinIO using Docker Compose
   docker-compose up -d
   ```

4. **Initialize the database**

   ```bash
   # Run database initialization
   cd backend
   npm run seed-db
   ```

5. **Upload sample assets**

   ```bash
   # Upload sample images to object storage
   npm run upload-assets
   ```

6. **Start development servers**

   ```bash
   # Terminal 1: Backend server
   cd backend
   npm run dev
   
   # Terminal 2: Frontend server
   cd frontend
   npm start
   ```

5. **Access the application**

   * Open: [http://localhost:3000](http://localhost:3000)

---

## 📖 Usage Guide

### Development Mode

```bash
cd frontend
npm start
```

### Production Build

```bash
npm run build
```

### Run Tests

```bash
npm test
```

---

## 🔧 Development Guide

### Code Standards

* TypeScript for static typing
* ESLint for linting
* Prettier for formatting
* Functional components + Hooks

### Component Development

```typescript
import React from 'react';

interface NewComponentProps {}

const NewComponent: React.FC<NewComponentProps> = (props) => {
  return (
    // JSX
  );
};

export default NewComponent;
```

---

## 🧪 Testing

### Commands

```bash
npm test
npm test -- --testPathPattern=ComponentName
npm test -- --coverage
```

### Strategy

* Unit testing
* Integration testing
* End-to-end testing

---

## 📦 Deployment

### Build

```bash
cd frontend
npm run build
```

### Docker

```bash
docker build -t captraw-documents .
docker run -p 3000:80 captraw-documents
```

### Platforms

* Vercel (Frontend)
* Railway / Render (Backend)
* Docker Hub (Images)

---

## 🔐 Security Considerations

### Configuration Security

* Sensitive configs are not exposed to frontend
* Type validation and error handling
* Safe fallback mechanisms

### Resource Security

* Signed URL support for object storage
* Backend-generated short-lived access URLs
* Permission-based access control

### Network Security

* HTTPS support
* CORS configuration
* API rate limiting

---

## 🤝 Contribution Guide

### Workflow

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

### Code Review

* Must pass TypeScript checks
* All tests must pass
* Follow coding standards
* Update documentation

---

## 📄 License

This project is licensed under the AGPL-3.0 Licens.

---

## 📞 Contact

* **Maintainer**: @[He0xD4C0@hub.captraw.com](mailto:He0xD4C0@hub.captraw.com)
* **Status**: Actively developed
* **Issues**: Use GitHub Issues

---

## 🙏 Acknowledgements

Thanks to all contributors who helped build this project.

---

## 📈 Project Progress

### Roadmap

| Phase                               | Status         | Progress |
| ----------------------------------- | -------------- | -------- |
| Phase 1: Frontend Foundation        | 🟢 In Progress | 90%      |
| Phase 2: Backend Foundation         | 🟢 In Progress | 80%      |
| Phase 3: Article System             | ⚪ Not Started  | 10%      |
| Phase 4: User Authentication        | ⚪ Not Started  | 5%       |
| Phase 5: Admin & Management         | ⚪ Not Started  | 0%       |
| Phase 6: Testing & Deployment       | ⚪ Not Started  | 15%      |

### Detailed Progress

* ✅ Phase 1: Project Initialization & Architecture (100%)
* ✅ Phase 2: Frontend Layout Components (100%)
* ✅ Phase 3: Homepage Components (BannerCarousel, NoticeBoard, ArticleTimeline) (100%)
* ✅ Phase 4: Configuration System (YAML config with runtime loading) (100%)
* ✅ Phase 5: Data Layer & Modular API Services (100%)
* ✅ Phase 6: Asset Management System (Signed URLs, asset registry) (100%)
* ✅ Phase 7: Backend Foundation (PostgreSQL, MinIO, asset signing) (100%)
* ✅ Phase 8: Project Documentation & Code Organization (100%)
* 🟡 Phase 9: Development Infrastructure (Docker Compose, scripts) (90%)
* ⚪ Phase 10: Article Detail Pages & Markdown Rendering (10%)
* ⚪ Phase 11: User Authentication System (5%)
* ⚪ Phase 12: Search & Filtering Functionality (0%)
* ⚪ Phase 13: Admin Dashboard & Management (0%)
* ⚪ Phase 14: Testing & Deployment Pipeline (15%)

---

**Inspired by CaptRAW Community – Misskey Server**
You are also welcome to visit our CaptRAW community to communicate, share life, or just hang out.

---

If you want, I can further optimize this into:

* GitHub README (more concise + badge style)
* Product landing page copy (more marketing-oriented)
* Technical whitepaper style (more formal and structured)

Just specify the target.
