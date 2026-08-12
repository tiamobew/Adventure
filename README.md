# Adventure — เกมผจญภัยทศนิยม 3D

เกมผจญภัยบนเกาะลอยฟ้า เดินเข้าใกล้มอนสเตอร์และตอบโจทย์ทศนิยมเพื่อผ่านแต่ละด่าน

## เล่นออนไลน์

https://tiamobew.github.io/Adventure/

## จัดการโจทย์

เกมใช้ Google Sheet เป็นคลังโจทย์กลาง ทุกอุปกรณ์จะได้รับโจทย์ชุดเดียวกัน และตรวจการอัปเดตเมื่อกลับมาเปิดหน้าเกมหรือภายใน 1 นาที

- `index.html` — หน้า GitHub Pages ที่แสดง Google Web App เต็มหน้าจอ
- `part2.html` — เกมผจญภัยหลักที่ใช้ใน Google Apps Script
- `admin.html` — หน้า Admin สำหรับ Google Apps Script
- `apps-script/Code.gs` — backend เชื่อม Google Sheet
- `js/config.js` — URL ของ Web App
- `docs/google-sheet-setup.md` — คู่มือระบบคลังโจทย์

เกมบันไดงูอยู่ที่ repository `skyisland`:
https://github.com/tiamobew/skyisland
