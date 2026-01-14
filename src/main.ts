import "./main.css";

document.addEventListener("DOMContentLoaded", () => {
    try {
        document.querySelectorAll(".stream-start-time").forEach((el) => {
            updateStreamTime(el);
        });
    } finally {
        document.documentElement.classList.remove("pending");
    }
});

function updateStreamTime(element: Element): void {
    const now = new Date();
    const target = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 2, 0, 0));
    if (now >= target) target.setUTCDate(target.getUTCDate() + 1);
    const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        timeZoneName: "short",
    };
    const textContent = target.toLocaleString(undefined, options);
    const datetime = target.toISOString();
    element.textContent = textContent;
    element.setAttribute("datetime", datetime);
}
