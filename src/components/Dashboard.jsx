import React from 'react';
import { mainTopics } from '../data/topics';
import { 
  Heart, 
  Activity, 
  Layers, 
  Briefcase, 
  Eye, 
  PhoneCall, 
  Truck, 
  CornerUpRight, 
  ArrowRightLeft,
  Settings,
  LogOut,
  Plus,
  FileText,
  Play,
  Award
} from 'lucide-react';

const iconsMap = {
  "1": Heart,
  "2": Activity,
  "3": Layers,
  "4": Briefcase,
  "5": Award,
  "6": Eye,
  "7": PhoneCall,
  "8": Truck,
  "9": ArrowRightLeft
};

const Dashboard = ({ 
  student, 
  logs, 
  onSelectSubtopic, 
  onOpenSummary, 
  onLogout, 
  onOpenSettings,
  onGenerateDemoData 
}) => {
  
  // Calculate total statistics
  const getSubtopicCount = (subId) => {
    return logs.filter(log => log.subtopicId === subId).length;
  };

  const getTopicCount = (topicId) => {
    return logs.filter(log => log.topicId === topicId).length;
  };

  // Total required target
  const totalTarget = mainTopics.reduce((sum, topic) => {
    return sum + topic.subtopics.reduce((subSum, sub) => subSum + sub.target, 0);
  }, 0);

  const totalCompleted = logs.length;
  const overallPercentage = Math.min(100, Math.round((totalCompleted / totalTarget) * 100));

  const getCategoryIcon = (id) => {
    const IconComponent = iconsMap[id] || Activity;
    return <IconComponent size={24} />;
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', zIndex: 5, position: 'relative' }}>
      
      {/* Top Navigation / Student Header */}
      <header className="glass-panel" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 24px',
        marginBottom: '24px',
        background: 'var(--bg-card)',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1.2rem',
            color: '#fff',
            border: '2px solid rgba(0, 240, 255, 0.3)'
          }}>
            {student.firstName.charAt(0)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{student.fullName}</h2>
              <span className="badge-esi esi-3" style={{ fontSize: '0.7rem' }}>ENP รุ่น 4</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {student.position} | รหัสผู้เข้าอบรม: {('256904000' + String(student.id).padStart(2, '0'))}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            onClick={onLogout} 
            className="btn-secondary"
            style={{ 
              padding: '10px 16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--red)',
              borderColor: 'rgba(239, 68, 68, 0.15)',
              background: 'rgba(239, 68, 68, 0.02)'
            }}
            title="ออกจากระบบ"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
              e.currentTarget.style.borderColor = 'var(--red)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.02)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.15)';
            }}
          >
            <LogOut size={16} /> ออกจากระบบ
          </button>
        </div>
      </header>

      {/* Overview Statistics Widgets */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Total Progress Card */}
        <div className="glass-panel" style={{
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.04), rgba(0, 180, 216, 0.08))',
          display: 'flex',
          alignItems: 'center',
          gap: '24px'
        }}>
          {/* Progress Circular visual representation */}
          <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" stroke="rgba(0, 102, 204, 0.08)" strokeWidth="6" fill="transparent" />
              <circle 
                cx="40" 
                cy="40" 
                r="34" 
                stroke="var(--accent)" 
                strokeWidth="6" 
                fill="transparent"
                strokeDasharray={2 * Math.PI * 34}
                strokeDashoffset={2 * Math.PI * 34 * (1 - overallPercentage / 100)}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
                style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--text-primary)'
            }}>
              {overallPercentage}%
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ความสำเร็จของประสบการณ์รวม
            </span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '4px' }}>
              {totalCompleted} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ {totalTarget} เคส</span>
            </h3>
          </div>
        </div>

        {/* ESI 1 Status Card */}
        <div className="glass-panel" style={{ padding: '24px', background: 'rgba(239, 68, 68, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="badge-esi esi-1">Life Danger Presentation (ESI 1)</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>เกณฑ์ขั้นต่ำ: 5 เคส</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--red)' }}>
              {getSubtopicCount("1.1")}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>บันทึกแล้ว</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '12px', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(100, (getSubtopicCount("1.1") / 5) * 100)}%`,
              height: '100%',
              backgroundColor: 'var(--red)',
              borderRadius: '2px'
            }} />
          </div>
        </div>

        {/* Triage Status Card */}
        <div className="glass-panel" style={{ padding: '24px', background: 'rgba(245, 158, 11, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="badge-esi esi-2">Triage Evaluation (คัดแยกผู้ป่วย)</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>เกณฑ์ขั้นต่ำ: 25 เคส</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--yellow)' }}>
              {getSubtopicCount("3.1")}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>บันทึกแล้ว</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '12px', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(100, (getSubtopicCount("3.1") / 25) * 100)}%`,
              height: '100%',
              backgroundColor: 'var(--yellow)',
              borderRadius: '2px'
            }} />
          </div>
        </div>
      </section>

      {/* Grid of 9 Main Category Boxes */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ width: '6px', height: '18px', background: 'var(--accent)', borderRadius: '2px' }} />
        เลือกหมวดหมู่ที่ต้องการบันทึกประสบการณ์
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px'
      }}>
        {mainTopics.map((topic) => {
          const count = getTopicCount(topic.id);
          // Total target for this topic
          const target = topic.subtopics.reduce((acc, sub) => acc + sub.target, 0);
          const percent = Math.min(100, Math.round((count / target) * 100));

          return (
            <div key={topic.id} className="glass-panel" style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'default',
              minHeight: '260px'
            }}>
              <div>
                {/* Header Icon + Progress Circle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(0, 240, 255, 0.08)',
                    border: '1px solid rgba(0, 240, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent)'
                  }}>
                    {getCategoryIcon(topic.id)}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                      {count} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ {target}</span>
                    </span>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>เคสสำเร็จ</span>
                  </div>
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.4 }}>
                  {topic.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '20px' }}>
                  {topic.description}
                </p>
              </div>

              <div>
                {/* Progress bar */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <span>ความคืบหน้าของกล่อง</span>
                    <span>{percent}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(0, 102, 204, 0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${percent}%`,
                      height: '100%',
                      background: `linear-gradient(to right, var(--primary), var(--accent))`,
                      borderRadius: '3px',
                      transition: 'width 0.5s ease-out'
                    }} />
                  </div>
                </div>

                {/* Subtopic Selector list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {topic.subtopics.map(sub => {
                    const subCount = getSubtopicCount(sub.id);
                    const subPercent = Math.min(100, Math.round((subCount / sub.target) * 100));
                    const isDone = subCount >= sub.target;

                    return (
                      <button
                        key={sub.id}
                        onClick={() => onSelectSubtopic(sub)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 12px',
                          background: 'rgba(0, 102, 204, 0.02)',
                          border: '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          color: 'var(--text-primary)',
                          textAlign: 'left',
                          fontSize: '0.8rem',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(0, 102, 204, 0.05)';
                          e.currentTarget.style.borderColor = 'var(--primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(0, 102, 204, 0.02)';
                          e.currentTarget.style.borderColor = 'var(--border-light)';
                        }}
                      >
                        <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                          {sub.title}
                        </span>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            color: isDone ? 'var(--green)' : 'var(--text-secondary)',
                            fontWeight: 600
                          }}>
                            {subCount}/{sub.target}
                          </span>
                          <div style={{
                            padding: '3px 6px',
                            borderRadius: '4px',
                            background: isDone ? 'var(--green-glow)' : 'rgba(0, 0, 0, 0.04)',
                            color: isDone ? 'var(--green)' : 'var(--text-muted)',
                            fontSize: '0.65rem',
                            fontWeight: 600
                          }}>
                            {isDone ? 'สำเร็จ' : 'ยังขาด'}
                          </div>
                          <Plus size={14} style={{ color: 'var(--accent)' }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Printable Report Section at the Bottom */}
      <div className="glass-panel" style={{
        marginTop: '40px',
        padding: '30px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.03), rgba(0, 180, 216, 0.05))',
        border: '1px solid var(--border-glow)',
        borderRadius: 'var(--radius-lg)',
        gap: '20px'
      }}>
        <div>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
            รายงานสรุปผลสัมฤทธิ์ปฏิบัติวิชาชีพ
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            ตรวจสอบความคืบหน้าของทุกหมวดหมู่การบันทึกเคส และทำการพิมพ์เล่มผลงานขนาด A4 หรือบันทึกเป็นไฟล์ PDF
          </p>
        </div>
        <button
          onClick={onOpenSummary}
          className="btn-primary"
          style={{
            padding: '14px 28px',
            fontSize: '0.95rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'linear-gradient(135deg, var(--primary), var(--accent))'
          }}
        >
          <FileText size={18} /> ดูหน้ารายงานสรุปผลพิมพ์
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
