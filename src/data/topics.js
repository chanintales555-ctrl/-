export const mainTopics = [
  {
    id: "1",
    title: "1. การดูแลและจัดการเบื้องต้นในผู้ป่วยฉุกเฉิน",
    description: "Emergency assessment and management for emergency signs & symptoms related system function",
    subtopics: [
      { id: "1.1", title: "1.1 Life danger presentation (ESI 1)", target: 5, type: "clinical_management" },
      { id: "1.2", title: "1.2 Organ danger presentation (ESI 2)", target: 5, type: "clinical_management" },
      { id: "1.3", title: "1.3 Urgent condition (ESI 3)", target: 5, type: "clinical_management" },
      { id: "1.4", title: "1.4 Emergency condition ในเด็ก", target: 2, type: "clinical_management" }
    ]
  },
  {
    id: "2",
    title: "2. การดูแลผู้ป่วยบาดเจ็บ",
    description: "Emergency management for Traumatic patients",
    subtopics: [
      { id: "2.1", title: "2.1 Head/ Spinal/ Extremity injury", target: 5, type: "clinical_management" },
      { id: "2.2", title: "2.2 Chest/ Abdominal/ Pelvic injury", target: 5, type: "clinical_management" },
      { id: "2.3", title: "2.3 Major trauma/ Multiple injuries", target: 5, type: "clinical_management" },
      { id: "2.4", title: "2.4 Emergency trauma condition ในเด็ก", target: 2, type: "clinical_management" }
    ]
  },
  {
    id: "3",
    title: "3. การประเมินและคัดแยกผู้ป่วยฉุกเฉิน",
    description: "Triage acuity level evaluation and validation",
    subtopics: [
      { id: "3.1", title: "3.1 การประเมินและคัดแยกผู้ป่วยฉุกเฉิน", target: 25, type: "triage" }
    ]
  },
  {
    id: "4",
    title: "4. การปฏิบัติหัตถการในภาวะฉุกเฉิน",
    description: "Emergency medical procedures and airway management",
    subtopics: [
      { id: "4.1", title: "4.1 เปิดทางหายใจ (Sellick's/Head-tilt/Jaw thrust/Modified chin)", target: 3, type: "procedure" },
      { id: "4.2", title: "4.2 การใช้ BVM (หน้ากากพร้อมถุงบีบลม)", target: 5, type: "procedure" },
      { id: "4.3", title: "4.3 สอดใส่อุปกรณ์พยุงหายใจ (OPA/NPA/Humidifiers/Masks)", target: 5, type: "procedure" },
      { id: "4.4", title: "4.4 ใช้เครื่องช่วยหายใจกึ่งอัตโนมัติ (MTV/ATV)", target: 3, type: "procedure" },
      { id: "4.5", title: "4.5 สอดใส่ LMA (Esophageal tube)", target: 5, type: "procedure" },
      { id: "4.6", title: "4.6 สอดใส่ Nasal or oral Endotracheal intubation", target: 3, type: "procedure" },
      { id: "4.7", title: "4.7 วัด ETCO2/Capnography", target: 10, type: "procedure" },
      { id: "4.8", title: "4.8 เจาะลดแรงดันในโพรงเยื่อหุ้มปอด (Needle thoracotomy)", target: 1, type: "procedure" },
      { id: "4.9", title: "4.9 ขจัดสิ่งแปลกปลอมอุดกั้นทางหายใจโดย Laryngoscopy", target: 3, type: "procedure" }
    ]
  },
  {
    id: "5",
    title: "5. ปฏิบัติเวชกรรมด้านจัดการยา และสารน้ำในภาวะฉุกเฉิน",
    description: "Emergency pharmaceuticals and blood transfusions",
    subtopics: [
      { id: "5.1", title: "5.1 ยาและสารน้ำช่วยชีวิต (ACLS/ATLS)", target: 5, type: "drug_cardiac" },
      { id: "5.2", title: "5.2 ยารักษาภาวะฉุกเฉิน หรือ High alert drugs", target: 5, type: "drug_cardiac" },
      { id: "5.3", title: "5.3 Emergency blood transfusion", target: 3, type: "drug_blood" }
    ]
  },
  {
    id: "6",
    title: "6. การแปลผลเบื้องต้นการตรวจแล็บและรังสีวินิจฉัย",
    description: "Interpretation of laboratory tests and emergency radiology",
    subtopics: [
      { id: "6.1", title: "6.1 แปลผล X-ray", target: 5, type: "interpret_disease" },
      { id: "6.2", title: "6.2 แปลผล CT Scan หรือ MRI หรือ MRA", target: 5, type: "interpret_injury" },
      { id: "6.3", title: "6.3 อ่านผล Ultrasound หรือ FAST", target: 3, type: "interpret_disease" },
      { id: "6.4", title: "6.4 แปลผล EKG (ตรวจ อ่านผล และรายงานแพทย์)", target: 5, type: "interpret_disease" },
      { id: "6.5", title: "6.5 อ่านผล Emergency lab (ABG, Lactic, Cardiac enzyme)", target: 10, type: "interpret_injury" }
    ]
  },
  {
    id: "7",
    title: "7. การรับแจ้งเหตุและสั่งการ (Dispatch)",
    description: "Emergency medical dispatching and instruction standard",
    subtopics: [
      { id: "7.1", title: "7.1 ผู้ป่วยประเภทสีแดง", target: 10, type: "dispatch", callType: "สีแดง" },
      { id: "7.2", title: "7.2 ผู้ป่วยประเภทสีเหลือง", target: 15, type: "dispatch", callType: "สีเหลือง" },
      { id: "7.3", title: "7.3 Pre-arrival instruction", target: 3, type: "dispatch", callType: "Pre-arrival instruction" },
      { id: "7.4", title: "7.4 DACPR", target: 2, type: "dispatch", callType: "DACPR" }
    ]
  },
  {
    id: "8",
    title: "8. การให้การดูแลรักษาผู้ป่วยฉุกเฉิน",
    description: "Emergency care, resuscitation and disaster management",
    subtopics: [
      { id: "8.1", title: "8.1 ปฏิบัติการกู้ชีพ (Resuscitation) ในที่เกิดเหตุ", target: 5, type: "care_general" },
      { id: "8.2", title: "8.2 ปฏิบัติการกู้ชีพ (Emergent) ในที่เกิดเหตุ", target: 5, type: "care_general" },
      { id: "8.3", title: "8.3 ปฏิบัติการการแพทย์ฉุกเฉินในรถพยาบาล", target: 5, type: "care_general" },
      { id: "8.4", title: "8.4 ปฏิบัติการแพทย์ฉุกเฉินในภาวะภัยพิบัติ (Disaster)", target: 1, type: "care_disaster" }
    ]
  },
  {
    id: "9",
    title: "9. ปฏิบัติการส่งต่อผู้ป่วย (Referral)",
    description: "Patient transfer logistics and patient care management",
    subtopics: [
      { id: "9.1", title: "9.1 ปฏิบัติการส่งต่อผู้ป่วย (Pre-During-Post transfer)", target: 5, type: "referral" }
    ]
  }
];

