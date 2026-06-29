import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import LogModal from './components/LogModal';
import SummaryView from './components/SummaryView';
import FirebaseConfigModal from './components/FirebaseConfigModal';
import { dbService } from './firebase';
import { mainTopics } from './data/topics';

// Mock values for Demo Data Generator
const patientNames = [
  "นายสมศักดิ์ รักชาติ", "นางสาววิภาวดี บุญมี", "นายสมชาย เกื้อกูล", 
  "นางสาวศิริพร เพชรดี", "นายสุรพล พลอยงาม", "นางสมบูรณ์ ดีเลิศ",
  "เด็กชายกิตติศักดิ์ ใจกล้า", "เด็กหญิงมนัสชนก ทรายแก้ว", "นายณรงค์ เกียรติภูมิ",
  "นางสาวเบญจวรรณ สว่างใจ", "นายทศพล ศรีสุวรรณ", "นางรุ่งทิวา พึ่งพิง"
];

const supervisors = [
  "อ.พญ.พัชราภรณ์ วิริยะ", "นพ.ชัยวิทย์ เลิศธรรม", "อ.พญ.ดวงฤดี จิตประสงค์",
  "นพ.เกรียงไกร มั่นใจ", "พญ.วิลาวัณย์ สรรพสิทธิ์"
];

