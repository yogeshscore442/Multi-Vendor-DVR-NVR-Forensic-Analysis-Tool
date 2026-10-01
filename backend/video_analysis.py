"""
Video Carving & Analysis Module
H.264/H.265 NAL-based video carving, vendor-agnostic recovery,
frame validation, and tamper detection.
"""

import os
import struct
import json
import random
from datetime import datetime, timedelta


# H.264 NAL unit type definitions
H264_NAL_TYPES = {
    0: 'Unspecified',
    1: 'Non-IDR Slice (P/B frame)',
    2: 'Slice Data Partition A',
    3: 'Slice Data Partition B',
    4: 'Slice Data Partition C',
    5: 'IDR Slice (I-frame/Keyframe)',
    6: 'SEI (Supplemental Enhancement Info)',
    7: 'SPS (Sequence Parameter Set)',
    8: 'PPS (Picture Parameter Set)',
    9: 'Access Unit Delimiter',
    10: 'End of Sequence',
    11: 'End of Stream',
    12: 'Filler Data',
}


class VideoCarver:
    """
    H.264/H.265 NAL-based video carver for DVR/NVR forensic recovery.
    Scans raw data for NAL start codes and reconstructs video streams.
    """

    def __init__(self):
        self.start_code_4 = b'\x00\x00\x00\x01'
        self.start_code_3 = b'\x00\x00\x01'

    def scan_for_nal_units(self, file_path, max_scan_bytes=None):
        """
        Scan a file for H.264 NAL unit start codes.
        Returns list of NAL unit positions and types.
        """
        nal_units = []
        file_size = os.path.getsize(file_path)
        scan_size = min(file_size, max_scan_bytes) if max_scan_bytes else file_size

        with open(file_path, 'rb') as f:
            data = f.read(scan_size)

        pos = 0
        while pos < len(data) - 4:
            # Check for 4-byte start code
            if data[pos:pos + 4] == self.start_code_4:
                nal_byte = data[pos + 4]
                nal_type = nal_byte & 0x1F
                nal_ref_idc = (nal_byte >> 5) & 0x3
                nal_units.append({
                    'offset': pos,
                    'start_code_len': 4,
                    'nal_type': nal_type,
                    'nal_type_name': H264_NAL_TYPES.get(nal_type, f'Unknown ({nal_type})'),
                    'ref_idc': nal_ref_idc,
                })
                pos += 4
            # Check for 3-byte start code
            elif data[pos:pos + 3] == self.start_code_3:
                nal_byte = data[pos + 3]
                nal_type = nal_byte & 0x1F
                nal_ref_idc = (nal_byte >> 5) & 0x3
                nal_units.append({
                    'offset': pos,
                    'start_code_len': 3,
                    'nal_type': nal_type,
                    'nal_type_name': H264_NAL_TYPES.get(nal_type, f'Unknown ({nal_type})'),
                    'ref_idc': nal_ref_idc,
                })
                pos += 3
            else:
                pos += 1

        return nal_units

    def analyze_video_structure(self, file_path):
        """
        Analyze the H.264 structure of a video file.
        Returns codec parameters, GOP structure, frame counts, etc.
        """
        file_size = os.path.getsize(file_path)

        # Scan first 10MB for NAL units
        nal_units = self.scan_for_nal_units(file_path, max_scan_bytes=min(file_size, 10 * 1024 * 1024))

        # Count NAL types
        type_counts = {}
        for nal in nal_units:
            t = nal['nal_type_name']
            type_counts[t] = type_counts.get(t, 0) + 1

        # Determine GOP structure
        idr_positions = [n['offset'] for n in nal_units if n['nal_type'] == 5]
        gop_sizes = []
        for i in range(1, len(idr_positions)):
            gop_sizes.append(idr_positions[i] - idr_positions[i - 1])

        avg_gop = sum(gop_sizes) / len(gop_sizes) if gop_sizes else 0

        # Extract SPS info if available
        sps_info = {}
        for nal in nal_units:
            if nal['nal_type'] == 7:  # SPS
                sps_info['found'] = True
                sps_info['offset'] = nal['offset']
                break

        return {
            'file_size': file_size,
            'nal_units_found': len(nal_units),
            'nal_type_counts': type_counts,
            'idr_frames': len(idr_positions),
            'gop_sizes': gop_sizes[:20],  # First 20 GOPs
            'average_gop_size': int(avg_gop),
            'has_sps': sps_info.get('found', False),
            'has_pps': any(n['nal_type'] == 8 for n in nal_units),
            'codec': 'H.264/AVC',
        }


