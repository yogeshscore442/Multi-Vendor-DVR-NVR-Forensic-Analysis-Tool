# 🛡️ ForensicVault — Multi-Vendor DVR/NVR Forensic Analysis Suite

<div align="center">

<img src="static/img/logo_cs_transparent.png" alt="Code Sentinels Logo" width="150" />

**Smart India Hackathon 2026** • Problem Statement: **SIH26150**  
Theme: Blockchain & Cyber Security • Team: **Code-Sentinels** (ID: 192057)

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Framework-Flask%203.0-000000.svg?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Legal](https://img.shields.io/badge/Legal-BSA%202023%20Sec.%2063-059669.svg)](https://www.mha.gov.in/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux-4f46e5.svg)](#)

</div>

---

## 📌 What is this?

**ForensicVault** is an end-to-end digital forensic platform for analysing surveillance footage from DVR/NVR devices (Hikvision, Dahua, CP Plus, Samsung/Hanwha, Bosch, Honeywell). It handles evidence acquisition, proprietary format detection, video recovery, tamper detection, chain of custody, and court-ready reporting — all in one tool.

---

## 🚀 Key Features

| Feature | Description |
|:---|:---|
| 🔒 **Secure Acquisition** | Read-only bit-stream imaging with dual SHA-256 verification |
| 🏭 **Multi-Vendor Detection** | Auto-identifies HIKFS, DHAV, MPEG-PS, SEC formats via magic bytes |
| 🎬 **H.264 NAL Carving** | Recovers deleted/unindexed footage from raw unallocated sectors |
| 🔍 **Tamper Detection** | Detects timestamp gaps, GOP breaks & software re-encoding artifacts |
| ⛓️ **Blockchain Custody** | Append-only SHA-256 hash-chained chain of custody ledger |
| 📄 **Court PDF Report** | BSA 2023 Section 63 certified forensic dossier (ReportLab) |
| 🖥️ **Cyber Dark UI** | Glassmorphism 2.0 design with particle canvas & live tactical radar |

---

## ⚡ Quick Start

### Windows (1-Click)
```cmd
start.bat
```
Auto-checks Python, installs dependencies, seeds the database, and opens `http://127.0.0.1:5000/` in your browser.

### Manual (All Platforms)
```bash
pip install -r requirements.txt
python backend/seed_data.py   # seed demo data
python app.py                 # start server → http://127.0.0.1:5000/
```

---

## 💻 Tech Stack

`Python 3.10+` · `Flask 3.0` · `SQLite` · `ReportLab` · `Pillow` · `HTML5/CSS3` · `SHA-256 Ledger`

---

## 📂 Project Structure

```
SIH_project/
├── app.py                  # Flask server & REST API
├── requirements.txt
├── start.bat               # 1-Click Windows launcher
├── backend/
│   ├── database.py         # SQLite schema
│   ├── seed_data.py        # Demo dataset seeder
│   ├── vendor_detection.py # Multi-vendor signature engine
│   ├── integrity.py        # SHA-256 blockchain ledger
│   ├── video_analysis.py   # H.264 NAL parser & tamper detector
│   └── report_generator.py # BSA 2023 PDF generator
├── static/css/style.css    # Cyberpunk dark theme
├── static/js/app.js        # SPA router, radar, particle canvas
└── templates/index.html    # Single-page app shell
```

---

## ⚖️ Legal Compliance

- **BSA 2023 Section 63** — Admissibility of electronic records in Indian courts
- **ISO/IEC 27037:2012** — Digital evidence collection & preservation
- **NIST SP 800-86** — Forensic techniques integration

---

## 👥 Team Code-Sentinels

**Team ID:** 192057 | **SIH 2026** | **Motto:** *Code / Defend / Innovate*
