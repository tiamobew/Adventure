/****************************************************************************************
 *  ผจญภัยเกาะมหาสนุก — Google Apps Script (Code.gs)
 *  ------------------------------------------------------------------------------------
 *  ไฟล์นี้ทำหน้าที่ 4 อย่าง:
 *    1) doGet()        -> เสิร์ฟหน้าเกม (ไฟล์ part2.html) ให้เปิดผ่านลิงก์เว็บแอปได้
 *    2) getQuestions() -> อ่านโจทย์จากชีท "โจทย์" ส่งให้เกม (ครูแก้โจทย์ในชีทได้เอง!)
 *    3) saveRecord()   -> บันทึกคะแนนผู้เล่นลงชีท "คะแนน" ทุกครั้งที่จบเกม
 *    4) หน้า Admin    -> จัดการคลังโจทย์กลางจากอุปกรณ์ใดก็ได้
 *
 *  วิธีติดตั้งแบบละเอียด อ่านได้ในไฟล์ docs/google-sheet-setup.md
 ****************************************************************************************/

// ชื่อชีท (แท็บด้านล่างของ Google Sheet) — เปลี่ยนได้ถ้าต้องการ
const SHEET_QUESTIONS_NAME = 'โจทย์';
const SHEET_SCORES_NAME    = 'คะแนน';

/**
 * เสิร์ฟหน้าเกม + รองรับการขอโจทย์แบบ ?action=questions (เผื่อกรณีเปิดไฟล์แยก)
 */
function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'questions') {
    const json = JSON.stringify(getQuestions());
    const callback = String(e.parameter.callback || '').replace(/[^a-zA-Z0-9_.$]/g, '');
    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + json + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
  }
  const page = e && e.parameter && e.parameter.page === 'admin' ? 'admin' : 'part2';
  const title = page === 'admin' ? 'Admin จัดการโจทย์ — ผจญภัยเกาะมหาสนุก' : 'ผจญภัยเกาะมหาสนุก';
  return HtmlService.createHtmlOutputFromFile(page)
    .setTitle(title)
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
  return readQuestionBank_()
    .filter(function (item) { return item.enabled; })
    .map(function (item) {
      return {
        id: item.id,
        level: item.level,
        text: item.text,
        answer: item.answer,
        choices: item.choices,
        hint: item.hint
      };
    });
}

/** ตรวจรหัสและอ่านคลังโจทย์สำหรับหน้า Admin */
function getQuestionBank(pin) {
  assertAdmin_(pin);
  return readQuestionBank_();
}

/** บันทึกคลังโจทย์ทั้งชุดลง Google Sheet เพื่อให้ทุกอุปกรณ์ใช้ข้อมูลเดียวกัน */
function saveQuestionBank(pin, items) {
  assertAdmin_(pin);
  const normalized = normalizeQuestionBank_(items);
  if (!normalized.length) throw new Error('ต้องมีโจทย์อย่างน้อย 1 ข้อ');
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    writeQuestionBank_(normalized);
  } finally {
    lock.releaseLock();
  }
  return normalized;
}

function verifyAdmin(pin) {
  return String(pin || '') === getAdminPin_();
}

function resetQuestionBank(pin) {
  assertAdmin_(pin);
  const items = defaultQuestionBank_();
  writeQuestionBank_(items);
  return items;
}

function getAdminPin_() {
  // ตั้งค่า ADMIN_PIN ใน Project Settings > Script properties ก่อนเผยแพร่จริง
  return PropertiesService.getScriptProperties().getProperty('ADMIN_PIN') || '044441300';
}

function assertAdmin_(pin) {
  if (!verifyAdmin(pin)) throw new Error('รหัส Admin ไม่ถูกต้อง');
}

function normalizeLevel_(value) {
  const text = String(value == null ? '' : value).trim().toLowerCase();
  if (text === 'easy' || text === 'ง่าย') return 'easy';
  if (text === 'medium' || text === 'ปานกลาง' || text === 'กลาง') return 'medium';
  if (text === 'hard' || text === 'ยาก') return 'hard';
  if (text === 'boss' || text === 'บอส') return 'boss';
  return null;
}

function parseChoices_(value, answer) {
  let values = value;
  if (typeof values === 'string') {
    try { values = JSON.parse(values); }
    catch (err) { values = values.split(','); }
  }
  if (!Array.isArray(values)) values = [];
  const out = [];
  values.forEach(function (choice) {
    if (choice === '' || choice === null || typeof choice === 'undefined') return;
    const number = Number(choice);
    if (isFinite(number) && out.indexOf(number) === -1) out.push(number);
  });
  if (out.indexOf(answer) === -1) out.unshift(answer);
  let step = 1;
  while (out.length < 4) {
    const next = Number((answer + step).toFixed(2));
    if (out.indexOf(next) === -1) out.push(next);
    step++;
  }
  return out.slice(0, 4);
}

