const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

function getAuthHeaders() {
    try {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        return {
            'X-User-Role': user?.role || 'PRINCIPAL',
            'X-User-Id': String(user?.user_id || '15')
        };
    } catch (e) {
        return { 'X-User-Role': 'PRINCIPAL', 'X-User-Id': '15' };
    }
}

export async function getNotifications() {
    const res = await fetch(`${API_BASE}/principal/notifications`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
}

export async function approveSyllabus(syllabusId, comment = '') {
    const url = `${API_BASE}/principal/final-approvals/${syllabusId}/approve${comment ? `?comment=${encodeURIComponent(comment)}` : ''}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' }
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Approve failed');
    }
    return res.json();
}

export async function rejectSyllabus(syllabusId, reason) {
    const url = `${API_BASE}/principal/final-approvals/${syllabusId}/reject?reason=${encodeURIComponent(reason)}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Reject failed');
    return res.json();
}
