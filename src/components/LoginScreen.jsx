import React, { useState } from 'react';
import studentsData from '../data/students.json';
import venuesData from '../data/venues.json';
import { User, Award, MapPin } from 'lucide-react';

const LoginScreen = ({ onLogin, isFirebaseConnected }) => {
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [venue1, setVenue1] = useState("");
  const [venue2, setVenue2] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudentId || !venue1 || !venue2) {
      alert("กรุณากรอกข้อมูลและเลือกแหล่งฝึกให้ครบถ้วนครับ");
      return;
    }
    const student = studentsData.people.find(s => s.id === selectedStudentId);
    if (student) {
      onLogin(student, venue1, venue2);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'row',
      background: '#ffffff',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-family)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Left Column: Sign In Form (Fills remaining space) */}
      <div style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '40px 60px',
        backgroundColor: '#ffffff',
        zIndex: 5
      }} className="login-form-side">
        
        <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
          
          {/* Institution Header Info */}
          <div style={{ marginBottom: '24px' }}>
            <div className="header-badge" style={{ 
              marginBottom: '16px', 
              background: 'rgba(0, 102, 204, 0.06)',
              border: '1px solid rgba(0, 102, 204, 0.15)',
              color: 'var(--primary)'
            }}>
              <Award size={14} />
              วิทยาลัยพยาบาลบรมราชชนนี สรรพสิทธิประสงค์
            </div>
            
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '10px',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}>
              Sign in
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
              ยินดีต้อนรับสู่ระบบสมุดบันทึกประสบการณ์ฝึกปฏิบัติทักษะพยาบาลเวชปฏิบัติฉุกเฉิน รุ่นที่ 4
            </p>
          </div>

          {/* Selection Form */}
          <form onSubmit={handleSubmit}>
            
            {/* Student Select Dropdown */}
            <div style={{ marginBottom: '18px' }}>
              <label htmlFor="student-select" style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.85rem' }}>
                เลือกรายชื่อผู้ส่งงานของคุณ
              </label>
              <select
                id="student-select"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                required
                style={{
                  cursor: 'pointer',
                  appearance: 'none',
                  border: '1px solid rgba(0, 102, 204, 0.2)',
                  borderRadius: '8px',
                  background: '#ffffff',
                  color: '#0f172a',
                  padding: '14px 16px',
                  paddingRight: '40px',
                  fontSize: '0.95rem',
                  backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%230066cc\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center',
                  backgroundSize: '16px',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(0, 102, 204, 0.2)'}
              >
                <option value="" disabled style={{ color: 'var(--text-muted)' }}>
                  -- เลือกรายชื่อนักศึกษาพยาบาล --
                </option>
                {studentsData.people.map((student) => {
                  const studentCode = '256904000' + String(student.id).padStart(2, '0');
                  return (
                    <option key={student.id} value={student.id}>
                      {student.fullName} (รหัส: {studentCode})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Venue Rotation 1 Dropdown */}
            <div style={{ marginBottom: '18px' }}>
              <label htmlFor="venue1-select" style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} style={{ color: 'var(--primary)' }} /> แหล่งฝึกรอบที่ 1
              </label>
              <select
                id="venue1-select"
                value={venue1}
                onChange={(e) => setVenue1(e.target.value)}
                required
                style={{
                  cursor: 'pointer',
                  appearance: 'none',
                  border: '1px solid rgba(0, 102, 204, 0.2)',
                  borderRadius: '8px',
                  background: '#ffffff',
                  color: '#0f172a',
                  padding: '14px 16px',
                  paddingRight: '40px',
                  fontSize: '0.95rem',
                  backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%230066cc\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center',
                  backgroundSize: '16px',
                  transition: 'all 0.2s'
                }}
              >
                <option value="" disabled style={{ color: 'var(--text-muted)' }}>
                  -- เลือกโรงพยาบาล/แหล่งฝึกรอบที่ 1 --
                </option>
                {venuesData.venues.map((venue) => (
                  <option key={venue} value={venue}>
                    {venue}
                  </option>
                ))}
              </select>
            </div>

            {/* Venue Rotation 2 Dropdown */}
            <div style={{ marginBottom: '28px' }}>
              <label htmlFor="venue2-select" style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} style={{ color: 'var(--accent)' }} /> แหล่งฝึกรอบที่ 2
              </label>
              <select
                id="venue2-select"
                value={venue2}
                onChange={(e) => setVenue2(e.target.value)}
                required
                style={{
                  cursor: 'pointer',
                  appearance: 'none',
                  border: '1px solid rgba(0, 102, 204, 0.2)',
                  borderRadius: '8px',
                  background: '#ffffff',
                  color: '#0f172a',
                  padding: '14px 16px',
                  paddingRight: '40px',
                  fontSize: '0.95rem',
                  backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%230066cc\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center',
                  backgroundSize: '16px',
                  transition: 'all 0.2s'
                }}
              >
                <option value="" disabled style={{ color: 'var(--text-muted)' }}>
                  -- เลือกโรงพยาบาล/แหล่งฝึกรอบที่ 2 --
                </option>
                {venuesData.venues.map((venue) => (
                  <option key={venue} value={venue}>
                    {venue}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={!selectedStudentId || !venue1 || !venue2}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: 600,
                opacity: (selectedStudentId && venue1 && venue2) ? 1 : 0.6,
                cursor: (selectedStudentId && venue1 && venue2) ? 'pointer' : 'not-allowed',
                background: 'linear-gradient(135deg, #2563eb, #0284c7)'
              }}
            >
              Sign in
            </button>
          </form>

          {/* Period Info */}
          <div style={{
            marginTop: '36px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            textAlign: 'left'
          }}>
            ระยะเวลาบันทึก: 29 มิถุนายน – 14 สิงหาคม 2569
          </div>
        </div>

      </div>

      {/* Right Column: Split Cover Image Side (Fits image width exactly) */}
      <div style={{
        flex: '0 0 auto',
        height: '100vh',
        backgroundColor: '#f1f5f9',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }} className="login-cover-side">
        <img 
          src="/cover_new.jpg" 
          alt="Cover Page" 
          style={{
            height: '100vh',
            width: 'auto',
            display: 'block',
            objectFit: 'contain'
          }} 
        />
      </div>

      {/* Responsive Stacking CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 860px) {
          .login-cover-side {
            display: none !important;
          }
          .login-form-side {
            padding: 40px 24px !important;
            max-width: 100% !important;
          }
        }
      `}} />

    </div>
  );
};

export default LoginScreen;
