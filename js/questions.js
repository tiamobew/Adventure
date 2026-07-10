/* =========================================================
   questions.js
   คลังโจทย์ปัญหาทศนิยม ระดับประถมศึกษาปีที่ 6
   easy   = ทศนิยมไม่เกิน 1 หลัก, 1 ขั้นตอน (บวก/ลบ/คูณ/หาร อย่างใดอย่างหนึ่ง)
   medium = ทศนิยมไม่เกิน 2 หลัก, 2 ขั้นตอน (เช่น บวกแล้วลบ, คูณแล้วลบ)
   hard   = ทศนิยมไม่เกิน 2 หลัก, 3 ขั้นตอน (เช่น บวก+คูณ+ลบ)
   ทุกโจทย์คืนค่า { text, answer, hint } — hint ใช้สำหรับระบบคำใบ้ (แลกด้วยแต้ม)
   ========================================================= */

function randDecimal(min, max, decimals = 1) {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(decimals));
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ---------- ป้ายกำกับแต่ละด่าน ----------
const LEVEL_CONFIG = {
  easy:   { label: 'ง่าย (ทศนิยม 1 หลัก · 1 ขั้นตอน)' },
  medium: { label: 'ปานกลาง (ทศนิยม 2 หลัก · 2 ขั้นตอน)' },
  hard:   { label: 'ยาก (ทศนิยม 2 หลัก · 3 ขั้นตอน)' }
};

// ตัวเลือกเวลาต่อคำถามที่ผู้เล่นเลือกเองได้ (วินาที)
const TIME_OPTIONS = [10, 15, 20, 30];

// ================= ระดับง่าย: 1 ขั้นตอน ทศนิยม 1 ตำแหน่ง =================
function easy_add() {
  const a = randDecimal(5, 30, 1);
  const b = randDecimal(5, 30, 1);
  const answer = parseFloat((a + b).toFixed(1));
  return {
    text: `แม่ค้าขายส้มได้เงิน ${a} บาท และขายมะม่วงได้เงิน ${b} บาท รวมแล้วได้เงินทั้งหมดกี่บาท`,
    answer, hint: 'ใช้วิธี บวก นำเงินสองจำนวนมารวมกัน'
  };
}
function easy_sub() {
  const a = randDecimal(5, 15, 1);
  const b = randDecimal(1, 4, 1);
  const answer = parseFloat((a - b).toFixed(1));
  return {
    text: `ถุงข้าวสารหนัก ${a} กิโลกรัม แบ่งให้เพื่อนบ้านไป ${b} กิโลกรัม เหลือข้าวสารกี่กิโลกรัม`,
    answer, hint: 'ใช้วิธี ลบ นำน้ำหนักตั้งต้นลบด้วยส่วนที่แบ่งไป'
  };
}
function easy_mul() {
  const a = randDecimal(1.5, 6, 1);
  const n = randInt(2, 6);
  const answer = parseFloat((a * n).toFixed(1));
  return {
    text: `ริบบิ้นเส้นละ ${a} เมตร จำนวน ${n} เส้น ยาวรวมกันกี่เมตร`,
    answer, hint: 'ใช้วิธี คูณ นำความยาวต่อเส้นคูณกับจำนวนเส้น'
  };
}
function easy_div() {
  const n = randInt(2, 5);
  const answer = randDecimal(1, 6, 1);
  const total = parseFloat((answer * n).toFixed(1));
  return {
    text: `น้ำผลไม้ ${total} ลิตร แบ่งใส่ขวดเท่า ๆ กัน ${n} ขวด แต่ละขวดมีน้ำผลไม้กี่ลิตร`,
    answer, hint: 'ใช้วิธี หาร นำปริมาณทั้งหมดหารด้วยจำนวนขวด'
  };
}

// ================= ระดับปานกลาง: 2 ขั้นตอน ทศนิยม 2 ตำแหน่ง =================
function medium_addSub() {
  const a = randDecimal(10, 80, 2);
  const b = randDecimal(10, 80, 2);
  const sum = parseFloat((a + b).toFixed(2));
  const c = randDecimal(5, Math.max(5, sum * 0.5), 2);
  const answer = parseFloat((sum - c).toFixed(2));
  return {
    text: `เช้าขายของได้เงิน ${a} บาท บ่ายขายได้อีก ${b} บาท ตกเย็นนำเงินไปซื้อวัตถุดิบ ${c} บาท เหลือเงินกี่บาท`,
    answer, hint: 'ขั้นที่ 1 บวก เงินที่ขายได้ทั้งสองช่วงเวลา · ขั้นที่ 2 ลบ ด้วยเงินที่ใช้ซื้อของ'
  };
}
function medium_mulSub() {
  const price = randDecimal(5, 25, 2);
  const n = randInt(2, 8);
  const cost = parseFloat((price * n).toFixed(2));
  const paid = parseFloat((cost + randDecimal(5, 30, 2)).toFixed(2));
  const answer = parseFloat((paid - cost).toFixed(2));
  return {
    text: `ซื้อสมุดราคาเล่มละ ${price} บาท จำนวน ${n} เล่ม จ่ายเงินไป ${paid} บาท จะได้รับเงินทอนกี่บาท`,
    answer, hint: 'ขั้นที่ 1 คูณ ราคาต่อเล่มกับจำนวนเล่ม · ขั้นที่ 2 ลบ เงินที่จ่ายด้วยราคารวม'
  };
}
function medium_addMul() {
  const first = randDecimal(2, 15, 2);
  const perDay = randDecimal(1, 10, 2);
  const days = randInt(2, 6);
  const answer = parseFloat((first + perDay * days).toFixed(2));
  return {
    text: `วันแรกเดินทางไปแล้ว ${first} กิโลเมตร วันต่อ ๆ มาเดินทางวันละ ${perDay} กิโลเมตร เป็นเวลา ${days} วัน รวมแล้วเดินทางทั้งหมดกี่กิโลเมตร`,
    answer, hint: 'ขั้นที่ 1 คูณ ระยะทางต่อวันกับจำนวนวัน · ขั้นที่ 2 บวก กับระยะทางวันแรก'
  };
}

