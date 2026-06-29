import React, { useState } from 'react';
import { getFieldsForType } from '../data/topics';
import { X, Trash2, Plus, CheckCircle } from 'lucide-react';

const LogModal = ({ subtopic, logs, onSaveLog, onDeleteLog, onClose }) => {
  const subtopicLogs = logs.filter(log => log.subtopicId === subtopic.id);
  const fields = getFieldsForType(subtopic.type, subtopic.id);

  // Form State
  const initialFormState = fields.reduce((acc, field) => {
    acc[field.name] = field.type === 'select' ? (field.options[0]?.value || '') : '';
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormState);
  const [showAddForm, setShowAddForm] = useState(subtopicLogs.length < subtopic.target);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple verification
    const missingFields = fields.filter(f => f.required && !formData[f.name]);
    if (missingFields.length > 0) {
      alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วนครับ");
      return;
    }

    onSaveLog({
      subtopicId: subtopic.id,
      topicId: subtopic.id.split('.')[0], // get main topic ID (e.g. "1" from "1.1")
      data: formData
    });

    // Reset Form
    setFormData(initialFormState);
    setShowAddForm(false);
  };

  const handleDelete = (logId) => {
    if (window.confirm("คุณต้องการลบบันทึกรายการนี้ใช่หรือไม่?")) {
      onDeleteLog(logId);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(15, 23, 42, 0.45)', // Translucent dark overlay matching light theme
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        background: '#ffffff', // Pure white background matching light theme
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0, 102, 204, 0.12)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 30px',
          borderBottom: '1px solid rgba(0, 102, 204, 0.08)'
        }}>
          <div>
            <span className="badge-esi esi-3" style={{ marginBottom: '6px' }}>
              หัวข้อย่อย {subtopic.id}
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{subtopic.title}</h2>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div style={{
          overflowY: 'auto',
          padding: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
          flex: 1
        }}>
          
          {/* Progress Tracker inside Modal */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            background: 'rgba(0, 102, 204, 0.03)', // Soft light blue-gray
            border: '1px solid rgba(0, 102, 204, 0.08)',
            borderRadius: 'var(--radius-md)'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>สถานะเคสของหัวข้อนี้</span>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '2px', color: 'var(--text-primary)' }}>
                บันทึกแล้ว {subtopicLogs.length} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 400 }}>จากเป้าหมายขั้นต่ำ {subtopic.target} เคส</span>
              </h4>
            </div>
            {subtopicLogs.length >= subtopic.target ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--green)', fontWeight: 600, fontSize: '0.9rem' }}>
                <CheckCircle size={18} /> กรอกครบถ้วนตามเกณฑ์
              </div>
            ) : (
              <button 
                onClick={() => setShowAddForm(true)}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={14} /> เพิ่มบันทึกเคสใหม่
              </button>
            )}
          </div>

          {/* Form to Add New Entry */}
          {showAddForm && (
            <div className="glass-panel" style={{
              padding: '24px',
              background: 'rgba(0, 102, 204, 0.01)',
              borderColor: 'rgba(0, 180, 216, 0.25)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary)' }}>แบบฟอร์มเพิ่มข้อมูลการส่งงาน</h3>
                {subtopicLogs.length > 0 && (
                  <button 
                    onClick={() => setShowAddForm(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    ยกเลิก
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                  marginBottom: '20px'
                }}>
                  {fields.map(field => {
                    const gridSpan = field.type === 'textarea' ? 'span 2' : 'span 1';
                    
                    return (
                      <div key={field.name} style={{ gridColumn: gridSpan }}>
                        <label style={{ color: 'var(--text-secondary)' }}>
                          {field.label} {field.required && <span style={{ color: 'var(--red)' }}>*</span>}
                        </label>
                        
                        {field.type === 'textarea' ? (
                          <textarea
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleInputChange}
                            required={field.required}
                            placeholder={field.placeholder}
                            rows={3}
                            style={{ border: '1px solid rgba(0, 102, 204, 0.15)', background: '#ffffff', color: 'var(--text-primary)' }}
                          />
                        ) : field.type === 'select' ? (
                          <select
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleInputChange}
                            required={field.required}
                            style={{ border: '1px solid rgba(0, 102, 204, 0.15)', background: '#ffffff', color: 'var(--text-primary)' }}
                          >
                            {field.options.map(opt => (
                              <option key={opt.value} value={opt.value} style={{ background: '#ffffff', color: '#0f172a' }}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleInputChange}
                            required={field.required}
                            placeholder={field.placeholder}
                            style={{ border: '1px solid rgba(0, 102, 204, 0.15)', background: '#ffffff', color: 'var(--text-primary)' }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    style={{ padding: '10px 24px', fontSize: '0.85rem' }}
                  >
                    บันทึกรายการ
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List of Existing Entries */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>รายการที่บันทึกแล้วในระบบ ({subtopicLogs.length})</h3>
            
            {subtopicLogs.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: 'rgba(0, 102, 204, 0.01)',
                border: '1px dashed var(--border-light)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
                fontSize: '0.9rem'
              }}>
                ยังไม่มีข้อมูลที่บันทึกในหัวข้อนี้
              </div>
            ) : (
              <div style={{ overflowX: 'auto', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: 'left',
                  fontSize: '0.85rem'
                }}>
                  <thead>
                    <tr style={{ background: 'rgba(0, 102, 204, 0.04)', borderBottom: '1px solid var(--border-light)' }}>
                      <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>ลำดับ</th>
                      {fields.map(f => (
                        <th key={f.name} style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{f.label}</th>
                      ))}
                      <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-secondary)' }}>การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subtopicLogs.map((log, index) => (
                      <tr 
                        key={log.id} 
                        style={{ 
                          borderBottom: '1px solid var(--border-light)',
                          background: index % 2 === 0 ? 'transparent' : 'rgba(0, 102, 204, 0.01)'
                        }}
                      >
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{index + 1}</td>
                        {fields.map(f => {
                          const val = log.data?.[f.name] || '';
                          
                          // Display styling for special fields
                          let displayVal = val;
                          if (f.name === 'outcome' && (val.includes('triage') || val.includes('Triage'))) {
                            const isCorrect = val === 'Correct triage';
                            displayVal = (
                              <span style={{ 
                                color: isCorrect ? 'var(--green)' : 'var(--yellow)',
                                fontWeight: 600
                              }}>
                                {val}
                              </span>
                            );
                          }
                          
                          return (
                            <td key={f.name} style={{ padding: '14px 16px', color: '#1e293b', maxWidth: '220px', whiteSpace: 'pre-wrap' }}>
                              {displayVal}
                            </td>
                          );
                        })}
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleDelete(log.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: '6px',
                              borderRadius: '4px',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                              e.currentTarget.style.color = 'var(--red)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'none';
                              e.currentTarget.style.color = 'var(--text-muted)';
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogModal;
