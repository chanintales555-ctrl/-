// สคริปต์ดึงข้อมูลจาก Cloud Firestore ลงสู่ Google Sheets
// ผู้พัฒนา: เจฟ (AI Assistant)

const PROJECT_ID = "enp4-logbook";

// แผนผังข้อมูลนักศึกษา (สำหรับแปลง ID เป็นชื่อจริง)
const STUDENT_MAP = {
  "1": {
    "fullName": "นางสาวกลิ่นสุคนธ์ ทองไพร",
    "position": "พยาบาลวิชาชีพปฏิบัติการ"
  },
  "2": {
    "fullName": "นางคำสอน แซ่อึ้ง",
    "position": "พยาบาลวิชาชีพชำนาญการ"
  },
  "3": {
    "fullName": "นางสาวแคทลิยา กัลยาพันธ์",
    "position": "พยาบาลวิชาชีพปฏิบัติการ"
  },
  "4": {
    "fullName": "นางสาวจารุณี พยุงพงษ์",
    "position": "พยาบาลวิชาชีพชำนาญการ"
  },
  "5": {
    "fullName": "นางสาวจิราภรณ์ ชินทวัน",
    "position": "พยาบาลวิชาชีพปฏิบัติการ"
  },
  "6": {
    "fullName": "นางสาวจุฑามาศ บุญอารีย์",
    "position": "พยาบาลวิชาชีพปฏิบัติการ"
  },
  "7": {
    "fullName": "นางสาวชรินรัตน์ สาวันดี",
    "position": "พยาบาลวิชาชีพ"
  },
  "8": {
    "fullName": "นายชัยวัฒน์ วาปีสังข์",
    "position": "พยาบาลวิชาชีพ"
  },
  "9": {
    "fullName": "นายชัยวัฒน์ รักษ์โคตร",
    "position": "พยาบาลวิชาชีพ"
  },
  "10": {
    "fullName": "นายณัฐพล พิมพันธ์",
    "position": "พยาบาลวิชาชีพ"
  },
  "11": {
    "fullName": "นางสาวณินธิรา หาญสุรภานนท์",
    "position": "พยาบาลวิชาชีพชำนาญการ"
  },
  "12": {
    "fullName": "นายธวัชชัย ฤาชัย",
    "position": "พยาบาลวิชาชีพปฏิบัติการ"
  },
  "13": {
    "fullName": "นางสาวนริพร ภาระเวช",
    "position": "พยาบาลวิชาชีพปฏิบัติการ"
  },
  "14": {
    "fullName": "นางสาวนิยะดา แก้วคูณ",
    "position": "พยาบาลวิชาชีพชำนาญการ"
  },
  "15": {
    "fullName": "นางปีใหม่ อนันตภักดิ์",
    "position": "พยาบาลวิชาชีพชำนาญการ"
  },
  "16": {
    "fullName": "นางสาวพรชิตา เหลื่อมศรี",
    "position": "พยาบาลวิชาชีพปฏิบัติการ"
  },
  "17": {
    "fullName": "นางสาวพรสวรรค์ แก้วโท",
    "position": "พยาบาลวิชาชีพชำนาญการ"
  },
  "18": {
    "fullName": "นางสาวพัชรียา กากแก้ว",
    "position": "พยาบาลวิชาชีพชำนาญการ"
  },
  "19": {
    "fullName": "นางสาวพิมพ์ชนก วิชัย",
    "position": "พยาบาลวิชาชีพปฏิบัติการ"
  },
  "20": {
    "fullName": "นางสาวภัทราภรณ์ บุญสอน",
    "position": "พยาบาลวิชาชีพชำนาญการ"
  },
  "21": {
    "fullName": "นางสาวรติกร ทองไพร",
    "position": "พยาบาลวิชาชีพชำนาญการ"
  },
  "22": {
    "fullName": "นางสาวรุ่งฤดี กลิ่นนิยม",
    "position": "พยาบาลวิชาชีพชำนาญการ"
  },
  "23": {
    "fullName": "นางสาวลลิตา สุโกพันธ์",
    "position": "พยาบาลวิชาชีพชำนาญการ"
  },
  "24": {
    "fullName": "นางสาววัชราพร ศรีสุริยจันทร์",
    "position": "พยาบาลวิชาชีพชำนาญการ"
  },
  "25": {
    "fullName": "นางสาววารุณี ใจภักดี",
    "position": "พยาบาลวิชาชีพชำนาญการ"
  },
  "26": {
    "fullName": "นางสาววาสนา บุตรขัน",
    "position": "พยาบาลวิชาชีพชำนาญการ"
  },
  "27": {
    "fullName": "นางสาววิภารัตน์ อุทัย",
    "position": "พยาบาลวิชาชีพชำนาญการ"
  },
  "28": {
    "fullName": "นางสาววิไลวรรณ อุไรสาย",
    "position": "พยาบาลวิชาชีพ"
  },
  "29": {
    "fullName": "นางสาวศันศนีย์ เนตรวงศ์",
    "position": "พยาบาลวิชาชีพชำนาญการ"
  },
  "30": {
    "fullName": "นางสาวศิริลักษณ์ ศิริวาลย์",
    "position": "พยาบาลวิชาชีพชำนาญการ"
  },
  "31": {
    "fullName": "นางสาวสุดารัตน์ แดนพันธ์",
    "position": "พยาบาลวิชาชีพชำนาญการ"
  },
  "32": {
    "fullName": "นางสาวสุนันทา อุตมาน",
    "position": "พยาบาลวิชาชีพชำนาญการ"
  },
  "33": {
    "fullName": "นายอลงกรณ์ อมรสิน",
    "position": "พยาบาลวิชาชีพปฏิบัติการ"
  },
  "34": {
    "fullName": "นางสาวอัญญารัตน์ ประชานันท์",
    "position": "พยาบาลวิชาชีพปฏิบัติการ"
  },
  "35": {
    "fullName": "นางสาวอารยา จันทพันธ์",
    "position": "พยาบาลวิชาชีพชำนาญการ"
  },
  "36": {
    "fullName": "นายอุเทน วงษาชัย",
    "position": "พยาบาลวิชาชีพชำนาญการ"
  },
  "37": {
    "fullName": "นางสาวเอี่ยมศิริ จำปาโท",
    "position": "พยาบาลวิชาชีพชำนาญการ"
  }
};

