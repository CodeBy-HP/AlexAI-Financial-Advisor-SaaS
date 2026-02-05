# 🏦 Alex - AI Financial Planning Platform

**Production-grade multi-agent system for intelligent portfolio analysis and retirement planning**

<img src="https://img.shields.io/badge/Python-3.12-blue.svg" alt="Python"> <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6.svg" alt="TypeScript"> <img src="https://img.shields.io/badge/Next.js-15.5-000000.svg" alt="Next.js"> <img src="https://img.shields.io/badge/Terraform-IaC-7B42BC.svg" alt="Terraform"> <img src="https://img.shields.io/badge/AWS-Serverless-FF9900.svg" alt="AWS"> <img src="https://img.shields.io/badge/Azure_OpenAI-GPT--4o-0078D4.svg" alt="Azure OpenAI">

</div>

---

## 🎯 Overview

Five AI agents. One orchestrated system. **Real financial analysis at scale.**

Built on AWS serverless with Terraform, powered by Azure OpenAI GPT-4o, and running vector search at 90% less cost. This isn't a prototype—it's production infrastructure handling multi-tenant workloads with autonomous research, real-time insights, and zero server management.

---

## ✨ Core Features

### 🤖 **INTELLIGENT MULTI-AGENT ORCHESTRATION**
- 5 specialized AI agents collaborating through SQS messaging
- Azure OpenAI GPT-4o powering intelligent analysis
- Parallel Lambda execution for 3x faster processing
- Autonomous research with Tavily API integration
- Each agent focused, independent, unified insights

### ⚡ **PRODUCTION-GRADE INFRASTRUCTURE**
- 100% Terraform-managed serverless AWS architecture
- S3 Vectors for 90% cost reduction vs traditional vector DBs
- Aurora Serverless v2, Lambda, App Runner, SageMaker embeddings
- CloudWatch observability + LangFuse agent tracing
- Zero servers, automatic scaling, pay-per-use

### 🔐 **ENTERPRISE-READY FULL-STACK**
- Next.js 15 + React 19 with TypeScript and Framer Motion
- Clerk authentication with multi-tenant PostgreSQL isolation
- API Gateway with key-based security
- Real-time streaming responses and CloudFront CDN
- EventBridge automated research scheduling (every 2 hours)

---

## 🏛️ System Architecture

### AWS Services Workflow

<div align="center">
<img width="2174" height="1784" alt="aws diagram drawio (1)" src="https://github.com/user-attachments/assets/25fd1db6-0f74-408b-ab91-77773b12442a" />
</div>

### Job Lifecycle

<div align="center">
 <img width="3322" height="4880" alt="Mermaid Chart - Create complex, visual diagrams with text -2026-02-03-165331" src="https://github.com/user-attachments/assets/c8ebfc13-1323-4806-965d-45989f707435" />
</div>

### AWS Infrastructure

- **Compute**: AWS Lambda (6 functions), App Runner (Researcher service)
- **Database**: Aurora Serverless v2 PostgreSQL
- **AI/ML**: Azure OpenAI GPT-4o, SageMaker Serverless (embeddings)
- **Storage**: S3 (vectors, static assets), ECR (Docker images)
- **Orchestration**: SQS, EventBridge Scheduler
- **Frontend**: CloudFront + S3, API Gateway
- **Monitoring**: CloudWatch, LangFuse (observability)

### Database Schema

<div align="center">
<img width="8065" height="4854" alt="Mermaid Chart - Create complex, visual diagrams with text -2026-02-03-161347" src="https://github.com/user-attachments/assets/5ccbed87-e29b-4364-bfb8-717b8a71ed42" />
</div>

**Schema Design**:
- **users**: Clerk authentication with retirement goals and target allocations
- **accounts**: Investment accounts (401k, IRA, taxable) with cash positions
- **positions**: Holdings per account with quantity and valuation date
- **instruments**: Shared ETF/stock reference data with JSONB allocation metadata
- **jobs**: Async analysis tracking with dedicated JSONB fields per agent output (no merging logic needed)

---

## 🛠️ Tech Stack

### **Backend & AI**
- **Language**: Python 3.12 with `uv` package management
- **LLM**: Azure OpenAI GPT-4o (chat completions API)
- **Agents Framework**: OpenAI Agents SDK
- **Embeddings**: SageMaker Serverless (sentence-transformers)
- **Web Search**: Tavily API
- **Observability**: LangFuse for tracing

### **Frontend**
- **Framework**: Next.js 15 (React 19, TypeScript)
- **Styling**: Tailwind CSS
- **Auth**: Clerk
- **Charts**: Recharts
- **Animations**: Framer Motion

### **Infrastructure & DevOps**
- **IaC**: Terraform (modular architecture)
- **Cloud**: AWS (Lambda, Aurora, S3, CloudFront, API Gateway, SQS, EventBridge)
- **Containers**: Docker, ECR
- **Database**: PostgreSQL (Aurora Serverless v2)
- **Vector Storage**: S3 Vectors

---

## 📁 Project Structure