// ================= ระดับยาก: 3 ขั้นตอน ทศนิยม 2 ตำแหน่ง =================
function hard_addSubMul() {
  const a = randDecimal(30, 150, 2);
  const b = randDecimal(20, 120, 2);
  const sum = parseFloat((a + b).toFixed(2));
  const n = randInt(2, 8);
  // จำกัดราคารวมของที่ซื้อให้ไม่เกิน 60% ของยอดขาย เพื่อให้เงินที่เหลือเป็นบวกเสมอ
  const maxPrice = Math.max(2, (sum * 0.6) / n);
  const price = randDecimal(2, maxPrice, 2);
  const answer = parseFloat((sum - price * n).toFixed(2));
  return {
    text: `เช้าขายของได้เงิน ${a} บาท บ่ายขายได้อีก ${b} บาท ตกเย็นซื้อวัตถุดิบราคาชิ้นละ ${price} บาท จำนวน ${n} ชิ้น เหลือเงินกี่บาท`,
    answer,
    hint: 'ขั้นที่ 1 บวก เงินที่ขายได้ทั้งสองช่วง · ขั้นที่ 2 คูณ ราคาสินค้ากับจำนวนชิ้น · ขั้นที่ 3 ลบ ผลบวกด้วยผลคูณ'
  };
}
function hard_mulMulSub() {
  const p1 = randDecimal(5, 20, 2); const n1 = randInt(2, 6);
  const p2 = randDecimal(3, 15, 2); const n2 = randInt(2, 6);
  const cost = parseFloat((p1 * n1 + p2 * n2).toFixed(2));
  const paid = parseFloat((cost + randDecimal(10, 50, 2)).toFixed(2));
  const answer = parseFloat((paid - cost).toFixed(2));
  return {
    text: `ซื้อดินสอราคาด้ามละ ${p1} บาท จำนวน ${n1} ด้าม และยางลบราคาก้อนละ ${p2} บาท จำนวน ${n2} ก้อน จ่ายเงินไปทั้งหมด ${paid} บาท จะได้รับเงินทอนกี่บาท`,
    answer,
    hint: 'ขั้นที่ 1 คูณ ราคาดินสอกับจำนวน · ขั้นที่ 2 คูณ ราคายางลบกับจำนวน · ขั้นที่ 3 ลบ เงินที่จ่ายด้วยผลรวมทั้งสองราคา'
  };
}
function hard_addDivSub() {
  const a = randDecimal(10, 40, 2);
  const b = randDecimal(10, 40, 2);
  const n = randInt(2, 8);
  const used = randDecimal(0.5, 3, 2);
  const perBottle = parseFloat(((a + b) / n).toFixed(2));
  const answer = parseFloat((perBottle - used).toFixed(2));
  return {
    text: `น้ำผลไม้สองขวดมี ${a} ลิตร และ ${b} ลิตร นำมารวมกันแล้วแบ่งใส่ขวดเล็กเท่า ๆ กัน ${n} ขวด แต่ละขวดถูกนำไปใช้ ${used} ลิตร จะเหลือน้ำผลไม้ขวดละกี่ลิตร`,
    answer,
    hint: 'ขั้นที่ 1 บวก ปริมาณน้ำผลไม้ทั้งสองขวด · ขั้นที่ 2 หาร ด้วยจำนวนขวดเล็ก · ขั้นที่ 3 ลบ ด้วยปริมาณที่ใช้ไป'
  };
}

const LEVEL_TEMPLATES = {
  easy:   [easy_add, easy_sub, easy_mul, easy_div],
  medium: [medium_addSub, medium_mulSub, medium_addMul],
  hard:   [hard_addSubMul, hard_mulMulSub, hard_addDivSub]
};

/**
 * สุ่มโจทย์ 1 ข้อตามระดับที่เลือก พร้อมตัวเลือกคำตอบ 4 ตัว (1 ถูก + 3 ลวง)
 */
function generateQuestion(level) {
  const templates = LEVEL_TEMPLATES[level] || LEVEL_TEMPLATES.easy;
  const template = templates[randInt(0, templates.length - 1)];
  const { text, answer, hint } = template();

  const spread = level === 'hard' ? 10 : level === 'medium' ? 6 : 3;
  const decimals = level === 'easy' ? 1 : 2;

  const choiceSet = new Set([answer]);
  let attempts = 0;
  while (choiceSet.size < 4 && attempts < 200) {
    const offset = randDecimal(-spread, spread, decimals);
    const distractor = parseFloat((answer + offset).toFixed(decimals));
    if (distractor > 0 && distractor !== answer) choiceSet.add(distractor);
    attempts++;
  }
  // กันเหนียว: ถ้ายังไม่ครบ 4 ตัวเลือก (กรณีสุดขั้วที่หาตัวลวงบวกไม่ได้) ให้เติมด้วยค่าคงที่
  let fallback = 1;
  while (choiceSet.size < 4) {
    choiceSet.add(parseFloat((answer + fallback).toFixed(decimals)));
    fallback++;
  }

  const choices = shuffleArray([...choiceSet]);
  return { text, answer, hint, choices };
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