// เมนูพิเศษสำหรับกดอัปเดตข้อมูลบนหน้า Google Sheets
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🔄 อัปเดตข้อมูลระบบ')
    .addItem('ดึงข้อมูลจาก Firebase ล่าสุด', 'importFirestoreLogs')
    .addToUi();
}

// ฟังก์ชันหลักดึงข้อมูล
function importFirestoreLogs() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // 1. ดึงข้อมูลดิบจาก API ของ Firestore
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/logs?pageSize=1000`;
  
  try {
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const responseCode = response.getResponseCode();
    
    if (responseCode !== 200) {
      Browser.msgBox("❌ เกิดข้อผิดพลาดจาก Firebase: " + response.getContentText());
      return;
    }
    
    const json = JSON.parse(response.getContentText());
    
    if (!json.documents || json.documents.length === 0) {
      Browser.msgBox("ℹ️ ไม่พบข้อมูลการกรอกเคสในระบบในขณะนี้");
      return;
    }
    
    // 2. เคลียร์ข้อมูลหน้าเก่าออกและจัดเตรียมตารางใหม่
    sheet.clear();
    
    // ตั้งค่าหัวข้อหลักพรีเมี่ยม
    const headers = [
      "วันเวลาที่บันทึก",
      "รหัสผู้เข้าอบรม",
      "ชื่อ-สกุลผู้ส่งงาน",
      "ตำแหน่ง",
      "แหล่งฝึกรอบที่ 1",
      "แหล่งฝึกรอบที่ 2",
      "หมวดเคสย่อย",
      "ชื่อ-สกุล ผู้ป่วย",
      "อายุ (ปี)",
      "อาการ / การวินิจฉัย (Dx)",
      "ผลลัพธ์และบันทึกหลังทำหัตถการ",
      "ชื่อผู้นิเทศ (ผู้ประเมิน)"
    ];
    
    sheet.appendRow(headers);
    
    // 3. วนลูปแปลข้อมูลดิบใส่ในตาราง
    const rows = [];
    json.documents.forEach(doc => {
      const fields = doc.fields || {};
      
      const userId = fields.userId ? fields.userId.stringValue : "";
      const subtopicId = fields.subtopicId ? fields.subtopicId.stringValue : "";
      const timestamp = fields.timestamp ? fields.timestamp.stringValue : "";
      
      // ดึงข้อมูลใน nested data object
      const dataMap = fields.data && fields.data.mapValue ? fields.data.mapValue.fields : {};
      
      const patientName = dataMap.patientName ? dataMap.patientName.stringValue : "";
      const age = dataMap.age ? dataMap.age.stringValue : "";
      const diagnosis = dataMap.diagnosis ? dataMap.diagnosis.stringValue : "";
      const management = dataMap.management ? dataMap.management.stringValue : "";
      const outcome = dataMap.outcome ? dataMap.outcome.stringValue : "";
      const supervisor = dataMap.supervisor ? dataMap.supervisor.stringValue : "";
      
      // แปลงข้อมูลนักศึกษาจากรหัส
      const student = STUDENT_MAP[userId] || { fullName: "-", position: "-" };
      const formattedId = '256904000' + String(userId).padStart(2, '0');
      
      // ดึงข้อมูลผู้ใช้จาก Firestore หรือระบุค่าเริ่มต้น
      const userVenue1 = student.venue1 || "-";
      const userVenue2 = student.venue2 || "-";
      
      // จัดการแปลงเวลา (Timezone + จัดรูปแบบ)
      let formattedTime = timestamp;
      if (timestamp) {
        try {
          const dateObj = new Date(timestamp);
          // แสดงผลแบบเวลาไทย
          formattedTime = Utilities.formatDate(dateObj, "GMT+7", "dd/MM/yyyy HH:mm:ss");
        } catch(e) {}
      }
      
      rows.push([
        formattedTime,
        formattedId,
        student.fullName,
        student.position,
        userVenue1,
        userVenue2,
        subtopicId,
        patientName,
        age,
        diagnosis,
        management + " \n➔ " + outcome,
        supervisor
      ]);
    });
    
    // เขียนแถวทั้งหมดลงชีตทีเดียวเพื่อประสิทธิภาพสูง
    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    }
    
    // 4. จัดรูปแบบหน้าตาตารางให้สวยงามน่าใช้ (Theme สีฟ้าพรีเมี่ยม)
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#0066cc") // สีฟ้าหลักของธีมเรา
               .setFontColor("#ffffff")
               .setFontWeight("bold")
               .setHorizontalAlignment("center");
               
    // ตีเส้นขอบและจัดตำแหน่ง
    const totalRange = sheet.getRange(1, 1, rows.length + 1, headers.length);
    totalRange.setFontFamily("Prompt")
              .setBorder(true, true, true, true, true, true, "#e2e8f0", SpreadsheetApp.BorderStyle.SOLID)
              .setVerticalAlignment("middle");
              
    // จัดแนวข้อความหัวข้อสถิติกลางกระดาษ
    sheet.getRange(2, 1, rows.length, 2).setHorizontalAlignment("center"); // เวลา และ รหัส
    sheet.getRange(2, 7, rows.length, 1).setHorizontalAlignment("center"); // หมวดเคส
    sheet.getRange(2, 9, rows.length, 1).setHorizontalAlignment("center"); // อายุ
    
    // ออโต้ขยายขนาดคอลัมน์อัตโนมัติ
    for (let col = 1; col <= headers.length; col++) {
      sheet.autoResizeColumn(col);
    }
    
    Browser.msgBox("🔄 อัปเดตข้อมูลสำเร็จเสร็จสิ้น ดึงข้อมูลเคสมาแล้วทั้งหมด " + rows.length + " รายการครับ!");
    
  } catch(e) {
    Browser.msgBox("❌ เกิดข้อผิดพลาดในการโหลดข้อมูล: " + e.toString());
  }
}
