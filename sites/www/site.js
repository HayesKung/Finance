document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.getAttribute("data-copy") || "";
    const status = document.querySelector("#copy-status");
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
function paintBrief() {
  if (!brief) return;
  const who = document.querySelector("#who")?.value.trim() || (document.documentElement.lang === "en" ? "(company)" : "（企业称呼）");
  const where = document.querySelector("#where")?.value.trim() || (document.documentElement.lang === "en" ? "(region)" : "（业务地区）");
  const pressed = document.querySelector('.choices button[aria-pressed="true"]');
  const matter = pressed?.textContent.trim() || (document.documentElement.lang === "en" ? "Export papers and receipts" : "出口单据和收汇");
  const extra = document.querySelector("#extra")?.value.trim() || "";
  const en = document.documentElement.lang === "en";
  const subject = en ? "FinanPivot inquiry" : "FinanPivot 咨询";
  const body = en
    ? `Company: ${who}\nRegion: ${where}\nTopic: ${matter}\nNote: ${extra}\n\nThis is a first conversation, not a contract or an order. Please do not attach bank passwords, full identity documents, or client money accounts.`
    : `企业：${who}\n业务地区：${where}\n想先看的事项：${matter}\n补充：${extra}\n\n这是初步沟通，不是合同，也不是订单。请不要附银行口令、完整证件或客户资金账户。`;
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
      paintBrief();
    });
  });
  brief.querySelectorAll("input, textarea").forEach((field) => field.addEventListener("input", paintBrief));
  paintBrief();
}
