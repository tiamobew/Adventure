/* คลังโจทย์ที่แก้ไขได้สำหรับผจญภัยเกาะมหาสนุก (บันทึกใน localStorage) */
(function () {
  'use strict';

  const STORAGE_KEY = 'skyisland_question_bank_v1';
  const LEVELS = ['easy', 'medium', 'hard'];

  const DEFAULT_QUESTIONS = [
    {
      id: 'easy-1', level: 'easy', enabled: true,
      text: 'แม่ค้าขายส้มได้เงิน 12.5 บาท และขายมะม่วงได้เงิน 8.3 บาท รวมได้เงินทั้งหมดกี่บาท',
      answer: 20.8, choices: [20.8, 20.2, 21.8, 4.2],
      hint: 'นำเงินที่ขายได้ทั้งสองจำนวนมาบวกกัน'
    },
    {
      id: 'easy-2', level: 'easy', enabled: true,
      text: 'ถุงข้าวสารหนัก 9.6 กิโลกรัม แบ่งให้เพื่อนบ้าน 2.4 กิโลกรัม เหลือข้าวสารกี่กิโลกรัม',
      answer: 7.2, choices: [7.2, 6.2, 8.2, 12],
      hint: 'นำน้ำหนักตั้งต้นลบด้วยส่วนที่แบ่งไป'
    },
    {
      id: 'easy-3', level: 'easy', enabled: true,
      text: 'ริบบิ้นเส้นละ 2.5 เมตร จำนวน 4 เส้น ยาวรวมกันกี่เมตร',
      answer: 10, choices: [10, 6.5, 8, 12.5],
      hint: 'นำความยาวต่อเส้นคูณกับจำนวนเส้น'
    },
    {
      id: 'easy-4', level: 'easy', enabled: true,
      text: 'น้ำผลไม้ 8.4 ลิตร แบ่งใส่ขวดเท่า ๆ กัน 4 ขวด แต่ละขวดมีน้ำผลไม้กี่ลิตร',
      answer: 2.1, choices: [2.1, 2.4, 3.1, 4.4],
      hint: 'นำปริมาณทั้งหมดหารด้วยจำนวนขวด'
    },
    {
      id: 'medium-1', level: 'medium', enabled: true,
      text: 'เช้าขายของได้เงิน 25.50 บาท บ่ายขายได้อีก 18.75 บาท แล้วซื้อวัตถุดิบ 12.25 บาท เหลือเงินกี่บาท',
      answer: 32, choices: [32, 31, 42, 56.5],
      hint: 'บวกเงินที่ขายได้ทั้งสองช่วง แล้วลบเงินที่ซื้อวัตถุดิบ'
    },
    {
      id: 'medium-2', level: 'medium', enabled: true,
      text: 'ซื้อสมุดราคาเล่มละ 12.50 บาท จำนวน 4 เล่ม จ่ายเงิน 60 บาท ได้รับเงินทอนกี่บาท',
      answer: 10, choices: [10, 8, 12.5, 50],
      hint: 'คูณราคาต่อเล่มกับจำนวนเล่ม แล้วนำไปลบจากเงินที่จ่าย'
    },
    {
      id: 'medium-3', level: 'medium', enabled: true,
      text: 'วันแรกเดินทาง 7.25 กิโลเมตร วันต่อมาเดินทางวันละ 2.50 กิโลเมตร เป็นเวลา 4 วัน รวมเดินทางกี่กิโลเมตร',
      answer: 17.25, choices: [17.25, 9.75, 10, 19.75],
      hint: 'คูณระยะทางต่อวันกับจำนวนวัน แล้วบวกกับระยะทางวันแรก'
    },
    {
      id: 'hard-1', level: 'hard', enabled: true,
      text: 'เช้าขายของได้เงิน 85.50 บาท บ่ายขายได้ 64.25 บาท ซื้อวัตถุดิบชิ้นละ 12.50 บาท จำนวน 4 ชิ้น เหลือเงินกี่บาท',
      answer: 99.75, choices: [99.75, 100.25, 149.75, 49.75],
      hint: 'บวกยอดขายทั้งสองช่วง คูณราคาวัตถุดิบกับจำนวน แล้วนำผลคูณไปลบ'
    },
    {
      id: 'hard-2', level: 'hard', enabled: true,
      text: 'ซื้อดินสอด้ามละ 7.25 บาท 4 ด้าม และยางลบก้อนละ 4.50 บาท 3 ก้อน จ่าย 100 บาท ได้รับเงินทอนกี่บาท',
      answer: 57.5, choices: [57.5, 42.5, 71, 53.5],
      hint: 'หาราคารวมของดินสอและยางลบ แล้วลบออกจากเงินที่จ่าย'
    },
    {
      id: 'hard-3', level: 'hard', enabled: true,
      text: 'น้ำผลไม้ 18.75 ลิตร รวมกับ 13.25 ลิตร แบ่งเท่ากัน 8 ขวด แต่ละขวดใช้ไป 1.25 ลิตร เหลือขวดละกี่ลิตร',
      answer: 2.75, choices: [2.75, 4, 3.25, 1.75],
      hint: 'บวกปริมาณทั้งหมด หารด้วยจำนวนขวด แล้วลบปริมาณที่ใช้ไป'
    }
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function numberValue(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function normalizeQuestion(item, index) {
    if (!item || typeof item !== 'object') return null;
    const level = LEVELS.includes(item.level) ? item.level : 'easy';
    const text = String(item.text || '').trim();
    const answer = numberValue(item.answer);
    const hint = String(item.hint || '').trim();
    const rawChoices = Array.isArray(item.choices) ? item.choices : [];
    const choices = [];

    rawChoices.forEach(value => {
      const number = numberValue(value);
      if (number !== null && !choices.includes(number)) choices.push(number);
    });
    if (answer !== null && !choices.includes(answer)) choices.unshift(answer);
    if (!text || answer === null) return null;

    let fallback = 1;
    while (choices.length < 4) {
      const next = Number((answer + fallback).toFixed(level === 'easy' ? 1 : 2));
      if (!choices.includes(next)) choices.push(next);
      fallback++;
    }

    return {
      id: String(item.id || `question-${Date.now()}-${index}`),
      level,
      enabled: item.enabled !== false,
      text,
      answer,
      choices: choices.slice(0, 4),
      hint: hint || 'ลองแยกสิ่งที่โจทย์ให้มา แล้วคำนวณทีละขั้น'
    };
  }

  function normalizeBank(items) {
    if (!Array.isArray(items)) return [];
    return items.map(normalizeQuestion).filter(Boolean);
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const defaults = clone(DEFAULT_QUESTIONS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
        return defaults;
      }
      const parsed = normalizeBank(JSON.parse(raw));
      return parsed.length ? parsed : clone(DEFAULT_QUESTIONS);
    } catch (error) {
      return clone(DEFAULT_QUESTIONS);
    }
  }

  function save(items) {
    const normalized = normalizeBank(items);
    if (!normalized.length) throw new Error('ต้องมีโจทย์อย่างน้อย 1 ข้อ');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return clone(normalized);
  }

  function reset() {
    const defaults = clone(DEFAULT_QUESTIONS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }

  function enabledForLevel(level) {
    return load().filter(item => item.level === level && item.enabled);
  }

  function importJson(text) {
    const parsed = JSON.parse(text);
    const items = Array.isArray(parsed) ? parsed : parsed.questions;
    return save(items);
  }

  function exportJson() {
    return JSON.stringify({
      app: 'ผจญภัยเกาะมหาสนุก',
      version: 1,
      exportedAt: new Date().toISOString(),
      questions: load()
    }, null, 2);
  }

  window.QuestionStore = {
    STORAGE_KEY,
    LEVELS: LEVELS.slice(),
    DEFAULT_QUESTIONS: clone(DEFAULT_QUESTIONS),
    load,
    save,
    reset,
    enabledForLevel,
    importJson,
    exportJson
  };
})();
