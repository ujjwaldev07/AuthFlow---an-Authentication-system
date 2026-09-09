const RESEND_API_URL = "https://api.resend.com/emails";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getRecipients(userEmail) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL?.trim().toLowerCase();
  return [...new Set([userEmail?.trim().toLowerCase(), adminEmail].filter(Boolean))];
}

export async function sendAuthNotification({ event, user }) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  const recipients = getRecipients(user?.email);

  // Email delivery must never break registration, login, or logout.
  if (!apiKey || !from || recipients.length === 0) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Auth email notification skipped: email environment variables are not configured.");
    }
    return;
  }

  const safeName = escapeHtml(user?.name || "User");
  const safeEmail = escapeHtml(user?.email || "");
  const safeEvent = escapeHtml(event);
  const subject = `AuthFlow ${event} notification`;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033;max-width:600px;margin:auto">
      <h2 style="margin-bottom:8px">AuthFlow security notification</h2>
      <p>Hello ${safeName},</p>
      <p>Your AuthFlow account was <strong>${safeEvent}</strong>.</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p>If this activity was not performed by you, please secure your account immediately.</p>
      <hr style="border:0;border-top:1px solid #ddd;margin:24px 0" />
      <p style="font-size:12px;color:#667085">This is an automated message from AuthFlow.</p>
    </div>
  `;

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to: recipients,
        subject,
        html
      })
    });

    if (!response.ok && process.env.NODE_ENV !== "production") {
      const details = await response.text().catch(() => "");
      console.warn(`Auth email notification failed (${response.status}): ${details}`);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Auth email notification request failed:", error?.message || error);
    }
  }
}