```
alex/
├── backend/                 # Python agents and Lambda functions
│   ├── planner/            # Orchestrator agent (coordinates all agents)
│   ├── tagger/             # Instrument classification agent
│   ├── reporter/           # Portfolio analysis and metrics
│   ├── charter/            # Data visualization and charting
│   ├── retirement/         # Retirement projections
│   ├── researcher/         # Autonomous web research (App Runner)
│   ├── ingest/             # Document processing and vector storage
│   ├── database/           # Shared database library
│   └── api/                # FastAPI backend for frontend
│
├── frontend/               # Next.js application
│   ├── pages/             # Route components
│   ├── components/        # React components
│   └── lib/               # API client and utilities
│
├── terraform/             # Infrastructure as Code (modular)
│   ├── 2_sagemaker/      # SageMaker embedding endpoint
│   ├── 3_ingestion/      # S3 Vectors, ingest Lambda
│   ├── 4_researcher/     # App Runner research service
│   ├── 5_database/       # Aurora Serverless v2
│   ├── 6_agents/         # Multi-agent Lambda deployment
│   ├── 7_frontend/       # CloudFront, S3, API Gateway
│   └── 8_enterprise/     # Monitoring and dashboards
│
└── scripts/               # Deployment automation
```

---

## 🚀 Deployment Architecture

### Infrastructure Provisioning

The entire AWS infrastructure is managed through **Terraform modules**, deployed in sequence:

1. **SageMaker** → Serverless embedding endpoint
2. **Ingestion** → S3 Vectors, document processing Lambda
3. **Researcher** → App Runner service with Tavily integration
4. **Database** → Aurora Serverless v2 cluster
5. **Agents** → Multi-agent Lambda functions + SQS orchestration
6. **Frontend** → CloudFront distribution, S3 hosting, API Gateway
7. **Enterprise** → CloudWatch dashboards and monitoring

### Multi-Agent System

**Planner Agent** (Orchestrator):
- Receives user requests via API Gateway
- Coordinates execution across specialized agents
- Manages state and context flow
- Returns unified responses

**Specialized Agents**:
- **Tagger**: Classifies financial instruments (stocks, bonds, ETFs)
- **Reporter**: Analyzes portfolio performance, risk metrics, allocations
- **Charter**: Generates interactive visualizations and charts
- **Retirement**: Projects retirement scenarios with Monte Carlo simulations
- **Researcher**: Conducts autonomous web research using Tavily API

---

## 📊 What I Built

### Technical Achievements

✅ **Serverless Multi-Agent System**: Deployed coordinated AI agents with sub-2s response times

✅ **Cost-Optimized Infrastructure**: Reduced vector storage costs from $300/mo to $30/mo

✅ **Production-Grade Observability**: Integrated LangFuse for complete agent tracing

✅ **Infrastructure as Code**: 100% Terraform-managed, reproducible deployments

✅ **Real-Time Web Research**: Automated market research with Tavily API integration

✅ **Full-Stack SaaS Platform**: Clerk authentication, multi-tenant PostgreSQL, responsive UI

✅ **Autonomous Scheduling**: EventBridge-triggered research updates every 2 hours

✅ **Enterprise Security**: API Gateway authentication, user-level data isolation

---

## 🎓 What I Learned

### AWS Serverless at Scale
- Architecting multi-Lambda orchestration with SQS
- Optimizing Aurora Serverless v2 for cost and performance
- Managing serverless cold starts and connection pooling

### AI Engineering in Production
- Building reliable multi-agent systems with error handling
- Implementing observability with LangFuse tracing
- Prompt engineering for consistent financial analysis

### Infrastructure as Code
- Modular Terraform architecture for complex systems
- Managing state and dependencies across 7 infrastructure layers
- Automated deployment pipelines with `uv` and Docker

### Vector Search & Embeddings
- Implementing S3 Vectors for cost-effective similarity search
- SageMaker Serverless endpoint optimization
- Chunking strategies for financial documents

### Full-Stack Development
- Next.js 15 App Router with server components
- Real-time streaming from Lambda via API Gateway
- Clerk authentication with multi-tenant isolation

---

## 🔮 Future Enhancements

### Technical Improvements
- **WebSocket Integration**: Replace polling with real-time bidirectional communication
- **Redis Caching**: Cache research results and agent responses
- **A/B Testing**: Compare agent prompts and model performance
- **GraphQL API**: More flexible data fetching for frontend

### Feature Additions
- **Portfolio Optimization**: ML-powered asset allocation recommendations
- **Risk Scoring**: Real-time risk assessment dashboard
- **Document Chat**: Interactive Q&A with uploaded financial documents
- **Mobile App**: React Native companion app

### Infrastructure Evolution
- **Multi-Region Deployment**: Global availability with Route53
- **Kubernetes Migration**: EKS for advanced orchestration
- **Prometheus/Grafana**: Enhanced monitoring stack
- **CI/CD Pipeline**: GitHub Actions for automated testing and deployment

---

## 👤 Author

**Harsh Patel**  
📧 code.by.hp@gmail.com  
🔗 [GitHub](https://github.com/CodeBy-HP) • [LinkedIn](https://www.linkedin.com/in/harsh-patel-389593292/)

---

## 🎓 Special Thanks

A big thank you to **Ed Donner** for his excellent **MLOps Track**, which played a key role in shaping this project and my understanding of building production-grade, agentic AI systems.

📘 **Course:** Generative and Agentic AI in Production  
🔗 https://www.udemy.com/course/generative-and-agentic-ai-in-production/

---

<div align="center">

**⭐ Star this repo if you found it insightful**

</div>
