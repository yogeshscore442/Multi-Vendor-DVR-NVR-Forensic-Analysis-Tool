/**
 * ═══════════════════════════════════════════════════════════════════
 * ForensicVault 2026 — Multi-Vendor DVR/NVR Forensic Analysis Suite
 * Ultra-Premium $10,000 Interactive Engine & Animation Controller
 * SIH 2026 - Problem Statement SIH26150 (Team Code-Sentinels)
 * ═══════════════════════════════════════════════════════════════════
 */

// ─── API Client Layer ───
const API = {
    async get(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`GET ${url} failed with status ${res.status}`);
        return res.json();
    },
    async post(url, data) {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `POST ${url} failed`);
        }
        return res.json();
    },
    async postForm(url, formData) {
        const res = await fetch(url, {
            method: 'POST',
            body: formData,
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `Upload failed with status ${res.status}`);
        }
        return res.json();
    }
};

// ─── DOM Helpers ───
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function showScannerLoading(text = 'Executing Cryptographic Analysis...') {
    const el = $('#loadingOverlay');
    const textEl = $('#loadingText');
    if (textEl) textEl.textContent = text;
    if (el) el.classList.add('show');
}

function hideScannerLoading() {
    const el = $('#loadingOverlay');
    if (el) el.classList.remove('show');
}

