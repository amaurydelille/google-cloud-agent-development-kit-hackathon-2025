# VentureScope - AI-Powered Business Idea Analyzer

**Comprehensive business intelligence platform powered by Google Cloud Agent Development Kit (ADK)**

A full-stack application that transforms business ideas into actionable insights through intelligent web research, data analysis, and multi-source intelligence gathering.

---

## 🚀 Project Overview

VentureScope is a sophisticated business analysis platform that leverages Google Cloud's Agent Development Kit (ADK) to orchestrate multiple AI agents for comprehensive market research and business validation. The platform combines web search, social media analysis, and real-time data processing to deliver professional-grade business intelligence.

---

## ✨ Core Features

### 1. **Intelligent Web Research**
- **Google Search Integration**: Custom search API integration for targeted market research
- **Website Content Analysis**: Automated content extraction and analysis from relevant sources
- **Sentiment Analysis**: Advanced sentiment scoring using Google Cloud Natural Language API
- **Real-time Processing**: Streaming analysis results with live progress updates

### 2. **Multi-Agent Intelligence System**
- **Sequential Agent Orchestration**: Coordinated workflow across specialized AI agents
- **Google Research Agent**: Web search and content analysis specialist
- **Reddit Analysis Agent**: Social media sentiment and community insights
- **Data Analytics Agent**: BigQuery integration for market metrics
- **Market Intelligence Agent**: Synthesized insights and trend analysis

### 3. **Data Analytics & Insights**
- **BigQuery Integration**: Access to public datasets for economic indicators
- **Market Metrics**: Real-time data extraction and analysis
- **Trend Identification**: Growth patterns and market opportunities
- **Risk Assessment**: Automated risk factor identification

### 4. **Modern User Interface**
- **Real-time Event Streaming**: Live analysis progress with SSE (Server-Sent Events)
- **Interactive Dashboard**: Comprehensive results visualization
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Progressive Web App**: Modern React-based frontend

### 5. **Professional Reporting**
- **Structured Data Output**: JSON-formatted analysis results
- **Sentiment Scoring**: Quantified market sentiment analysis
- **Metric Visualization**: Clear presentation of key business indicators
- **Session Persistence**: Analysis results stored for dashboard viewing

---

## 🛠️ Technology Stack

### **Backend (Python)**
| Component | Technology | Purpose |
|-----------|------------|---------|
| **AI Framework** | Google Cloud ADK | Agent orchestration and workflow management |
| **API Framework** | FastAPI | High-performance async API server |
| **AI Models** | Gemini 2.0 Flash, Gemini 1.5 Pro | Language models for analysis |
| **Data Processing** | Google Cloud Natural Language API | Sentiment analysis |
| **Database** | Google BigQuery | Public dataset queries |
| **Search** | Google Custom Search API | Web research capabilities |
| **Web Scraping** | BeautifulSoup4, Requests | Content extraction |
| **Deployment** | Vercel | Serverless Python deployment |

### **Frontend (TypeScript/React)**
| Component | Technology | Purpose |
|-----------|------------|---------|
| **Framework** | Next.js 15.3.3 | React-based web application |
| **Language** | TypeScript 5 | Type-safe development |
| **Styling** | Tailwind CSS 4 | Utility-first styling |
| **HTTP Client** | Axios | API communication |
| **Icons** | Lucide React | Modern icon library |
| **Fonts** | Google Fonts (Besley) | Typography |
| **State Management** | React Hooks | Component state management |

### **Infrastructure & DevOps**
| Component | Technology |
|-----------|------------|
| **Backend Hosting** | Vercel (Python Runtime) |
| **Frontend Hosting** | Vercel |
| **API Communication** | Server-Sent Events (SSE) |
| **CORS** | FastAPI CORS middleware |
| **Environment** | Environment variables |

---

## 📁 Project Structure

```
google-cloud-agent-development-kit-hackathon-2025/
├── backend/                    # Python FastAPI backend
│   ├── src/
│   │   ├── agents/            # AI agent implementations
│   │   │   ├── google/        # Google search & analysis agent
│   │   │   └── reddit/        # Reddit sentiment analysis agent
│   │   └── main.py            # FastAPI application entry point
│   ├── utils/                 # Utility functions
│   │   ├── models.py          # Google Cloud API integrations
│   │   └── requests.py        # HTTP request utilities
│   ├── requirements.txt       # Python dependencies
│   ├── setup.py              # Package setup
│   └── vercel.json           # Vercel deployment config
├── client/                    # Next.js React frontend
│   ├── src/
│   │   ├── app/              # App router pages
│   │   ├── components/       # React components
│   │   │   ├── analysis/     # Analysis-related components
│   │   │   ├── layout/       # Layout components
│   │   │   └── ui/           # UI components
│   │   ├── hooks/            # Custom React hooks
│   │   └── types/            # TypeScript type definitions
│   ├── package.json          # Node.js dependencies
│   └── next.config.ts        # Next.js configuration
└── assets/                   # Project assets
```

---

## 🔄 Architecture & Workflow

### **Agent Workflow**
1. **Search Agent**: Analyzes Google search results for business relevance
2. **Content Agent**: Fetches and analyzes website content with sentiment scoring
3. **BigQuery Agent**: Queries public datasets for market metrics
4. **Synthesis Agent**: Combines insights into structured analysis

### **Data Flow**
1. User submits business idea via React frontend
2. FastAPI receives request and initializes Google Agent
3. Sequential agent execution with real-time streaming
4. Results aggregated and sent to frontend dashboard
5. Interactive visualization of analysis results

### **Real-time Communication**
- **Server-Sent Events (SSE)** for live progress updates
- **Streaming JSON responses** for incremental results
- **Session persistence** for dashboard navigation

---

## 🎯 Key Capabilities

### **Web Intelligence**
- Automated Google search result analysis
- Website content extraction and processing
- Sentiment analysis of market content
- Real-time competitive landscape assessment

### **Data Analytics**
- BigQuery public dataset integration
- Economic indicator analysis
- Market trend identification
- Quantitative metric extraction

### **Social Intelligence**
- Reddit community analysis (parallel processing)
- Social sentiment scoring
- Community trend identification
- Pros/cons analysis from social discussions

### **Business Intelligence**
- Structured analysis output
- Risk factor identification
- Market opportunity assessment
- Actionable business insights

---

## 🚀 Getting Started

### **Prerequisites**
- Google Cloud Platform account
- Google Custom Search API credentials
- BigQuery access
- Node.js 18+
- Python 3.9+

### **Environment Variables**
```bash
GOOGLE_CUSTOM_SEARCH_API=your_api_key
GOOGLE_CX=your_custom_search_engine_id
GOOGLE_APPLICATION_CREDENTIALS=path_to_service_account
```

### **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
uvicorn src.main:app --reload
```

### **Frontend Setup**
```bash
cd client
npm install
npm run dev
```

---

## 📊 Analysis Output Structure

```typescript
interface StructuredAnalysisResult {
  summary: {
    summary: string;
    sentiment_score: number;
    sentiment_magnitude: number;
  };
  bigquery_metrics: MetricData[];
  statista_insights: MetricData[];
  timestamp: number;
}
```

---

## 🌟 Value Proposition

- **AI-Powered Research**: Automated web research and content analysis
- **Real-time Intelligence**: Live streaming analysis with progress updates
- **Multi-Source Data**: Web, social media, and public dataset integration
- **Professional Output**: Structured, quantified business intelligence
- **Modern UX**: Responsive, interactive dashboard experience

---

**Built for Google Cloud ADK Hackathon 2025**