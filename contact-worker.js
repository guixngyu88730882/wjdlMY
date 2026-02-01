/**
 * Cloudflare Worker: /api/contact
 * - 接收前端 JSON
 * - 通过 MailChannels 发送到你的邮箱（163 + QQ）
 *
 * 部署要点（你在 Cloudflare 后台做）：
 * 1) 创建 Worker，把这段代码粘进去
 * 2) 给站点绑定一个路由：/api/contact -> 这个 Worker
 * 3) 在 Worker 里配置环境变量 FROM_EMAIL（建议：noreply@你的域名）
 */

const TO = [
  "guxingyu88730882@163.com",
  "3573799137@qq.com",
];

const DEFAULT_FROM = "noreply@your-domain.com";

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders,
    },
  });
}

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  return {
    "access-control-allow-origin": origin || "*",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
  };
}

function safeText(v, max = 2000) {
  const s = (v == null ? "" : String(v)).trim();
  return s.length > max ? s.slice(0, max) : s;
}

export default {
  async fetch(request, env, ctx) {
    const cors = corsHeaders(request);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== "POST") {
      return json({ ok: false, message: "Method Not Allowed" }, 405, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, message: "Bad JSON" }, 400, cors);
    }

    // 简易蜜罐：前端有个隐藏字段，机器人填了就当作成功吞掉
    const botField = safeText(body.website || "", 200);
    if (botField) {
      return json({ ok: true }, 200, cors);
    }

    const name = safeText(body.name, 80);
    const contact = safeText(body.contact, 120);
    const product = safeText(body.product, 60);
    const message = safeText(body.message, 4000);

    if (!message || message.length < 5) {
      return json({ ok: false, message: "请填写更详细的留言内容" }, 400, cors);
    }

    const fromEmail = env && env.FROM_EMAIL ? String(env.FROM_EMAIL) : DEFAULT_FROM;

    const subject = `[EF Mods] 留言${product ? `（${product}）` : ""}`;
    const content = [
      `时间：${new Date().toISOString()}`,
      `姓名：${name || "（未填）"}`,
      `联系方式：${contact || "（未填）"}`,
      `产品：${product || "（未选）"}`,
      "",
      message,
    ].join("\n");

    const resp = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        personalizations: [
          {
            to: TO.map((email) => ({ email })),
          },
        ],
        from: {
          email: fromEmail,
          name: "EF Mods 网站留言",
        },
        subject,
        content: [
          {
            type: "text/plain",
            value: content,
          },
        ],
        reply_to: contact && contact.includes("@") ? { email: contact } : undefined,
      }),
    });

    if (!resp.ok) {
      return json({ ok: false, message: "发送失败，请稍后再试" }, 502, cors);
    }

    return json({ ok: true, message: "已发送，我们会尽快回复" }, 200, cors);
  },
};