const symptomsList = {
  "1.1": { sym: "Cardiac Arrest, หมดสติ ไม่หายใจ คลำชีพจรไม่ได้", Dx: "SCA (Sudden Cardiac Arrest)", mgmt: "ทำ CPR ทันที, ติดเครื่อง AED, ช็อคไฟฟ้า 1 ครั้ง, ให้ยา Adrenaline 1 mg IV", out: "ROSC คลำชีพจรได้ สัญญาณชีพกลับคืนมา ย้ายเข้า ICU" },
  "1.2": { sym: "แน่นหน้าอกร้าวไปกรามซ้าย มีเหงื่อกาฬไหล หายใจเหนื่อยหอบ", Dx: "STEMI (Acute Myocardial Infarction)", mgmt: "ทำ EKG 12 leads, ให้ยา ASA 300 mg chewing, ให้ Oxygen, รายงานแพทย์เตรียม Cath lab", out: "ผู้ป่วยอาการดีขึ้น ย้ายส่งทำ PCI เร่งด่วน" },
  "1.3": { sym: "ปวดท้องน้อยด้านขวาอย่างรุนแรง กดเจ็บ มีไข้ คลื่นไส้อาเจียน", Dx: "Acute Appendicitis", mgmt: "ประเมิน Pain score, งดน้ำงดอาหาร (NPO), เปิดเส้นให้ IV fluid, เจาะเลือดเตรียมผ่าตัด", out: "สัญญาณชีพคงที่ ส่งห้องผ่าตัดเพื่อทำ Appendectomy" },
  "1.4": { sym: "เด็กชายอายุ 5 ปี หายใจหอบเหนื่อย มีเสียง Wheezing ตัวเขียวเล็กน้อย", Dx: "Status Asthmaticus in Pediatric", mgmt: "พ่นยา Ventolin 1.5 cc + Normal Saline 3 cc, ให้ Oxygen cannula 2 LPM, ประเมินอาการหายใจหอบ", out: "หายใจสะดวกขึ้น เสียง Wheezing ลดลง สัญญาณชีพปกติ" },
  
  "2.1": { sym: "ตกจากที่สูง 3 เมตร ปวดต้นคอ ขยับแขนขาไม่ได้ มีแผลฉีกขาดที่ศีรษะ", Dx: "Mild TBI with C-Spine Injury", mgmt: "ใส่ Collar เคลื่อนย้ายด้วย Board, ทำแผลห้ามเลือด, ตรวจประเมินทางระบบประสาท GCS = 14", out: "แผลหยุดไหล คลื่นไส้ลดลง ส่ง CT brain & C-spine" },
  "2.2": { sym: "อุบัติเหตุรถชน หน้าอกกระแทกพวงมาลัย หายใจเจ็บ หน้าอกขวาขยับไม่เท่ากัน", Dx: "Right Tension Pneumothorax", mgmt: "ฟังเสียงปอดได้ยินข้างขวาลดลง, เตรียมเข็มทำ Needle Decompression ข้างขวาช่องซี่โครงที่ 2", out: "หายใจสะดวกขึ้นทันที ฟังเสียงปอดเท่ากันสองข้าง ส่งใส่ ICD" },
  "2.3": { sym: "จักรยานยนต์ชนเสาไฟ มีแผลฉีกขาดขนาดใหญ่ ต้นขาซ้ายผิดรูป เสียเลือดมาก", Dx: "Open Fracture Left Femur with Hemorrhagic Shock", mgmt: "ห้ามเลือดกดบาดแผล, ดามขาด้วย Splint, เปิดเส้น IV 2 เส้น ให้ NSS 1,000 ml free flow", out: "สัญญาณชีพเริ่มคงที่ BP 100/60 mmHg ห้ามเลือดสำเร็จ ส่ง OR" },
  "2.4": { sym: "เด็กหญิงวิ่งล้ม แขนขวาผิดรูป ปวดบวมมาก ร้องไห้ไม่หยุด", Dx: "Closed Fracture Right Radius/Ulna in Pediatric", mgmt: "ประเมินการไหลเวียนเลือดส่วนปลาย (Capillary refill < 2 sec), ดามแขนด้วยไม้ดาม, ประคบเย็น", out: "แขนลดการบวม ร้องไห้ลดลงหลังได้ยาพาราเซตามอล ส่ง X-ray" },
  
  "3.1": { sym: "หายใจเหนื่อยหอบ ไอมีเสมหะ ไข้สูง 39C, BP 90/50, PR 120, RR 26", Dx: "Sepsis", mgmt: "ESI Level 2 เพราะสัญญาณชีพวิกฤต เสี่ยงเกิดภาวะช็อค", out: "Correct triage" },
  
  "4.1": { sym: "ผู้ป่วยหมดสติ ลิ้นตกอุดกั้นทางเดินหายใจ", Dx: "Airway obstruction", mgmt: "เปิดทางหายใจด้วยวิธี Head-tilt chin lift และ Jaw thrust ใส่ Oropharyngeal airway", out: "ทางเดินหายใจโล่ง เสียงหายใจครืดคราดลดลง Oxygen saturation ดีขึ้น" },
  "4.2": { sym: "ผู้ป่วยหยุดหายใจ หน้าเขียวคล้ำ", Dx: "Respiratory arrest", mgmt: "ต่ออุปกรณ์หน้ากากครอบปากและจมูกเข้ากับถุงลม BVM ต่อสายออกซิเจน 15 LPM บีบช่วยหายใจ 10-12 ครั้ง/นาที", out: "ผู้ป่วยกลับมามีสีผิวปกติ อกขยับขึ้นลงเท่ากันสองข้าง" },
  "4.3": { sym: "ผู้ป่วยสับสน ดิ้นรน หายใจเร็ว มีเสียงกรนในคอ", Dx: "Airway threat", mgmt: "สอดใส่อุปกรณ์พยุงหายใจ Oropharyngeal airway เบอร์ 4 และให้การพ่นยาผ่าน Venturi mask", out: "ผู้ป่วยสงบลง หายใจมีประสิทธิภาพ ไม่มีเสียงกรน" },
  "4.4": { sym: "ผู้ป่วยวิกฤตต้องย้ายส่งต่อทางรถพยาบาล หายใจไม่สม่ำเสมอ", Dx: "Respiratory failure", mgmt: "ต่อท่อหายใจเข้ากับเครื่องช่วยหายใจเคลื่อนย้ายอัตโนมัติ (ATV) ตั้งค่า Tidal volume 450 ml, Rate 12/min", out: "สัญญาณชีพปกติขณะเคลื่อนย้าย ไม่มีภาวะพร่องออกซิเจน" },
  "4.5": { sym: "ผู้ป่วยล้างท้อง หมดสติ ใส่ท่อช่วยหายใจปกติไม่ได้เนื่องจากขากรรไกรแข็ง", Dx: "Difficult airway", mgmt: "สอดใส่ท่อทางเดินหายใจส่วนบนชนิด LMA เบอร์ 4 เพื่อเปิดทางช่วยหายใจชั่วคราว", out: "ใส่ได้สำเร็จในครั้งแรก บีบช่วยหายใจลมเข้าปอดสองข้างเท่ากัน" },
  "4.6": { sym: "ผู้ป่วยหัวใจหยุดเต้น หายใจเฮือก", Dx: "Cardiac arrest", mgmt: "เตรียมอุปกรณ์ใส่ท่อช่วยหายใจ Endotracheal tube เบอร์ 7.5 ใส่ได้สำเร็จ ตรวจยืนยันตำแหน่งท่อ", out: "ท่ออยู่ในตำแหน่งที่ถูกต้อง บันทึกความลึกที่มุมปาก 21 ซม. ต่อเข้าเครื่องช่วยหายใจ" },
  "4.7": { sym: "ผู้ป่วยใส่ท่อช่วยหายใจปั๊มหัวใจ CPR", Dx: "Post intubation monitoring", mgmt: "ต่อเครื่องวัด ETCO2 (Capnography) เข้ากับท่อช่วยหายใจ เพื่อติดตามคุณภาพการปั๊มหัวใจและการตรวจตำแหน่งท่อ", out: "กราฟขึ้นสม่ำเสมอ ค่า ETCO2 คงอยู่ที่ 35 mmHg แสดงถึงการปั๊มหัวใจที่มีคุณภาพดี" },
  "4.8": { sym: "อุบัติเหตุหน้าอกขวาถูกกระแทก หายใจเหนื่อยรุนแรง ความดันตก ฟังปอดข้างขวาไม่ได้ยินเสียงลม", Dx: "Tension pneumothorax", mgmt: "ทำหัตถการเจาะระบายลดแรงดันในช่องอกข้างขวาด้วยเข็มขนาดใหญ่ (Needle thoracotomy) บริเวณ 2nd ICS MCL", out: "มีลมพุ่งออกมาจากเข็ม ผู้ป่วยหายใจสะดวกขึ้น สัญญาณชีพดีขึ้นทันที" },
  "4.9": { sym: "ผู้ป่วยเด็กสำลักเหรียญบาท หมดสติ ทางเดินหายใจอุดกั้นสมบูรณ์", Dx: "Foreign body airway obstruction", mgmt: "ส่องกล้อง Laryngoscopy มองเห็นเหรียญอุดกั้นที่กล่องเสียง ใช้ Magill forceps คีบเหรียญบาทออกมาได้", out: "ขจัดสิ่งอุดกั้นสำเร็จ บีบช่วยหายใจลมเข้าปอดได้ดี กลับมารู้สึกตัว" },

  "5.1": { sym: "Cardiac arrest ปั๊มหัวใจ CPR", Dx: "Asystole", mgmt: "ให้ยา Adrenaline 1 mg IV push ทุก 3 นาที รวม 3 โดส พร้อมให้สารน้ำ 0.9% NSS 1,000 ml", out: "สัญญาณชีพกลับคืนมา ปลอดภัย" },
  "5.2": { sym: "ผู้ป่วยความดันโลหิตตกอย่างรุนแรงจากภาวะติดเชื้อในกระแสเลือด", Dx: "Septic shock", mgmt: "ให้ยาควบคุมพิเศษ (High alert drug) Dopamine (1:1) ดริปทางสาย IV อัตรา 5 mcg/kg/min ควบคุมด้วย Infusion pump", out: "ความดันโลหิตค่อยๆ สูงขึ้นเฉลี่ย MAP > 65 mmHg สัญญาณชีพคงที่" },
  "5.3": { sym: "ผู้ป่วยอาเจียนเป็นเลือดสดปริมาณมาก อ่อนเพลีย ซีด BP 80/40 mmHg", Dx: "Massive Upper GI Bleed", mgmt: "ขอเลือดฉุกเฉินชนิด PRC 2 units, ตรวจจับสัญญาณชีพ วัดอุณหภูมิ ติดตามอาการแพ้เลือดก่อนและหลังให้เลือด", out: "ได้รับเลือดครบ 2 units สัญญาณชีพดีขึ้น BP 110/70 ไม่พบอาการแพ้เลือด" },

  "6.1": { sym: "ไอเรื้อรัง เจ็บหน้าอกขวา หายใจเหนื่อย", Dx: "Right pleural effusion", mgmt: "แปลผล X-ray ทรวงอก พบมีลักษณะ Blunting of right costophrenic angle สงสัยมีน้ำในโพรงเยื่อหุ้มปอดขวา", out: "ส่งพบแพทย์เฉพาะทางโรคปอดเพื่อเจาะระบายน้ำออก" },
  "6.2": { sym: "อุบัติเหตุรถล้ม ศรีษะกระแทกพื้น หมดสติชั่วครู่ ปวดศรีษะรุนแรง อาเจียนพุ่ง", Dx: "Epidural hematoma", mgmt: "แปลผล CT Scan brain พบมีลักษณะ Hyperdense biconvex (lens-shaped) area บริเวณขมับขวา", out: "รายงานแพทย์ประสาทศัลยศาสตร์เตรียมผ่าตัดสมองด่วน (Craniotomy)" },
  "6.3": { sym: "ปวดท้องรุนแรงเฉียบพลันหลังอุบัติเหตุรถชน BP 90/50 mmHg", Dx: "Hemoperitoneum from splenic rupture", mgmt: "แปลผล Ultrasound / FAST พบมี Free fluid (black area) ในช่อง Morrison's pouch และ Splenorenal space", out: "รายงานแพทย์ศัลยกรรมทั่วไปเตรียมผ่าตัดเปิดช่องท้องด่วน (Exploratory Laparotomy)" },
  "6.4": { sym: "ผู้ป่วยชายมีอาการเจ็บแน่นหน้าอกรุนแรงร้าวไปแขนซ้าย หายใจลำบาก", Dx: "Acute Anterior STEMI", mgmt: "ตรวจแปลผล EKG 12 Leads พบมีลักษณะ ST elevation ที่ Lead V1 ถึง V4", out: "รายงานแพทย์สั่งให้ยาละลายลิ่มเลือดหรือส่งทำสวนหัวใจขยายหลอดเลือดด่วน" },
  "6.5": { sym: "ผู้ป่วยเหนื่อยหอบ มีภาวะช็อคจากการติดเชื้อ", Dx: "Metabolic Acidosis from Sepsis", mgmt: "แปลผล Emergency lab (ABG): pH 7.25, HCO3 15 mEq/L, Lactic acid 4.5 mmol/L บ่งชี้ภาวะกรดรุนแรง", out: "ให้ยา Sodium bicarbonate IV และแก้ไขภาวะติดเชื้อ" },

  "7.1": { sym: "แจ้งเหตุผู้ป่วยหมดสติ ปลุกไม่ตื่น หายใจเฮือก", Dx: "Red dispatch call", mgmt: "ส่งรถพยาบาลระดับ ALS ออกปฏิบัติการทันทีภายใน 2 นาที", out: "ประสานงานกับศูนย์สั่งการรวดเร็ว รถถึงจุดเกิดเหตุทันเวลา" },
  "7.2": { sym: "แจ้งเหตุผู้ป่วยอุบัติเหตุขาผิดรูป ปวดบวมมาก แต่รู้สึกตัวดี สัญญาณชีพปกติ", Dx: "Yellow dispatch call", mgmt: "ส่งรถพยาบาลระดับ BLS พร้อมทีมกู้ชีพออกปฏิบัติการประเมินปฐมพยาบาลเบื้องต้น", out: "ปฐมพยาบาลเข้าเฝือกดามขาสำเร็จ เคลื่อนย้ายปลอดภัย" },
  "7.3": { sym: "แจ้งเหตุผู้ป่วยเด็กสำลักอาหาร หน้าเขียว หายใจไม่ออก", Dx: "Pediatric choking", mgmt: "ให้คำแนะนำทางโทรศัพท์ (Pre-arrival instruction) สอนให้ญาติทำวิธี Back blows และ Chest thrusts", out: "อาหารหลุดออกมาได้ เด็กกลับมาร้องและหายใจได้ปกติก่อนรถกู้ชีพไปถึง" },
  "7.4": { sym: "ผู้แจ้งเหตุดับอนาถ พบญาติหมดสติ ปั๊มหัวใจไม่เป็น", Dx: "Out of hospital cardiac arrest", mgmt: "ทำ DACPR (Dispatch-assisted CPR) แนะนำขั้นตอนการปั๊มหัวใจกดหน้าอกตามจังหวะนับทางโทรศัพท์จนกว่ารถพยาบาลจะถึง", out: "ญาติสามารถกดหน้าอกได้ถูกวิธี ช่วยเพิ่มโอกาสการรอดชีวิตจน ROSC" },

  "8.1": { sym: "หมดสติ ณ บ้านพัก คลำชีพจรไม่ได้", Dx: "SCA at scene", mgmt: "ทำ Resuscitation กู้ชีพขั้นสูง ณ จุดเกิดเหตุ ใส่ท่อช่วยหายใจ ให้ยาช็อคไฟฟ้า", out: "ROSC คลำชีพจรได้ที่จุดเกิดเหตุ ลำเลียงส่งโรงพยาบาล" },
  "8.2": { sym: "ผู้ป่วยประสบอุบัติเหตุรุนแรง แผลฉีกขาดขนาดใหญ่ ช็อคจากการเสียเลือด", Dx: "Severe trauma hemorrhagic shock", mgmt: "ให้การดูแลรักษาขั้นฉุกเฉิน (Emergent care) ห้ามเลือด ให้สารน้ำอย่างรวดเร็ว ดามกระดูก", out: "สัญญาณชีพเริ่มคงที่ ปลอดภัยระหว่างเตรียมเคลื่อนย้าย" },
  "8.3": { sym: "ส่งต่อผู้ป่วยปอดอักเสบรุนแรงด้วยรถพยาบาลฉุกเฉิน", Dx: "Severe Pneumonia with Respiratory Failure", mgmt: "ดูแลติดตามระบบหายใจขณะเดินทาง ปรับตั้งค่าออกซิเจน เช็คท่อช่วยหายใจ สังเกตสัญญาณชีพทุก 5 นาที", out: "ส่งมอบผู้ป่วยปลายทางปลอดภัยโดยไม่มีภาวะวิกฤตแทรกซ้อน" },
  "8.4": { sym: "อุบัติเหตุรถบัสพุ่งชนเสาไฟฟ้า เสียหลักพลิกคว่ำ มีผู้บาดเจ็บกว่า 20 ราย", Dx: "Disaster mass casualty incident", mgmt: "ทำ Triage แยกประเภทผู้บาดเจ็บด้วยระบบ START triage แบ่งโซน แดง เหลือง เขียว ดำ ประสานการลำเลียงส่ง รพ.ใกล้เคียง", out: "คัดแยกผู้ป่วยเสร็จสิ้นภายใน 15 นาที นำส่งผู้ป่วยกลุ่มสีแดงได้รับการรักษาด่วนที่สุด" },

  "9.1": { sym: "ส่งต่อผู้ป่วยโรคหลอดเลือดสมองแตก (Stroke Hemorrhagic) มี GCS ลดลง", Dx: "Intracerebral hemorrhage", mgmt: "Pre: เตรียมเตียง ICU ปลายทาง ประเมิน Airway / During: ให้ยาควบคุมความดัน ควบคุมระดับออกซิเจน / Post: รายงานผลสแกนและส่งเวรให้ทีมเฉพาะทาง", out: "ส่งต่อปลายทางเรียบร้อย สัญญาณชีพคงที่ ปลอดภัย" }
};

