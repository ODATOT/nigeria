(function () {
  "use strict";
  // QR코드관리!B8:H11 snapshot, 2026-10-01. All four rows share this URL.
  const checkInUrl = "https://script.google.com/macros/s/AKfycbwQMnJ5neDDl2_ttRaLTP1EMZOgsaHxMKm6-E01teHuwoSargeG5KAYqgyHHtuZJJYs/exec";
  const dates = [
    ["2026-10-23", "2026-10-24"],
    ["2026-10-30", "2026-10-31"],
    ["2026-11-06", "2026-11-07"],
    ["2026-11-13", "2026-11-14"]
  ];
  const today = new Intl.DateTimeFormat("sv-SE",{timeZone:"Asia/Seoul",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
  const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=" + encodeURIComponent(checkInUrl);
  const dialog = document.getElementById("zoom");
  function zoom(week) {
    document.getElementById("zoom-title").textContent = "Week " + week + " Attendance QR";
    document.getElementById("zoom-image").src = qrUrl;
    dialog.showModal();
  }
  dates.forEach(function (days,index) {
    const week = index+1;
    const card = document.createElement("article");
    const status = today < days[0] ? "Upcoming" : today > days[1] ? "Ended" : "Ongoing";
    card.innerHTML = '<span class="status">' + status + '</span><h2>Week ' + week + ' Attendance</h2><div class="details"><button class="qr" type="button" aria-label="Week ' + week + ' QR zoom"><img alt="Week ' + week + ' Attendance QR" width="150" height="150"></button><div><p>Day 1 · ' + days[0] + '<br><strong>by 18:00</strong></p><p>Day 2 · ' + days[1] + '<br><strong>by 09:00</strong></p></div></div><div class="actions"><button type="button">Enlarge QR</button><a target="_blank" rel="noopener noreferrer">Open check-in page ↗</a></div>';
    const img = card.querySelector("img");
    img.src = qrUrl;
    img.addEventListener("error",function () { img.alt="Couldn't load the QR image. Please use \"Open check-in page.\""; });
    card.querySelector("a").href = checkInUrl;
    card.querySelectorAll("button").forEach(function (button) { button.addEventListener("click",function () { zoom(week); }); });
    document.getElementById("weeks").appendChild(card);
  });
  document.getElementById("close").addEventListener("click",function () { dialog.close(); });
  dialog.addEventListener("click",function (event) { if (event.target === dialog) dialog.close(); });
})();
