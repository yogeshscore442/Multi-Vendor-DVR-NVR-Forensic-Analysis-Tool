"""
Report Generator Module
Generates court-ready PDF reports with hash logs,
BSA 2023 Section 63 certificate support, and evidence summaries.
"""

import os
import json
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, Image
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT


class ForensicReportGenerator:
    """Generates court-ready forensic analysis PDF reports."""

    def __init__(self, output_dir='reports'):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()

    def _setup_custom_styles(self):
        """Setup custom paragraph styles for the report."""
        self.styles.add(ParagraphStyle(
            name='ReportTitle',
            parent=self.styles['Title'],
            fontSize=20,
            spaceAfter=20,
            textColor=colors.HexColor('#1a1a2e'),
            alignment=TA_CENTER,
        ))
        self.styles.add(ParagraphStyle(
            name='SectionHeading',
            parent=self.styles['Heading1'],
            fontSize=14,
            spaceBefore=16,
            spaceAfter=8,
            textColor=colors.HexColor('#16213e'),
            borderWidth=1,
            borderColor=colors.HexColor('#0f3460'),
            borderPadding=5,
        ))
        self.styles.add(ParagraphStyle(
            name='SubHeading',
            parent=self.styles['Heading2'],
            fontSize=11,
            spaceBefore=10,
            spaceAfter=6,
            textColor=colors.HexColor('#0f3460'),
        ))
        self.styles.add(ParagraphStyle(
            name='BodyTextJustified',
            parent=self.styles['BodyText'],
            alignment=TA_JUSTIFY,
            fontSize=10,
            leading=14,
        ))
        self.styles.add(ParagraphStyle(
            name='SmallText',
            parent=self.styles['Normal'],
            fontSize=8,
            textColor=colors.grey,
        ))
        self.styles.add(ParagraphStyle(
            name='HashText',
            parent=self.styles['Code'],
            fontSize=7,
            fontName='Courier',
            textColor=colors.HexColor('#333333'),
            backColor=colors.HexColor('#f0f0f0'),
            borderWidth=0.5,
            borderColor=colors.HexColor('#cccccc'),
            borderPadding=4,
        ))
        self.styles.add(ParagraphStyle(
            name='CertificateText',
            parent=self.styles['BodyText'],
            fontSize=10,
            leading=14,
            alignment=TA_JUSTIFY,
            spaceBefore=6,
            spaceAfter=6,
        ))

    def _add_header(self, story, case_data):
        """Add report header."""
        story.append(Paragraph(
            "FORENSIC ANALYSIS REPORT",
            self.styles['ReportTitle']
        ))
        story.append(Paragraph(
            "Multi-Vendor DVR/NVR Forensic Analysis Tool",
            self.styles['Normal']
        ))
        story.append(Spacer(1, 10))

        # Report metadata table
        report_meta = [
            ['Case Number:', case_data.get('case_number', 'N/A'),
             'Report Date:', datetime.now().strftime('%d-%m-%Y %H:%M')],
            ['Case Title:', case_data.get('case_title', 'N/A'),
             'Status:', case_data.get('status', 'N/A').upper()],
            ['Officer:', case_data.get('investigating_officer', 'N/A'),
             'Organization:', case_data.get('organization', 'N/A')],
        ]

        meta_table = Table(report_meta, colWidths=[90, 160, 90, 160])
        meta_table.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#0f3460')),
            ('TEXTCOLOR', (2, 0), (2, -1), colors.HexColor('#0f3460')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cccccc')),
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f8f9fa')),
            ('BACKGROUND', (2, 0), (2, -1), colors.HexColor('#f8f9fa')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('PADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(meta_table)
        story.append(Spacer(1, 20))
        story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#0f3460')))
        story.append(Spacer(1, 10))

    def _add_evidence_section(self, story, evidence_items):
        """Add evidence items section."""
        story.append(Paragraph("1. EVIDENCE ITEMS", self.styles['SectionHeading']))

        if not evidence_items:
            story.append(Paragraph("No evidence items recorded.", self.styles['BodyTextJustified']))
            return

        for i, item in enumerate(evidence_items, 1):
            story.append(Paragraph(
                f"1.{i} Evidence #{item.get('evidence_number', 'N/A')}",
                self.styles['SubHeading']
            ))

            data = [
                ['Device Type', str(item.get('device_type', 'N/A'))],
                ['Vendor', str(item.get('vendor', 'N/A'))],
                ['Model', str(item.get('model', 'N/A'))],
                ['Serial Number', str(item.get('serial_number', 'N/A'))],
                ['Acquisition Method', str(item.get('acquisition_method', 'N/A'))],
                ['Original SHA-256', str(item.get('original_hash_sha256', 'N/A'))],
                ['Verified SHA-256', str(item.get('verified_hash_sha256', 'N/A'))],
                ['Integrity Status', str(item.get('integrity_status', 'N/A')).upper()],
                ['Acquired By', str(item.get('acquired_by', 'N/A'))],
                ['Acquired At', str(item.get('acquired_at', 'N/A'))],
            ]

            t = Table(data, colWidths=[140, 360])
            t.setStyle(TableStyle([
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
                ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#e8eaf6')),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('PADDING', (0, 0), (-1, -1), 5),
            ]))
            story.append(t)
            story.append(Spacer(1, 10))

    def _add_videos_section(self, story, videos):
        """Add recovered videos section."""
        story.append(Paragraph("2. RECOVERED VIDEO FILES", self.styles['SectionHeading']))

        if not videos:
            story.append(Paragraph("No video files recovered.", self.styles['BodyTextJustified']))
            return

        headers = ['#', 'Filename', 'Codec', 'Resolution', 'Duration', 'Channel', 'Status']
        table_data = [headers]

        for i, v in enumerate(videos, 1):
            duration = f"{v.get('duration_seconds', 0):.1f}s" if v.get('duration_seconds') else 'N/A'
            table_data.append([
                str(i),
                str(v.get('filename', 'N/A'))[:30],
                str(v.get('codec', 'N/A')),
                str(v.get('resolution', 'N/A')),
                duration,
                str(v.get('channel_number', 'N/A')),
                str(v.get('validation_status', 'N/A')).upper(),
            ])

        t = Table(table_data, colWidths=[25, 140, 55, 70, 55, 50, 60])
        t.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a1a2e')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f5f5f5')]),
            ('ALIGN', (0, 0), (0, -1), 'CENTER'),
            ('ALIGN', (4, 0), (4, -1), 'CENTER'),
            ('ALIGN', (5, 0), (5, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('PADDING', (0, 0), (-1, -1), 4),
        ]))
        story.append(t)
        story.append(Spacer(1, 15))

    def _add_tamper_section(self, story, tamper_results):
        """Add tamper analysis section."""
        story.append(Paragraph("3. TAMPER DETECTION ANALYSIS", self.styles['SectionHeading']))

        if not tamper_results:
            story.append(Paragraph(
                "No tamper analysis results available.",
                self.styles['BodyTextJustified']
            ))
            return

        for result in tamper_results:
            story.append(Paragraph(
                f"Analysis Type: {result.get('analysis_type', 'N/A')}",
                self.styles['SubHeading']
            ))
            severity_colors = {
                'high': colors.HexColor('#dc3545'),
                'medium': colors.HexColor('#fd7e14'),
                'low': colors.HexColor('#ffc107'),
                'info': colors.HexColor('#17a2b8'),
            }
            severity = result.get('severity', 'info')
            story.append(Paragraph(
                f"<font color='{severity_colors.get(severity, colors.grey)}'>Severity: {severity.upper()}</font>",
                self.styles['BodyTextJustified']
            ))
            story.append(Paragraph(
                f"Description: {result.get('description', 'N/A')}",
                self.styles['BodyTextJustified']
            ))
            story.append(Spacer(1, 8))

    def _add_custody_section(self, story, custody_log):
        """Add chain of custody section."""
        story.append(Paragraph("4. CHAIN OF CUSTODY LOG", self.styles['SectionHeading']))
        story.append(Paragraph(
            "The following is a hash-chained, append-only log of all actions performed on the evidence. "
            "Each entry is cryptographically linked to the previous entry using SHA-256, ensuring that "
            "no entries can be altered, removed, or inserted without detection.",
            self.styles['BodyTextJustified']
        ))
        story.append(Spacer(1, 10))

        if not custody_log:
            story.append(Paragraph("No custody log entries.", self.styles['BodyTextJustified']))
            return

        for entry in custody_log:
            data = [
                ['Entry #', str(entry.get('id', 'N/A')), 'Timestamp', str(entry.get('created_at', 'N/A'))],
                ['Action', str(entry.get('action', 'N/A')), 'Performed By', str(entry.get('performed_by', 'N/A'))],
            ]
            t = Table(data, colWidths=[70, 180, 70, 180])
            t.setStyle(TableStyle([
                ('FONTSIZE', (0, 0), (-1, -1), 8),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
                ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f0f0')),
                ('BACKGROUND', (2, 0), (2, -1), colors.HexColor('#f0f0f0')),
                ('PADDING', (0, 0), (-1, -1), 4),
            ]))
            story.append(t)

            # Hash info
            story.append(Paragraph(
                f"Entry Hash: {entry.get('entry_hash', 'N/A')}",
                self.styles['HashText']
            ))
            story.append(Paragraph(
                f"Previous Hash: {entry.get('previous_hash', 'N/A')}",
                self.styles['HashText']
            ))
            if entry.get('description'):
                story.append(Paragraph(
                    f"Details: {entry['description']}",
                    self.styles['SmallText']
                ))
            story.append(Spacer(1, 8))

    def _add_bsa_certificate(self, story, case_data, evidence_items):
        """
        Add BSA 2023 Section 63 Certificate.
        This is the legal certificate required for electronic evidence admissibility.
        """
        story.append(PageBreak())
        story.append(Paragraph(
            "CERTIFICATE UNDER SECTION 63 OF THE BHARATIYA SAKSHYA ADHINIYAM, 2023",
            self.styles['ReportTitle']
        ))
        story.append(Paragraph(
            "(For admissibility of electronic records as evidence)",
            ParagraphStyle(
                name='CertSubtitle',
                parent=self.styles['Normal'],
                fontSize=10,
                alignment=TA_CENTER,
                textColor=colors.grey,
                spaceAfter=20,
            )
        ))
        story.append(HRFlowable(width="100%", thickness=1, color=colors.black))
        story.append(Spacer(1, 15))

        # Certificate body
        officer = case_data.get('investigating_officer', '[Officer Name]')
        org = case_data.get('organization', '[Organization]')
        case_num = case_data.get('case_number', '[Case Number]')

        cert_text = f"""
        I, <b>{officer}</b>, holding the position of Forensic Examiner at <b>{org}</b>,
        do hereby certify the following in relation to Case Number <b>{case_num}</b>:
        """
        story.append(Paragraph(cert_text, self.styles['CertificateText']))

        # Certificate clauses
        clauses = [
            f"(a) The electronic records described herein were produced by a computer/device during the period "
            f"over which the said computer/device was used regularly to store or process information for the "
            f"purposes of the activities regularly carried on during that period by the person having lawful "
            f"control over the use of the computer/device.",

            f"(b) During the said period, information of the kind contained in the electronic record was "
            f"regularly fed into the computer/device in the ordinary course of the said activities.",

            f"(c) Throughout the material part of the said period, the computer/device was operating properly "
            f"and that even if not operating properly or was out of operation during some part of that period, "
            f"this fact did not affect the accuracy of the electronic record.",

            f"(d) The information contained in the electronic record reproduces or is derived from such "
            f"information fed into the computer/device in the ordinary course of the said activities.",
        ]

        for clause in clauses:
            story.append(Paragraph(clause, self.styles['CertificateText']))

        story.append(Spacer(1, 10))

        # Evidence hashes
        if evidence_items:
            story.append(Paragraph(
                "<b>Digital Evidence Hash Values (SHA-256):</b>",
                self.styles['CertificateText']
            ))
            for item in evidence_items:
                story.append(Paragraph(
                    f"Evidence #{item.get('evidence_number', 'N/A')}: {item.get('original_hash_sha256', 'N/A')}",
                    self.styles['HashText']
                ))
            story.append(Spacer(1, 15))

        # Signature block
        sig_data = [
            ['', '', ''],
            ['Signature: ___________________', '', f'Date: {datetime.now().strftime("%d-%m-%Y")}'],
            [f'Name: {officer}', '', f'Place: ___________________'],
            [f'Designation: Forensic Examiner', '', f'Organization: {org}'],
        ]
        sig_table = Table(sig_data, colWidths=[200, 50, 200])
        sig_table.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(Spacer(1, 30))
        story.append(sig_table)

    def generate_full_report(self, case_data, evidence_items, videos, tamper_results, custody_log):
        """
        Generate a complete forensic analysis report PDF.
        Returns the file path of the generated report.
        """
        case_num = case_data.get('case_number', 'unknown')
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"forensic_report_{case_num}_{timestamp}.pdf"
        filepath = os.path.join(self.output_dir, filename)

        doc = SimpleDocTemplate(
            filepath,
            pagesize=A4,
            rightMargin=50,
            leftMargin=50,
            topMargin=50,
            bottomMargin=50,
        )

        story = []

        # Build report sections
        self._add_header(story, case_data)
        self._add_evidence_section(story, evidence_items)
        story.append(PageBreak())
        self._add_videos_section(story, videos)
        self._add_tamper_section(story, tamper_results)
        story.append(PageBreak())
        self._add_custody_section(story, custody_log)
        self._add_bsa_certificate(story, case_data, evidence_items)

        # Build PDF
        doc.build(story)

        return filepath


# Module-level instance
report_generator = ForensicReportGenerator()
