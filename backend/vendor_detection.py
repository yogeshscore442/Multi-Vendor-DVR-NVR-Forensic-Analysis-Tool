"""
Vendor Detection Module
Auto-identifies DVR/NVR vendors (Hikvision, Dahua, CP Plus, etc.)
by scanning file headers, magic bytes, and filesystem signatures.
"""

import os
import struct
import json
from datetime import datetime

# Known vendor signatures (magic bytes / header patterns)
VENDOR_SIGNATURES = {
    'Hikvision': {
        'magic_bytes': [
            b'HIKV',
            b'\x48\x49\x4b\x56',
            b'HIK\x00',
        ],
        'file_extensions': ['.mp4', '.avi', '.264'],
        'filesystem_markers': ['hikvstor', 'hikvision', 'HIKVISION'],
        'header_offsets': [(0, 4), (512, 4)],
        'description': 'Hikvision Digital Technology',
        'supported_models': ['DS-7200', 'DS-7600', 'DS-7700', 'DS-9000'],
    },
    'Dahua': {
        'magic_bytes': [
            b'DHI\x00',
            b'DAHUA',
            b'\x44\x48\x41\x56',
        ],
        'file_extensions': ['.dav', '.264', '.mp4'],
        'filesystem_markers': ['dahua', 'DAHUA', 'dhfs'],
        'header_offsets': [(0, 5), (256, 4)],
        'description': 'Dahua Technology',
        'supported_models': ['DH-XVR', 'DH-NVR', 'DH-HCVR'],
    },
    'CP Plus': {
        'magic_bytes': [
            b'CPPL',
            b'CP\x00\x00',
        ],
        'file_extensions': ['.h264', '.h265', '.mp4'],
        'filesystem_markers': ['cpplus', 'CP PLUS', 'COSMIC'],
        'header_offsets': [(0, 4), (128, 4)],
        'description': 'CP Plus (Aditya Infotech)',
        'supported_models': ['CP-UVR', 'CP-UNR', 'CP-ER'],
    },
    'Samsung (Hanwha)': {
        'magic_bytes': [
            b'SAMS',
            b'HNWV',
        ],
        'file_extensions': ['.avi', '.264', '.backup'],
        'filesystem_markers': ['samsung', 'hanwha', 'WISENET'],
        'header_offsets': [(0, 4)],
        'description': 'Hanwha Techwin (Samsung)',
        'supported_models': ['SRD', 'SRN', 'XRN'],
    },
    'Honeywell': {
        'magic_bytes': [
            b'HONW',
            b'HWL\x00',
        ],
        'file_extensions': ['.avi', '.mp4', '.264'],
        'filesystem_markers': ['honeywell', 'HONEYWELL', 'maxpro'],
        'header_offsets': [(0, 4)],
        'description': 'Honeywell Security',
        'supported_models': ['HEN', 'HRHQ', 'MAXPRO'],
    },
    'Bosch': {
        'magic_bytes': [
            b'BVMS',
            b'BOSC',
        ],
        'file_extensions': ['.mp4', '.container'],
        'filesystem_markers': ['bosch', 'BOSCH', 'bvms'],
        'header_offsets': [(0, 4)],
        'description': 'Bosch Security Systems',
        'supported_models': ['DIP', 'DVR-5000', 'DIVAR'],
    },
}

# H.264 NAL unit start codes
H264_START_CODES = [
    b'\x00\x00\x00\x01',  # 4-byte start code
    b'\x00\x00\x01',       # 3-byte start code
]

# NAL unit types
NAL_TYPES = {
    1: 'Non-IDR Slice',
    2: 'Slice Data Partition A',
    3: 'Slice Data Partition B',
    4: 'Slice Data Partition C',
    5: 'IDR Slice (Keyframe)',
    6: 'SEI',
    7: 'SPS (Sequence Parameter Set)',
    8: 'PPS (Picture Parameter Set)',
    9: 'Access Unit Delimiter',
    10: 'End of Sequence',
    11: 'End of Stream',
}


