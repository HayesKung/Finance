document.querySelectorAll(".qq-open").forEach((link) => {
  link.addEventListener("click", (event) => {
    const card = link.closest(".contact-card");
    const fallback = card?.querySelector(".qq-fallback");
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const protocol = coarse ? link.dataset.mobile : link.dataset.desktop;
    if (!protocol || !fallback) return;
    event.preventDefault();
    window.location.href = protocol;
    window.setTimeout(() => {
      if (document.visibilityState === "visible") fallback.hidden = false;
    }, 1200);
  });
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.getAttribute("data-copy") || "";
    const status = button.parentElement?.querySelector(".copy-status");
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const field = document.createElement("textarea");
      field.value = value;
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    if (status) status.textContent = document.documentElement.lang === "en" ? "QQ number copied" : "已复制 QQ 号";
  });
});

const langButton = document.querySelector("#lang");
if (langButton) {
  const apply = (lang) => {
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
    document.querySelectorAll("[data-en]").forEach((node) => {
      if (!node.dataset.zh) node.dataset.zh = node.textContent;
      node.textContent = lang === "en" ? node.dataset.en : node.dataset.zh;
    });
    langButton.textContent = lang === "en" ? "中文" : "EN";
    paintBrief();
  };
  langButton.addEventListener("click", () => apply(document.documentElement.lang === "en" ? "zh" : "en"));
}

const brief = document.querySelector("#brief");
function paintBrief() {
  if (!brief) return;
  const who = document.querySelector("#who")?.value.trim() || "（企业称呼）";
  const where = document.querySelector("#where")?.value.trim() || "（业务地区）";
  const pressed = document.querySelector('.choices button[aria-pressed="true"]');
  const matter = pressed?.textContent.trim() || "先看服务范围";
  const extra = document.querySelector("#extra")?.value.trim() || "";
  const en = document.documentElement.lang === "en";
  const subject = en ? "FinanPivot inquiry" : "FinanPivot 咨询";
  const body = en
    ? `Company: ${who}\nRegion: ${where}\nTopic: ${matter}\nNote: ${extra}\n\nThis is a first conversation, not a contract or an order.`
    : `企业：${who}\n业务地区：${where}\n想先看的事项：${matter}\n补充：${extra}\n\n这是初步沟通，不是合同，也不是订单。`;
  const preview = document.querySelector("#preview");
  if (preview) preview.textContent = `${subject}\n\n${body}`;
  const send = document.querySelector("#send");
  if (send) send.href = `mailto:admin@finanpivot.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
if (brief) {
  document.querySelectorAll(".choices button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".choices button").forEach((item) => item.setAttribute("aria-pressed", "false"));
      button.setAttribute("aria-pressed", "true");
      const matter = document.querySelector("#matter");
      if (matter) matter.textContent = button.textContent.trim();
      paintBrief();
    });
  });
  brief.querySelectorAll("input, textarea").forEach((field) => field.addEventListener("input", paintBrief));
  paintBrief();
}