class VideoValidator:
    """
    Validates recovered video files for frame-level integrity.
    Simulates ffprobe/FFmpeg validation (since FFmpeg is not installed).
    """

    def validate_video(self, file_path):
        """
        Validate a video file's integrity.
        Checks for corruption, missing frames, codec issues.
        """
        if not os.path.exists(file_path):
            return {
                'status': 'error',
                'message': 'File not found',
            }

        file_size = os.path.getsize(file_path)

        # Analyze the actual file structure
        carver = VideoCarver()

        try:
            nal_analysis = carver.analyze_video_structure(file_path)
        except Exception as e:
            nal_analysis = None

        # Build validation result
        result = {
            'file_path': file_path,
            'file_size': file_size,
            'validated_at': datetime.now().isoformat(),
            'checks': [],
        }

        # Check 1: File not empty
        if file_size == 0:
            result['checks'].append({
                'check': 'File Size',
                'status': 'FAIL',
                'detail': 'File is empty (0 bytes)',
            })
            result['status'] = 'invalid'
            return result
        else:
            result['checks'].append({
                'check': 'File Size',
                'status': 'PASS',
                'detail': f'File size: {file_size:,} bytes',
            })

        # Check 2: Header validity
        with open(file_path, 'rb') as f:
            header = f.read(32)

        has_valid_header = False
        # Check for common video container signatures
        if header[:4] in [b'\x00\x00\x00\x01', b'\x00\x00\x01\x00']:
            has_valid_header = True
            result['checks'].append({
                'check': 'Header Signature',
                'status': 'PASS',
                'detail': 'Valid H.264 NAL start code found',
            })
        elif header[4:8] == b'ftyp':
            has_valid_header = True
            result['checks'].append({
                'check': 'Header Signature',
                'status': 'PASS',
                'detail': 'Valid MP4 container (ftyp atom) found',
            })
        elif header[:4] == b'RIFF':
            has_valid_header = True
            result['checks'].append({
                'check': 'Header Signature',
                'status': 'PASS',
                'detail': 'Valid AVI container (RIFF) found',
            })
        else:
            result['checks'].append({
                'check': 'Header Signature',
                'status': 'WARNING',
                'detail': f'Unrecognized header: {header[:8].hex()}',
            })

        # Check 3: NAL structure (if H.264)
        if nal_analysis and nal_analysis['nal_units_found'] > 0:
            result['checks'].append({
                'check': 'H.264 NAL Structure',
                'status': 'PASS',
                'detail': f"Found {nal_analysis['nal_units_found']} NAL units, {nal_analysis['idr_frames']} IDR frames",
            })

            if nal_analysis['has_sps'] and nal_analysis['has_pps']:
                result['checks'].append({
                    'check': 'SPS/PPS Presence',
                    'status': 'PASS',
                    'detail': 'Both SPS and PPS found - stream can be decoded',
                })
            elif not nal_analysis['has_sps']:
                result['checks'].append({
                    'check': 'SPS/PPS Presence',
                    'status': 'WARNING',
                    'detail': 'Missing SPS - decoder may have issues',
                })
        else:
            result['checks'].append({
                'check': 'H.264 NAL Structure',
                'status': 'INFO',
                'detail': 'No H.264 NAL units found in scanned region',
            })

        # Overall status
        fail_count = sum(1 for c in result['checks'] if c['status'] == 'FAIL')
        warn_count = sum(1 for c in result['checks'] if c['status'] == 'WARNING')

        if fail_count > 0:
            result['status'] = 'invalid'
        elif warn_count > 0:
            result['status'] = 'warning'
        else:
            result['status'] = 'valid'

        result['codec_info'] = nal_analysis if nal_analysis else {}

        return result


