const form = document.querySelector("#shorten-form");
const urlInput = document.querySelector("#long-url");
const message = document.querySelector("#form-message");
const result = document.querySelector("#result");
const resultLink = document.querySelector("#result-link");
const copyResult = document.querySelector("#copy-result");
const historyList = document.querySelector("#history-list");
const emptyState = document.querySelector("#empty-state");
const historyCount = document.querySelector("#history-count");
const clearHistory = document.querySelector("#clear-history");
const historyKey = "shortform.history";

function readHistory() {
  try {
    return JSON.parse(localStorage.getItem(historyKey) || "[]");
  } catch {
    return [];
  }
}

function renderHistory() {
  const links = readHistory();
  historyList.replaceChildren();
  emptyState.hidden = links.length > 0;
  clearHistory.hidden = links.length === 0;
  historyCount.textContent = String(links.length);

  links.forEach((link, index) => {
    const item = document.createElement("article");
    item.className = "history-item";

    const top = document.createElement("div");
    top.className = "history-item-top";
    const shortLink = document.createElement("a");
    shortLink.className = "history-short";
    shortLink.href = link.shorturl;
    shortLink.target = "_blank";
    shortLink.rel = "noreferrer";
    shortLink.textContent = new URL(link.shorturl).host + new URL(link.shorturl).pathname;
    const copyButton = document.createElement("button");
    copyButton.className = "history-copy";
    copyButton.type = "button";
    copyButton.dataset.copy = link.shorturl;
    copyButton.textContent = "COPY";
    copyButton.setAttribute("aria-label", `Copy ${link.shorturl}`);
    top.append(shortLink, copyButton);

    const destination = document.createElement("span");
    destination.className = "history-destination";
    destination.textContent = link.longurl;
    item.append(top, destination);
    item.style.animationDelay = `${Math.min(index, 5) * 35}ms`;
    historyList.append(item);
  });
}

async function copyText(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    const originalText = button.textContent;
    button.textContent = "COPIED";
    window.setTimeout(() => { button.textContent = originalText; }, 1200);
  } catch {
    message.textContent = "Clipboard access is unavailable in this browser.";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";
  result.hidden = true;

  let destination;
  const rawUrl = urlInput.value.trim();
  try {
    destination = new URL(rawUrl);
    if (!["http:", "https:"].includes(destination.protocol)) throw new Error();
  } catch {
    message.textContent = "Enter a full URL beginning with http:// or https://.";
    urlInput.focus();
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.querySelector("span:first-child").textContent = "Making your link...";

  try {
    const response = await fetch("/api/v1/url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ longurl: rawUrl }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Unable to create a short link.");

    const shortened = payload.data;
    const links = readHistory().filter((link) => link.shorturl !== shortened.shorturl);
    links.unshift({ shorturl: shortened.shorturl, longurl: shortened.longurl });
    localStorage.setItem(historyKey, JSON.stringify(links.slice(0, 12)));
    resultLink.href = shortened.shorturl;
    resultLink.textContent = shortened.shorturl;
    result.hidden = false;
    renderHistory();
  } catch (error) {
    message.textContent = error.message || "Something went wrong. Please try again.";
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector("span:first-child").textContent = "Shorten link";
  }
});

copyResult.addEventListener("click", () => copyText(resultLink.href, copyResult));
historyList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-copy]");
  if (button) copyText(button.dataset.copy, button);
});
clearHistory.addEventListener("click", () => {
  localStorage.removeItem(historyKey);
  renderHistory();
});

renderHistory();