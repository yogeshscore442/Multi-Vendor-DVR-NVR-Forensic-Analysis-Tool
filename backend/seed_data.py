"""
Forensic Demo Data Seeder for Multi-Vendor DVR/NVR Forensic Analysis Tool.
Populates rich, court-ready realistic forensic cases, evidence images, carved video streams,
tamper findings, and an unbroken cryptographic custody ledger.
"""

import os
import json
import hashlib
from datetime import datetime, timedelta
from backend.database import get_db

def seed_demo_data(force=False):
    """Seed comprehensive realistic forensic data if DB is empty or force=True."""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('SELECT COUNT(*) as count FROM cases')
    count = cursor.fetchone()['count']
    if count > 0 and not force:
        conn.close()
        return False

    if force:
        # Clear existing tables
        tables = ['reports', 'timeline_events', 'custody_log', 'tamper_analysis', 'recovered_videos', 'evidence_items', 'cases']
        for t in tables:
            cursor.execute(f'DELETE FROM {t}')
        cursor.execute("DELETE FROM sqlite_sequence WHERE name IN ('reports', 'timeline_events', 'custody_log', 'tamper_analysis', 'recovered_videos', 'evidence_items', 'cases')")
        conn.commit()

    now = datetime.now()

    # 1. CASE 1: Central Cyber Hub Intrusion
    cursor.execute('''
        INSERT INTO cases (case_number, case_title, investigating_officer, organization, description, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        'CASE-2026-BLR-089',
        'Cyber Hub Data Center & Vault Room Intrusion',
        'Insp. Rajesh Varma, Cyber Forensic Division',
        'State Cyber Crime Investigation Cell (SCCIC)',
        'Physical unauthorized access to Server Room B and vault storage on 18-Sept-2026. Suspect allegedly disconnected or tampered with NVR channels during the breach window (02:30 AM - 03:15 AM).',
        'active',
        (now - timedelta(days=3)).strftime('%Y-%m-%d %H:%M:%S')
    ))
    case1_id = cursor.lastrowid

    # 2. CASE 2: Highway Toll Plaza Spoliation
    cursor.execute('''
        INSERT INTO cases (case_number, case_title, investigating_officer, organization, description, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        'CASE-2026-DLH-142',
        'Highway Toll Plaza Lane 4 DVR Spoliation Analysis',
        'Dr. Ananya Sen, Senior Digital Forensic Examiner',
        'Central Forensic Science Laboratory (CFSL)',
        'Investigation into missing CCTV footage from Lane 4 during incident vehicle transit. DVR footage suspected to be selectively wiped or overwritten via file-level deletion.',
        'active',
        (now - timedelta(days=7)).strftime('%Y-%m-%d %H:%M:%S')
    ))
    case2_id = cursor.lastrowid

    # 3. CASE 3: Bank Currency Chest NVR Recovery
    cursor.execute('''
        INSERT INTO cases (case_number, case_title, investigating_officer, organization, description, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        'CASE-2026-MUM-205',
        'Commercial Bank Currency Chest Tamper Audit',
        'DySP Vikramaditya Roy',
        'Economic Offences Wing (EOW), Cyber Wing',
        'Forensic verification of 8-channel Dahua NVR hard drive seized under warrant W-2026/881. Assessment of GOP continuity and deleted partition video carving under BSA 2023 Sec. 63.',
        'closed',
        (now - timedelta(days=14)).strftime('%Y-%m-%d %H:%M:%S')
    ))
    case3_id = cursor.lastrowid

    # ─────────────────────────────────────────────────────────────
    # EVIDENCE ITEMS
    # ─────────────────────────────────────────────────────────────
    # Evidence 1 for Case 1 (Hikvision)
    hash_ev1 = hashlib.sha256(b"ForensicVault_Hikvision_Seized_Drive_Image_2026_BLR_089").hexdigest()
    cursor.execute('''
        INSERT INTO evidence_items
        (case_id, evidence_number, device_type, vendor, model, serial_number, firmware_version,
         disk_size_bytes, acquisition_method, original_hash_sha256, verified_hash_sha256,
         integrity_status, image_path, status, acquired_at, acquired_by, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        case1_id,
        'EV-2026-HK-001',
        'Hikvision Network Video Recorder (NVR)',
        'Hikvision',
        'DS-7616NI-I2/16P (16-Ch Embedded 4K)',
        'HK-SN-998274102-X',
        'V4.50.000 build 210815',
        4294967296000, # 4 TB
        'Tableau T8u Hardware Write-Blocker (Bit-Stream DD Image)',
        hash_ev1,
        hash_ev1,
        'verified',
        os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'evidence_store', 'EV-2026-HK-001_hikvision_raw.dd'),
        'analyzed',
        (now - timedelta(days=3, hours=2)).strftime('%Y-%m-%d %H:%M:%S'),
        'Insp. Rajesh Varma',
        'Primary storage HDD pulled from Bay 1. Hardware write-blocker verified before acquisition.'
    ))
    ev1_id = cursor.lastrowid

    # Evidence 2 for Case 1 (Dahua)
    hash_ev2 = hashlib.sha256(b"ForensicVault_Dahua_Perimeter_NVR_2026").hexdigest()
    cursor.execute('''
        INSERT INTO evidence_items
        (case_id, evidence_number, device_type, vendor, model, serial_number, firmware_version,
         disk_size_bytes, acquisition_method, original_hash_sha256, verified_hash_sha256,
         integrity_status, image_path, status, acquired_at, acquired_by, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        case1_id,
        'EV-2026-DH-002',
        'Dahua 8-Channel NVR Storage Disk',
        'Dahua',
        'DHI-NVR5208-8P-4KS2E',
        'DH-SN-33918274-B',
        'V4.001.0000000.1',
        2147483648000, # 2 TB
        'Atola Insight Forensic Imager (E01 Format)',
        hash_ev2,
        hash_ev2,
        'verified',
        os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'evidence_store', 'EV-2026-DH-002_dahua_perimeter.e01'),
        'analyzed',
        (now - timedelta(days=2, hours=18)).strftime('%Y-%m-%d %H:%M:%S'),
        'Insp. Rajesh Varma',
        'Perimeter camera gateway recording unit. Acquired with dual SHA-256 and MD5 verification.'
    ))
    ev2_id = cursor.lastrowid

    # Evidence 3 for Case 2 (CP Plus)
    hash_ev3 = hashlib.sha256(b"ForensicVault_CPPlus_Toll_Lane4_2026").hexdigest()
    cursor.execute('''
        INSERT INTO evidence_items
        (case_id, evidence_number, device_type, vendor, model, serial_number, firmware_version,
         disk_size_bytes, acquisition_method, original_hash_sha256, verified_hash_sha256,
         integrity_status, image_path, status, acquired_at, acquired_by, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        case2_id,
        'EV-2026-CP-003',
        'CP Plus Digital Video Recorder (DVR)',
        'CP Plus',
        'CP-UVR-1601E2-CS 16 Ch Universal DVR',
        'CP-SN-88271039-T',
        'V3.2.14_2022',
        1073741824000, # 1 TB
        'FTK Imager Read-Only Raw Stream (.raw)',
        hash_ev3,
        hash_ev3,
        'verified',
        os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'evidence_store', 'EV-2026-CP-003_cpplus_lane4.raw'),
        'analyzed',
        (now - timedelta(days=6)).strftime('%Y-%m-%d %H:%M:%S'),
        'Dr. Ananya Sen',
        'Recovered from Toll Booth Lane 4. Contains deleted video cluster allocations in unallocated space.'
    ))
    ev3_id = cursor.lastrowid

    # ─────────────────────────────────────────────────────────────
    # RECOVERED VIDEOS
    # ─────────────────────────────────────────────────────────────
    # Video 1: Vault Entrance (Tampered with gap)
    v1_hash = hashlib.sha256(b"VID_VAULT_ENTRANCE_H264_STREAM").hexdigest()
    cursor.execute('''
        INSERT INTO recovered_videos
        (evidence_id, filename, file_path, file_size_bytes, codec, resolution, fps,
         duration_seconds, channel_number, camera_name, start_time, end_time,
         recovery_method, is_deleted_recovery, sha256_hash, validation_status, validation_details)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        ev1_id,
        'CH01_Vault_Entrance_0200_0330.mp4',
        os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'evidence_store', 'CH01_Vault_Entrance.mp4'),
        342890120, # ~342 MB
        'H.264 / AVC (High Profile Level 4.1)',
        '1920x1080 (Full HD)',
        30.0,
        5400.0, # 1 hr 30 min
        1,
        'Cam 01 - Main Vault Entrance Doorway',
        (now - timedelta(days=3, hours=1, minutes=45)).strftime('%Y-%m-%d %H:%M:%S'),
        (now - timedelta(days=3, hours=0, minutes=15)).strftime('%Y-%m-%d %H:%M:%S'),
        'HIKFS Custom Stream Extractor + H.264 NAL Parser',
        0,
        v1_hash,
        'tamper_detected',
        json.dumps({
            'valid': False,
            'status': 'tamper_detected',
            'warnings': ['Timestamp gap of 252 seconds at 02:43:18', 'Missing 7,560 predicted frames', 'GOP sequence break detected'],
            'nal_units': {'sps': 180, 'pps': 180, 'idr': 176, 'non_idr': 154200, 'sei': 180},
            'bitrate_kbps': 4200,
            'container': 'MP4/MOV'
        })
    ))
    v1_id = cursor.lastrowid

    # Video 2: Server Room Corridor (Carved from deleted sectors!)
    v2_hash = hashlib.sha256(b"VID_DELETED_CARVED_SERVER_CORRIDOR").hexdigest()
    cursor.execute('''
        INSERT INTO recovered_videos
        (evidence_id, filename, file_path, file_size_bytes, codec, resolution, fps,
         duration_seconds, channel_number, camera_name, start_time, end_time,
         recovery_method, is_deleted_recovery, sha256_hash, validation_status, validation_details)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        ev1_id,
        'CARVED_CH02_Deleted_Sector_0x4F8A2000.mp4',
        os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'evidence_store', 'CARVED_CH02_Deleted.mp4'),
        185420100, # ~185 MB
        'H.264 / AVC (Main Profile)',
        '1920x1080 (Full HD)',
        30.0,
        1820.0, # ~30 min
        2,
        'Cam 02 - Server Room B Internal Corridor',
        (now - timedelta(days=3, hours=1, minutes=20)).strftime('%Y-%m-%d %H:%M:%S'),
        (now - timedelta(days=3, hours=0, minutes=50)).strftime('%Y-%m-%d %H:%M:%S'),
        'Deep File Carving (H.264 NAL Boundary Scan 0x00000001)',
        1, # DELETED RECOVERY
        v2_hash,
        'valid',
        json.dumps({
            'valid': True,
            'status': 'valid',
            'carved_from_cluster': '0x4F8A2000 - 0x58210000',
            'recovered_nals': 54600,
            'idr_keyframes': 61,
            'container': 'Reconstructed MPEG-4 Container'
        })
    ))
    v2_id = cursor.lastrowid

    # Video 3: Perimeter Gate (Clean baseline)
    v3_hash = hashlib.sha256(b"VID_PERIMETER_GATE_DAHUA_CLEAN").hexdigest()
    cursor.execute('''
        INSERT INTO recovered_videos
        (evidence_id, filename, file_path, file_size_bytes, codec, resolution, fps,
         duration_seconds, channel_number, camera_name, start_time, end_time,
         recovery_method, is_deleted_recovery, sha256_hash, validation_status, validation_details)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        ev2_id,
        'CH04_Perimeter_Security_Gate_0100_0400.mp4',
        os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'evidence_store', 'CH04_Perimeter_Gate.mp4'),
        589210000, # ~589 MB
        'H.265 / HEVC (Main Profile)',
        '3840x2160 (4K UHD)',
        25.0,
        10800.0, # 3 hrs
        4,
        'Cam 04 - Main Vehicle Gate & ANPR',
        (now - timedelta(days=3, hours=3)).strftime('%Y-%m-%d %H:%M:%S'),
        (now - timedelta(days=3)).strftime('%Y-%m-%d %H:%M:%S'),
        'DHAV Index Table Reassembly',
        0,
        v3_hash,
        'valid',
        json.dumps({
            'valid': True,
            'status': 'valid',
            'anpr_detected': True,
            'license_plates_logged': 42,
            'container': 'Dahua DAV container unpacked to MP4'
        })
    ))
    v3_id = cursor.lastrowid

    # Video 4: Toll Plaza Lane 4 (Overwritten/Deleted Carved Stream)
    v4_hash = hashlib.sha256(b"VID_TOLL_LANE4_DELETED_CARVED_CPPLUS").hexdigest()
    cursor.execute('''
        INSERT INTO recovered_videos
        (evidence_id, filename, file_path, file_size_bytes, codec, resolution, fps,
         duration_seconds, channel_number, camera_name, start_time, end_time,
         recovery_method, is_deleted_recovery, sha256_hash, validation_status, validation_details)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        ev3_id,
        'CARVED_CH04_Toll_Booth_Incident_Time.mp4',
        os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'evidence_store', 'CARVED_CH04_Toll.mp4'),
        94210000,
        'H.264 / AVC (Baseline Profile)',
        '1280x720 (HD)',
        25.0,
        920.0,
        4,
        'Cam 04 - Toll Cash Counter & Barrier',
        (now - timedelta(days=6, hours=4)).strftime('%Y-%m-%d %H:%M:%S'),
        (now - timedelta(days=6, hours=3, minutes=45)).strftime('%Y-%m-%d %H:%M:%S'),
        'Raw Sector Carver (Signature Search 0x000001BA)',
        1,
        v4_hash,
        'tamper_detected',
        json.dumps({
            'valid': False,
            'status': 'tamper_detected',
            'warnings': ['Re-encoded footage detected', 'Software encoder signature x264 core 164 found in SEI'],
            'container': 'MPEG-PS stream'
        })
    ))
    v4_id = cursor.lastrowid

    # ─────────────────────────────────────────────────────────────
    # TAMPER ANALYSIS FINDINGS
    # ─────────────────────────────────────────────────────────────
    cursor.execute('''
        INSERT INTO tamper_analysis
        (video_id, analysis_type, severity, description, timestamp_start, timestamp_end, details)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        v1_id,
        'timestamp_discontinuity',
        'high',
        'Critical 4 min 12 sec (252s) timestamp discontinuity identified during the intrusion window (02:43:18 to 02:47:30 UTC). 7,560 expected video frames missing with no power-down signal recorded in syslog.',
        '02:43:18',
        '02:47:30',
        json.dumps({
            'type': 'timestamp_discontinuity',
            'severity': 'high',
            'expected_pts': 1459800,
            'actual_pts': 1711800,
            'gap_seconds': 252.0,
            'missing_frames': 7560,
            'forensic_conclusion': 'Deliberate footage spoliation or physical disconnection during suspect entry'
        })
    ))

    cursor.execute('''
        INSERT INTO tamper_analysis
        (video_id, analysis_type, severity, description, timestamp_start, timestamp_end, details)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        v1_id,
        'gop_break',
        'high',
        'GOP (Group of Pictures) boundary violation at byte offset 0x12A9E00. Sequence terminated mid-GOP on a predictive P-frame without closed IDR boundary; next frame begins with new non-sequential sequence parameter set (SPS).',
        '02:43:18',
        '02:43:19',
        json.dumps({
            'type': 'gop_break',
            'severity': 'high',
            'byte_offset': '0x12A9E00',
            'expected_gop_size': 30,
            'truncated_gop_size': 11,
            'indicator': 'Hard file splice / video truncation'
        })
    ))

    cursor.execute('''
        INSERT INTO tamper_analysis
        (video_id, analysis_type, severity, description, timestamp_start, timestamp_end, details)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        v4_id,
        'reencode_detection',
        'high',
        'Evidence of secondary transcoding / re-encoding: SEI metadata contains non-hardware encoder string "x264 - core 164 r3095" which contradicts CP Plus embedded firmware hardware DSP signature.',
        '03:45:00',
        '03:52:00',
        json.dumps({
            'type': 'reencode_detection',
            'severity': 'high',
            'detected_encoder': 'x264 core 164 r3095 baee400',
            'expected_encoder': 'Hisilicon Hi3520D Hardware Encoder',
            'quantization_delta': 14.8,
            'indicator': 'Fabricated or replaced surveillance clip'
        })
    ))

    cursor.execute('''
        INSERT INTO tamper_analysis
        (video_id, analysis_type, severity, description, timestamp_start, timestamp_end, details)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        v1_id,
        'watermark_integrity',
        'medium',
        'Hikvision proprietary digital watermark check failed on 14 consecutive frames following timestamp resumption. CRC32 checksum mismatch in SEI user data unaligned.',
        '02:47:30',
        '02:47:35',
        json.dumps({
            'type': 'watermark_integrity',
            'severity': 'medium',
            'frames_checked': 14,
            'watermark_failures': 14,
            'indicator': 'Possible frame replacement or re-insertion'
        })
    ))

    # ─────────────────────────────────────────────────────────────
    # CRYPTOGRAPHIC CHAIN OF CUSTODY (BLOCKCHAIN LEDGER)
    # ─────────────────────────────────────────────────────────────
    custody_events = [
        (case1_id, None, 'PHYSICAL_SEIZURE', 'Insp. Rajesh Varma',
         'Physical seizure of Hikvision NVR DS-7616NI-I2 from Data Center Rack #4 under Panchnama #72/2026. Sealed in anti-static tamper-evident evidence bag #TE-8812.',
         (now - timedelta(days=3, hours=6))),

        (case1_id, ev1_id, 'WRITE_BLOCKER_MOUNT', 'Forensic Tech K. Sridhar',
         'Seized 4TB Seagate SkyHawk HDD connected to Tableau T8u Forensic USB 3.0 Bridge in Hardware Read-Only Write-Blocker Mode. DIP switches verified.',
         (now - timedelta(days=3, hours=4))),

        (case1_id, ev1_id, 'BIT_STREAM_ACQUISITION', 'Forensic Tech K. Sridhar',
         f'Raw bit-stream image (DD) completed. Size: 4,294,967,296,000 bytes. Initial SHA-256 computed: {hash_ev1}',
         (now - timedelta(days=3, hours=2))),

        (case1_id, ev1_id, 'HASH_VERIFICATION', 'Insp. Rajesh Varma',
         f'Secondary independent integrity verification passed. Computed SHA-256 matches master hash exactly: {hash_ev1}. Integrity status: VERIFIED.',
         (now - timedelta(days=3, hours=1, minutes=30))),

        (case1_id, ev1_id, 'VENDOR_DETECTION', 'System Automated Engine',
         'Automated vendor identification executed: Hikvision proprietary HIKFS v1.2 file system detected (magic 0x48494B4653). Confidence: 99.8%.',
         (now - timedelta(days=3, hours=1, minutes=10))),

        (case1_id, ev1_id, 'DEEP_CARVING_EXECUTED', 'Dr. Ananya Sen',
         'H.264 NAL carver executed on unallocated sector ranges 0x40000000 - 0x60000000. Successfully recovered 1 deleted video stream (Cam 02 Server Room Corridor).',
         (now - timedelta(days=2, hours=22))),

        (case1_id, ev1_id, 'TAMPER_AUDIT_COMPLETED', 'Dr. Ananya Sen',
         'Cryptographic and structural tamper audit concluded: 3 anomalies detected including critical 252s timestamp gap and GOP truncation at 02:43:18.',
         (now - timedelta(days=2, hours=15))),

        (case1_id, None, 'REPORT_GENERATION', 'System Automated Engine',
         'Comprehensive Court-Ready Forensic Examination Report and Certificate under Section 63 of Bharatiya Sakshya Adhiniyam, 2023 generated.',
         (now - timedelta(days=1, hours=8))),

        (case1_id, None, 'LAB_TRANSFER', 'Insp. Rajesh Varma',
         'Digital evidence archive transferred to Secure Evidence Vault #4 at State Cyber Crime Investigation Cell. Received by Custodian Officer D. Murthy.',
         (now - timedelta(hours=14))),

        # Case 2 events
        (case2_id, None, 'CASE_REGISTERED', 'Dr. Ananya Sen',
         'Case registered based on FIR #142/2026 under IPC 420/IT Act 65. Investigating toll collection system sabotage.',
         (now - timedelta(days=7))),

        (case2_id, ev3_id, 'EVIDENCE_INGESTED', 'Dr. Ananya Sen',
         f'CP Plus DVR storage dump ingested. SHA-256: {hash_ev3}. Write-block verification OK.',
         (now - timedelta(days=6, hours=12))),

        (case2_id, ev3_id, 'RE_ENCODE_PROVEN', 'Dr. Ananya Sen',
         'Transcoding trace proven via x264 SEI watermark identification. Tamper flag escalated to HIGH.',
         (now - timedelta(days=5, hours=8)))
    ]

    # Insert custody log with cryptographic chaining
    prev_hash = "0000000000000000000000000000000000000000000000000000000000000000"
    for cid, eid, action, performer, desc, time_val in custody_events:
        time_str = time_val.strftime('%Y-%m-%d %H:%M:%S')
        block_payload = f"{cid}|{eid}|{action}|{performer}|{desc}|{time_str}|{prev_hash}"
        entry_hash = hashlib.sha256(block_payload.encode('utf-8')).hexdigest()

        cursor.execute('''
            INSERT INTO custody_log
            (case_id, evidence_id, action, performed_by, description, previous_hash, entry_hash, metadata, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            cid, eid, action, performer, desc, prev_hash, entry_hash,
            json.dumps({'security_level': 'FORENSIC_GRADE', 'admissible_bsa2023': True}),
            time_str
        ))
        prev_hash = entry_hash

    # ─────────────────────────────────────────────────────────────
    # TIMELINE EVENTS
    # ─────────────────────────────────────────────────────────────
    cursor.execute('''
        INSERT INTO timeline_events
        (case_id, evidence_id, video_id, event_type, event_time, channel, camera_name, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        case1_id, ev1_id, v1_id,
        'NORMAL_RECORDING',
        (now - timedelta(days=3, hours=1, minutes=45)).strftime('%Y-%m-%d %H:%M:%S'),
        1, 'Cam 01 - Vault Entrance',
        'Normal continuous recording session starts. 30 fps 1080p.'
    ))

    cursor.execute('''
        INSERT INTO timeline_events
        (case_id, evidence_id, video_id, event_type, event_time, channel, camera_name, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        case1_id, ev1_id, v1_id,
        'TAMPER_DISCONTINUITY',
        (now - timedelta(days=3, hours=1, minutes=17)).strftime('%Y-%m-%d %H:%M:%S'),
        1, 'Cam 01 - Vault Entrance',
        'CRITICAL: 252-second timestamp jump detected! Suspect incursion window.'
    ))

    cursor.execute('''
        INSERT INTO timeline_events
        (case_id, evidence_id, video_id, event_type, event_time, channel, camera_name, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        case1_id, ev1_id, v2_id,
        'CARVED_RECOVERY',
        (now - timedelta(days=3, hours=1, minutes=10)).strftime('%Y-%m-%d %H:%M:%S'),
        2, 'Cam 02 - Server Room B Corridor',
        'RECOVERED FROM DELETED CLUSTERS: Suspect carrying duffel bag near Server Rack 4.'
    ))

    cursor.execute('''
        INSERT INTO timeline_events
        (case_id, evidence_id, video_id, event_type, event_time, channel, camera_name, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        case1_id, ev2_id, v3_id,
        'ANPR_DETECTION',
        (now - timedelta(days=3, hours=0, minutes=45)).strftime('%Y-%m-%d %H:%M:%S'),
        4, 'Cam 04 - Perimeter Gate',
        'Vehicle departure logged: White Sedan Reg #KA-03-HA-9102.'
    ))

    # Commit all
    conn.commit()
    conn.close()
    print("[DB] Comprehensive forensic demo dataset seeded successfully!")
    return True

if __name__ == '__main__':
    seed_demo_data(force=True)
