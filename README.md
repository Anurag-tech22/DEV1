# OmniGuard

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/Anurag-tech22/DEV1/actions/workflows/ci.yml/badge.svg)](https://github.com/Anurag-tech22/DEV1/actions)
[![Python: 3.11+](https://img.shields.io/badge/Python-3.11+-3776AB.svg?logo=python&logoColor=white)](https://python.org)
[![React: 19](https://img.shields.io/badge/React-19.0-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)

OmniGuard is an open-source fraud detection and cyber defense platform. It is designed to identify and neutralize social engineering attacks, phishing, and financial fraud across digital channels.

[Features](#features) • [Architecture](#architecture) • [Installation](#installation) • [API](#api) • [Contributing](CONTRIBUTING.md) • [License](LICENSE)

## Features

- **Threat Core**: Pattern recognition for detecting digital threats, fake KYC, lottery bait, APK droppers, and courier imposter schemes.
- **Threat Radar**: Live scam feed, homoglyph link inspection, and QR/UPI debit analyzer.
- **Audio Guard**: Audio waveform visualizer and speech analyzer for voice cloning detection.
- **Android APK Sandbox**: Manifest privilege analyzer, Accessibility hijacking detector, and trojan profiler.
- **Dossier Export**: Formats incident data into structured evidence dossiers for legal submission.
- **Multi-language Support**: Localization in English, Hindi, Marathi, Spanish, French, German, Chinese, Japanese, Arabic, and Portuguese.
- **Interactive Drills**: Scenario simulator for training users to identify phishing and authority impersonation.
- **Breach Intel**: Checks compromised credentials, leaked hashes, and underground forum data.
- **Audit Logging**: Event telemetry and loss-prevention analytics with local state wipe capabilities.

## Architecture

OmniGuard uses a decoupled architecture with an asynchronous FastAPI backend and a React 19 + Vite frontend.

```
User -> React Frontend -> FastAPI Backend -> Heuristic Rule Engine
                                          -> Threat Intel Correlator
```

## Repository Structure

```
omniguard/
├── app/                        # FastAPI Backend Service
│   ├── main.py                 # API Gateway, routes & endpoints
│   ├── rules.py                # Core scam engines & regex rules
│   └── models.py               # Pydantic schemas & data models
├── web/                        # React 19 Frontend
│   ├── src/
│   │   ├── components/         # Navigation and UI components
│   │   ├── pages/              # Scanner, Simulator, Logs, BreachMonitor
│   │   ├── i18n/               # Internationalization
│   │   ├── App.tsx             # Root application shell & layout
│   │   └── index.css           # Global stylesheet
│   ├── package.json            # Frontend dependencies
│   └── vite.config.ts          # Vite build configuration
├── eval/                       # Benchmark & Evaluation Suite
├── data/                       # Local threat signatures and seed datasets
├── tests/                      # Automated tests
├── Dockerfile                  # Containerized deployment specification
├── requirements.txt            # Python dependencies
└── README.md                   # Platform documentation
```

## Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Anurag-tech22/DEV1.git
cd DEV1
```

### 2. Backend Setup
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API documentation is accessible at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup
```bash
cd web
npm install
npm run dev
```
Open your browser at `http://localhost:5173/`.

### 4. Docker Deployment
```bash
docker build -t omniguard-security .
docker run -p 8000:8000 omniguard-security
```

## API

### `POST /api/scan`
Evaluates an incoming message, SMS, email, or URL for fraud vectors.

**Request:**
```json
{
  "text": "URGENT: Electricity power will be disconnected tonight. Call officer at 9876543210 immediately.",
  "lang": "en"
}
```

**Response:**
```json
{
  "verdict": "scam",
  "score": 92,
  "type": "Utility Impersonation",
  "explain": "High-urgency utility shutoff scam demanding immediate contact via an unverified personal phone number.",
  "reasons": [
    "Fabricated urgency demanding immediate action under threat of disconnection"
  ],
  "actions": [
    "Do not call the provided telephone number"
  ]
}
```

Other available endpoints include `/api/drill`, `/api/history`, `/api/intel`, `/api/url-inspect`, `/api/upi-inspect`, `/api/audio-inspect`, and `/api/apk-inspect`. See the OpenAPI docs at `/docs` for complete details.

## Testing

Run the automated evaluation suite against real-world benchmarks:
```bash
pytest
python eval/run.py
```

## Privacy & Security
- Data is evaluated locally in memory.
- No PII is sent to external proprietary commercial models.
- The platform can be self-hosted and operated in air-gapped environments.

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
