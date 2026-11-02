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

const brief = document.querySelector("#brief");
function selectedTopic(topic) {
  const buttons = [...document.querySelectorAll(".choices button")];
  const match = /^[a-z]+$/.test(topic) ? buttons.find((button) => button.dataset.topic === topic) : null;
  if (!match) return;
  buttons.forEach((item) => item.setAttribute("aria-pressed", "false"));
  match.setAttribute("aria-pressed", "true");
  const matter = document.querySelector("#matter");
  if (matter) matter.textContent = match.textContent.trim();
}
function paintBrief() {
  if (!brief) return;
  const en = document.documentElement.lang === "en";
  const who = document.querySelector("#who")?.value.trim() || (en ? "(add a company name)" : "（企业称呼）");
  const where = document.querySelector("#where")?.value.trim() || (en ? "(add a region)" : "（业务地区）");
  const pressed = document.querySelector('.choices button[aria-pressed="true"]');
  const matter = pressed?.textContent.trim() || (en ? "See the scope first" : "先看服务范围");
  const extra = document.querySelector("#extra")?.value.trim() || "";
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
  selectedTopic(location.hash.replace("#", ""));
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

document.addEventListener("click", (event) => {
  const node = event.target instanceof Element ? event.target.closest("[data-track]") : null;
  if (!node || typeof window.finanpivot?.track !== "function") return;
  window.finanpivot.track(node.getAttribute("data-track") || "click", { path: location.pathname });
});
