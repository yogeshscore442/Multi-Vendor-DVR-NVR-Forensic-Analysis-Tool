"""
Integrity & Hashing Module
Provides SHA-256 hashing, integrity verification, and hash-chained custody logging.
"""

import hashlib
import os
import json
from datetime import datetime


def compute_sha256(file_path, chunk_size=8192):
    """
    Compute SHA-256 hash of a file.
    Returns hex digest string.
    """
    sha256 = hashlib.sha256()
    total_size = os.path.getsize(file_path)
    bytes_read = 0

    with open(file_path, 'rb') as f:
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break
            sha256.update(chunk)
            bytes_read += len(chunk)

    return sha256.hexdigest()


def compute_sha256_bytes(data):
    """Compute SHA-256 hash of raw bytes."""
    return hashlib.sha256(data).hexdigest()


def verify_integrity(file_path, expected_hash):
    """
    Verify file integrity by comparing computed hash with expected.
    Returns dict with verification result.
    """
    result = {
        'file_path': file_path,
        'expected_hash': expected_hash,
        'verified_at': datetime.now().isoformat(),
    }

    if not os.path.exists(file_path):
        result['status'] = 'error'
        result['message'] = 'File not found'
        return result

    computed = compute_sha256(file_path)
    result['computed_hash'] = computed
    result['match'] = (computed.lower() == expected_hash.lower())
    result['status'] = 'verified' if result['match'] else 'mismatch'
    result['message'] = 'Integrity verified - hashes match' if result['match'] else 'INTEGRITY FAILURE - hashes do not match!'

    return result


class CustodyChain:
    """
    Hash-chained, append-only chain of custody log.
    Each entry's hash includes the previous entry's hash, creating an
    unbreakable chain that proves no entries were altered or removed.
    """

    def __init__(self, db_module):
        self.db = db_module

    def _compute_entry_hash(self, action, performed_by, description, previous_hash, timestamp):
        """Compute hash for a custody log entry."""
        data = f"{action}|{performed_by}|{description}|{previous_hash}|{timestamp}"
        return hashlib.sha256(data.encode('utf-8')).hexdigest()

    def add_entry(self, case_id, evidence_id, action, performed_by, description, metadata=None):
        """
        Add a new entry to the chain of custody log.
        The entry is hash-chained to the previous entry.
        """
        conn = self.db.get_db()
        cursor = conn.cursor()

        # Get the last entry's hash
        cursor.execute('''
            SELECT entry_hash FROM custody_log
            WHERE case_id = ?
            ORDER BY id DESC LIMIT 1
        ''', (case_id,))
        row = cursor.fetchone()
        previous_hash = row['entry_hash'] if row else '0' * 64  # Genesis hash

        timestamp = datetime.now().isoformat()
        entry_hash = self._compute_entry_hash(
            action, performed_by, description, previous_hash, timestamp
        )

        cursor.execute('''
            INSERT INTO custody_log
            (case_id, evidence_id, action, performed_by, description,
             previous_hash, entry_hash, metadata, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            case_id, evidence_id, action, performed_by, description,
            previous_hash, entry_hash,
            json.dumps(metadata) if metadata else None,
            timestamp
        ))

        conn.commit()
        entry_id = cursor.lastrowid
        conn.close()

        return {
            'id': entry_id,
            'action': action,
            'performed_by': performed_by,
            'entry_hash': entry_hash,
            'previous_hash': previous_hash,
            'timestamp': timestamp,
        }

    def verify_chain(self, case_id):
        """
        Verify the entire chain of custody for a case.
        Checks that each entry's hash correctly chains to the previous.
        """
        conn = self.db.get_db()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT * FROM custody_log
            WHERE case_id = ?
            ORDER BY id ASC
        ''', (case_id,))
        entries = cursor.fetchall()
        conn.close()

        if not entries:
            return {'valid': True, 'message': 'No custody entries found', 'entries': 0}

        results = {
            'valid': True,
            'entries': len(entries),
            'verified_at': datetime.now().isoformat(),
            'details': [],
        }

        expected_previous = '0' * 64  # Genesis

        for entry in entries:
            entry_dict = dict(entry)
            # Verify previous hash links correctly
            if entry_dict['previous_hash'] != expected_previous:
                results['valid'] = False
                results['details'].append({
                    'entry_id': entry_dict['id'],
                    'status': 'BROKEN_CHAIN',
                    'expected_previous': expected_previous,
                    'actual_previous': entry_dict['previous_hash'],
                })
            else:
                # Recompute hash
                recomputed = self._compute_entry_hash(
                    entry_dict['action'],
                    entry_dict['performed_by'],
                    entry_dict['description'],
                    entry_dict['previous_hash'],
                    entry_dict['created_at']
                )
                if recomputed != entry_dict['entry_hash']:
                    results['valid'] = False
                    results['details'].append({
                        'entry_id': entry_dict['id'],
                        'status': 'HASH_MISMATCH',
                        'expected': recomputed,
                        'actual': entry_dict['entry_hash'],
                    })
                else:
                    results['details'].append({
                        'entry_id': entry_dict['id'],
                        'status': 'VALID',
                    })

            expected_previous = entry_dict['entry_hash']

        return results

    def get_log(self, case_id):
        """Get all custody log entries for a case."""
        conn = self.db.get_db()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT * FROM custody_log
            WHERE case_id = ?
            ORDER BY id ASC
        ''', (case_id,))
        entries = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return entries
