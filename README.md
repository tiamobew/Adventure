# ผจญภัยเกาะมหาสนุก

เกมผจญภัยบนเกาะลอยฟ้า เดินเข้าใกล้มอนสเตอร์และตอบโจทย์ทศนิยมเพื่อผ่านแต่ละด่าน

## เล่นออนไลน์

https://tiamobew.github.io/Adventure/

## จัดการโจทย์

เกมใช้ Google Sheet เป็นคลังโจทย์กลาง ทุกอุปกรณ์จะได้รับโจทย์ชุดเดียวกัน และตรวจการอัปเดตเมื่อกลับมาเปิดหน้าเกมหรือภายใน 1 นาที

หน้า Admin รองรับการนำเข้าและส่งออกไฟล์ CSV ซึ่งเปิดแก้ไขได้ด้วย Excel, Google Sheets และแอปตารางบนมือถือ โดยใช้แม่แบบ `questions-template.csv`

- `index.html` — หน้า GitHub Pages ที่แสดงเกมเต็มหน้าจอ ใช้ได้ทุกอุปกรณ์
- `part2.html` — เกมผจญภัยหลักที่ใช้ใน Google Apps Script
- `admin.html` — หน้า Admin สำหรับ Google Apps Script
- `questions-template.csv` — แม่แบบคลังโจทย์ CSV จำนวน 10 ข้อ
- `apps-script/Code.gs` — backend เชื่อม Google Sheet
- `js/config.js` — URL ของ Web App
- `docs/google-sheet-setup.md` — คู่มือระบบคลังโจทย์

เกมบันไดงูอยู่ที่ repository `skyisland`:
https://github.com/tiamobew/skyisland
