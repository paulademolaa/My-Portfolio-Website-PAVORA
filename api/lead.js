// Vercel serverless function: POST /api/lead
// Receives the project brief from the website assistant and emails it to you.
//
// Set these in Vercel → Project → Settings → Environment Variables:
//   RESEND_API_KEY   your key from https://resend.com (free plan is fine)
//   LEAD_TO_EMAIL    where briefs should go (your inbox)
//   LEAD_FROM_EMAIL  optional, e.g. "PAVORA <hello@yourdomain.com>"
//                    (needs a verified domain in Resend; defaults to Resend's test sender)
//
// Nothing secret lives in the code, so the repo can stay public.

const clean = (v, max = 2000) => String(v ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
const escape = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { RESEND_API_KEY, LEAD_TO_EMAIL, LEAD_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !LEAD_TO_EMAIL) {
    return res.status(503).json({ error: "Email is not set up yet" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body ||= {};

  // Bots fill hidden fields — quietly accept and drop
  if (body.website) return res.status(200).json({ ok: true });

  const lead = {
    name: clean(body.name, 120),
    email: clean(body.email, 200),
    service: clean(body.service, 120),
    timeline: clean(body.timeline, 120),
    budget: clean(body.budget, 120),
    details: clean(body.details, 4000),
    page: clean(body.page, 200),
  };

  if (!lead.name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email) || lead.details.length < 10) {
    return res.status(400).json({ error: "Please include a name, a valid email and a few project details" });
  }

  const rows = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Service", lead.service || "—"],
    ["Timeline", lead.timeline || "—"],
    ["Budget", lead.budget || "—"],
    ["Sent from", lead.page || "/"],
  ];

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px">
      <h2 style="margin:0 0 16px">New project brief from the website assistant</h2>
      <table style="border-collapse:collapse;width:100%">
        ${rows.map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#64748b;width:110px">${k}</td><td style="padding:6px 0"><b>${escape(v)}</b></td></tr>`).join("")}
      </table>
      <h3 style="margin:24px 0 8px">Project details</h3>
      <p style="white-space:pre-wrap;line-height:1.6;margin:0">${escape(lead.details)}</p>
      <p style="color:#64748b;font-size:13px;margin-top:24px">Reply to this email to answer ${escape(lead.name)} directly.</p>
    </div>`;

  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nProject details:\n${lead.details}`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: LEAD_FROM_EMAIL || "PAVORA Assistant <onboarding@resend.dev>",
        to: [LEAD_TO_EMAIL],
        reply_to: lead.email,
        subject: `New brief: ${lead.service || "Project"} — ${lead.name}`,
        html,
        text,
      }),
    });
    if (!r.ok) {
      console.error("Resend error", r.status, await r.text());
      return res.status(502).json({ error: "Could not send the email" });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(502).json({ error: "Could not send the email" });
  }
}