const App = () => {
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [activeSubtopic, setActiveSubtopic] = useState(null);
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' | 'summary'
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);

  // Load User from Session
  useEffect(() => {
    const savedUser = sessionStorage.getItem('enp_current_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setUser(u);
        loadUserLogs(u.id);
      } catch (e) {
        console.error("Error reading saved user session", e);
      }
    }
    setIsFirebaseConnected(dbService.isFirebaseConnected());
  }, []);

  const loadUserLogs = async (userId) => {
    const userLogs = await dbService.getLogs(userId);
    setLogs(userLogs);
  };

  const handleLogin = async (selectedUser, venue1, venue2) => {
    const u = { ...selectedUser, venue1, venue2 };
    setUser(u);
    sessionStorage.setItem('enp_current_user', JSON.stringify(u));
    await dbService.saveUserProfile(u);
    loadUserLogs(selectedUser.id);
  };

  const handleLogout = () => {
    setUser(null);
    setLogs([]);
    sessionStorage.removeItem('enp_current_user');
  };

  const handleSaveLog = async (logPayload) => {
    if (!user) return;
    const newLog = {
      userId: user.id,
      topicId: logPayload.topicId,
      subtopicId: logPayload.subtopicId,
      data: logPayload.data,
      timestamp: new Date().toISOString()
    };
    
    const saved = await dbService.saveLog(newLog);
    setLogs(prev => [...prev, saved]);
  };

  const handleDeleteLog = async (logId) => {
    const success = await dbService.deleteLog(logId);
    if (success) {
      setLogs(prev => prev.filter(log => log.id !== logId));
    }
  };

  // Generate complete Demo Data for trainee verification
  const handleGenerateDemoData = async () => {
    if (!user) return;
    
    // Clear previous logs first for testing
    const currentLocalLogs = JSON.parse(localStorage.getItem('enp_logs') || '[]');
    const cleanedLocalLogs = currentLocalLogs.filter(log => log.userId !== user.id);
    localStorage.setItem('enp_logs', JSON.stringify(cleanedLocalLogs));

    const generatedLogs = [];
    
    // Iterate through all subtopics and fill with exact minimum required cases
    for (const topic of mainTopics) {
      for (const sub of topic.subtopics) {
        const targetCount = sub.target;
        const mockTemplate = symptomsList[sub.id] || symptomsList["1.1"];
        
        for (let i = 0; i < targetCount; i++) {
          const randPatient = patientNames[Math.floor(Math.random() * patientNames.length)];
          const randAge = Math.floor(Math.random() * 55) + 15; // 15 to 70
          const randSupervisor = supervisors[Math.floor(Math.random() * supervisors.length)];

          // Build dynamic mock data according to type
          let mockData = {};
          if (sub.type === "clinical_management") {
            mockData = {
              patientName: randPatient,
              age: randAge,
              symptoms: `มีอาการ ${mockTemplate.sym} #${i+1}`,
              management: mockTemplate.mgmt,
              outcome: mockTemplate.out,
              supervisorName: randSupervisor
            };
          } else if (sub.type === "triage") {
            mockData = {
              patientName: randPatient,
              age: randAge,
              symptoms: `BT: 37.8C, PR: 110/min, RR: 24/min, BP: 100/60 mmHg. อาการ: ${mockTemplate.sym}`,
              triageReason: `ระบุอาการเร่งด่วนระดับ ${sub.id === "1.1" ? "ESI 1" : "ESI 2"}. เหตุผล: สัญญาณชีพและวิกฤตความปลอดภัยของผู้ป่วย`,
              outcome: "Correct triage",
              supervisorName: randSupervisor
            };
          } else if (sub.type === "procedure") {
            mockData = {
              patientName: randPatient,
              age: randAge,
              symptoms: mockTemplate.sym,
              outcome: mockTemplate.out,
              supervisorName: randSupervisor
            };
          } else if (sub.type === "drug_cardiac") {
            mockData = {
              patientName: randPatient,
              age: randAge,
              symptoms: mockTemplate.sym,
              outcome: mockTemplate.out,
              supervisorName: randSupervisor
            };
          } else if (sub.type === "drug_blood") {
            mockData = {
              patientName: randPatient,
              age: randAge,
              symptoms: mockTemplate.sym,
              outcome: mockTemplate.out,
              supervisorName: randSupervisor
            };
          } else if (sub.type === "interpret_disease" || sub.type === "interpret_injury") {
            mockData = {
              patientName: randPatient,
              age: randAge,
              symptoms: mockTemplate.sym,
              outcome: mockTemplate.out,
              supervisorName: randSupervisor
            };
          } else if (sub.type === "dispatch") {
            // Pick appropriate category
            mockData = {
              patientName: randPatient,
              age: randAge,
              callTime: new Date(Date.now() - i * 3600000).toISOString().slice(0, 16),
              symptoms: mockTemplate.sym,
              outcome: sub.callType || "สีแดง",
              supervisorName: randSupervisor
            };
          } else if (sub.type === "care_general") {
            mockData = {
              patientName: randPatient,
              age: randAge,
              symptoms: mockTemplate.sym,
              management: mockTemplate.mgmt,
              supervisorName: randSupervisor
            };
          } else if (sub.type === "care_disaster") {
            mockData = {
              disasterName: mockTemplate.disasterName,
              symptoms: mockTemplate.sym,
              triageLevel: mockTemplate.triageLevel,
              management: mockTemplate.mgmt,
              transportDetails: mockTemplate.transportDetails,
              supervisorName: randSupervisor
            };
          } else if (sub.type === "referral") {
            mockData = {
              patientName: randPatient,
              age: randAge,
              symptoms: mockTemplate.sym,
              management: mockTemplate.mgmt,
              supervisorName: randSupervisor
            };
          }

          const mockLog = {
            id: `local_demo_${sub.id}_${i}_${Math.random().toString(36).substr(2, 9)}`,
            userId: user.id,
            topicId: sub.id.split('.')[0],
            subtopicId: sub.id,
            data: mockData,
            timestamp: new Date().toISOString()
          };

          // Save to local storage mock array
          generatedLogs.push(mockLog);
        }
      }
    }

    // Combine local storage and update state
    const updatedLocalLogs = [...cleanedLocalLogs, ...generatedLogs];
    localStorage.setItem('enp_logs', JSON.stringify(updatedLocalLogs));
    
    // Force reload user logs from local storage
    loadUserLogs(user.id);
    alert("ระบบทำการสร้างข้อมูลจำลองแบบสมบูรณ์ให้คุณเรียบร้อยแล้วครับ! (ครบเกณฑ์ขั้นต่ำ 189 เคสทุกหมวดหมู่) คุณสามารถเปิดดูหน้ารายงานสรุปเพื่อทดสอบการพิมพ์งานออกกระดาษได้ทันทีครับ");
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      
      {!user ? (
        <LoginScreen 
          onLogin={handleLogin}
        />
      ) : viewMode === 'summary' ? (
        <SummaryView
          student={user}
          logs={logs}
          onClose={() => setViewMode('dashboard')}
        />
      ) : (
        <Dashboard
          student={user}
          logs={logs}
          onSelectSubtopic={(sub) => setActiveSubtopic(sub)}
          onOpenSummary={() => setViewMode('summary')}
          onLogout={handleLogout}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onGenerateDemoData={handleGenerateDemoData}
        />
      )}

      {/* Entry Forms modal popup */}
      {activeSubtopic && (
        <LogModal
          subtopic={activeSubtopic}
          logs={logs}
          onSaveLog={handleSaveLog}
          onDeleteLog={handleDeleteLog}
          onClose={() => setActiveSubtopic(null)}
        />
      )}

      {/* Firebase setup popup */}
      <FirebaseConfigModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

    </div>
  );
};

export default App;
