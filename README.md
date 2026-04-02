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

* **Current Version**: v0.6.0
* **Development Phase**: Phase 2 – Real Database Integration (Day 1 completed)
* **Last Updated**: April 2026 (Stage 2, Day 2 in progress)

### ✅ Completed Features

1. **Project Foundation** – Complete monorepo structure and development environment
2. **Layout System** – Header, Footer, Layout components with responsive design
3. **Homepage Features** – BannerCarousel (auto-rotating), NoticeBoard, ArticleTimeline with pagination
4. **Configuration System** – Secure YAML configuration with frontend runtime loading + database-backed dynamic configuration
5. **Data Layer** – Modular API services (articles, banners, notices, tags, auth, files)
6. **Backend Foundation** – PostgreSQL database, MinIO/S3 object storage, asset signing service
7. **Asset Management** – Signed URL generation, asset registry with database fallback
8. **UI Components** – AssetImage, ThemeToggle, UserAvatar with federation support
9. **Custom Hooks** – useArticles, useAssetUrl, useBanners, useNotices, useTags
10. **Project Documentation** – Complete module documentation across all directories
11. **Real Database Architecture** – Complete business tables (users, articles, announcements, banners, server_info)
12. **Server Information System** – Dynamic configuration management with public/private controls
13. **Real API Endpoints** – Article, Banner, and Authentication APIs with full CRUD operations
14. **Database Management Tools** – Reset, seed, and migration scripts
15. **Federal Identity Support** – Fediverse user ID integration in user table

### 🚧 Features in Progress

1. **Frontend Service Layer Refactoring** – Removing mock data, switching to real API calls (Day 2 task)
2. **Article Detail Page** – Markdown rendering with syntax highlighting
3. **Comment System** – Nested comments with reactions
4. **User Authentication Frontend** – Login, registration pages (Day 4 task)
5. **Admin Dashboard** – Article, user, and content management
6. **Search Functionality** – Full-text search with filters
7. **API Documentation** – OpenAPI/Swagger specification

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
│   │   │   ├── index.ts      # Database connection and query utilities
│   │   │   ├── articles.ts   # Article database operations
│   │   │   ├── users.ts      # User database operations
│   │   │   ├── banners.ts    # Banner database operations
│   │   │   └── serverInfo.ts # Server info database operations
│   │   ├── services/         # Business logic services
│   │   │   ├── articleService.ts
│   │   │   ├── authService.ts
│   │   │   ├── bannerService.ts
│   │   │   └── serverInfoService.ts
│   │   ├── routes/          # API route handlers
│   │   │   ├── articleRoute.ts
│   │   │   ├── authRoute.ts
│   │   │   ├── bannerRoute.ts
│   │   │   ├── assetSignRoute.ts
│   │   │   └── serverInfoRoute.ts
│   │   ├── storage/           # Storage module (S3 compatible client)
│   │   ├── assetRegistry.ts   # Asset registry with database fallback
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
| Phase 1: Frontend Foundation        | ✅ Completed   | 100%     |
| Phase 2: Backend Foundation         | ✅ Completed   | 100%     |
| Phase 3: Real API Integration       | 🟡 In Progress | 50%      |
| Phase 4: Frontend Service Refactor  | 🟡 In Progress | 20%      |
| Phase 5: Article Detail Pages       | ⚪ Not Started  | 10%      |
| Phase 6: User Authentication        | ⚪ Not Started  | 20%      |
| Phase 7: Admin & Management         | ⚪ Not Started  | 0%       |
| Phase 8: Testing & Deployment       | ⚪ Not Started  | 15%      |

### Detailed Progress (Phase 2 - Real Database Integration)

* ✅ Phase 2, Day 1: Real Database Architecture (100%)
  - Complete business tables with foreign key relationships
  - UUID-based primary keys for all entities
  - Federal identity support in user table

* ✅ Phase 2, Day 1: Server Information System (100%)
  - Dynamic configuration storage in database
  - Public/private configuration controls
  - Runtime configuration API for frontend

* ✅ Phase 2, Day 1: Article API Implementation (100%)
  - Complete CRUD operations for articles
  - Search, filtering, and pagination
  - Author information joining

* ✅ Phase 2, Day 1: Banner API Implementation (100%)
  - Active banner filtering by date
  - Display order management
  - Admin management endpoints

* ✅ Phase 2, Day 1: Authentication API Implementation (100%)
  - User registration and login
  - JWT token generation (basic)
  - Federal user identity support

* 🟡 Phase 2, Day 2: Frontend Service Layer Refactoring (0%)
  - Remove mock data and simulateDelay
  - Connect to real API endpoints
  - Update error handling and retry logic

* ⚪ Phase 2, Day 3: Article Detail Page Implementation (0%)
  - Article page component
  - Markdown rendering
  - Comment system foundation

* ⚪ Phase 2, Day 4: User Authentication Frontend (0%)
  - Login and registration pages
  - Profile management
  - JWT token handling

### Phase 2 Completion Goals (7-Day Plan)

**✅ Completed (April 1-2):**
1. Real database architecture and business tables
2. Server information configuration system
3. Complete backend API endpoints (articles, banners, auth)
4. Database management scripts

**🔄 In Progress (April 2):**
1. Frontend service layer refactoring

**📅 Upcoming (April 3-7):**
1. Article detail pages
2. User authentication frontend
3. Testing and quality assurance
4. Documentation and deployment preparation

---

**Inspired by CaptRAW Community – Misskey Server**
You are also welcome to visit our CaptRAW community to communicate, share life, or just hang out.

---

If you want, I can further optimize this into:

* GitHub README (more concise + badge style)
* Product landing page copy (more marketing-oriented)
* Technical whitepaper style (more formal and structured)

Just specify the target.