export const getFieldsForType = (type, subtopicId) => {
  switch (type) {
    case "clinical_management":
      return [
        { name: "patientName", label: "ชื่อ-สกุล ผู้ป่วย", type: "text", required: true, placeholder: "เช่น นายสมชาย ดีใจ" },
        { name: "age", label: "อายุ (ปี)", type: "number", required: true, placeholder: "เช่น 45" },
        { name: "symptoms", label: "อาการ / การวินิจฉัย (Dx)", type: "textarea", required: true, placeholder: "อาการแรกรับ และผลการวินิจฉัย (Dx)" },
        { name: "management", label: "การประเมินและจัดการเบื้องต้น", type: "textarea", required: true, placeholder: "เขียนอธิบายขั้นตอนการประเมินและการให้การพยาบาลจัดการเบื้องต้น" },
        { name: "outcome", label: "ผลลัพธ์", type: "textarea", required: true, placeholder: "ผลการดูแลรักษาหรือตอบสนองการรักษา" },
        { name: "supervisorName", label: "ชื่อผู้นิเทศ (ผู้ประเมิน)", type: "text", required: true, placeholder: "ชื่อ-สกุล ผู้นิเทศคุมฝึกปฏิบัติ" }
      ];
      
    case "triage":
      return [
        { name: "patientName", label: "ชื่อ-สกุล ผู้ป่วย", type: "text", required: true, placeholder: "เช่น นายมานะ ตั้งใจ" },
        { name: "age", label: "อายุ (ปี)", type: "number", required: true, placeholder: "เช่น 28" },
        { name: "symptoms", label: "อาการ / ระดับสัญญาณชีพ (Vitals)", type: "textarea", required: true, placeholder: "เช่น BT, PR, RR, BP และอาการสัญญานชีพสำคัญ" },
        { name: "triageReason", label: "Triage acuity level (เหตุผลคัดกรอง)", type: "textarea", required: true, placeholder: "ระบุระดับความฉุกเฉิน (เช่น ESI 1, 2, 3) พร้อมเหตุผลทางคลินิกที่จัดอยู่ในระดับนี้" },
        { name: "outcome", label: "ผลลัพธ์การ Triage", type: "select", required: true, options: [
            { value: "Correct triage", label: "(✔) Correct triage" },
            { value: "Over triage", label: "(⚠) Over triage" },
            { value: "Under triage", label: "(⚠) Under triage" }
          ]
        },
        { name: "supervisorName", label: "ชื่อผู้นิเทศ (ผู้ประเมิน)", type: "text", required: true, placeholder: "ชื่อ-สกุล ผู้นิเทศคุมฝึกปฏิบัติ" }
      ];
      
    case "procedure":
      return [
        { name: "patientName", label: "ชื่อ-สกุล ผู้ป่วย", type: "text", required: true, placeholder: "เช่น นางมาลี มีสุข" },
        { name: "age", label: "อายุ (ปี)", type: "number", required: true, placeholder: "เช่น 60" },
        { name: "symptoms", label: "อาการ / การวินิจฉัย (Dx)", type: "textarea", required: true, placeholder: "อาการบ่งชี้ที่ต้องทำหัตถการ" },
        { name: "outcome", label: "ผลลัพธ์และบันทึกหลังทำหัตถการ", type: "textarea", required: true, placeholder: "อธิบายขั้นตอนสำเร็จ ภาวะแทรกซ้อน และผลลัพธ์ของหัตถการ" },
        { name: "supervisorName", label: "ชื่อผู้นิเทศ (ผู้ประเมิน)", type: "text", required: true, placeholder: "ชื่อ-สกุล ผู้นิเทศคุมฝึกปฏิบัติ" }
      ];
      
    case "drug_cardiac":
      return [
        { name: "patientName", label: "ชื่อ-สกุล ผู้ป่วย", type: "text", required: true, placeholder: "เช่น นายดำรง รักษากาย" },
        { name: "age", label: "อายุ (ปี)", type: "number", required: true, placeholder: "เช่น 52" },
        { name: "symptoms", label: "Problem list & Drug used (รายการยา/ข้อบ่งชี้)", type: "textarea", required: true, placeholder: "ระบุโรค/ภาวะฉุกเฉิน และตัวยาที่ใช้ (เช่น Adrenaline, Cordarone)" },
        { name: "outcome", label: "Side effect & Nursing (ผลข้างเคียงและการพยาบาล)", type: "textarea", required: true, placeholder: "การเฝ้าระวังทางพยาบาลและอาการไม่พึงประสงค์ที่ต้องสังเกต" },
        { name: "supervisorName", label: "ชื่อผู้นิเทศ (ผู้ประเมิน)", type: "text", required: true, placeholder: "ชื่อ-สกุล ผู้นิเทศคุมฝึกปฏิบัติ" }
      ];
      
    case "drug_blood":
      return [
        { name: "patientName", label: "ชื่อ-สกุล ผู้ป่วย", type: "text", required: true, placeholder: "เช่น นายสุภาพ มีเลือด" },
        { name: "age", label: "อายุ (ปี)", type: "number", required: true, placeholder: "เช่น 39" },
        { name: "symptoms", label: "Problem list & Condition (เหตุผลที่ต้องให้เลือด)", type: "textarea", required: true, placeholder: "ระบุโรค ปริมาณเลือดที่เสีย และชนิดของเลือด (PRC, FFP, etc.)" },
        { name: "outcome", label: "การประเมินก่อนและหลังให้เลือด", type: "textarea", required: true, placeholder: "ระบุ Vitals ก่อน-หลัง สังเกตปฏิกิริยาการแพ้เลือด" },
        { name: "supervisorName", label: "ชื่อผู้นิเทศ (ผู้ประเมิน)", type: "text", required: true, placeholder: "ชื่อ-สกุล ผู้นิเทศคุมฝึกปฏิบัติ" }
      ];
      
    case "interpret_disease":
      return [
        { name: "patientName", label: "ชื่อ-สกุล ผู้ป่วย", type: "text", required: true, placeholder: "เช่น นางดวงใจ ใยดี" },
        { name: "age", label: "อายุ (ปี)", type: "number", required: true, placeholder: "เช่น 50" },
        { name: "symptoms", label: "อาการแสดง / กลไกการเกิดโรค", type: "textarea", required: true, placeholder: "อาการสำคัญที่ต้องส่งตรวจแล็บ/สแกน" },
        { name: "outcome", label: "การแปลผล / การวินิจฉัย", type: "textarea", required: true, placeholder: "รายละเอียดการอ่านฟิล์ม/ผล EKG/ค่าผลแล็บทางห้องปฏิบัติการ" },
        { name: "supervisorName", label: "ชื่อผู้นิเทศ (ผู้ประเมิน)", type: "text", required: true, placeholder: "ชื่อ-สกุล ผู้นิเทศคุมฝึกปฏิบัติ" }
      ];
      
    case "interpret_injury":
      return [
        { name: "patientName", label: "ชื่อ-สกุล ผู้ป่วย", type: "text", required: true, placeholder: "เช่น เด็กชายเก่ง กล้าหาญ" },
        { name: "age", label: "อายุ (ปี)", type: "number", required: true, placeholder: "เช่น 12" },
        { name: "symptoms", label: "อาการแสดง / กลไกการบาดเจ็บ", type: "textarea", required: true, placeholder: "กลไกการเกิดอุบัติเหตุและการบาดเจ็บ (Mechanism of Injury)" },
        { name: "outcome", label: "การแปลผล / การวินิจฉัย", type: "textarea", required: true, placeholder: "รายละเอียดการอ่านผลสแกน CT/MRI/ผลแล็บวิกฤต" },
        { name: "supervisorName", label: "ชื่อผู้นิเทศ (ผู้ประเมิน)", type: "text", required: true, placeholder: "ชื่อ-สกุล ผู้นิเทศคุมฝึกปฏิบัติ" }
      ];
      
    case "dispatch":
      return [
        { name: "patientName", label: "ชื่อ-สกุล ผู้ป่วย (ถ้าทราบ)", type: "text", required: false, placeholder: "เช่น ชายไทยไม่ทราบชื่อ หรือเว้นว่างได้" },
        { name: "age", label: "อายุ (โดยประมาณ)", type: "number", required: false, placeholder: "เช่น 30" },
        { name: "callTime", label: "วันเวลารับแจ้งเหตุ", type: "datetime-local", required: true },
        { name: "symptoms", label: "อาการข้อบ่งชี้ / ขั้นตอนการทำ / ข้อวินิจฉัยรับแจ้ง", type: "textarea", required: true, placeholder: "เขียนลำดับขั้นตอนรับแจ้งเหตุมาตรฐาน และการให้ Pre-arrival instruction / DACPR" },
        { name: "outcome", label: "ประเภทการรับแจ้งเหตุ (ตามเกณฑ์ของหมวด)", type: "select", required: true, options: [
            { value: "สีแดง", label: "ผู้ป่วยประเภทสีแดง (Red Call)" },
            { value: "สีเหลือง", label: "ผู้ป่วยประเภทสีเหลือง (Yellow Call)" },
            { value: "Pre - arrival instruction", label: "Pre-arrival instruction" },
            { value: "DACPR", label: "Dispatch-assisted CPR (DACPR)" }
          ]
        },
        { name: "supervisorName", label: "ชื่อผู้นิเทศ (ผู้ประเมิน)", type: "text", required: true, placeholder: "ชื่อ-สกุล ผู้นิเทศคุมฝึกปฏิบัติ" }
      ];
      
    case "care_general":
      return [
        { name: "patientName", label: "ชื่อ-สกุล ผู้ป่วย", type: "text", required: true, placeholder: "เช่น นางสายใจ รักดี" },
        { name: "age", label: "อายุ (ปี)", type: "number", required: true, placeholder: "เช่น 41" },
        { name: "symptoms", label: "อาการแสดง / การวินิจฉัย (Dx)", type: "textarea", required: true, placeholder: "สภาพผู้ป่วย ณ จุดเกิดเหตุ การวินิจฉัยเบื้องต้น" },
        { name: "management", label: "ปฏิบัติการ / เหตุผลความจำเป็น", type: "textarea", required: true, placeholder: "การกู้ชีพ การใส่ท่อหายใจ หรือการบำบัดรักษาบนรถพยาบาลฉุกเฉิน" },
        { name: "supervisorName", label: "ชื่อผู้นิเทศ (ผู้ประเมิน)", type: "text", required: true, placeholder: "ชื่อ-สกุล ผู้นิเทศคุมฝึกปฏิบัติ" }
      ];
      
    case "care_disaster":
      return [
        { name: "disasterName", label: "ชื่อสถานการณ์ภัยพิบัติ (Disaster)", type: "text", required: true, placeholder: "เช่น อุบัติเหตุหมู่รถบัสชนคว่ำ ถนนชยางกูร" },
        { name: "symptoms", label: "อาการ / อาการแสดงของผู้บาดเจ็บโดยรวม", type: "textarea", required: true, placeholder: "รายละเอียดผู้บาดเจ็บ จำนวนเคส และการจัดลำดับการคัดแยก (Triage level)" },
        { name: "triageLevel", label: "Triage Level (การแบ่งโซนสี)", type: "text", required: true, placeholder: "แดง... เหลือง... เขียว... ดำ... จำนวนเคสแต่ละระดับ" },
        { name: "management", label: "ปฏิบัติการที่ดำเนินการ", type: "textarea", required: true, placeholder: "การจัดตั้งกองอำนวยการแพทย์สนาม การกู้ชีพปฐมพยาบาลในพื้นที่" },
        { name: "transportDetails", label: "การลำเลียงขนส่งผู้บาดเจ็บ", type: "textarea", required: true, placeholder: "รายละเอียดการกระจายและส่งต่อผู้บาดเจ็บไปยังโรงพยาบาลต่างๆ" },
        { name: "supervisorName", label: "ชื่อผู้นิเทศ (ผู้ประเมิน)", type: "text", required: true, placeholder: "ชื่อ-สกุล ผู้นิเทศคุมฝึกปฏิบัติ" }
      ];
      
    case "referral":
      return [
        { name: "patientName", label: "ชื่อ-สกุล ผู้ป่วย", type: "text", required: true, placeholder: "เช่น นายสวัสดิ์ เกื้อกูล" },
        { name: "age", label: "อายุ (ปี)", type: "number", required: true, placeholder: "เช่น 67" },
        { name: "symptoms", label: "การวินิจฉัย และ Level of acuity (ระดับความรุนแรง)", type: "textarea", required: true, placeholder: "รายละเอียดโรคและการประเมินความปลอดภัยในการขนย้าย" },
        { name: "management", label: "การปฏิบัติ (ก่อน - ขณะ - หลังส่งต่อ)", type: "textarea", required: true, placeholder: "Pre: เตรียมยา อุปกรณ์ / During: ติดตาม Vitals เฝ้าระวังภาวะแทรกซ้อน / Post: รายงานรับส่งเวรที่ รพ.ปลายทาง" },
        { name: "supervisorName", label: "ชื่อผู้นิเทศ (ผู้ประเมิน)", type: "text", required: true, placeholder: "ชื่อ-สกุล ผู้นิเทศคุมฝึกปฏิบัติ" }
      ];
      
    default:
      return [];
  }
};
