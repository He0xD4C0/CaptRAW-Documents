Below is a precise English translation of your document, preserving structure and technical intent:

---

# CaptRAW Documents

*A modern technical blog and documentation management system focused on knowledge sharing and technical content.*

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

* **Current Version**: v0.4.0-beta
* **Development Phase**: Phase 1 – Frontend Development (75% complete) + Backend Foundation
* **Last Updated**: March 31, 2026

### ✅ Completed Features

1. **Project Foundation** – Complete structure and development environment
2. **Layout System** – Header, Footer, and Layout components
3. **Homepage Features** – Banner carousel, bulletin board, article timeline
4. **Configuration System** – Secure configuration management and unified resource handling
5. **Data Layer** – API services and data management
6. **Backend Foundation** – Database, object storage, and asset management
7. **Project Documentation** – Complete module documentation and progress reports

### 🚧 Features in Progress

1. **Article Detail Page** – Content rendering and Markdown support
2. **Comment System** – Article interaction and discussion
3. **User Authentication** – Login, registration, profile pages
4. **Admin Dashboard** – Administrative control panel

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

### Backend (Partially Implemented)

* **Runtime**: Node.js + Express 5.2.1
* **Database**: PostgreSQL + pg 8.20.0
* **Object Storage**: @aws-sdk/client-s3 (S3 compatible)
* **Asset Management**: Signed URL generation and asset registry
* **Database Operations**: Connection pooling, transactions, CRUD operations
* **Configuration**: Unified YAML configuration with environment variables

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

2. **Install frontend dependencies**

   ```bash
   cd frontend
   npm install
   ```

3. **Create configuration file**

   ```bash
   cp config.example.yaml config.yaml
   nano config.yaml
   ```

4. **Start development server**

   ```bash
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

This project is licensed under the MIT License – see the LICENSE file for details.

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
| Phase 1: Frontend Development       | 🟢 In Progress | 75%      |
| Phase 2: Backend Foundation         | 🟢 In Progress | 70%      |
| Phase 3: Article System             | ⚪ Not Started  | 0%       |
| Phase 4: User Authentication        | ⚪ Not Started  | 0%       |
| Phase 5: Admin & Management         | ⚪ Not Started  | 0%       |
| Phase 6: Testing & Deployment       | ⚪ Not Started  | 0%       |

### Detailed Progress

* ✅ Phase 1: Initialization & Architecture (100%)
* ✅ Phase 2: Layout Components (100%)
* ✅ Phase 3: Homepage Components (100%)
* ✅ Phase 4: Configuration System (100%)
* ✅ Phase 5: Data Layer & API Services (100%)
* ✅ Phase 6: Project Documentation & Cleanup (100%)
* 🟡 Phase 7: Backend Foundation (70%)
* ⚪ Phase 8: Article Pages (Pending)
* ⚪ Phase 9: Authentication System (Pending)
* ⚪ Phase 10: Admin Panel (Pending)

---

**Inspired by CaptRAW Community – Misskey Server**
You are also welcome to visit our CaptRAW community to communicate, share life, or just hang out.

---

If you want, I can further optimize this into:

* GitHub README (more concise + badge style)
* Product landing page copy (more marketing-oriented)
* Technical whitepaper style (more formal and structured)

Just specify the target.