class VendorDetector:
    """Detects DVR/NVR vendor from disk image or video file."""

    def __init__(self):
        self.signatures = VENDOR_SIGNATURES

    def detect_from_file(self, file_path):
        """
        Detect vendor from a file by scanning headers and signatures.
        Returns dict with vendor info and confidence.
        """
        result = {
            'vendor': 'Unknown',
            'confidence': 0.0,
            'method': 'none',
            'details': {},
            'detected_at': datetime.now().isoformat(),
        }

        if not os.path.exists(file_path):
            result['error'] = 'File not found'
            return result

        file_size = os.path.getsize(file_path)
        result['details']['file_size'] = file_size
        result['details']['file_name'] = os.path.basename(file_path)

        # Method 1: Check file extension
        ext = os.path.splitext(file_path)[1].lower()
        result['details']['extension'] = ext

        ext_matches = []
        for vendor, sig in self.signatures.items():
            if ext in sig['file_extensions']:
                ext_matches.append(vendor)

        # Method 2: Check magic bytes at header offsets
        try:
            with open(file_path, 'rb') as f:
                # Read first 1KB for header analysis
                header = f.read(1024)
                result['details']['header_hex'] = header[:64].hex()

                for vendor, sig in self.signatures.items():
                    for magic in sig['magic_bytes']:
                        for offset, length in sig['header_offsets']:
                            if offset + len(magic) <= len(header):
                                chunk = header[offset:offset + len(magic)]
                                if chunk == magic:
                                    result['vendor'] = vendor
                                    result['confidence'] = 0.95
                                    result['method'] = 'magic_bytes'
                                    result['details']['matched_magic'] = magic.hex()
                                    result['details']['offset'] = offset
                                    result['details']['description'] = sig['description']
                                    result['details']['supported_models'] = sig['supported_models']
                                    return result

                # Method 3: String search in header for vendor markers
                header_str = header.decode('ascii', errors='ignore').upper()
                for vendor, sig in self.signatures.items():
                    for marker in sig['filesystem_markers']:
                        if marker.upper() in header_str:
                            result['vendor'] = vendor
                            result['confidence'] = 0.80
                            result['method'] = 'filesystem_marker'
                            result['details']['matched_marker'] = marker
                            result['details']['description'] = sig['description']
                            result['details']['supported_models'] = sig['supported_models']
                            return result

                # Method 4: Check for H.264 NAL units (vendor-agnostic video)
                for start_code in H264_START_CODES:
                    pos = header.find(start_code)
                    if pos >= 0:
                        nal_byte = header[pos + len(start_code)] if pos + len(start_code) < len(header) else 0
                        nal_type = nal_byte & 0x1F
                        result['details']['h264_detected'] = True
                        result['details']['first_nal_type'] = NAL_TYPES.get(nal_type, f'Unknown ({nal_type})')
                        result['details']['nal_offset'] = pos

                        if nal_type == 7:  # SPS
                            result['details']['starts_with_sps'] = True

                        # If extension matches a vendor, use that with medium confidence
                        if ext_matches:
                            result['vendor'] = ext_matches[0]
                            result['confidence'] = 0.60
                            result['method'] = 'extension_with_h264'
                            if ext_matches[0] in self.signatures:
                                result['details']['description'] = self.signatures[ext_matches[0]]['description']
                        else:
                            result['vendor'] = 'Generic H.264'
                            result['confidence'] = 0.50
                            result['method'] = 'h264_detection'
                        return result

        except (IOError, PermissionError) as e:
            result['error'] = str(e)

        # Fallback: extension-only match
        if ext_matches:
            result['vendor'] = ext_matches[0]
            result['confidence'] = 0.30
            result['method'] = 'extension_only'

        return result

    def detect_from_bytes(self, data, filename='unknown'):
        """Detect vendor from raw bytes (for uploaded content)."""
        # Write to temp and use file detection
        import tempfile
        ext = os.path.splitext(filename)[1]
        with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp:
            tmp.write(data)
            tmp_path = tmp.name

        try:
            result = self.detect_from_file(tmp_path)
            result['details']['original_filename'] = filename
            return result
        finally:
            os.unlink(tmp_path)

    def get_supported_vendors(self):
        """Return list of supported vendors and their details."""
        vendors = []
        for name, sig in self.signatures.items():
            vendors.append({
                'name': name,
                'description': sig['description'],
                'file_extensions': sig['file_extensions'],
                'supported_models': sig['supported_models'],
            })
        return vendors


# Singleton
vendor_detector = VendorDetector()
