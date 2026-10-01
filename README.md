# 🛡️ ForensicVault — Multi-Vendor DVR/NVR Forensic Analysis Suite

<div align="center">

<img src="static/img/logo_cs_transparent.png" alt="Code Sentinels Logo" width="170" />

### Standardized Acquisition, Deep Video Recovery, Tamper Detection & Cryptographic Custody for Surveillance Evidence

**Smart India Hackathon (SIH) 2026** • **Problem Statement ID:** SIH26150  
**Theme:** Blockchain & Cyber Security • **Team:** Code-Sentinels (Team ID: 192057)

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Framework-Flask%203.0-000000.svg?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Legal Compliance](https://img.shields.io/badge/Legal%20Standard-BSA%202023%20Sec.%2063-059669.svg)](https://www.mha.gov.in/)
[![Hash Ledger](https://img.shields.io/badge/Integrity-SHA--256%20Blockchain%20Ledger-06b6d4.svg)](https://en.wikipedia.org/wiki/SHA-2)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-4f46e5.svg)](#)
[![UI Theme](https://img.shields.io/badge/Design-Cyber%20Dark%20%26%20Forensic%20Light%20Mode-f59e0b.svg)](#)

</div>

---

## 📑 Table of Contents

1. [Executive Summary & Problem Statement](#-executive-summary--problem-statement)
2. [Proposed Solution Architecture](#-proposed-solution-architecture)
3. [Key Forensic Capabilities](#-key-forensic-capabilities)
4. [Tech Stack & System Architecture](#-tech-stack--system-architecture)
5. [Prerequisites & System Requirements](#-prerequisites--system-requirements)
6. [Quick Start Guide (Installation & Setup)](#-quick-start-guide-installation--setup)
   - [Method 1: 1-Click Startup (Windows `start.bat`)](#-method-1-1-click-startup-windows-recommended)
   - [Method 2: Manual Setup via Terminal](#-method-2-manual-setup-via-terminal)
7. [Step-by-Step User Manual (How to Use)](#-step-by-step-user-manual-how-to-use)
   - [Step 1: Dashboard Navigation & Theme Selection](#step-1-dashboard-navigation--theme-selection)
   - [Step 2: Instant Evaluation via "Demo Data"](#step-2-instant-evaluation-via-demo-data)
   - [Step 3: Creating an Official Forensic Case](#step-3-creating-an-official-forensic-case)
   - [Step 4: Evidence Acquisition & Bit-Stream Hashing](#step-4-evidence-acquisition--bit-stream-hashing)
   - [Step 5: Automated Multi-Vendor Signature Detection](#step-5-automated-multi-vendor-signature-detection)
   - [Step 6: Deep H.264 NAL-Unit Carving & Recovery](#step-6-deep-h264-nal-unit-carving--recovery)
   - [Step 7: Video Tamper & GOP Anomaly Analysis](#step-7-video-tamper--gop-anomaly-analysis)
   - [Step 8: Multi-Camera Timeline Reconstruction](#step-8-multi-camera-timeline-reconstruction)
   - [Step 9: Cryptographic Blockchain Chain of Custody](#step-9-cryptographic-blockchain-chain-of-custody)
   - [Step 10: Generating Section 63 BSA 2023 Court Report](#step-10-generating-section-63-bsa-2023-court-report)
8. [REST API Documentation](#-rest-api-documentation)
9. [Project Directory Layout](#-project-directory-layout)
10. [Legal & Regulatory Compliance](#-legal--regulatory-compliance)
11. [Troubleshooting & FAQs](#-troubleshooting--faqs)
12. [Team & Contact](#-team--contact)

---

## 📌 Executive Summary & Problem Statement

### The Real-World Challenge
In criminal investigations, surveillance footage from Digital Video Recorders (DVR) and Network Video Recorders (NVR) is often the most critical digital evidence. However, digital forensic examiners face steep challenges:
- **Proprietary, Non-Standard File Systems:** Major surveillance OEMs (such as **Hikvision (HIKFS)**, **Dahua (DHAV)**, **CP Plus**, **Samsung / Hanwha Techwin**, **Bosch**, and **Honeywell**) use proprietary disk formatting and fragmented storage layouts. Conventional disk forensic tools (e.g., standard file system carvers) cannot parse these unindexed partitions.
- **Intentional Spoliation & Overwriting:** Suspects intentionally format disks, delete specific video blocks, or disconnect cameras during an offense.
- **Sophisticated Video Tampering:** Footage can be altered through selective frame dropping, altered timestamp watermarks, or software re-encoding (e.g., using `x264`/`FFmpeg` to fabricate CCTV footage).
- **Admissibility in Courts of Law:** Digital evidence is easily rejected in judicial proceedings unless an unbroken, cryptographically verified **Chain of Custody** and a certified certificate under **Section 63 of Bharatiya Sakshya Adhiniyam, 2023 (BSA 2023)** (formerly Section 65B of Indian Evidence Act) is established.

### ForensicVault Solution
**ForensicVault** provides an end-to-end, vendor-agnostic forensic suite capable of:
1. Performing **hardware read-only bit-stream acquisition** with dual SHA-256 pre/post hashing.
2. Automatically classifying surveillance architectures via **magic byte signature inspection**.
3. Reconstructing unindexed/deleted video fragments via **deep H.264 NAL-unit byte carving**.
4. Detecting frame drops, GOP (Group of Pictures) boundary truncations, and software re-encoding footprints.
5. Maintaining an append-only, **SHA-256 blockchain custody ledger**.
6. Exporting court-certified forensic dossiers with **legal certificates under BSA 2023 Section 63**.

---

## 🏗️ Proposed Solution Architecture

<div align="center">
  <img src="static/img/image4.png" alt="ForensicVault Proposed Architecture" width="900" />
</div>

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ 1. ACQUISITION   │───>│ 2. VENDOR DETECT │───>│ 3. VIDEO CARVE   │───>│ 4. TIMELINE      │
│ Read-only Image  │    │ HIKFS, DHAV,     │    │ H.264 NAL Units  │    │ Multi-Channel    │
│ SHA-256 Hashing  │    │ MPEG-PS, Hanwha  │    │ Deleted Sectors  │    │ Synchronized Map │
└──────────────────┘    └──────────────────┘    └──────────────────┘    └──────────────────┘
                                                                                  │
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐              ▼
│ 8. COURT DOSSIER │<───│ 7. CUSTODY CHAIN │<───│ 6. GOP ANALYSIS  │<───│ 5. TAMPER AUDIT  │
│ BSA 2023 Sec 63  │    │ Cryptographic    │    │ I, P, B Slices   │    │ Timestamp Gaps   │
│ Certified PDF    │    │ Block Ledger     │    │ Missing Frames   │    │ Transcode Signs  │
└──────────────────┘    └──────────────────┘    └──────────────────┘    └──────────────────┘
```

<div align="center">
  <img src="static/img/image5.png" alt="Forensic Workflow Process" width="600" />
</div>

---

## 🚀 Key Forensic Capabilities

### 1. Bit-Stream Read-Only Imaging & SHA-256 Verification
- Enforces strict write-blocking protocols (compatible with Tableau, Atola, and FTK Imager write-blockers).
- Calculates cryptographic SHA-256 hashes immediately at ingestion and after each analytical stage to guarantee zero-byte alteration.
- Supports physical disk dumps (`.dd`, `.raw`, `.img`), Expert Witness files (`.E01`), and raw stream extractions (`.dav`, `.264`, `.h264`, `.mp4`).

### 2. Multi-Vendor Automated Signature Detection
Inspects byte-level magic numbers, file headers, and internal container markers to identify:
- **Hikvision**: Detects `HIKFS` volume signatures (`0x48494B4653`), HKH streams, and Hikvision CRC watermarks.
- **Dahua**: Recognizes `DHAV` container headers, `DHI` magic numbers, and proprietary index tables.
- **CP Plus**: Identifies CP-Plus Orange/Indigo DVR streams, UVR MPEG-PS wrappers, and HiSilicon DSP encoder footprints.
- **Samsung / Hanwha Techwin**: Identifies SUNAPI, SEC video container formats.
- **Bosch**: Parses DIVAR IP and VRM surveillance streams.
- **Honeywell**: Recognizes MAXPRO NVR recording container layouts.
- **Vendor-Agnostic Fallback**: Automatically activates deep generic NAL-unit carving when unknown or damaged headers are detected.

### 3. Deep H.264 NAL-Unit Carving
- Scans raw sector dumps byte-by-byte for 4-byte (`0x00 00 00 01`) and 3-byte (`0x00 00 01`) NAL start codes.
- Extracts and decodes:
  - **SPS (Type 7)**: Video resolution (e.g., 1080p, 4K), Profile/Level, chroma sub-sampling.
  - **PPS (Type 8)**: CABAC/CAVLC entropy parameters.
  - **IDR Keyframes (Type 5)**: Intra-coded frames containing complete visual scene data.
  - **Non-IDR Slices (Type 1)**: Motion predictive P-frames and B-frames.
  - **SEI (Type 6)**: Supplemental enhancement info containing DVR hardware timecodes and camera IDs.
- Stitches unallocated or fragmented video slices back into playable streams.

### 4. Frame-Level Tamper & Spoliation Detection
- **Timestamp Discontinuity Detection**: Scans continuous video timecodes and highlights sudden time jumps (e.g., a 252-second cut void where surveillance was wiped).
- **GOP Boundary Integrity**: Identifies broken Groups of Pictures where I-frames are isolated or predictive slices lack anchor references.
- **Software Re-Encoding Footprint Detection**: Flags the presence of desktop/server encoding strings (such as `x264 core 164 - H.264/MPEG-4 AVC codec`) in footage claimed to be direct hardware CCTV recordings, providing undeniable proof of video fabrication.

### 5. Blockchain Chain of Custody Ledger
- Each forensic action (Ingestion, Carving, Anomaly Detection, Officer Verification, Report Generation) is recorded as a linked cryptographic block.
- Implements strict block verification:
  $$\text{Block Hash} = \text{SHA256}(\text{CaseID} \parallel \text{Action} \parallel \text{Custodian} \parallel \text{Timestamp} \parallel \text{PreviousHash})$$
- 1-click ledger audit verifies that not a single record or hash in the case history has been retroactively altered.

### 6. Court-Certified BSA 2023 Section 63 Legal Reporting
- Produces court-admissible PDF dossiers generated in accordance with **Section 63 of Bharatiya Sakshya Adhiniyam, 2023**.
- Features an embedded certificate of authenticity, examiner credentials, judicial watermark seal, hardware details, tamper summary tables, and full cryptographic SHA-256 audit trails.

---

## 💻 Tech Stack & System Architecture

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend Engine** | Python 3.10+ | Core forensic processing, byte stream manipulation, algorithms |
| **Web Server** | Flask 3.0.3, Werkzeug | REST API, session management, static asset streaming |
| **Database** | SQLite3 (WAL Mode) | Zero-configuration, ACID compliant local forensic repository |
| **PDF Generation** | ReportLab 4.2.5 | High-resolution, multi-page court document rendering |
| **Image / Media** | Pillow 10.4.0 | Frame extraction, badge rendering, thumbnail generation |
| **Frontend UI** | HTML5, Vanilla CSS3 | Custom Glassmorphism 2.0 system, dynamic responsive grid |
| **Visual Effects** | HTML5 Canvas / JS | Dynamic particle background, live tactical radar canvas, 3D tilt |
| **Integrity Engine** | SHA-256 Ledger | Cryptographic blockchain chain-of-custody engine |

---

## ⚙️ Prerequisites & System Requirements

- **Operating System:** Windows 10/11, Ubuntu 20.04+, Debian, macOS.
- **Python:** Version 3.10 or higher installed and added to system PATH.
- **Hardware:**
  - Minimum: 4 GB RAM, Dual-core CPU.
  - Recommended: 8 GB+ RAM, Quad-core CPU (for handling multi-gigabyte disk dumps).
- **Browser:** Any modern Chromium-based browser (Google Chrome, Brave, Microsoft Edge) or Mozilla Firefox.

---

## ⚡ Quick Start Guide (Installation & Setup)

### 🚀 Method 1: 1-Click Startup (Windows) [RECOMMENDED]

If you are on Windows, simply double-click **`start.bat`** in the project root directory!

```cmd
start.bat
```

**What `start.bat` does automatically:**
1. Checks if Python 3.10+ is installed in PATH.
2. Automatically installs/verifies all required packages (`pip install -r requirements.txt`).
3. Automatically initializes and seeds the forensic database if running for the first time.
4. Detects both **Localhost (`127.0.0.1:5000`)** and **LAN/WiFi IP (`192.168.x.x:5000`)** for multi-device access.
5. Automatically opens `http://127.0.0.1:5000/` in your default browser.

---

### 💻 Method 2: Manual Setup via Terminal

#### Step 1: Open Terminal in Project Root
```bash
cd SIH_project
```

#### Step 2: (Optional) Create & Activate Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux / macOS
python3 -m venv venv
source venv/bin/activate
```

#### Step 3: Install Required Dependencies
```bash
pip install -r requirements.txt
```
*Required packages: `flask==3.0.3`, `flask-cors==4.0.1`, `reportlab==4.2.5`, `Werkzeug==3.0.4`, `Pillow==10.4.0`.*

#### Step 4: Initialize Demo Dataset
```bash
python backend/seed_data.py
```
This populates the database (`forensic_tool.db`) with realistic CCTV surveillance scenarios, 4 camera channels, tamper anomalies, and pre-calculated SHA-256 blockchain blocks.

#### Step 5: Start the Flask Forensic Server
```bash
python app.py
```

#### Step 6: Access the Application
Open your web browser and go to:
```
http://127.0.0.1:5000/
```

---

## 📖 Step-by-Step User Manual (How to Use)

Follow this clear, step-by-step workflow to perform end-to-end DVR/NVR forensic analysis:

```
Step 1: Open Dashboard  ──>  Step 2: Seed / Load Case  ──>  Step 3: Acquire Image
                                                                     │
Step 6: GOP & Tamper    <──  Step 5: NAL Carve Video   <──  Step 4: Detect Vendor
      │
      └──>  Step 7: Multi-Cam Timeline  ──>  Step 8: Audit Custody  ──>  Step 9: Export PDF
```

---

### Step 1: Dashboard Navigation & Theme Selection
1. Navigate to `http://127.0.0.1:5000/` in your browser.
2. **Top Navigation Bar:**
   - **Theme Switcher:** Click the Sun/Moon toggle (`☀️ Light Mode` / `🌙 Dark Mode`) to alternate between:
     - **Cyber Command Dark Theme**: Designed for low-light digital forensic labs.
     - **High-Contrast Laboratory Light Theme**: Optimized for daylight report reading and presentation.
   - **Tactical Radar:** Displays real-time sweep tracking connected CCTV channels and active analysis threads.
   - **KPI Metric Badges:** Real-time counters showing Total Cases, Seized Evidence Volumes, Carved Video Clips, and Blockchain Blocks.

---

### Step 2: Instant Evaluation via "Demo Data"
- In the top navigation bar, click the **"⚡ Reset Demo Data"** button.
- This immediately resets and provisions a comprehensive multi-camera forensic investigation:
  - **Case ID:** `CASE-2026-BLR-089` (Cyber City Jewel Robbery)
  - **Evidence:** Hikvision 16-Channel DVR Seized Hard Disk (2TB Bit-Stream Image)
  - **Channels:** 4 Synchronized Camera Angles (Main Gate, Vault Corridor, Server Room, Exit Alley)
  - **Anomalies Injected:** 252-second timestamp blackout cut on Channel 2, `x264 core 164` software re-encode anomaly on Channel 3.

---

### Step 3: Creating an Official Forensic Case
1. Click the **"Cases"** tab in the navigation menu.
2. View existing registered cases or click **"Register New Case"**.
3. Fill in the statutory case fields:
   - **Case Identifier:** e.g., `CASE-2026-DLH-014`
   - **FIR / Crime Number:** e.g., `FIR-342/2026 U/S 307/392 IPC`
   - **Police Station / Unit:** e.g., `Special Cyber Forensics Division, New Delhi`
   - **Lead Forensic Examiner:** e.g., `Insp. Yogesh M S`
   - **Case Description & Incident Date:** Incident background details.
4. Click **"Register Case"** — the case is saved to the SQLite database and an initial genesis block is recorded in the blockchain custody ledger.

---

### Step 4: Evidence Acquisition & Bit-Stream Hashing
1. Navigate to the **"Acquisition"** tab.
2. Select your active Case from the dropdown menu.
3. Configure the Acquisition Parameters:
   - **Source Device:** e.g., `PhysicalDrive2 (Hikvision DS-7216HQHI-K1)`
   - **Acquisition Protocol:** Select `E01 (Expert Witness)` or `Raw Bit-Stream (.dd/.img)`.
   - **Hardware Write-Blocker Status:** Toggle to **Enabled** (simulates Tableau T8u bridge connection).
4. Upload or select an evidence image file.
5. Click **"Ingest & Verify SHA-256"**.
6. The system calculates and displays:
   - **Pre-Ingest SHA-256:** `9f3a8b27c14e05d6...`
   - **Post-Ingest SHA-256:** `9f3a8b27c14e05d6...`
   - **Integrity Status:** `MATCH - 100% BIT-STREAM IDENTICAL (ZERO ALTERATION)`.

---

### Step 5: Automated Multi-Vendor Signature Detection
1. Once evidence is ingested, the engine reads the primary sector blocks.
2. The **Vendor Detection Engine** inspects the magic headers and displays:
   - **Detected Vendor:** e.g., `Hikvision (HIKFS 4.0)`
   - **Confidence Score:** `98.7%`
   - **Identified Signatures:** `0x48494B4653 ('HIKFS')` magic bytes, `HKH` frame headers, proprietary CRC32 checksum.
   - **Drive Architecture:** Channel multiplexing layout, block sector allocation size (typically 128KB or 2MB clusters).

---

### Step 6: Deep H.264 NAL-Unit Carving & Recovery
1. Navigate to the **"Video & Carve"** tab.
2. Click **"Start Deep NAL Carve"** to trigger the byte-level scanner.
3. Watch the **Interactive Laser Sector Carving Scanner** modal scan through sectors:
   - Highlighting unallocated sectors containing orphaned H.264 video streams.
4. Inspect Carved Output:
   - **Carved Clips Table:** Lists recovered video clips, start sector, byte offset, duration, and frame count.
   - **Interactive CCTV Simulated Player:** Click any carved clip to play back the recovered surveillance stream.
   - **NAL Unit Breakdown:** Displays the parsed count of SPS, PPS, IDR Keyframes (I-frames), P-frames, and B-frames.

---

### Step 7: Video Tamper & GOP Anomaly Analysis
1. Navigate to the **"Tamper Detection"** tab.
2. Click **"Run Automated Tamper Audit"**.
3. The engine parses the video frame sequence and visualizes the results:
   - **GOP Sequence Visualizer:** Renders an interactive strip of frame types (`[I] [P] [P] [P] [B] ...`).
   - **GOP Break / Frame Void:** Identifies where the GOP was truncated mid-sequence without a trailing I-frame.
   - **Timestamp Discontinuity Alert:** Flags the exact gap:
     ```
     [CRITICAL] Timestamp Gap Detected on Camera 02 (Vault Corridor):
     Frame 1420 timestamp: 2026-10-01 14:22:18
     Frame 1421 timestamp: 2026-10-01 14:26:30
     Discontinuity: 252.00 seconds missing footage!
     ```
   - **Transcoding Anomaly Alert:**
     ```
     [WARNING] Software Re-Encoding Artifact Detected on Camera 03:
     Header metadata contains 'x264 core 164 r3095' encoder signature.
     Hardware DVR does NOT use desktop x264 encoders. Video has been modified.
     ```

---

### Step 8: Multi-Camera Timeline Reconstruction
1. Navigate to the **"Timeline"** tab.
2. View the unified multi-channel event timeline:
   - Synchronizes footage from Camera 1 (Main Gate), Camera 2 (Vault Corridor), Camera 3 (Server Room), and Camera 4 (Exit Alley).
   - Color-coded status ribbons:
     - 🟩 **Green Ribbon:** Intact, verified continuous footage.
     - 🟧 **Orange Ribbon:** Flagged suspect segment (re-encoded / altered).
     - 🟥 **Red Ribbon:** Detected timestamp gap / blackout void.
3. Examiners can correlate events across different camera angles at the exact second of an incident.

---

### Step 9: Cryptographic Blockchain Chain of Custody
1. Navigate to the **"Chain of Custody"** tab.
2. View the chronological block ledger. Each block records:
   - Block Index, Case ID, Action Performed, Custodian Name/Rank, Timestamp, Action Metadata.
   - Previous Block Hash ($\text{SHA-256}$)
   - Current Block Hash ($\text{SHA-256}$)
3. Click the **"Verify Ledger Integrity"** button:
   - The engine traverses the entire block sequence from Genesis Block to the latest entry, recomputing each cryptographic hash.
   - Returns: `ALL BLOCKS VALID - ZERO TAMPERING DETECTED`.

---

### Step 10: Generating Section 63 BSA 2023 Court Report
1. Navigate to the **"Court Reports"** tab.
2. Select your Case ID and review the on-screen **Certificate of Authenticity Preview**.
3. Click **"Generate Certified PDF Dossier"**:
   - The ReportLab engine renders a multi-page, high-resolution forensic dossier.
   - Includes:
     - Government/Law Enforcement Header & Emblem
     - Section 63 Bharatiya Sakshya Adhiniyam, 2023 Statutory Certification
     - Examiner Declaration signed under legal penalties
     - Evidence Acquisition Table & Pre/Post SHA-256 Hash Verification
     - Multi-Vendor Hardware Diagnostic Analysis
     - Forensic Carving & Recovered Footage Breakdown
     - Tamper Detection Findings & Incident Timestamps
     - Complete Blockchain Chain of Custody Audit Log
4. Click **"Download Official PDF"** — save the `.pdf` file directly for courtroom submission.

---

## 🔌 REST API Documentation

ForensicVault provides a complete, developer-friendly REST API:

| HTTP Method | API Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Fetches system KPI counters and live tactical status |
| `GET` | `/api/cases` | Retrieves list of all forensic cases |
| `POST` | `/api/cases` | Registers a new forensic case |
| `GET` | `/api/cases/<case_id>` | Fetches detailed case dossier including evidence and channels |
| `POST` | `/api/cases/<case_id>/ingest` | Ingests evidence image, runs write-blocker SHA-256 hashing |
| `GET` | `/api/cases/<case_id>/vendor-detect` | Executes multi-vendor signature identification engine |
| `POST` | `/api/cases/<case_id>/carve` | Runs deep H.264 NAL-unit byte carving scan |
| `GET` | `/api/cases/<case_id>/tamper-detect`| Runs GOP integrity, timestamp gap, and transcode analysis |
| `GET` | `/api/cases/<case_id>/timeline` | Retrieves multi-channel synchronized incident timeline |
| `GET` | `/api/cases/<case_id>/custody` | Retrieves blockchain chain of custody ledger |
| `GET` | `/api/custody/verify` | Cryptographically validates entire blockchain ledger integrity |
| `GET` | `/api/reports/<case_id>/pdf` | Generates and downloads Section 63 BSA 2023 PDF dossier |
| `POST` | `/api/demo-data` | Resets and seeds realistic multi-camera forensic demo data |

---

## 📂 Project Directory Layout

```
SIH_project/
│
├── app.py                          # Main Flask server & REST API route controllers
├── requirements.txt                # Python package dependencies
├── start.bat                       # 1-Click automated Windows launch script
├── forensic_tool.db                # SQLite database (auto-generated)
├── Multi Vendor DVR NVR...pptx     # Problem statement & technical presentation
├── README.md                       # Comprehensive documentation & user guide
├── .gitignore                      # Git exclusion rules for clean repository
│
├── backend/
│   ├── __init__.py                 # Backend package initializer
│   ├── database.py                 # SQLite schema, tables & connection management
│   ├── seed_data.py                # Realistic multi-camera forensic dataset seeder
│   ├── vendor_detection.py         # Multi-vendor binary signature detection engine
│   ├── integrity.py                # SHA-256 hashing & blockchain custody chain class
│   ├── video_analysis.py           # H.264 NAL-unit parser, carver & tamper detector
│   └── report_generator.py         # Court-certified PDF report generator (BSA 2023)
│
├── static/
│   ├── css/
│   │   └── style.css               # Luxury Cyberpunk Dark & Forensic Light Theme system
│   ├── js/
│   │   └── app.js                  # Particle canvas, radar, SPA router & interactions
│   └── img/
│       ├── logo_cs_transparent.png # Code Sentinels team logo (transparent)
│       ├── logo_cs_icon.png        # Code Sentinels emblem badge
│       ├── image3.png              # Code Sentinels high-res logo
│       ├── image4.png              # Proposed Solution Architecture diagram
│       ├── image5.png              # End-to-end Forensic Workflow flowchart
│       ├── image6.png              # Feasibility and Viability matrix
│       └── image7.png              # Core Impact & Value Proposition
│
├── templates/
│   └── index.html                  # Single-Page Application shell
│
├── evidence_store/                 # Bit-stream disk images & carved video streams
├── reports/                        # Generated court-ready PDF documents
└── uploads/                        # Temporary evidence upload buffer
```

---

## ⚖️ Legal & Regulatory Compliance

ForensicVault is developed in strict alignment with statutory laws and international digital forensics standards:

- **Bharatiya Sakshya Adhiniyam, 2023 (BSA 2023) — Section 63**:
  Replaces Section 65B of the Indian Evidence Act, 1872. Section 63 governs the admissibility of electronic records in Indian courts, mandating an accompanying certificate by the person in lawful charge of the electronic device detailing the device make, model, continuous operating state, hash integrity, and safeguards against tampering. ForensicVault automatically generates this signed certificate.
- **ISO/IEC 27037:2012**:
  Guidelines for identification, collection, acquisition, and preservation of digital evidence.
- **NIST Special Publication 800-86**:
  Guide to Integrating Forensic Techniques into Incident Response.

---

## ❓ Troubleshooting & FAQs

### Q1: `start.bat` reports "Python is not installed or not in PATH"
- **Solution:** Download Python 3.10 or higher from [python.org](https://www.python.org/downloads/). When running the installer, **ensure you check the box that says "Add Python to PATH"**.

### Q2: Port 5000 is already in use
- **Solution:** Another application (e.g., AirPlay Receiver on macOS or another Flask server) is using port 5000.
  You can change the port in `app.py`:
  ```python
  app.run(debug=True, host='0.0.0.0', port=5050)
  ```
  Then access `http://127.0.0.1:5050/`.

### Q3: PDF generation fails or fonts look misaligned
- **Solution:** Ensure `reportlab` and `Pillow` are installed with:
  ```bash
  pip install --upgrade reportlab Pillow
  ```

### Q4: How do I test the application without real physical DVR disks?
- **Solution:** Click the **"⚡ Reset Demo Data"** button in the top bar. ForensicVault automatically provisions simulated raw sector blocks, multi-camera channels, injected tamper cuts, and pre-calculated SHA-256 chains for comprehensive demonstration.

---

## 👥 Team & Contact

**Team:** Code-Sentinels (Team ID: 192057)  
**Hackathon:** Smart India Hackathon (SIH) 2026  
**Problem Statement ID:** SIH26150 — *Multi-Vendor DVR/NVR Forensic Analysis Tool*  
**Theme:** Blockchain & Cyber Security  
**Motto:** *Code / Defend / Innovate*

---

<div align="center">

**Developed with ❤️ for Law Enforcement & Digital Forensic Examiners across India.**

</div>