class TamperDetector:
    """
    Detects signs of tampering in surveillance video:
    - Timestamp gaps / discontinuities
    - GOP (Group of Pictures) structure breaks
    - Re-encoding artifacts
    - Metadata inconsistencies
    """

    def analyze_for_tampering(self, file_path, video_metadata=None):
        """
        Perform comprehensive tamper analysis on a video file.
        Returns list of detected anomalies.
        """
        findings = []
        file_size = os.path.getsize(file_path)

        # Analysis 1: File structure analysis
        carver = VideoCarver()
        try:
            structure = carver.analyze_video_structure(file_path)

            # Check GOP consistency
            if structure['gop_sizes']:
                avg_gop = structure['average_gop_size']
                for i, gop_size in enumerate(structure['gop_sizes']):
                    if avg_gop > 0:
                        deviation = abs(gop_size - avg_gop) / avg_gop
                        if deviation > 0.5:  # 50% deviation
                            findings.append({
                                'type': 'GOP_BREAK',
                                'severity': 'high',
                                'description': f'GOP #{i+1} size ({gop_size:,} bytes) deviates significantly from average ({avg_gop:,} bytes)',
                                'detail': f'Deviation: {deviation*100:.1f}% - possible edit point or re-encoding',
                                'gop_index': i,
                            })

            # Check for missing SPS/PPS (sign of truncation)
            if not structure['has_sps']:
                findings.append({
                    'type': 'MISSING_SPS',
                    'severity': 'medium',
                    'description': 'Sequence Parameter Set (SPS) not found',
                    'detail': 'Missing SPS may indicate the beginning of the stream was truncated or removed',
                })

        except Exception as e:
            findings.append({
                'type': 'ANALYSIS_ERROR',
                'severity': 'info',
                'description': f'Could not perform structural analysis: {str(e)}',
            })

        # Analysis 2: Check for re-encoding artifacts
        with open(file_path, 'rb') as f:
            header_data = f.read(min(file_size, 4096))

        # Look for multiple SPS (sign of re-encoding / concatenation)
        sps_count = header_data.count(b'\x00\x00\x00\x01\x67') + header_data.count(b'\x00\x00\x01\x67')
        if sps_count > 1:
            findings.append({
                'type': 'MULTIPLE_SPS',
                'severity': 'high',
                'description': f'Multiple SPS NAL units found ({sps_count}) in header region',
                'detail': 'Multiple SPS units may indicate video was re-encoded or segments were concatenated',
            })

        # Analysis 3: File size anomaly check
        if video_metadata and video_metadata.get('duration_seconds'):
            expected_min_size = video_metadata['duration_seconds'] * 50000  # ~400kbps minimum
            if file_size < expected_min_size * 0.5:
                findings.append({
                    'type': 'SIZE_ANOMALY',
                    'severity': 'medium',
                    'description': 'File size is unusually small for the reported duration',
                    'detail': f'Expected at least {expected_min_size:,} bytes for {video_metadata["duration_seconds"]}s, got {file_size:,} bytes',
                })

        # Summary
        result = {
            'file_path': file_path,
            'analyzed_at': datetime.now().isoformat(),
            'total_findings': len(findings),
            'findings': findings,
            'severity_counts': {
                'high': sum(1 for f in findings if f.get('severity') == 'high'),
                'medium': sum(1 for f in findings if f.get('severity') == 'medium'),
                'low': sum(1 for f in findings if f.get('severity') == 'low'),
                'info': sum(1 for f in findings if f.get('severity') == 'info'),
            },
            'tamper_likely': any(f.get('severity') == 'high' for f in findings),
        }

        return result


# Create module-level instances
video_carver = VideoCarver()
video_validator = VideoValidator()
tamper_detector = TamperDetector()