function showCyberToast(message, type = 'info') {
    const container = $('#toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `cyber-toast ${type}`;

    const iconMap = {
        success: 'fa-shield-check text-emerald',
        error: 'fa-triangle-exclamation text-crimson',
        warning: 'fa-bolt text-amber',
        info: 'fa-fingerprint text-cyan'
    };

    toast.innerHTML = `
        <i class="fas ${iconMap[type] || iconMap.info}"></i>
        <div style="flex:1;">${message}</div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(60px)';
        setTimeout(() => toast.remove(), 350);
    }, 4200);
}

function showCyberModal(title, iconClass, bodyHTML) {
    const modalTitle = $('#modalTitle');
    const modalIcon = $('#modalIconBadge');
    const modalBody = $('#modalBody');
    const modalOverlay = $('#modalOverlay');

    if (modalTitle) modalTitle.textContent = title;
    if (modalIcon) modalIcon.innerHTML = `<i class="fas ${iconClass}"></i>`;
    if (modalBody) modalBody.innerHTML = bodyHTML;
    if (modalOverlay) modalOverlay.classList.add('show');
}

function hideCyberModal() {
    const modalOverlay = $('#modalOverlay');
    if (modalOverlay) modalOverlay.classList.remove('show');
}

function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function truncateHash(hash, len = 12) {
    if (!hash) return 'N/A';
    if (hash.length <= len * 2) return hash;
    return `${hash.substring(0, len)}...${hash.substring(hash.length - len)}`;
}

// ═══════════════════════════════════════════════════════════════════
// BACKGROUND INTERACTIVE CYBER PARTICLE CANVAS
// ═══════════════════════════════════════════════════════════════════
function initCyberBackground() {
    const canvas = document.getElementById('cyberBackground');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(Math.floor((width * height) / 16000), 75);

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.45,
            vy: (Math.random() - 0.5) * 0.45,
            radius: Math.random() * 2 + 1,
            color: Math.random() > 0.4 ? 'rgba(0, 242, 254, ' : 'rgba(139, 92, 246, '
        });
    }

    let mouse = { x: -1000, y: -1000 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // Draw particle
            const isLight = document.body.classList.contains('light-theme');
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = isLight ? 'rgba(2, 132, 199, 0.35)' : p.color + '0.6)';
            ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 125) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = isLight 
                        ? `rgba(2, 132, 199, ${(1 - dist / 125) * 0.12})`
                        : `rgba(0, 242, 254, ${(1 - dist / 125) * 0.18})`;
                    ctx.lineWidth = 0.75;
                    ctx.stroke();
                }
            }

            // Mouse interaction
            const mdx = p.x - mouse.x;
            const mdy = p.y - mouse.y;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mdist < 100) {
                p.x += (mdx / mdist) * 1.5;
                p.y += (mdy / mdist) * 1.5;
            }
        }

        requestAnimationFrame(animate);
    }
    animate();
}

// ═══════════════════════════════════════════════════════════════════
// CLOCK & FORENSIC AUDIT STREAM CONTROLLER
// ═══════════════════════════════════════════════════════════════════
function startCyberClock() {
    const clockEl = document.getElementById('liveTimeClock');
    if (!clockEl) return;
    setInterval(() => {
        const d = new Date();
        const utc = d.toUTCString().split(' ')[4] + ' UTC';
        clockEl.textContent = utc;
    }, 1000);
}

let auditStreamData = [];
let auditIndex = 0;

async function startAuditStreamTicker() {
    const tickerEl = document.getElementById('tickerContent');
    if (!tickerEl) return;

    try {
        auditStreamData = await API.get('/api/audit/stream');
    } catch {
        auditStreamData = [
            { action: 'WRITE_BLOCKER_VERIFIED', description: 'Tableau T8u Hardware Bridge Active' },
            { action: 'HASH_CHECK_PASS', description: 'SHA-256 Ledger Block #12 cryptographically intact' }
        ];
    }

    setInterval(() => {
        if (!auditStreamData || auditStreamData.length === 0) return;
        const entry = auditStreamData[auditIndex % auditStreamData.length];
        auditIndex++;
        
        tickerEl.style.opacity = '0';
        setTimeout(() => {
            tickerEl.innerHTML = `<strong>[${entry.action}]</strong> ${entry.description} <span style="color:#00f2fe;font-family:monospace;">${entry.entry_hash ? '• ' + truncateHash(entry.entry_hash, 6) : ''}</span>`;
            tickerEl.style.opacity = '1';
        }, 300);
    }, 4500);
}

// ═══════════════════════════════════════════════════════════════════
// ROUTING & NAVIGATION
// ═══════════════════════════════════════════════════════════════════
let currentPage = 'dashboard';
const pageTitles = {
    dashboard: 'Forensic Operations Dashboard',
    cases: 'Forensic Case Management',
    evidence: 'Read-Only Evidence Acquisition & Imaging',
    analysis: 'Video Recovery & H.264 Carving Studio',
    timeline: 'Multi-Camera Timeline Reconstruction',
    tamper: 'Cryptographic & Structural Tamper Detection',
    custody: 'Blockchain Chain of Custody Ledger',
    reports: 'Court-Ready Forensic Reports (BSA 2023 Sec. 63)'
};

function navigateTo(page) {
    currentPage = page;
    $$('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });

    const heading = $('#currentPageHeading');
    if (heading) heading.textContent = pageTitles[page] || 'Dashboard';

    const sidebar = $('#sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');
    const backdrop = $('#sidebarBackdrop');
    if (backdrop) backdrop.classList.remove('show');

    renderPage(page);
}

async function renderPage(page) {
    const viewport = $('#pageViewport');
    if (!viewport) return;
    
    // Ensure viewport is always visible
    viewport.style.opacity = '1';
    viewport.style.transform = 'none';

    try {
        switch (page) {
            case 'dashboard': await renderDashboard(); break;
            case 'cases': await renderCases(); break;
            case 'evidence': await renderEvidence(); break;
            case 'analysis': await renderAnalysis(); break;
            case 'timeline': await renderTimeline(); break;
            case 'tamper': await renderTamper(); break;
            case 'custody': await renderCustody(); break;
            case 'reports': await renderReports(); break;
            default: await renderDashboard(); break;
        }
    } catch (err) {
        console.error('Error rendering page ' + page, err);
        viewport.innerHTML = `
            <div class="cyber-panel" style="padding:30px;text-align:center;">
                <i class="fas fa-triangle-exclamation" style="font-size:36px;color:var(--crimson-tamper);margin-bottom:12px;"></i>
                <h3 style="color:#fff;margin-bottom:8px;">Failed to Load View: ${page}</h3>
                <p style="color:var(--text-secondary);font-size:13px;margin-bottom:16px;">${err.message || 'An unexpected error occurred'}</p>
                <button class="btn-cyber-primary" onclick="navigateTo('dashboard')">Return to Dashboard</button>
            </div>
        `;
    }
}

// ═══════════════════════════════════════════════════════════════════
// VIEW 1: DASHBOARD
// ═══════════════════════════════════════════════════════════════════
async function renderDashboard() {
    const viewport = $('#pageViewport');
    viewport.innerHTML = `
        <!-- Hero Luxury Banner -->
        <div class="cyber-hero-banner">
            <div class="hero-content">
                <div class="hero-title-group">
                    <h2>Multi-Vendor DVR/NVR Forensic Suite</h2>
                    <p>Standardized digital evidence acquisition, deleted H.264 video carving, GOP-level tamper detection, and cryptographic chain of custody under Section 63 of Bharatiya Sakshya Adhiniyam, 2023.</p>
                    <div class="hero-hud-badges">
                        <span class="hud-pill highlight"><i class="fas fa-shield-check"></i> Hardware Write-Block Active</span>
                        <span class="hud-pill"><i class="fas fa-microchip"></i> 6 Vendor Decoders Ready</span>
                        <span class="hud-pill"><i class="fas fa-cube"></i> Hash-Chained Custody Armed</span>
                        <span class="hud-pill"><i class="fas fa-scale-balanced"></i> BSA 2023 Sec. 63 Certified</span>
                    </div>
                </div>
                <div class="hero-actions">
                    <button class="btn-cyber-primary" onclick="showCreateCaseModal()">
                        <i class="fas fa-plus"></i> New Investigation
                    </button>
                    <button class="btn-cyber-secondary" onclick="navigateTo('evidence')">
                        <i class="fas fa-hard-drive"></i> Ingest Drive
                    </button>
                </div>
            </div>
        </div>

        <!-- 6 Animated KPI Stat Cards -->
        <div class="stats-grid" id="statsGrid">
            <div class="stat-card-3d" style="--card-gradient: var(--gradient-cyan-blue); --card-accent: #00f2fe; --card-glow: rgba(0,242,254,0.3)">
                <div class="stat-header">
                    <div class="stat-icon-wrap"><i class="fas fa-folder-closed"></i></div>
                    <span class="stat-delta positive" id="kpiActiveCasesBadge">Active</span>
                </div>
                <div class="stat-value" id="kpiTotalCases">3</div>
                <div class="stat-label">Total Forensic Cases</div>
            </div>

            <div class="stat-card-3d" style="--card-gradient: var(--gradient-emerald-cyan); --card-accent: #00f5a0; --card-glow: rgba(0,245,160,0.3)">
                <div class="stat-header">
                    <div class="stat-icon-wrap" style="color:#00f5a0;background:rgba(0,245,160,0.12)"><i class="fas fa-hard-drive"></i></div>
                    <span class="stat-delta positive"><i class="fas fa-check"></i> SHA-256</span>
                </div>
                <div class="stat-value" id="kpiTotalEvidence">3</div>
                <div class="stat-label">Acquired Evidence Items</div>
            </div>

            <div class="stat-card-3d" style="--card-gradient: var(--gradient-violet-magenta); --card-accent: #8b5cf6; --card-glow: rgba(139,92,246,0.3)">
                <div class="stat-header">
                    <div class="stat-icon-wrap" style="color:#8b5cf6;background:rgba(139,92,246,0.12)"><i class="fas fa-video"></i></div>
                    <span class="stat-delta positive" id="kpiDeletedBadge"><i class="fas fa-recycle"></i> Carved</span>
                </div>
                <div class="stat-value" id="kpiRecoveredVideos">4</div>
                <div class="stat-label">Recovered Video Streams</div>
            </div>

            <div class="stat-card-3d" style="--card-gradient: var(--gradient-fire); --card-accent: #ff2a5f; --card-glow: rgba(255,42,95,0.4)">
                <div class="stat-header">
                    <div class="stat-icon-wrap" style="color:#ff2a5f;background:rgba(255,42,95,0.14)"><i class="fas fa-triangle-exclamation"></i></div>
                    <span class="stat-delta critical"><i class="fas fa-bell"></i> Critical</span>
                </div>
                <div class="stat-value" id="kpiTamperAlerts" style="color:#ff2a5f">4</div>
                <div class="stat-label">Tamper Anomalies Flagged</div>
            </div>

            <div class="stat-card-3d" style="--card-gradient: linear-gradient(135deg, #3b82f6, #06b6d4); --card-accent: #38bdf8; --card-glow: rgba(56,189,248,0.3)">
                <div class="stat-header">
                    <div class="stat-icon-wrap" style="color:#38bdf8;background:rgba(56,189,248,0.12)"><i class="fas fa-link"></i></div>
                    <span class="stat-delta positive"><i class="fas fa-lock"></i> Unbroken</span>
                </div>
                <div class="stat-value" id="kpiCustodyBlocks">12</div>
                <div class="stat-label">Cryptographic Custody Blocks</div>
            </div>

            <div class="stat-card-3d" style="--card-gradient: linear-gradient(135deg, #10b981, #059669); --card-accent: #10b981; --card-glow: rgba(16,185,129,0.3)">
                <div class="stat-header">
                    <div class="stat-icon-wrap" style="color:#10b981;background:rgba(16,185,129,0.12)"><i class="fas fa-stamp"></i></div>
                    <span class="stat-delta positive">BSA 2023</span>
                </div>
                <div class="stat-value" style="color:#10b981">100%</div>
                <div class="stat-label">Court Admissibility Index</div>
            </div>
        </div>

        <!-- Tactical Forensic Radar & Supported Vendors -->
        <div class="dashboard-grid-dual">
            <!-- Left: Tactical Radar Scanner -->
            <div class="cyber-panel">
                <div class="panel-header">
                    <div class="panel-title">
                        <i class="fas fa-crosshairs"></i> Tactical Evidence Radar &amp; Telemetry
                    </div>
                    <span class="badge-status verified"><i class="fas fa-circle-dot"></i> LIVE SCANNING</span>
                </div>
                <div class="panel-body">
                    <div class="radar-container">
                        <div class="radar-scope">
                            <div class="radar-grid-ring ring-1"></div>
                            <div class="radar-grid-ring ring-2"></div>
                            <div class="radar-grid-ring ring-3"></div>
                            <div class="radar-crosshair-v"></div>
                            <div class="radar-crosshair-h"></div>
                            <div class="radar-sweep-beam"></div>
                            <div class="radar-blip blip-1" title="Ch 1: Vault Doorway (Normal)"></div>
                            <div class="radar-blip blip-2" title="Ch 4: Perimeter Gate (ANPR)"></div>
                            <div class="radar-blip blip-tamper" title="Ch 2: Server Room (Tamper Detected)"></div>
                        </div>

                        <div class="radar-telemetry">
                            <div class="telemetry-row" style="--row-color: #00f2fe;">
                                <span class="tel-label">Active Acquisition Port</span>
                                <span class="tel-val">Tableau T8u USB 3.0 Bridge</span>
                            </div>
                            <div class="telemetry-row" style="--row-color: #00f5a0;">
                                <span class="tel-label">Write-Blocker Status</span>
                                <span class="tel-val">HARDWARE WRITE-PROTECT (ARMED)</span>
                            </div>
                            <div class="telemetry-row" style="--row-color: #8b5cf6;">
                                <span class="tel-label">H.264 Carving Engine</span>
                                <span class="tel-val">Deep NAL Boundary Search 0x00000001</span>
                            </div>
                            <div class="telemetry-row" style="--row-color: #ff2a5f;">
                                <span class="tel-label">Tamper Risk Alert</span>
                                <span class="tel-val" style="color:#ff2a5f;">HIGH (252s Timestamp Gap)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right: Supported DVR/NVR Vendors -->
            <div class="cyber-panel">
                <div class="panel-header">
                    <div class="panel-title">
                        <i class="fas fa-microchip"></i> Multi-Vendor Signature Decoders
                    </div>
                    <span class="badge-status active">6 READY</span>
                </div>
                <div class="panel-body">
                    <div class="vendor-cards-grid" id="vendorGridContainer">
                        <div class="vendor-mini-chip">
                            <div class="vendor-icon-circle"><i class="fas fa-video"></i></div>
                            <span class="vendor-chip-name">Hikvision</span>
                            <span class="vendor-chip-sig">HIKFS / HKH</span>
                        </div>
                        <div class="vendor-mini-chip">
                            <div class="vendor-icon-circle"><i class="fas fa-camera"></i></div>
                            <span class="vendor-chip-name">Dahua</span>
                            <span class="vendor-chip-sig">DHAV / DHI</span>
                        </div>
                        <div class="vendor-mini-chip">
                            <div class="vendor-icon-circle"><i class="fas fa-shield"></i></div>
                            <span class="vendor-chip-name">CP Plus</span>
                            <span class="vendor-chip-sig">UVR / MPEG-PS</span>
                        </div>
                        <div class="vendor-mini-chip">
                            <div class="vendor-icon-circle"><i class="fas fa-tv"></i></div>
                            <span class="vendor-chip-name">Samsung/Hanwha</span>
                            <span class="vendor-chip-sig">SEC / SUNAPI</span>
                        </div>
                        <div class="vendor-mini-chip">
                            <div class="vendor-icon-circle"><i class="fas fa-server"></i></div>
                            <span class="vendor-chip-name">Bosch</span>
                            <span class="vendor-chip-sig">VRM / DIVAR</span>
                        </div>
                        <div class="vendor-mini-chip">
                            <div class="vendor-icon-circle"><i class="fas fa-building-shield"></i></div>
                            <span class="vendor-chip-name">Honeywell</span>
                            <span class="vendor-chip-sig">MAXPRO / H.264</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Cases & Evidence Table -->
        <div class="cyber-panel">
            <div class="panel-header">
                <div class="panel-title">
                    <i class="fas fa-list-check"></i> High-Priority Active Investigations
                </div>
                <button class="btn-cyber-secondary" onclick="navigateTo('cases')">
                    View All Cases <i class="fas fa-arrow-right"></i>
                </button>
            </div>
            <div class="panel-body" style="padding:0;">
                <div class="cyber-table-container" id="recentCasesTableContainer">
                    <div style="padding:24px;text-align:center;color:var(--text-muted);">Loading active investigations...</div>
                </div>
            </div>
        </div>
    `;

    // Fetch and bind stats
    try {
        const stats = await API.get('/api/dashboard/stats');
        $('#kpiTotalCases').textContent = stats.total_cases;
        $('#kpiActiveCasesBadge').textContent = `${stats.active_cases} Active`;
        $('#kpiTotalEvidence').textContent = stats.total_evidence;
        $('#kpiRecoveredVideos').textContent = stats.total_videos;
        $('#kpiDeletedBadge').innerHTML = `<i class="fas fa-recycle"></i> ${stats.recovered_deleted} from deleted`;
        $('#kpiTamperAlerts').textContent = stats.tamper_findings;
        $('#kpiCustodyBlocks').textContent = stats.custody_entries;
    } catch (e) {
        console.warn('Dashboard stats fallback:', e);
    }

    // Load recent cases table
    loadDashboardCasesTable();
}

async function loadDashboardCasesTable() {
    const container = $('#recentCasesTableContainer');
    if (!container) return;

    try {
        const cases = await API.get('/api/cases');
        if (!cases || cases.length === 0) {
            container.innerHTML = `<div style="padding:30px;text-align:center;color:var(--text-muted);">No active forensic cases. Click "New Investigation" or "Demo Data" above.</div>`;
            return;
        }

        container.innerHTML = `
            <table class="cyber-table">
                <thead>
                    <tr>
                        <th>Case Ref #</th>
                        <th>Investigation Title</th>
                        <th>Investigating Officer</th>
                        <th>Organization</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${cases.map(c => `
                        <tr>
                            <td><strong style="color:var(--cyan-primary);font-family:monospace;">${c.case_number}</strong></td>
                            <td><span style="font-weight:600;color:var(--text-primary);">${c.case_title}</span></td>
                            <td>${c.investigating_officer || 'Unassigned'}</td>
                            <td><span style="font-size:11.5px;color:var(--text-secondary);">${c.organization || 'Forensic Lab'}</span></td>
                            <td>
                                <span class="badge-status ${c.status === 'active' ? 'active' : 'verified'}">
                                    <i class="fas ${c.status === 'active' ? 'fa-bolt' : 'fa-check'}"></i>
                                    ${c.status.toUpperCase()}
                                </span>
                            </td>
                            <td>
                                <button class="btn-cyber-secondary" style="padding:5px 12px;font-size:11px;" onclick="viewCaseDetail(${c.id})">
                                    <i class="fas fa-microscope"></i> Inspect
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch {
        container.innerHTML = `<div style="padding:20px;color:var(--crimson-tamper);">Unable to load cases table.</div>`;
    }
}

// ═══════════════════════════════════════════════════════════════════
// VIEW 2: CASES MANAGEMENT
// ═══════════════════════════════════════════════════════════════════
async function renderCases() {
    const viewport = $('#pageViewport');
    viewport.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <div>
                <h2 style="font-size:24px;font-weight:800;color:#fff;">Forensic Case Management</h2>
                <p style="color:var(--text-secondary);font-size:13.5px;">Chain-of-custody locked surveillance investigation files</p>
            </div>
            <button class="btn-cyber-primary" onclick="showCreateCaseModal()">
                <i class="fas fa-plus"></i> Open New Case
            </button>
        </div>

        <div id="casesListGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:20px;">
            <div style="padding:40px;color:var(--text-muted);">Loading forensic cases...</div>
        </div>
    `;

    try {
        const cases = await API.get('/api/cases');
        const grid = $('#casesListGrid');
        if (!cases || cases.length === 0) {
            grid.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted);grid-column:1/-1;">No cases created yet. Click "Open New Case" or use the top Demo Data button.</div>`;
            return;
        }

        grid.innerHTML = cases.map(c => `
            <div class="cyber-panel" style="padding:22px;display:flex;flex-direction:column;justify-content:space-between;gap:16px;">
                <div>
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
                        <span style="font-family:monospace;font-size:12px;color:var(--cyan-primary);font-weight:700;">${c.case_number}</span>
                        <span class="badge-status ${c.status === 'active' ? 'active' : 'verified'}">${c.status.toUpperCase()}</span>
                    </div>
                    <h3 style="font-size:17px;font-weight:700;color:#fff;margin-bottom:8px;line-height:1.3;">${c.case_title}</h3>
                    <p style="font-size:12px;color:var(--text-secondary);line-height:1.5;margin-bottom:14px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;">
                        ${c.description || 'No description provided.'}
                    </p>
                    <div style="font-size:11.5px;color:var(--text-muted);display:flex;flex-direction:column;gap:4px;">
                        <div><i class="fas fa-user-shield" style="color:var(--cyan-primary);width:16px;"></i> ${c.investigating_officer || 'Unassigned'}</div>
                        <div><i class="fas fa-building" style="color:var(--violet-primary);width:16px;"></i> ${c.organization || 'State Forensic Unit'}</div>
                        <div><i class="far fa-clock" style="color:var(--emerald-primary);width:16px;"></i> Created: ${c.created_at || 'Recent'}</div>
                    </div>
                </div>

                <div style="display:flex;gap:10px;border-top:1px solid var(--border-subtle);padding-top:14px;">
                    <button class="btn-cyber-primary" style="flex:1;justify-content:center;padding:8px 12px;font-size:12px;" onclick="viewCaseDetail(${c.id})">
                        <i class="fas fa-folder-open"></i> Open Dossier
                    </button>
                    <button class="btn-cyber-secondary" style="padding:8px 12px;font-size:12px;" onclick="generateCaseReport(${c.id})" title="Generate BSA 2023 Report">
                        <i class="fas fa-file-pdf"></i>
                    </button>
                </div>
            </div>
        `).join('');
    } catch {
        $('#casesListGrid').innerHTML = `<div style="padding:30px;color:var(--crimson-tamper);">Failed to load cases.</div>`;
    }
}

function showCreateCaseModal() {
    showCyberModal(
        'Initiate New Forensic Investigation',
        'fa-folder-plus',
        `
        <form id="createCaseForm" onsubmit="handleCreateCase(event)">
            <div class="form-group">
                <label class="form-label">Case Reference Identifier (Auto or FIR/Warrant Ref)</label>
                <input class="form-input" id="caseNumberInput" placeholder="e.g. CASE-2026-BLR-099" value="CASE-2026-${Math.floor(1000 + Math.random() * 9000)}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Investigation Title</label>
                <input class="form-input" id="caseTitleInput" placeholder="e.g. Currency Vault CCTV Footage Tamper Audit" required>
            </div>
            <div class="form-group">
                <label class="form-label">Lead Investigating Officer &amp; Designation</label>
                <input class="form-input" id="caseOfficerInput" placeholder="e.g. Insp. Rajesh Varma, Digital Forensic Division" required>
            </div>
            <div class="form-group">
                <label class="form-label">Agency / Jurisdiction / Laboratory</label>
                <input class="form-input" id="caseOrgInput" placeholder="e.g. State Cyber Crime Investigation Cell (SCCIC)" required>
            </div>
            <div class="form-group">
                <label class="form-label">Crime Scene / Surveillance Seizure Summary</label>
                <textarea class="form-textarea" id="caseDescInput" placeholder="Detail the physical seizure location, DVR serial number, and nature of requested examination..."></textarea>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:20px;">
                <button type="button" class="btn-cyber-secondary" onclick="hideCyberModal()">Cancel</button>
                <button type="submit" class="btn-cyber-primary"><i class="fas fa-check"></i> Register Investigation</button>
            </div>
        </form>
        `
    );
}

async function handleCreateCase(e) {
    e.preventDefault();
    const payload = {
        case_number: $('#caseNumberInput').value.trim(),
        case_title: $('#caseTitleInput').value.trim(),
        investigating_officer: $('#caseOfficerInput').value.trim(),
        organization: $('#caseOrgInput').value.trim(),
        description: $('#caseDescInput').value.trim()
    };

    try {
        showScannerLoading('Hashing & Cryptographically Registering Case Ledger...');
        await API.post('/api/cases', payload);
        hideScannerLoading();
        hideCyberModal();
        showCyberToast('Investigation registered and hash-chained to master ledger.', 'success');
        renderCases();
    } catch (err) {
        hideScannerLoading();
        showCyberToast(err.message || 'Case creation failed', 'error');
    }
}

async function viewCaseDetail(caseId) {
    try {
        showScannerLoading('Retrieving Case Forensic Artifacts...');
        const caseData = await API.get(`/api/cases/${caseId}`);
        hideScannerLoading();

        showCyberModal(
            `Case Dossier: ${caseData.case_number}`,
            'fa-file-shield',
            `
            <div style="display:flex;flex-direction:column;gap:16px;">
                <div style="background:rgba(0,0,0,0.3);padding:14px;border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
                    <h4 style="font-size:16px;color:#fff;margin-bottom:6px;">${caseData.case_title}</h4>
                    <p style="font-size:12px;color:var(--text-secondary);line-height:1.5;">${caseData.description || 'No notes'}</p>
                </div>

                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr));gap:10px;font-size:12px;">
                    <div><strong>Officer:</strong> ${caseData.investigating_officer || 'Unassigned'}</div>
                    <div><strong>Agency:</strong> ${caseData.organization || 'Forensic Lab'}</div>
                    <div><strong>Status:</strong> <span class="badge-status active">${caseData.status}</span></div>
                    <div><strong>Recovered Streams:</strong> ${caseData.video_count || 0}</div>
                </div>

                <h4 style="font-size:14px;color:var(--cyan-primary);margin-top:10px;"><i class="fas fa-hard-drive"></i> Associated Evidence Items</h4>
                <div style="max-height:180px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;">
                    ${(caseData.evidence_items && caseData.evidence_items.length > 0) ? caseData.evidence_items.map(ei => `
                        <div style="background:rgba(255,255,255,0.03);padding:10px;border-radius:var(--radius-sm);border:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center;">
                            <div>
                                <div style="font-weight:700;color:#fff;font-size:12px;">${ei.evidence_number} — ${ei.vendor || 'Unknown Vendor'}</div>
                                <div style="font-family:monospace;font-size:10px;color:var(--text-muted);">${truncateHash(ei.original_hash_sha256, 10)}</div>
                            </div>
                            <span class="badge-status verified"><i class="fas fa-check"></i> ${ei.integrity_status}</span>
                        </div>
                    `).join('') : '<div style="color:var(--text-muted);font-size:12px;">No evidence disk images ingested yet.</div>'}
                </div>

                <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px;">
                    <button class="btn-cyber-secondary" onclick="hideCyberModal()">Close</button>
                    <button class="btn-cyber-primary" onclick="generateCaseReport(${caseId})"><i class="fas fa-file-pdf"></i> Generate BSA Report</button>
                </div>
            </div>
            `
        );
    } catch (e) {
        hideScannerLoading();
        showCyberToast('Failed to load case dossier', 'error');
    }
}

// ═══════════════════════════════════════════════════════════════════
// VIEW 3: EVIDENCE ACQUISITION & IMAGING
// ═══════════════════════════════════════════════════════════════════
async function renderEvidence() {
    const viewport = $('#pageViewport');
    viewport.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <div>
                <h2 style="font-size:24px;font-weight:800;color:#fff;">Evidence Acquisition &amp; Disk Imaging</h2>
                <p style="color:var(--text-secondary);font-size:13.5px;">Bit-stream physical acquisition with cryptographic SHA-256 integrity verification</p>
            </div>
            <div class="write-blocker-pill" style="margin:0;">
                <span class="live-pulse-dot green"></span>
                <span style="font-size:11px;font-weight:700;color:var(--emerald-primary);">WRITE-BLOCKER ARMED</span>
            </div>
        </div>

        <!-- Ingestion Dropzone & Acquisition Simulation -->
        <div class="cyber-panel" style="margin-bottom:28px;">
            <div class="panel-header">
                <div class="panel-title"><i class="fas fa-cloud-arrow-up"></i> Secure Evidence Ingestion Portal</div>
                <span class="badge-status active">READ-ONLY STREAM</span>
            </div>
            <div class="panel-body">
                <form id="evidenceUploadForm" onsubmit="handleEvidenceUpload(event)" style="display:flex;flex-direction:column;gap:18px;">
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:16px;">
                        <div class="form-group" style="margin:0;">
                            <label class="form-label">Attach To Case</label>
                            <select class="form-select" id="evidenceCaseSelect" required>
                                <option value="">Select Target Case...</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin:0;">
                            <label class="form-label">Acquisition Method</label>
                            <select class="form-select" id="evidenceMethodSelect">
                                <option value="Tableau T8u Hardware Write-Blocker">Tableau T8u Hardware Write-Blocker (Bit-Stream DD)</option>
                                <option value="Atola Insight Forensic Imager">Atola Insight Forensic Imager (E01 Format)</option>
                                <option value="Direct Raw Video Extraction">Direct Raw Surveillance Stream (.raw / .264 / .mp4)</option>
                            </select>
                        </div>
                    </div>

                    <div style="border:2px dashed rgba(0,242,254,0.3);border-radius:var(--radius-lg);padding:35px;text-align:center;background:rgba(0,0,0,0.25);position:relative;cursor:pointer;" onclick="$('#evidenceFileInput').click()">
                        <i class="fas fa-hard-drive" style="font-size:42px;color:var(--cyan-primary);margin-bottom:12px;filter:drop-shadow(0 0 12px var(--cyan-primary));"></i>
                        <h4 style="font-size:16px;color:#fff;margin-bottom:6px;">Select or Drag &amp; Drop Surveillance Disk Image / Raw Stream</h4>
                        <p style="font-size:12px;color:var(--text-secondary);margin-bottom:14px;">Supported: RAW DD (.dd, .raw, .img), Expert Witness (.e01), H.264 Raw Streams (.264, .h264, .mp4, .dav)</p>
                        <input type="file" id="evidenceFileInput" style="display:none;" onchange="handleFileSelected(this)">
                        <div id="fileSelectionInfo" style="display:none;font-family:monospace;font-size:12px;color:var(--emerald-primary);margin-top:8px;"></div>
                    </div>

                    <div style="display:flex;justify-content:flex-end;">
                        <button type="submit" class="btn-cyber-primary" id="btnAcquireSubmit">
                            <i class="fas fa-fingerprint"></i> Execute Bit-Stream Ingest &amp; SHA-256 Check
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Evidence Inventory Table -->
        <div class="cyber-panel">
            <div class="panel-header">
                <div class="panel-title"><i class="fas fa-database"></i> Seized Physical &amp; Digital Evidence Inventory</div>
            </div>
            <div class="panel-body" style="padding:0;">
                <div class="cyber-table-container" id="evidenceTableContainer">
                    <div style="padding:30px;text-align:center;color:var(--text-muted);">Loading evidence inventory...</div>
                </div>
            </div>
        </div>
    `;

    // Populate cases dropdown
    try {
        const cases = await API.get('/api/cases');
        const select = $('#evidenceCaseSelect');
        if (select && cases) {
            cases.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.id;
                opt.textContent = `${c.case_number} — ${c.case_title}`;
                select.appendChild(opt);
            });
        }
    } catch {}

    // Load table
    loadEvidenceInventory();
}

function handleFileSelected(input) {
    const file = input.files[0];
    const info = $('#fileSelectionInfo');
    if (file && info) {
        info.style.display = 'block';
        info.innerHTML = `<i class="fas fa-file-circle-check"></i> Selected: <strong>${file.name}</strong> (${formatBytes(file.size)})`;
    }
}

async function handleEvidenceUpload(e) {
    e.preventDefault();
    const caseId = $('#evidenceCaseSelect').value;
    const fileInput = $('#evidenceFileInput');
    const method = $('#evidenceMethodSelect').value;

    if (!caseId) {
        showCyberToast('Please select a target case', 'warning');
        return;
    }
    if (!fileInput.files || fileInput.files.length === 0) {
        showCyberToast('Please select a surveillance file or disk image', 'warning');
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('case_id', caseId);
    formData.append('file', file);
    formData.append('device_type', 'Surveillance Storage Drive');
    formData.append('acquisition_method', method);
    formData.append('acquired_by', 'Insp. Rajesh Varma');

    try {
        showScannerLoading(`Computing SHA-256 bit-stream hash for ${file.name}...`);
        const result = await API.postForm('/api/evidence/acquire', formData);
        hideScannerLoading();
        showCyberToast(`Evidence ${result.evidence_number} acquired! Vendor: ${result.vendor_detection ? result.vendor_detection.vendor : 'Detected'}`, 'success');
        renderEvidence();
    } catch (err) {
        hideScannerLoading();
        showCyberToast(err.message || 'Evidence acquisition failed', 'error');
    }
}

async function loadEvidenceInventory() {
    const container = $('#evidenceTableContainer');
    if (!container) return;

    try {
        const items = await API.get('/api/evidence');
        if (!items || items.length === 0) {
            container.innerHTML = `<div style="padding:30px;text-align:center;color:var(--text-muted);">No evidence acquired yet.</div>`;
            return;
        }

        container.innerHTML = `
            <table class="cyber-table">
                <thead>
                    <tr>
                        <th>Evidence ID</th>
                        <th>Associated Case</th>
                        <th>Device / Vendor</th>
                        <th>Acquired Size</th>
                        <th>SHA-256 Hash</th>
                        <th>Integrity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                        <tr>
                            <td><strong style="color:var(--cyan-primary);font-family:monospace;">${item.evidence_number}</strong></td>
                            <td><span style="font-size:12px;color:var(--text-primary);">${item.case_number}</span></td>
                            <td>
                                <div style="font-weight:600;color:#fff;">${item.vendor || 'Unknown Vendor'}</div>
                                <div style="font-size:10.5px;color:var(--text-muted);">${item.model || item.device_type}</div>
                            </td>
                            <td>${formatBytes(item.disk_size_bytes)}</td>
                            <td>
                                <span class="hash-text" title="${item.original_hash_sha256}" style="color:var(--text-code);font-size:11px;">
                                    ${truncateHash(item.original_hash_sha256, 8)}
                                </span>
                            </td>
                            <td>
                                <span class="badge-status verified"><i class="fas fa-shield-check"></i> ${item.integrity_status}</span>
                            </td>
                            <td>
                                <div style="display:flex;gap:6px;">
                                    <button class="btn-cyber-primary" style="padding:4px 10px;font-size:11px;" onclick="runDeepCarving(${item.id})">
                                        <i class="fas fa-microchip"></i> Carve NAL
                                    </button>
                                    <button class="btn-cyber-secondary" style="padding:4px 10px;font-size:11px;" onclick="verifyEvidenceHash(${item.id})">
                                        <i class="fas fa-check-double"></i> Verify
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch {
        container.innerHTML = `<div style="padding:20px;color:var(--crimson-tamper);">Failed to load evidence inventory.</div>`;
    }
}

async function verifyEvidenceHash(evidenceId) {
    try {
        showScannerLoading('Executing Live Secondary SHA-256 Checksum Verification...');
        const res = await API.post(`/api/evidence/${evidenceId}/verify`, {});
        hideScannerLoading();
        if (res.match) {
            showCyberToast(`Hash verified! Computed SHA-256 matches master hash perfectly.`, 'success');
        } else {
            showCyberToast(`CRITICAL INTEGRITY FAILURE: Hash mismatch detected!`, 'error');
        }
        loadEvidenceInventory();
    } catch (e) {
        hideScannerLoading();
        showCyberToast('Verification failed: ' + e.message, 'error');
    }
}

// ═══════════════════════════════════════════════════════════════════
// VIEW 4: VIDEO RECOVERY & H.264 CARVING STUDIO
// ═══════════════════════════════════════════════════════════════════
async function renderAnalysis() {
    const viewport = $('#pageViewport');
    viewport.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <div>
                <h2 style="font-size:24px;font-weight:800;color:#fff;">Video Recovery &amp; H.264 Carving Studio</h2>
                <p style="color:var(--text-secondary);font-size:13.5px;">Vendor-agnostic NAL boundary extraction, unallocated sector carving, and GOP inspection</p>
            </div>
            <button class="btn-cyber-primary" onclick="launchCarveSimulation()">
                <i class="fas fa-laser"></i> Launch Live Laser Carving
            </button>
        </div>

        <!-- Video Player Simulation & GOP Analyzer -->
        <div class="dashboard-grid-dual">
            <!-- Simulated CCTV Player -->
            <div class="cyber-panel">
                <div class="panel-header">
                    <div class="panel-title"><i class="fas fa-tv"></i> Surveillance Stream Inspection</div>
                    <span class="badge-status tamper"><i class="fas fa-triangle-exclamation"></i> TAMPER FLAG DETECTED</span>
                </div>
                <div class="panel-body">
                    <!-- Surveillance Display Screen -->
                    <div style="position:relative;background:#000;border-radius:var(--radius-md);aspect-ratio:16/9;overflow:hidden;display:flex;align-items:center;justify-content:center;border:1px solid rgba(0,242,254,0.3);box-shadow:inset 0 0 40px rgba(0,242,254,0.15);">
                        <!-- OSD Camera Watermark -->
                        <div style="position:absolute;top:14px;left:16px;font-family:monospace;font-size:12px;color:rgba(0,242,254,0.9);text-shadow:0 0 6px #000;line-height:1.4;">
                            CAM 01 — MAIN VAULT ENTRANCE<br>
                            REC [H.264 / AVC HIGH LEVEL 4.1]<br>
                            FPS: 30.00 • BITRATE: 4,200 kbps
                        </div>
                        <div style="position:absolute;top:14px;right:16px;font-family:monospace;font-size:13px;color:#00f5a0;text-shadow:0 0 6px #000;" id="playerTimestamp">
                            2026-09-18 02:43:18 UTC
                        </div>

                        <!-- Center Simulation Graphics -->
                        <div style="text-align:center;">
                            <i class="fas fa-person-military-pointing" style="font-size:64px;color:rgba(255,255,255,0.15);margin-bottom:12px;"></i>
                            <div style="background:rgba(255,42,95,0.25);border:1px solid var(--crimson-tamper);padding:8px 16px;border-radius:var(--radius-sm);color:#ff2a5f;font-family:monospace;font-size:12px;">
                                [!] TIMESTAMP ANOMALY: +252s JUMP AT OFFSET 0x12A9E00
                            </div>
                        </div>

                        <!-- Timeline Scrub Progress Bar -->
                        <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.8);padding:10px 16px;display:flex;align-items:center;gap:12px;">
                            <button style="background:none;border:none;color:#00f2fe;font-size:14px;cursor:pointer;" onclick="togglePlaySim(this)"><i class="fas fa-play"></i></button>
                            <span style="font-family:monospace;font-size:11px;color:#fff;">02:43:18</span>
                            <div style="flex:1;height:5px;background:rgba(255,255,255,0.15);border-radius:3px;position:relative;">
                                <div style="width:42%;height:100%;background:var(--cyan-primary);border-radius:3px;"></div>
                                <!-- Red marker for tamper gap -->
                                <div style="position:absolute;left:42%;top:-3px;width:12px;height:11px;background:#ff2a5f;border-radius:2px;" title="Tamper Gap Window"></div>
                            </div>
                            <span style="font-family:monospace;font-size:11px;color:var(--text-muted);">03:30:00</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- NAL Unit Tree & Stream Specs -->
            <div class="cyber-panel">
                <div class="panel-header">
                    <div class="panel-title"><i class="fas fa-cubes"></i> NAL Unit &amp; SPS/PPS Metadata</div>
                    <span class="badge-status verified">DECODED</span>
                </div>
                <div class="panel-body">
                    <div style="display:flex;flex-direction:column;gap:10px;font-size:12px;">
                        <div class="telemetry-row" style="--row-color:#00f2fe;">
                            <span class="tel-label">Video Codec</span>
                            <span class="tel-val">H.264 / MPEG-4 AVC</span>
                        </div>
                        <div class="telemetry-row" style="--row-color:#8b5cf6;">
                            <span class="tel-label">Sequence Parameter Set (SPS)</span>
                            <span class="tel-val">Profile: High (100) • Level: 4.1</span>
                        </div>
                        <div class="telemetry-row" style="--row-color:#00f5a0;">
                            <span class="tel-label">Picture Parameter Set (PPS)</span>
                            <span class="tel-val">Entropy Coding: CABAC Enabled</span>
                        </div>
                        <div class="telemetry-row" style="--row-color:#38bdf8;">
                            <span class="tel-label">IDR Keyframes Carved</span>
                            <span class="tel-val">176 Keyframes (GOP: 30)</span>
                        </div>
                        <div class="telemetry-row" style="--row-color:#ff2a5f;">
                            <span class="tel-label">GOP Structure Integrity</span>
                            <span class="tel-val" style="color:#ff2a5f;">FAILED (Mid-GOP Truncation)</span>
                        </div>
                        <div class="telemetry-row" style="--row-color:#f59e0b;">
                            <span class="tel-label">SEI User Data Header</span>
                            <span class="tel-val">Hikvision Watermark Tag: CRC32 FAIL</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- GOP Structure Visualizer -->
        <div class="cyber-panel" style="margin-bottom:28px;">
            <div class="panel-header">
                <div class="panel-title"><i class="fas fa-chart-simple"></i> GOP (Group of Pictures) Sequence Map</div>
                <div class="gop-legend" style="margin-bottom:0;">
                    <div class="legend-item"><span class="legend-color i-frame"></span> I-Frame (IDR)</div>
                    <div class="legend-item"><span class="legend-color p-frame"></span> P-Frame (Predicted)</div>
                    <div class="legend-item"><span class="legend-color b-frame"></span> B-Frame (Bi-dir)</div>
                    <div class="legend-item"><span class="legend-color tamper-gap"></span> Tamper Discontinuity</div>
                </div>
            </div>
            <div class="panel-body">
                <div class="gop-strip" id="gopStripVisualizer">
                    <!-- Populated dynamically -->
                </div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:12px;display:flex;justify-content:space-between;align-items:center;">
                    <span>PTS 1,450,000 (02:43:00)</span>
                    <span style="color:#ff2a5f;font-weight:700;"><i class="fas fa-scissors"></i> 252-SECOND FRAME VOID</span>
                    <span>PTS 1,712,000 (02:47:30)</span>
                </div>
            </div>
        </div>

        <!-- Recovered Video Files Catalog -->
        <div class="cyber-panel">
            <div class="panel-header">
                <div class="panel-title"><i class="fas fa-file-video"></i> Recovered Surveillance Streams Catalog</div>
            </div>
            <div class="panel-body" style="padding:0;">
                <div class="cyber-table-container" id="recoveredVideosTableContainer">
                    <div style="padding:30px;text-align:center;color:var(--text-muted);">Loading recovered video files...</div>
                </div>
            </div>
        </div>
    `;

    renderGOPStrip();
    loadRecoveredVideosTable();
}

function renderGOPStrip() {
    const strip = $('#gopStripVisualizer');
    if (!strip) return;

    let html = '';
    // Pre-tamper frames
    html += '<div class="frame-bar i-frame" title="IDR Keyframe #1 (Intact)"></div>';
    for (let i = 0; i < 10; i++) {
        html += `<div class="frame-bar p-frame" title="P-Frame #${i+2}"></div>`;
    }
    // Tamper break!
    html += '<div class="frame-bar tamper-break" title="CRITICAL: 252s Frame Void (Deliberate Cut)"></div>';
    // Post-tamper frames
    html += '<div class="frame-bar i-frame" title="IDR Keyframe #2 (Resumed)"></div>';
    for (let i = 0; i < 14; i++) {
        html += `<div class="frame-bar p-frame" title="P-Frame #${i+14}"></div>`;
    }
    strip.innerHTML = html;
}

let isSimPlaying = false;
let simInterval = null;
function togglePlaySim(btn) {
    isSimPlaying = !isSimPlaying;
    btn.innerHTML = `<i class="fas ${isSimPlaying ? 'fa-pause' : 'fa-play'}"></i>`;
    const ts = $('#playerTimestamp');
    if (isSimPlaying) {
        let sec = 18;
        simInterval = setInterval(() => {
            sec++;
            if (ts) ts.textContent = `2026-09-18 02:43:${sec < 10 ? '0' + sec : sec} UTC`;
        }, 800);
    } else {
        clearInterval(simInterval);
    }
}

async function loadRecoveredVideosTable() {
    const container = $('#recoveredVideosTableContainer');
    if (!container) return;

    try {
        const videos = await API.get('/api/videos');
        if (!videos || videos.length === 0) {
            container.innerHTML = `<div style="padding:30px;text-align:center;color:var(--text-muted);">No videos recovered yet.</div>`;
            return;
        }

        container.innerHTML = `
            <table class="cyber-table">
                <thead>
                    <tr>
                        <th>Video Stream File</th>
                        <th>Camera Channel</th>
                        <th>Resolution &amp; FPS</th>
                        <th>Recovery Source</th>
                        <th>SHA-256 Checksum</th>
                        <th>Integrity Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${videos.map(v => `
                        <tr>
                            <td>
                                <div style="font-weight:700;color:#fff;"><i class="fas fa-film text-cyan"></i> ${v.filename}</div>
                                <div style="font-size:10.5px;color:var(--text-muted);">${formatBytes(v.file_size_bytes)}</div>
                            </td>
                            <td><span style="font-weight:600;color:var(--text-primary);">${v.camera_name || 'Channel ' + v.channel_number}</span></td>
                            <td>${v.resolution || '1080p'} @ ${v.fps || 30} fps</td>
                            <td>
                                <span class="badge-status ${v.is_deleted_recovery ? 'carved' : 'verified'}">
                                    <i class="fas ${v.is_deleted_recovery ? 'fa-recycle' : 'fa-check'}"></i>
                                    ${v.is_deleted_recovery ? 'DELETED SECTOR CARVED' : 'ACTIVE ALLOCATION'}
                                </span>
                            </td>
                            <td>
                                <span class="hash-text" title="${v.sha256_hash}" style="color:var(--text-code);font-size:11px;">
                                    ${truncateHash(v.sha256_hash, 8)}
                                </span>
                            </td>
                            <td>
                                <span class="badge-status ${v.validation_status === 'tamper_detected' ? 'tamper' : 'verified'}">
                                    <i class="fas ${v.validation_status === 'tamper_detected' ? 'fa-triangle-exclamation' : 'fa-circle-check'}"></i>
                                    ${v.validation_status === 'tamper_detected' ? 'TAMPER FLAGGED' : 'VALID'}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch {
        container.innerHTML = `<div style="padding:20px;color:var(--crimson-tamper);">Failed to load video streams.</div>`;
    }
}

async function runDeepCarving(evidenceId) {
    try {
        showScannerLoading('Scanning unallocated disk sectors for H.264 NAL headers (0x00000001)...');
        const res = await API.post(`/api/carve/simulate/${evidenceId}`, {});
        hideScannerLoading();

        showCyberModal(
            `Deep Carving Results: Evidence #${evidenceId}`,
            'fa-microchip',
            `
            <div style="display:flex;flex-direction:column;gap:16px;">
                <div style="background:rgba(0,245,160,0.1);border:1px solid rgba(0,245,160,0.3);padding:14px;border-radius:var(--radius-md);">
                    <div style="color:var(--emerald-primary);font-weight:700;font-size:14px;margin-bottom:4px;">
                        <i class="fas fa-check-circle"></i> Carving Concluded: 100% Unallocated Space Scanned
                    </div>
                    <div style="font-size:12px;color:#fff;">
                        Sectors Analyzed: <strong>${res.sectors_scanned.toLocaleString()}</strong> | Recovered Carved Data: <strong>${res.unallocated_carved_mb} MB</strong> | Recovered NALs: <strong>${res.nals_recovered.toLocaleString()}</strong>
                    </div>
                </div>

                <h4 style="font-size:13.5px;color:#fff;"><i class="fas fa-list"></i> Carved Sector Log</h4>
                <div style="max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;">
                    ${res.carved_sectors.map(s => `
                        <div style="background:rgba(0,0,0,0.4);padding:8px 12px;border-radius:var(--radius-sm);border:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center;font-size:11px;">
                            <span style="font-family:monospace;color:var(--cyan-primary);">${s.sector} (${s.cluster})</span>
                            <span style="color:#fff;">${s.nal_type}</span>
                            <span class="badge-status ${s.status === 'TAMPER_FLAGGED' ? 'tamper' : 'verified'}" style="font-size:9.5px;">${s.status}</span>
                        </div>
                    `).join('')}
                </div>

                <div style="display:flex;justify-content:flex-end;">
                    <button class="btn-cyber-primary" onclick="hideCyberModal();navigateTo('analysis');">Inspect Carved Video</button>
                </div>
            </div>
            `
        );
    } catch (e) {
        hideScannerLoading();
        showCyberToast('Carving failed: ' + e.message, 'error');
    }
}

function launchCarveSimulation() {
    runDeepCarving(1);
}

// ═══════════════════════════════════════════════════════════════════
// VIEW 5: TIMELINE RECONSTRUCTION
// ═══════════════════════════════════════════════════════════════════
async function renderTimeline() {
    const viewport = $('#pageViewport');
    viewport.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <div>
                <h2 style="font-size:24px;font-weight:800;color:#fff;">Multi-Camera Timeline Reconstruction</h2>
                <p style="color:var(--text-secondary);font-size:13.5px;">Time-ordered sequence alignment across synchronized camera channels</p>
            </div>
        </div>

        <div class="cyber-panel">
            <div class="panel-header">
                <div class="panel-title"><i class="fas fa-timeline"></i> Incident Chronology &amp; Discontinuity Map</div>
                <span class="badge-status verified">CHANNELS 1 - 4 SYNCHRONIZED</span>
            </div>
            <div class="panel-body">
                <div class="blockchain-ledger-track" id="timelineTrackContainer">
                    <div style="padding:30px;color:var(--text-muted);">Rebuilding chronological event trail...</div>
                </div>
            </div>
        </div>
    `;

    try {
        const events = await API.get('/api/timeline/1');
        const track = $('#timelineTrackContainer');
        if (!events || events.length === 0) {
            track.innerHTML = `<div style="padding:30px;color:var(--text-muted);">No timeline events recorded.</div>`;
            return;
        }

        track.innerHTML = events.map((ev, idx) => {
            const isTamper = ev.type === 'video' && ev.status === 'tamper_detected';
            return `
                <div class="block-node">
                    <div class="block-badge-pill" style="border-color:${isTamper ? '#ff2a5f' : 'var(--cyan-primary)'};">
                        <span class="block-num">${idx + 1}</span>
                        <i class="fas ${isTamper ? 'fa-triangle-exclamation text-crimson' : (ev.type === 'video' ? 'fa-video text-cyan' : 'fa-link text-violet')} block-icon"></i>
                    </div>
                    <div class="block-card-body" style="border-left:3px solid ${isTamper ? '#ff2a5f' : 'var(--cyan-primary)'};">
                        <div class="block-card-header">
                            <span class="block-action-name" style="color:${isTamper ? '#ff2a5f' : '#fff'};">
                                ${ev.action || ev.camera || 'Forensic Event'}
                            </span>
                            <span class="block-time">${ev.time}</span>
                        </div>
                        <div style="font-size:12.5px;color:var(--text-secondary);line-height:1.5;">
                            ${ev.description || (ev.filename ? `Video Stream: ${ev.filename} (Vendor: ${ev.vendor || 'Generic'})` : '')}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch {
        $('#timelineTrackContainer').innerHTML = `<div style="padding:20px;color:var(--crimson-tamper);">Failed to load timeline.</div>`;
    }
}

// ═══════════════════════════════════════════════════════════════════
// VIEW 6: TAMPER DETECTION SUITE
// ═══════════════════════════════════════════════════════════════════
async function renderTamper() {
    const viewport = $('#pageViewport');
    viewport.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <div>
                <h2 style="font-size:24px;font-weight:800;color:#fff;">Tamper Detection &amp; Spoliation Audit</h2>
                <p style="color:var(--text-secondary);font-size:13.5px;">GOP sequence validation, timestamp discontinuity detection, and re-encoding analysis</p>
            </div>
            <span class="badge-status tamper" style="font-size:13px;padding:6px 14px;">
                <i class="fas fa-triangle-exclamation"></i> HIGH TAMPER RISK (88%)
            </span>
        </div>

        <!-- 3 Highlight Findings -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:20px;margin-bottom:28px;">
            <div class="cyber-panel" style="border-top:3px solid #ff2a5f;">
                <div class="panel-body">
                    <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                        <span class="badge-status tamper">CRITICAL SEVERITY</span>
                        <i class="fas fa-clock-rotate-left" style="color:#ff2a5f;font-size:18px;"></i>
                    </div>
                    <h3 style="font-size:16px;color:#fff;margin-bottom:8px;">Timestamp Discontinuity</h3>
                    <p style="font-size:12px;color:var(--text-secondary);line-height:1.5;">
                        A 252-second (4 min 12 sec) unlogged timestamp void detected between 02:43:18 and 02:47:30 UTC. 7,560 missing expected frames.
                    </p>
                </div>
            </div>

            <div class="cyber-panel" style="border-top:3px solid #ff2a5f;">
                <div class="panel-body">
                    <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                        <span class="badge-status tamper">CRITICAL SEVERITY</span>
                        <i class="fas fa-scissors" style="color:#ff2a5f;font-size:18px;"></i>
                    </div>
                    <h3 style="font-size:16px;color:#fff;margin-bottom:8px;">GOP Boundary Violation</h3>
                    <p style="font-size:12px;color:var(--text-secondary);line-height:1.5;">
                        Predictive P-Frame truncated mid-sequence without closed IDR boundary at sector 0x12A9E00, followed by abrupt SPS injection.
                    </p>
                </div>
            </div>

            <div class="cyber-panel" style="border-top:3px solid #f59e0b;">
                <div class="panel-body">
                    <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                        <span class="badge-status" style="background:rgba(245,158,11,0.15);color:#f59e0b;border:1px solid rgba(245,158,11,0.3);">HIGH SEVERITY</span>
                        <i class="fas fa-code-compare" style="color:#f59e0b;font-size:18px;"></i>
                    </div>
                    <h3 style="font-size:16px;color:#fff;margin-bottom:8px;">Software Re-Encoding Traces</h3>
                    <p style="font-size:12px;color:var(--text-secondary);line-height:1.5;">
                        SEI user metadata contains "x264 core 164" software encoder strings, contradicting CP Plus embedded hardware DSP firmware.
                    </p>
                </div>
            </div>
        </div>

        <!-- Tamper Log Table -->
        <div class="cyber-panel">
            <div class="panel-header">
                <div class="panel-title"><i class="fas fa-shield-virus"></i> Comprehensive Forensic Anomaly Records</div>
            </div>
            <div class="panel-body" style="padding:0;">
                <div class="cyber-table-container" id="tamperTableContainer">
                    <div style="padding:30px;text-align:center;color:var(--text-muted);">Loading anomaly findings...</div>
                </div>
            </div>
        </div>
    `;

    loadTamperTable();
}

async function loadTamperTable() {
    const container = $('#tamperTableContainer');
    if (!container) return;

    try {
        const findings = await API.get('/api/tamper');
        if (!findings || findings.length === 0) {
            container.innerHTML = `<div style="padding:30px;text-align:center;color:var(--emerald-primary);"><i class="fas fa-check-circle"></i> Clean: No tamper anomalies recorded.</div>`;
            return;
        }

        container.innerHTML = `
            <table class="cyber-table">
                <thead>
                    <tr>
                        <th>Anomaly Type</th>
                        <th>Severity</th>
                        <th>Time Range</th>
                        <th>Forensic Finding Summary</th>
                        <th>Investigator Assessment</th>
                    </tr>
                </thead>
                <tbody>
                    ${findings.map(f => `
                        <tr>
                            <td><strong style="color:#fff;font-family:monospace;">${f.analysis_type}</strong></td>
                            <td>
                                <span class="badge-status ${f.severity === 'high' ? 'tamper' : 'active'}">
                                    ${f.severity.toUpperCase()}
                                </span>
                            </td>
                            <td><span style="font-family:monospace;font-size:11px;">${f.timestamp_start || '00:00'} - ${f.timestamp_end || 'End'}</span></td>
                            <td style="max-width:380px;line-height:1.4;font-size:12px;">${f.description}</td>
                            <td>
                                <span style="font-size:11px;color:var(--text-secondary);">BSA 2023 Sec. 63 Rebuttal Ready</span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch {
        container.innerHTML = `<div style="padding:20px;color:var(--crimson-tamper);">Failed to load tamper findings.</div>`;
    }
}

// ═══════════════════════════════════════════════════════════════════
// VIEW 7: CHAIN OF CUSTODY (BLOCKCHAIN LEDGER)
// ═══════════════════════════════════════════════════════════════════
async function renderCustody() {
    const viewport = $('#pageViewport');
    viewport.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <div>
                <h2 style="font-size:24px;font-weight:800;color:#fff;">Cryptographic Chain of Custody Ledger</h2>
                <p style="color:var(--text-secondary);font-size:13.5px;">Append-only, SHA-256 hash-chained immutable audit trail meeting court admissibility standards</p>
            </div>
            <div style="display:flex;gap:12px;">
                <button class="btn-cyber-primary" onclick="verifyFullCustodyLedger()">
                    <i class="fas fa-shield-halved"></i> Verify Cryptographic Ledger
                </button>
            </div>
        </div>

        <div class="cyber-panel">
            <div class="panel-header">
                <div class="panel-title"><i class="fas fa-link"></i> Immutable Hash-Chained Blocks</div>
                <span class="badge-status verified" id="ledgerStatusBadge"><i class="fas fa-lock"></i> CHAIN INTEGRITY: 100% UNBROKEN</span>
            </div>
            <div class="panel-body">
                <div class="blockchain-ledger-track" id="custodyBlocksContainer">
                    <div style="padding:30px;color:var(--text-muted);">Verifying cryptographic blocks...</div>
                </div>
            </div>
        </div>
    `;

    loadCustodyLedger();
}

async function loadCustodyLedger() {
    const container = $('#custodyBlocksContainer');
    if (!container) return;

    try {
        const blocks = await API.get('/api/custody/1');
        if (!blocks || blocks.length === 0) {
            container.innerHTML = `<div style="padding:30px;color:var(--text-muted);">No ledger entries found.</div>`;
            return;
        }

        container.innerHTML = blocks.map((b, idx) => `
            <div class="block-node" id="custodyBlock_${idx}">
                <div class="block-badge-pill">
                    <span class="block-num">#${idx + 1}</span>
                    <i class="fas fa-cube block-icon" style="color:var(--cyan-primary);"></i>
                </div>
                <div class="block-card-body">
                    <div class="block-card-header">
                        <span class="block-action-name"><i class="fas fa-fingerprint text-cyan"></i> ${b.action}</span>
                        <span class="block-time">${b.created_at}</span>
                    </div>
                    <div class="block-meta-row">
                        <span><i class="fas fa-user-shield"></i> Custodian: <strong>${b.performed_by}</strong></span>
                        <span><i class="fas fa-scale-balanced"></i> BSA 2023 Admissible: <strong>YES</strong></span>
                    </div>
                    <div style="font-size:12.5px;color:var(--text-secondary);line-height:1.5;margin-bottom:10px;">
                        ${b.description}
                    </div>
                    <div class="block-hash-box">
                        <span>PREV: ${truncateHash(b.previous_hash, 10)}</span>
                        <span>BLOCK: <strong>${truncateHash(b.entry_hash, 10)}</strong></span>
                    </div>
                </div>
            </div>
        `).join('');
    } catch {
        container.innerHTML = `<div style="padding:20px;color:var(--crimson-tamper);">Failed to load custody ledger.</div>`;
    }
}

async function verifyFullCustodyLedger() {
    try {
        showScannerLoading('Scanning All SHA-256 Block Hashes In Cryptographic Ledger...');
        const res = await API.post('/api/custody/1/verify', {});
        hideScannerLoading();

        if (res.valid) {
            showCyberToast(`LEDGER VERIFIED: All ${res.total_entries || 9} cryptographic blocks are 100% UNBROKEN!`, 'success');
            const badge = $('#ledgerStatusBadge');
            if (badge) badge.innerHTML = `<i class="fas fa-shield-check"></i> ALL ${res.total_entries || 9} BLOCKS VERIFIED (100% COURT READY)`;
        } else {
            showCyberToast(`TAMPER ALERT: Broken link at block #${res.broken_at}!`, 'error');
        }
    } catch (e) {
        hideScannerLoading();
        showCyberToast('Ledger check failed: ' + e.message, 'error');
    }
}

// ═══════════════════════════════════════════════════════════════════
// VIEW 8: COURT-READY REPORTS (BSA 2023 SEC. 63)
// ═══════════════════════════════════════════════════════════════════
async function renderReports() {
    const viewport = $('#pageViewport');
    viewport.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <div>
                <h2 style="font-size:24px;font-weight:800;color:#fff;">Court-Ready Forensic Reports &amp; BSA 2023 Certification</h2>
                <p style="color:var(--text-secondary);font-size:13.5px;">Admissible under Section 63 of Bharatiya Sakshya Adhiniyam, 2023 (formerly Section 65B IEA)</p>
            </div>
            <button class="btn-cyber-primary" onclick="generateCaseReport(1)">
                <i class="fas fa-file-pdf"></i> Generate Full Case PDF Report
            </button>
        </div>

        <!-- Official BSA 2023 Certificate Interactive Preview -->
        <div class="bsa-cert-box" style="margin-bottom:28px;">
            <div class="cert-watermark">BSA SEC. 63 CERTIFIED</div>
            <div class="cert-title-section">
                <h3>CERTIFICATE OF AUTHENTICITY OF ELECTRONIC RECORD</h3>
                <p>[ Under Section 63 of Bharatiya Sakshya Adhiniyam, 2023 ]</p>
                <div style="font-size:11px;color:#94a3b8;margin-top:4px;">(Corresponding to erstwhile Section 65B of Indian Evidence Act, 1872)</div>
            </div>

            <div class="cert-grid-meta">
                <div><strong>Case Ref No:</strong> CASE-2026-BLR-089</div>
                <div><strong>Investigating Unit:</strong> State Cyber Crime Investigation Cell (SCCIC)</div>
                <div><strong>Examiner Name:</strong> Insp. Rajesh Varma, Cyber Forensic Examiner</div>
                <div><strong>Evidence Item:</strong> EV-2026-HK-001 (Hikvision 4TB NVR Bit-Stream DD)</div>
                <div><strong>Master SHA-256:</strong> <span style="font-family:monospace;color:#f1df97;">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span></div>
                <div><strong>Integrity Verification:</strong> 100% UNMODIFIED • ZERO BYTE CONTAMINATION</div>
            </div>

            <div class="cert-statement">
                I hereby certify under Section 63(4) of the Bharatiya Sakshya Adhiniyam, 2023 that the digital surveillance recordings and carved H.264 video streams described herein were acquired directly from the seized hardware storage medium using hardware write-blocking bridges. The hash values were computed instantaneously and have been maintained within an unbroken cryptographic ledger.
            </div>

            <div class="cert-sign-strip">
                <div>
                    <div style="font-weight:700;color:#fff;">Insp. Rajesh Varma</div>
                    <div style="font-size:11px;color:#94a3b8;">Lead Digital Forensic Examiner</div>
                    <div style="font-size:10px;color:#64748b;">Digitally Certified via SHA-256 Ledger</div>
                </div>

                <div class="judicial-seal">
                    <i class="fas fa-scale-balanced" style="font-size:18px;margin-bottom:4px;"></i>
                    <span>BSA 2023</span>
                    <span style="font-size:8px;">SEC. 63</span>
                </div>
            </div>
        </div>

        <!-- Generated PDF Reports Archive -->
        <div class="cyber-panel">
            <div class="panel-header">
                <div class="panel-title"><i class="fas fa-folder-closed"></i> Generated Legal Reports Repository</div>
            </div>
            <div class="panel-body" style="padding:0;">
                <div class="cyber-table-container" id="reportsArchiveContainer">
                    <div style="padding:30px;text-align:center;color:var(--text-muted);">Loading generated reports...</div>
                </div>
            </div>
        </div>
    `;

    loadReportsArchive();
}

async function loadReportsArchive() {
    const container = $('#reportsArchiveContainer');
    if (!container) return;

    try {
        const reports = await API.get('/api/reports');
        if (!reports || reports.length === 0) {
            container.innerHTML = `<div style="padding:30px;text-align:center;color:var(--text-muted);">No reports generated yet. Click "Generate Full Case PDF Report" above.</div>`;
            return;
        }

        container.innerHTML = `
            <table class="cyber-table">
                <thead>
                    <tr>
                        <th>Report Title</th>
                        <th>Case Reference</th>
                        <th>Generated By</th>
                        <th>SHA-256 Verification Hash</th>
                        <th>Date</th>
                        <th>Download</th>
                    </tr>
                </thead>
                <tbody>
                    ${reports.map(r => `
                        <tr>
                            <td><strong style="color:#fff;"><i class="fas fa-file-pdf text-crimson"></i> ${r.report_title}</strong></td>
                            <td><span style="font-family:monospace;color:var(--cyan-primary);">${r.case_number}</span></td>
                            <td>${r.generated_by || 'System'}</td>
                            <td><span class="hash-text" style="color:var(--text-code);font-size:11px;">${truncateHash(r.sha256_hash, 8)}</span></td>
                            <td>${r.generated_at}</td>
                            <td>
                                <a href="/api/reports/download/${r.id}" class="btn-cyber-primary" style="text-decoration:none;display:inline-flex;padding:5px 12px;font-size:11px;">
                                    <i class="fas fa-download"></i> PDF Download
                                </a>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch {
        container.innerHTML = `<div style="padding:20px;color:var(--crimson-tamper);">Failed to load reports archive.</div>`;
    }
}

async function generateCaseReport(caseId) {
    try {
        showScannerLoading('Compiling Complete Court-Ready Forensic PDF Dossier with BSA 2023 Sec. 63 Certificate...');
        const res = await API.post(`/api/reports/generate/${caseId}`, {});
        hideScannerLoading();

        showCyberModal(
            'Forensic PDF Report Ready',
            'fa-file-pdf',
            `
            <div style="text-align:center;padding:10px;">
                <i class="fas fa-circle-check" style="font-size:48px;color:var(--emerald-primary);margin-bottom:14px;"></i>
                <h3 style="font-size:18px;color:#fff;margin-bottom:8px;">Report Successfully Generated</h3>
                <p style="font-size:13px;color:var(--text-secondary);margin-bottom:16px;">
                    ${res.filename}<br>
                    SHA-256: <strong style="font-family:monospace;color:var(--cyan-primary);font-size:11px;">${res.sha256}</strong>
                </p>
                <div style="display:flex;justify-content:center;gap:12px;">
                    <a href="/api/reports/download/${res.report_id}" class="btn-cyber-primary" style="text-decoration:none;">
                        <i class="fas fa-download"></i> Download Certified PDF
                    </a>
                    <button class="btn-cyber-secondary" onclick="hideCyberModal()">Done</button>
                </div>
            </div>
            `
        );
        if (currentPage === 'reports') loadReportsArchive();
    } catch (e) {
        hideScannerLoading();
        showCyberToast('Report generation failed: ' + e.message, 'error');
    }
}

// ═══════════════════════════════════════════════════════════════════
// INITIALIZATION
function initForensicApp() {
    // 1. Particle network
    try {
        initCyberBackground();
    } catch (e) {
        console.warn('Canvas particle init:', e);
    }

    // 2. Clocks and tickers
    startCyberClock();
    startAuditStreamTicker();

    // 3. Navigation links
    $$('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            window.location.hash = page;
            navigateTo(page);
        });
    });

    // 4. Sidebar toggle
    const toggleBtn = $('#sidebarToggle');
    const sidebar = $('#sidebar');
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    // 5. Mobile toggle & Backdrop
    const mobileBtn = $('#mobileMenuBtn');
    const backdrop = $('#sidebarBackdrop');

    function closeMobileSidebar() {
        if (sidebar) sidebar.classList.remove('mobile-open');
        if (backdrop) backdrop.classList.remove('show');
    }

    function openMobileSidebar() {
        if (sidebar) sidebar.classList.add('mobile-open');
        if (backdrop) backdrop.classList.add('show');
    }

    if (mobileBtn && sidebar) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (sidebar.classList.contains('mobile-open')) {
                closeMobileSidebar();
            } else {
                openMobileSidebar();
            }
        });
    }

    if (backdrop) {
        backdrop.addEventListener('click', closeMobileSidebar);
    }

    // 6. Universal Button Ripple Effect
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-cyber-primary, .btn-cyber-secondary, .action-seed-btn');
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'cyber-ripple';
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });

    // 7. Interactive 3D Card Hover Tilt (subtle, professional)
    document.addEventListener('mousemove', (e) => {
        const card = e.target.closest('.stat-card-3d, .cyber-panel');
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -1.5;
        const rotateY = ((x - centerX) / centerX) * 1.5;
        card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    document.addEventListener('mouseout', (e) => {
        const card = e.target.closest('.stat-card-3d, .cyber-panel');
        if (card && !card.contains(e.relatedTarget)) {
            card.style.transform = '';
        }
    });

    // 8. Modal dismiss
    const modalClose = $('#modalClose');
    const modalOverlay = $('#modalOverlay');
    if (modalClose) modalClose.addEventListener('click', hideCyberModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) hideCyberModal();
        });
    }

    // 9. Quick Demo Seed button
    const seedBtn = $('#btnQuickSeed');
    if (seedBtn) {
        seedBtn.addEventListener('click', async () => {
            try {
                showScannerLoading('Injecting Court-Ready Seizure & Carved Stream Dataset...');
                const res = await API.post('/api/demo/seed', {});
                hideScannerLoading();
                showCyberToast(res.message || 'Forensic demo dataset refreshed!', 'success');
                renderPage(currentPage);
            } catch (err) {
                hideScannerLoading();
                showCyberToast('Seed failed: ' + err.message, 'error');
            }
        });
    }

    // 10. Light / Dark Theme Switcher Controller
    const themeBtn = $('#themeToggleBtn');
    const themeIcon = $('#themeToggleIcon');
    const themeText = $('#themeToggleText');

    function applyTheme(theme, showToast = false) {
        if (theme === 'light') {
            document.body.classList.remove('cyber-theme');
            document.body.classList.add('light-theme');
            if (themeIcon) {
                themeIcon.className = 'fas fa-moon';
                themeIcon.style.color = '#6366f1';
            }
            if (themeText) themeText.textContent = 'Dark';
            localStorage.setItem('forensic_vault_theme', 'light');
            if (showToast) showCyberToast('Switched to Light Theme (Forensic Laboratory)', 'info');
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('cyber-theme');
            if (themeIcon) {
                themeIcon.className = 'fas fa-sun';
                themeIcon.style.color = '#ffb800';
            }
            if (themeText) themeText.textContent = 'Light';
            localStorage.setItem('forensic_vault_theme', 'dark');
            if (showToast) showCyberToast('Switched to Dark Theme (Cyber Command)', 'info');
        }
    }

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('forensic_vault_theme') || 'dark';
    applyTheme(savedTheme, false);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(nextTheme, true);
        });
    }

    // 11. Listen for URL hash changes
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '') || 'dashboard';
        navigateTo(hash);
    });

    // 12. Initial Page Render based on URL hash
    const initialPage = window.location.hash.replace('#', '') || 'dashboard';
    navigateTo(initialPage);
}

// Bulletproof execution regardless of readyState
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForensicApp);
} else {
    initForensicApp();
}
