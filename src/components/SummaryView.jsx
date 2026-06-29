import React from 'react';
import { mainTopics } from '../data/topics';
import { ArrowLeft, Printer, Award, ShieldCheck } from 'lucide-react';

const SummaryView = ({ student, logs, onClose }) => {
  
  const getSubtopicCount = (subId) => {
    return logs.filter(log => log.subtopicId === subId).length;
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = () => {
    const today = new Date();
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    return `${today.getDate()} ${thaiMonths[today.getMonth()]} พ.ศ. ${today.getFullYear() + 543}`;
  };

  return (
    <div className="summary-print-container" style={{ padding: '24px', maxWidth: '960px', margin: '0 auto', zIndex: 5, position: 'relative' }}>
      
      {/* Action Bar (hidden during print) */}
      <div className="no-print" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        background: 'rgba(15, 27, 45, 0.75)',
        padding: '16px 24px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)'
      }}>
        <button 
          onClick={onClose} 
          className="btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={16} /> กลับไปหน้าควบคุม
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            ตรวจสอบข้อมูลและกดปุ่มเพื่อสั่งพิมพ์หรือบันทึก PDF
          </span>
          <button 
            onClick={handlePrint} 
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Printer size={16} /> พิมพ์รายงาน / บันทึก PDF
          </button>
        </div>
      </div>

      {/* Print Document Wrapper */}
      <div className="printable-document" style={{
        background: '#fff',
        color: '#000',
        borderRadius: '8px',
        padding: '40px 50px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        minHeight: '297mm', // A4 Size approx ratio
        fontFamily: "'Prompt', 'Sarabun', sans-serif"
      }}>
        
        {/* Document Header (Institution style) */}
        <div style={{ textAlign: 'center', marginBottom: '32px', position: 'relative' }}>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            lineHeight: 1.5,
            marginBottom: '4px'
          }}>
            วิทยาลัยพยาบาลบรมราชชนนี สรรพสิทธิประสงค์
          </div>
          <div style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            marginBottom: '16px'
          }}>
            สรุปประสบการณ์ฝึกปฏิบัติทักษะเฉพาะทางการพยาบาลเวชปฏิบัติฉุกเฉิน
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            borderBottom: '2px solid #000',
            paddingBottom: '16px',
            fontWeight: 500
          }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              <span>ผู้ฝึกปฏิบัติ: {student.fullName}</span>
              <span>ตำแหน่ง: {student.position}</span>
              <span>รหัสผู้เข้าอบรม: {('256904000' + String(student.id).padStart(2, '0'))}</span>
            </div>
            <div style={{ display: 'flex', gap: '24px', fontSize: '0.85rem', color: '#1e293b' }}>
              <span>แหล่งฝึกรอบที่ 1: {student.venue1 || '-'}</span>
              <span>แหล่งฝึกรอบที่ 2: {student.venue2 || '-'}</span>
            </div>
          </div>
        </div>

        {/* Experience Table */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '40px',
          fontSize: '0.85rem',
          lineHeight: 1.4
        }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #000', borderTop: '2px solid #000' }}>
              <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700, width: '70%' }}>ลักษณะประสบการณ์</th>
              <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, width: '15%' }}>จำนวนที่กำหนด</th>
              <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, width: '15%' }}>จำนวนที่ได้</th>
            </tr>
          </thead>
          <tbody>
            {mainTopics.map(topic => (
              <React.Fragment key={topic.id}>
                {/* Main Topic Header */}
                <tr style={{ background: '#f3f4f6', borderBottom: '1px solid #000' }}>
                  <td colSpan="3" style={{ padding: '8px 10px', fontWeight: 700, fontSize: '0.9rem' }}>
                    {topic.title}
                  </td>
                </tr>
                
                {/* Subtopics */}
                {topic.subtopics.map(sub => {
                  const count = getSubtopicCount(sub.id);
                  const isMet = count >= sub.target;
                  return (
                    <tr key={sub.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '8px 10px', paddingLeft: '24px' }}>
                        {sub.title}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600 }}>
                        {sub.target}
                      </td>
                      <td style={{ 
                        padding: '8px 10px', 
                        textAlign: 'center', 
                        fontWeight: 700,
                        color: isMet ? '#16a34a' : '#dc2626'
                      }}>
                        {count} {isMet ? '✔' : ''}
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Signature Box */}
        <div style={{
          marginTop: '60px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          fontSize: '0.9rem',
          lineHeight: 1.8
        }}>
          <div style={{ textAlign: 'center', width: '320px' }}>
            <div style={{ marginBottom: '12px' }}>
              ข้าพเจ้าขอรับรองว่าสรุปรายงานที่บันทึกเป็นความจริงทุกประการ
            </div>
            
            <div style={{ margin: '24px 0 8px' }}>
              ลงชื่อ............................................................
            </div>
            
            <div style={{ fontWeight: 600 }}>
              ( {student.fullName} )
            </div>
            
            <div>
              รหัสประจำตัวผู้เข้าอบรม: {('256904000' + String(student.id).padStart(2, '0'))}
            </div>
            
            <div>
              วันที่ {formatDate()}
            </div>
          </div>
        </div>

      </div>

      {/* Print-specific CSS styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            background: #fff !important;
            color: #000 !important;
          }
          .no-print {
            display: none !important;
          }
          .summary-print-container {
            padding: 0 !important;
            max-width: 100% !important;
          }
          .printable-document {
            box-shadow: none !important;
            padding: 0 !important;
            border: none !important;
          }
        }
      `}} />
      
    </div>
  );
};

export default SummaryView;