function normalizeQuestionBank_(items) {
  if (!Array.isArray(items)) return [];
  return items.map(function (item, index) {
    item = item || {};
    const level = normalizeLevel_(item.level);
    const text = String(item.text || '').trim();
    const answer = Number(item.answer);
    if (!level || !text || !isFinite(answer)) return null;
    return {
      id: String(item.id || ('question-' + new Date().getTime() + '-' + index)),
      level: level,
      enabled: item.enabled !== false,
      text: text,
      answer: answer,
      choices: parseChoices_(item.choices, answer),
      hint: String(item.hint || 'ค่อย ๆ คำนวณทีละขั้น').trim()
    };
  }).filter(function (item) { return item !== null; });
}

function readQuestionBank_() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_QUESTIONS_NAME);
  if (!sh || sh.getLastRow() < 2) return [];
  const values = sh.getDataRange().getValues();
  const headers = values[0].map(function (value) { return String(value).trim().toLowerCase(); });
  const modern = headers.indexOf('id') !== -1;
  const items = values.slice(1).map(function (row, index) {
    if (modern) {
      return {
        id: row[0], level: row[1], enabled: row[2] !== false && String(row[2]).toLowerCase() !== 'false',
        text: row[3], answer: row[4], choices: row[5], hint: row[6]
      };
    }
    // รองรับชีทเดิม 3 คอลัมน์: ระดับ, โจทย์, คำตอบ
    return { id: 'legacy-' + (index + 1), level: row[0], enabled: true, text: row[1], answer: row[2] };
  });
  return normalizeQuestionBank_(items);
}

function writeQuestionBank_(items) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_QUESTIONS_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_QUESTIONS_NAME);
  sh.clearContents();
  const rows = [['id', 'ระดับ', 'เปิดใช้', 'โจทย์', 'คำตอบ', 'ตัวเลือก', 'คำใบ้']];
  items.forEach(function (item) {
    rows.push([item.id, item.level, item.enabled, item.text, item.answer, JSON.stringify(item.choices), item.hint]);
  });
  sh.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
  sh.getRange(1, 1, 1, rows[0].length).setFontWeight('bold');
  sh.setFrozenRows(1);
  sh.setColumnWidth(4, 320);
  sh.setColumnWidth(7, 260);
}

function defaultQuestionBank_() {
  return normalizeQuestionBank_([
    { id:'easy-1', level:'easy', enabled:true, text:'1.5 + 2.3', answer:3.8, choices:[3.8,3.2,4.8,2.8], hint:'นำจำนวนทั้งสองมาบวกกัน' },
    { id:'easy-2', level:'easy', enabled:true, text:'8.4 - 5.1', answer:3.3, choices:[3.3,2.3,4.3,13.5], hint:'นำ 8.4 ลบด้วย 5.1' },
    { id:'medium-1', level:'medium', enabled:true, text:'2.5 × 4', answer:10, choices:[10,6.5,8,12.5], hint:'นำ 2.5 คูณด้วย 4' },
    { id:'medium-2', level:'medium', enabled:true, text:'9.6 ÷ 3', answer:3.2, choices:[3.2,2.2,4.2,6.6], hint:'นำ 9.6 หารด้วย 3' },
    { id:'hard-1', level:'hard', enabled:true, text:'3.2 + (1.5 × 2)', answer:6.2, choices:[6.2,4.7,7.2,9.4], hint:'คำนวณในวงเล็บก่อน แล้วจึงบวก 3.2' },
    { id:'hard-2', level:'hard', enabled:true, text:'(8.0 ÷ 4) + 5.5', answer:7.5, choices:[7.5,2,6.5,9.5], hint:'คำนวณในวงเล็บก่อน แล้วจึงบวก 5.5' },
    { id:'boss-1', level:'boss', enabled:true, text:'(6.0 × 3) - 2.5', answer:15.5, choices:[15.5,20.5,13,8.5], hint:'คูณในวงเล็บก่อน แล้วจึงลบ 2.5' }
  ]);
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
  writeQuestionBank_(defaultQuestionBank_());
  return { ok: true, message: 'สร้างชีทโจทย์ตัวอย่างเรียบร้อยแล้ว' };
}
