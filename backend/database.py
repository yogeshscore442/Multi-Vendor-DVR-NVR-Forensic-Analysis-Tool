"""
Database module for Multi-Vendor DVR/NVR Forensic Analysis Tool.
Uses SQLite for zero-configuration setup (MySQL-compatible schema).
"""

import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'forensic_tool.db')


def get_db():
    """Get a database connection with row factory."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    """Initialize the database with all required tables."""
    conn = get_db()
    cursor = conn.cursor()

    # Cases table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_number TEXT UNIQUE NOT NULL,
            case_title TEXT NOT NULL,
            investigating_officer TEXT,
            organization TEXT,
            description TEXT,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Evidence items (disk images / DVR/NVR devices)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS evidence_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_id INTEGER NOT NULL,
            evidence_number TEXT NOT NULL,
            device_type TEXT,
            vendor TEXT,
            model TEXT,
            serial_number TEXT,
            firmware_version TEXT,
            disk_size_bytes INTEGER,
            acquisition_method TEXT,
            original_hash_sha256 TEXT,
            verified_hash_sha256 TEXT,
            integrity_status TEXT DEFAULT 'pending',
            image_path TEXT,
            status TEXT DEFAULT 'acquired',
            acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            acquired_by TEXT,
            notes TEXT,
            FOREIGN KEY (case_id) REFERENCES cases(id)
        )
    ''')

    # Recovered video files
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS recovered_videos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            evidence_id INTEGER NOT NULL,
            filename TEXT NOT NULL,
            file_path TEXT,
            file_size_bytes INTEGER,
            codec TEXT,
            resolution TEXT,
            fps REAL,
            duration_seconds REAL,
            channel_number INTEGER,
            camera_name TEXT,
            start_time TIMESTAMP,
            end_time TIMESTAMP,
            recovery_method TEXT,
            is_deleted_recovery INTEGER DEFAULT 0,
            sha256_hash TEXT,
            validation_status TEXT DEFAULT 'pending',
            validation_details TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (evidence_id) REFERENCES evidence_items(id)
        )
    ''')

    # Tamper detection results
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tamper_analysis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            video_id INTEGER NOT NULL,
            analysis_type TEXT NOT NULL,
            severity TEXT DEFAULT 'info',
            description TEXT,
            timestamp_start TEXT,
            timestamp_end TEXT,
            details TEXT,
            analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (video_id) REFERENCES recovered_videos(id)
        )
    ''')

    # Chain of custody log (append-only, hash-chained)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS custody_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_id INTEGER,
            evidence_id INTEGER,
            action TEXT NOT NULL,
            performed_by TEXT NOT NULL,
            description TEXT,
            previous_hash TEXT,
            entry_hash TEXT NOT NULL,
            metadata TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (case_id) REFERENCES cases(id),
            FOREIGN KEY (evidence_id) REFERENCES evidence_items(id)
        )
    ''')

    # Timeline events
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS timeline_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_id INTEGER NOT NULL,
            evidence_id INTEGER,
            video_id INTEGER,
            event_type TEXT,
            event_time TIMESTAMP,
            channel INTEGER,
            camera_name TEXT,
            description TEXT,
            thumbnail_path TEXT,
            FOREIGN KEY (case_id) REFERENCES cases(id)
        )
    ''')

    # Generated reports
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_id INTEGER NOT NULL,
            report_type TEXT,
            report_title TEXT,
            file_path TEXT,
            generated_by TEXT,
            generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            sha256_hash TEXT,
            FOREIGN KEY (case_id) REFERENCES cases(id)
        )
    ''')

    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            full_name TEXT,
            role TEXT DEFAULT 'examiner',
            organization TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Insert default user if not exists
    cursor.execute('''
        INSERT OR IGNORE INTO users (username, full_name, role, organization)
        VALUES ('admin', 'System Administrator', 'admin', 'Forensic Lab')
    ''')

    conn.commit()
    conn.close()
    print(f"[DB] Database initialized at {DB_PATH}")

    # Auto-seed if database is empty
    try:
        from backend.seed_data import seed_demo_data
        seed_demo_data(force=False)
    except Exception as e:
        print(f"[DB] Auto-seed warning: {e}")


def dict_from_row(row):
    """Convert a sqlite3.Row to a dictionary."""
    if row is None:
        return None
    return dict(row)


def dict_from_rows(rows):
    """Convert a list of sqlite3.Row to a list of dictionaries."""
    return [dict(row) for row in rows]
