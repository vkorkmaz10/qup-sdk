import { DEFAULT_ORIGIN } from './connection';
async function exchange(origin, code, kind, card) {
    try {
        const res = await fetch(`${origin}/api/events/${encodeURIComponent(code.toUpperCase())}/${kind}`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ t: card }),
        });
        const body = (await res.json().catch(() => ({})));
        if (res.ok && !body.error)
            return { ok: true, value: body };
        return { ok: false, error: body.error ?? `http_${res.status}` };
    }
    catch {
        return { ok: false, error: 'network' };
    }
}
export const exchangeMemberCard = (code, card, origin = DEFAULT_ORIGIN) => exchange(origin, code, 'member-pass', card);
export const exchangeStaffCard = (code, card, origin = DEFAULT_ORIGIN) => exchange(origin, code, 'staff-pass', card);
