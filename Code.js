// สคริปต์ดึงข้อมูลจาก Cloud Firestore ลงสู่ Google Sheets แยกชีตรายคนพร้อมแสดงลายเซ็น
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
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // สร้าง/ดึงชีต DebugLogs
  let debugSheet = ss.getSheetByName("DebugLogs");
  if (!debugSheet) {
    debugSheet = ss.insertSheet("DebugLogs");
  }
  debugSheet.clear();
  debugSheet.getRange(1, 1).setValue("=== LOGS START: " + new Date().toString() + " ===");
  
  const debugLogs = [];
  function addLog(msg) {
    debugLogs.push(msg);
    Logger.log(msg);
  }
  
  addLog("เริ่มการเชื่อมต่อและดึงข้อมูลจาก Firestore...");
  
  // 1. ดึงข้อมูลรายชื่อและแหล่งฝึกของนักศึกษาจาก Firestore (users collection) พร้อมตั้งค่าเลี่ยงแคชผ่าน Header
  const usersUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users?pageSize=1000`;
  const userProfiles = {};
  
  const fetchOptions = {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    muteHttpExceptions: true
  };
  
  try {
    addLog("กำลังดึงโปรไฟล์ผู้ใช้งาน (users)...");
    const usersResponse = UrlFetchApp.fetch(usersUrl, fetchOptions);
    if (usersResponse.getResponseCode() === 200) {
      const usersJson = JSON.parse(usersResponse.getContentText());
      if (usersJson.documents) {
        usersJson.documents.forEach(doc => {
          const fields = doc.fields || {};
          const uid = fields.id ? (fields.id.stringValue || String(fields.id.integerValue || "")) : "";
          const venue1 = fields.venue1 ? fields.venue1.stringValue : "-";
          const venue2 = fields.venue2 ? fields.venue2.stringValue : "-";
          if (uid) {
            userProfiles[uid] = { venue1, venue2 };
          }
        });
        addLog(`ดึงโปรไฟล์สำเร็จ: พบผู้ใช้งาน ${Object.keys(userProfiles).length} คน`);
      }
    } else {
      addLog("ดึงโปรไฟล์ล้มเหลว: " + usersResponse.getContentText());
    }
  } catch (e) {
    addLog("เกิดข้อผิดพลาดขณะดึงโปรไฟล์: " + e.toString());
  }

  // 2. ดึงข้อมูลบันทึกหัตถการ/เคสทั้งหมดจาก Firestore (logs collection) พร้อมตั้งค่าเลี่ยงแคชผ่าน Header
  const logsUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/logs?pageSize=1000`;
  
  try {
    addLog("กำลังดึงรายการเคสบันทึก (logs)...");
    const response = UrlFetchApp.fetch(logsUrl, fetchOptions);
    const responseCode = response.getResponseCode();
    
    if (responseCode !== 200) {
      addLog("ดึงรายการเคสล้มเหลว: " + response.getContentText());
      Browser.msgBox("❌ เกิดข้อผิดพลาดจาก Firebase: " + response.getContentText());
      return;
    }
    
    const json = JSON.parse(response.getContentText());
    const documents = json.documents || [];
    addLog(`ดึงเคสสำเร็จ: พบเคสทั้งหมดบนฐานข้อมูล ${documents.length} เคส`);
    
    // จัดกลุ่มข้อมูล logs ตามรายชื่อนักศึกษา (userId)
    const logsByUser = {};
    Object.keys(STUDENT_MAP).forEach(uid => {
      logsByUser[uid] = [];
    });
    
    documents.forEach(doc => {
      const fields = doc.fields || {};
      const userId = fields.userId ? (fields.userId.stringValue || String(fields.userId.integerValue || "")) : "";
      if (userId && logsByUser[userId] !== undefined) {
        logsByUser[userId].push(doc);
      }
    });
    
    // หัวข้อหลักสำหรับตารางรายงานของแต่ละคน (เพิ่มหัวข้อ ลายเซ็นผู้นิเทศ ในคอลัมน์ที่ 8)
    const headers = [
      "วันเวลาที่บันทึก",
      "หมวดเคสย่อย",
      "ชื่อ-สกุล ผู้ป่วย",
      "อายุ (ปี)",
      "อาการ / การวินิจฉัย (Dx)",
      "ผลลัพธ์และบันทึกหลังทำหัตถการ",
      "ชื่อผู้นิเทศ (ผู้ประเมิน)",
      "ลายเซ็นผู้นิเทศ"
    ];
    
    // 3. วนลูปสร้าง/อัปเดตชีตของแต่ละคน (คนละ 1 Tab)
    Object.keys(STUDENT_MAP).forEach(uid => {
      const student = STUDENT_MAP[uid];
      const profile = userProfiles[uid] || {};
      const venue1 = profile.venue1 || "-";
      const venue2 = profile.venue2 || "-";
      
      const formattedId = '256904000' + String(uid).padStart(2, '0');
      // ตัดชื่อเล่น/ชื่อจริงมาแสดงเป็นชื่อ Tab เพื่อไม่ให้ยาวเกินไป (เช่น 25690400001 - กลิ่นสุคนธ์)
      const firstName = student.fullName.replace("นางสาว", "").replace("นาง", "").replace("นาย", "").split(" ")[0].trim();
      const sheetName = `${formattedId} - ${firstName}`;
      
      const userLogs = logsByUser[uid] || [];
      if (userLogs.length === 0) {
        return; // ข้ามถ้านักศึกษาคนนี้ยังไม่มีเคสเลย
      }
      
      addLog(`กำลังสร้าง/อัปเดตแผ่นงานสำหรับ: ${sheetName} (จำนวนเคส: ${userLogs.length} เคส)`);
      
      // ค้นหาชีตเดิม ถ้าไม่มีให้สร้างใหม่
      let userSheet = ss.getSheetByName(sheetName);
      if (!userSheet) {
        userSheet = ss.insertSheet(sheetName);
        addLog(`  -> สร้างชีตใหม่: ${sheetName}`);
      }
      
      // ล้างข้อมูลหน้าเดิมออกทั้งหมด (รองรับการทำข้อมูลให้เป็นปัจจุบันเมื่อมีการลบเคส)
      userSheet.clear();
      
      // ลบลายเซ็นภาพเดิมทั้งหมดที่เคยลอยอยู่ในชีตนี้ออกด้วย ป้องกันลายเซ็นซ้อนทับกัน
      const oldImages = userSheet.getImages();
      addLog(`  -> ลบลายเซ็นภาพเก่าลอยตัวออก: ${oldImages.length} ภาพ`);
      for (var i = 0; i < oldImages.length; i++) {
        oldImages[i].remove();
      }
      
      // แสดงข้อมูลส่วนตัวนักศึกษาด้านบนสุด
      userSheet.getRange(1, 1, 1, 5).setValues([[
        `ผู้ฝึกปฏิบัติ: ${student.fullName}`, 
        `รหัสประจำตัว: ${formattedId}`, 
        `ตำแหน่ง: ${student.position}`,
        `แหล่งฝึกรอบที่ 1: ${venue1}`,
        `แหล่งฝึกรอบที่ 2: ${venue2}`
      ]]).setFontWeight("bold").setBackground("#f1f5f9");
      
      // ตั้งค่าหัวข้อหลักพรีเมี่ยมที่แถวที่ 3
      userSheet.getRange(3, 1, 1, headers.length).setValues([headers]);
      
      // ดึงเคสของคนๆ นี้มาใส่ในตาราง
      const rows = [];
      
      userLogs.forEach(doc => {
        const fields = doc.fields || {};
        const subtopicId = fields.subtopicId ? fields.subtopicId.stringValue : "";
        const timestamp = fields.timestamp ? fields.timestamp.stringValue : "";
        
        const dataMap = fields.data && fields.data.mapValue ? fields.data.mapValue.fields : {};
        const patientName = dataMap.patientName ? dataMap.patientName.stringValue : "";
        const age = dataMap.age ? dataMap.age.stringValue : "";
        const symptoms = dataMap.symptoms ? dataMap.symptoms.stringValue : "";
        const details = (dataMap.management ? dataMap.management.stringValue : "") || 
                        (dataMap.triageReason ? dataMap.triageReason.stringValue : "");
                        
        const outcome = dataMap.outcome ? dataMap.outcome.stringValue : "";
        const supervisorName = dataMap.supervisorName ? dataMap.supervisorName.stringValue : "";
        
        let formattedTime = timestamp;
        if (timestamp) {
          try {
            const dateObj = new Date(timestamp);
            formattedTime = Utilities.formatDate(dateObj, "GMT+7", "dd/MM/yyyy HH:mm:ss");
          } catch(e) {}
        }
        
        const outcomeDetail = details ? (details + " \n➔ " + outcome) : outcome;
        
        rows.push([
          formattedTime,
          subtopicId,
          patientName,
          age,
          symptoms,
          outcomeDetail,
          supervisorName,
          "" // ช่องวางรูปภาพลายเซ็น
        ]);
      });
      
      // เขียนตารางแบบกลุ่มลงชีต
      if (rows.length > 0) {
        userSheet.getRange(4, 1, rows.length, headers.length).setValues(rows);
        addLog(`  -> เขียนแถวข้อมูลลงชีตเรียบร้อย: ${rows.length} แถว`);
        
        // วนลูปเพื่อวาดรูปลายเซ็นลอยในเซลล์คอลัมน์ H (คอลัมน์ที่ 8)
        userLogs.forEach((doc, idx) => {
          const docFields = doc.fields || {};
          const docDataMap = docFields.data && docFields.data.mapValue ? docFields.data.mapValue.fields : {};
          const supervisorSignature = docDataMap.supervisorSignature ? docDataMap.supervisorSignature.stringValue : "";
          
          const rowNum = 4 + idx;
          
          // ขยายความสูงของแถวข้อมูลให้สูงขึ้นเล็กน้อยเพื่อแสดงรูปภาพลายเซ็นได้ชัดเจน
          userSheet.setRowHeight(rowNum, 40);
          
          if (supervisorSignature && supervisorSignature.indexOf("data:image/png;base64,") === 0) {
            const docId = doc.name ? doc.name.split("/").pop() : "unknown_" + idx;
            addLog(`  -> กำลังประมวลผลลายเซ็นของเคสที่ ${idx + 1} (Doc: ${docId})`);
            try {
              const base64Data = supervisorSignature.split(",")[1];
              const decoded = Utilities.base64Decode(base64Data);
              const blob = Utilities.newBlob(decoded, 'image/png', 'sig_' + docId);
              
              // แทรกภาพลอยตัวเหนือกึ่งกลางเซลล์คอลัมน์ที่ 8 (คอลัมน์ H)
              const img = userSheet.insertImage(blob, 8, rowNum);
              
              // ปรับขนาดภาพลายเซ็นให้พอดีและกึ่งกลางตาราง (สัดส่วน 80x30 พิกเซล)
              img.setWidth(80).setHeight(30);
              
              // ขยับรูปเล็กน้อยเพื่อให้วางกึ่งกลางพอดี (Offset 10px จากขอบซ้าย และ 5px จากขอบบน)
              img.setAnchorCellXOffset(10).setAnchorCellYOffset(5);
              addLog(`     [สำเร็จ] แทรกรูปภาพลายเซ็นลงแถวที่ ${rowNum} สำเร็จ`);
            } catch(err) {
              addLog(`     [ล้มเหลว] เกิดข้อผิดพลาดกับภาพแถวที่ ${rowNum}: ${err.toString()}`);
            }
          }
        });
      }
      
      // จัดรูปแบบหัวข้อตารางสีฟ้าพรีเมี่ยม
      const headerRange = userSheet.getRange(3, 1, 1, headers.length);
      headerRange.setBackground("#0066cc")
                 .setFontColor("#ffffff")
                 .setFontWeight("bold")
                 .setHorizontalAlignment("center");
                 
      // จัดแต่งฟอนต์ Prompt และเส้นขอบตาราง
      const totalRange = userSheet.getRange(3, 1, rows.length + 1, headers.length);
      totalRange.setFontFamily("Prompt")
                .setBorder(true, true, true, true, true, true, "#e2e8f0", SpreadsheetApp.BorderStyle.SOLID)
                .setVerticalAlignment("middle");
                
      // จัดตำแหน่งแนวตั้งแถวข้อมูล
      if (rows.length > 0) {
        userSheet.getRange(4, 1, rows.length, 2).setHorizontalAlignment("center"); // เวลา และ หมวดเคส
        userSheet.getRange(4, 4, rows.length, 1).setHorizontalAlignment("center"); // อายุ
        userSheet.getRange(4, 8, rows.length, 1).setHorizontalAlignment("center"); // ลายเซ็น
      }
      
      // ออโต้ขยายคอลัมน์อัตโนมัติ
      for (let col = 1; col <= headers.length; col++) {
        userSheet.autoResizeColumn(col);
      }
    });
    
    // ลบหน้าชีตว่างเริ่มต้น (Sheet1 หรือ ชีต1) ออกเพื่อความเป็นระเบียบ
    const defaultSheet = ss.getSheetByName("Sheet1") || ss.getSheetByName("ชีต1");
    if (defaultSheet && ss.getSheets().length > 1) {
      ss.deleteSheet(defaultSheet);
    }
    
    addLog("=== การซิงก์ข้อมูลเสร็จสมบูรณ์เรียบร้อย ===");
    
    // เขียนบันทึก DebugLogs ทั้งหมดลงในชีตทีเดียว เพื่อความรวดเร็วสูงสุด (ไม่เสียเวลาเขียนทีละบรรทัดและลดการรีเฟรชหน้าจอ)
    if (debugLogs.length > 0) {
      debugSheet.getRange(2, 1, debugLogs.length, 1).setValues(debugLogs.map(l => [l]));
    }
    
    Browser.msgBox("🔄 อัปเดตข้อมูลสำเร็จเสร็จสิ้น! จัดกลุ่มแยกรายชื่อชีตส่วนตัวนักศึกษาพร้อมแทรกลายเซ็นและลบข้อมูลล่าสุดเรียบร้อยครับ");
    
  } catch(e) {
    addLog("เกิดข้อผิดพลาดร้ายแรง: " + e.toString());
    if (debugLogs.length > 0) {
      debugSheet.getRange(2, 1, debugLogs.length, 1).setValues(debugLogs.map(l => [l]));
    }
    Browser.msgBox("❌ เกิดข้อผิดพลาดในการดึงข้อมูล: " + e.toString());
  }
}
