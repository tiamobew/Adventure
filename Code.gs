/****************************************************************************************
 *  เกาะลอยฟ้า ผจญภัยทศนิยม — Google Apps Script (Code.gs)
 *  ------------------------------------------------------------------------------------
 *  ไฟล์นี้ทำหน้าที่ 3 อย่าง:
 *    1) doGet()        -> เสิร์ฟหน้าเกม (ไฟล์ part2.html) ให้เปิดผ่านลิงก์เว็บแอปได้
 *    2) getQuestions() -> อ่านโจทย์จากชีท "โจทย์" ส่งให้เกม (ครูแก้โจทย์ในชีทได้เอง!)
 *    3) saveRecord()   -> บันทึกคะแนนผู้เล่นลงชีท "คะแนน" ทุกครั้งที่จบเกม
 *
 *  วิธีติดตั้งแบบละเอียด อ่านได้ในไฟล์  คู่มือ-Google-Sheet.md
 ****************************************************************************************/

// ชื่อชีท (แท็บด้านล่างของ Google Sheet) — เปลี่ยนได้ถ้าต้องการ
const SHEET_QUESTIONS_NAME = 'โจทย์';
const SHEET_SCORES_NAME    = 'คะแนน';

/**
 * เสิร์ฟหน้าเกม + รองรับการขอโจทย์แบบ ?action=questions (เผื่อกรณีเปิดไฟล์แยก)
 */
function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'questions') {
    return ContentService
      .createTextOutput(JSON.stringify(getQuestions()))
      .setMimeType(ContentService.MimeType.JSON);
  }
  // ไฟล์ HTML ในโปรเจกต์ Apps Script ต้องชื่อ "part2" (คือ part2.html)
  return HtmlService.createHtmlOutputFromFile('part2')
    .setTitle('เกาะลอยฟ้า ผจญภัยทศนิยม')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * รองรับกรณีเปิดไฟล์ HTML แยก (วิธี B) แล้วส่งคะแนนมาแบบ POST
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    saveRecord(data);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * อ่านโจทย์ทั้งหมดจากชีท "โจทย์"
 * คืนค่าเป็น array ของ [ระดับ, โจทย์, คำตอบ]  เช่น  [['ง่าย','1.5 + 2.3','3.8'], ...]
 * เกมจะสุ่มหยิบโจทย์ตามระดับของมอนสเตอร์ไปแสดงเอง
 */
function getQuestions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_QUESTIONS_NAME);
  if (!sh) return [];                       // ยังไม่มีชีทโจทย์ -> เกมจะใช้โจทย์สุ่มอัตโนมัติแทน
  const values = sh.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < values.length; i++) { // เริ่มที่แถว 2 (ข้ามหัวตาราง)
    const row = values[i];
    if (row[0] === '' && row[1] === '') continue; // ข้ามแถวว่าง
    out.push([row[0], row[1], row[2]]);
  }
  return out;
}

/**
 * บันทึกคะแนน 1 รายการลงชีท "คะแนน" (สร้างชีทและหัวตารางให้อัตโนมัติถ้ายังไม่มี)
 */
function saveRecord(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_SCORES_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_SCORES_NAME);
    sh.appendRow(['เวลาที่บันทึก', 'ชื่อผู้เล่น', 'ผลการเล่น', 'คะแนนต่อสู้',
                  'โบนัสเวลา', 'คะแนนรวม', 'เวลาที่ใช้(วินาที)', 'มอนสเตอร์ที่ปราบ']);
    sh.getRange('A1:H1').setFontWeight('bold');
  }
  sh.appendRow([
    new Date(),
    data.name || '',
    data.status || '',
    data.score || 0,
    data.bonus || 0,
    data.total || 0,
    data.timeSec || 0,
    data.monstersDefeated || 0
  ]);
  return { ok: true };
}

/**
 * ►► รันฟังก์ชันนี้ "ครั้งเดียว" เพื่อสร้างชีท "โจทย์" ตัวอย่างให้ครูแก้ไข ◄◄
 * (เมนู Apps Script: เลือกฟังก์ชัน setupQuestionSheet แล้วกด Run)
 */
function setupQuestionSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_QUESTIONS_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_QUESTIONS_NAME);
  sh.clear();
  sh.appendRow(['ระดับ', 'โจทย์', 'คำตอบ']);
  // ระดับที่ใช้ได้: ง่าย / ปานกลาง / ยาก / บอส  (พิมพ์ภาษาอังกฤษ easy/medium/hard/boss ก็ได้)
  // โจทย์ที่มีหลายเครื่องหมาย แนะนำใส่วงเล็บให้ชัดเจน เพื่อไม่ให้เด็กสับสนลำดับการคิด
  const sample = [
    ['ง่าย',     '1.5 + 2.3',        '3.8'],
    ['ง่าย',     '8.4 - 5.1',        '3.3'],
    ['ง่าย',     '7.2 + 6.5',        '13.7'],
    ['ปานกลาง', '2.5 × 4',          '10.0'],
    ['ปานกลาง', '9.6 ÷ 3',          '3.2'],
    ['ยาก',     '3.2 + (1.5 × 2)',  '6.2'],
    ['ยาก',     '(8.0 ÷ 4) + 5.5',  '7.5'],
    ['บอส',     '(6.0 × 3) - 2.5',  '15.5']
  ];
  sample.forEach(r => sh.appendRow(r));
  sh.getRange('A1:C1').setFontWeight('bold');
  sh.setColumnWidth(2, 220);
  SpreadsheetApp.getUi().alert('สร้างชีท "โจทย์" ตัวอย่างเรียบร้อยแล้ว ✅\nแก้ไข/เพิ่มโจทย์ในแท็บ "โจทย์" ได้เลย');
}
