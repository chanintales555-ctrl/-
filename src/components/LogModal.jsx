import React, { useState } from 'react';
import { getFieldsForType } from '../data/topics';
import { X, Trash2, Plus, CheckCircle, Edit3 } from 'lucide-react';
import SignaturePad from './SignaturePad';

const LogModal = ({ subtopic, logs, onSaveLog, onUpdateLog, onDeleteLog, onClose }) => {
  const subtopicLogs = logs.filter(log => log.subtopicId === subtopic.id);
  const fields = getFieldsForType(subtopic.type, subtopic.id);

  // Form State
  const initialFormState = fields.reduce((acc, field) => {
    acc[field.name] = field.type === 'select' ? (field.options[0]?.value || '') : '';
    return acc;
  }, {});
  initialFormState.supervisorSignature = ''; // Add signature holder to initial state

  const [formData, setFormData] = useState(initialFormState);
  const [editingLogId, setEditingLogId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Signature Pad State
  const [isSigPadOpen, setIsSigPadOpen] = useState(false);
  const [sigPadTargetLogId, setSigPadTargetLogId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStartEdit = (log) => {
    setEditingLogId(log.id);
    // Populate form with existing data
    const editData = {};
    fields.forEach(field => {
      editData[field.name] = log.data?.[field.name] || '';
    });
    editData.supervisorSignature = log.data?.supervisorSignature || '';
    setFormData(editData);
    setIsFormOpen(true); // Pop up the edit form modal
  };

  const handleCancelEdit = () => {
    setEditingLogId(null);
    setFormData(initialFormState);
    setIsFormOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // ตรวจสอบว่ามีการกรอกข้อมูลอย่างน้อย 1 ช่อง (ไม่ปล่อยว่างทั้งหมด) เพื่อให้สามารถบันทึกร่างคร่าวๆ ไว้ก่อนได้
    const hasAnyContent = Object.values(formData).some(val => val && String(val).trim() !== "");
    if (!hasAnyContent) {
      alert("กรุณากรอกข้อมูลอย่างน้อยหนึ่งช่องเพื่อบันทึกรายการครับ");
      return;
    }

    if (editingLogId) {
      onUpdateLog(editingLogId, formData);
      setEditingLogId(null);
    } else {
      onSaveLog({
        subtopicId: subtopic.id,
        topicId: subtopic.id.split('.')[0], // get main topic ID (e.g. "1" from "1.1")
        data: formData
      });
    }

    // Reset Form & Close Form Popup
    setFormData(initialFormState);
    setIsFormOpen(false);
  };

  const handleDelete = (logId) => {
    if (window.confirm("คุณต้องการลบบันทึกรายการนี้ใช่หรือไม่?")) {
      onDeleteLog(logId);
    }
  };

  // Save signature callback from SignaturePad
  const handleSaveSignature = (signatureDataUrl) => {
    if (sigPadTargetLogId) {
      // 1. Direct signature from the table row!
      const targetLog = logs.find(l => l.id === sigPadTargetLogId);
      if (targetLog) {
        const updatedData = {
          ...targetLog.data,
          supervisorSignature: signatureDataUrl
        };
        onUpdateLog(sigPadTargetLogId, updatedData);
      }
      setSigPadTargetLogId(null);
    } else {
      // 2. Signature within the new/edit form modal
      setFormData(prev => ({
        ...prev,
        supervisorSignature: signatureDataUrl
      }));
    }
    setIsSigPadOpen(false);
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
      {/* Main List Modal Panel */}
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '980px',
        height: '85vh',
        maxHeight: '90vh',
        background: '#ffffff', // Pure white background matching light theme
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0, 102, 204, 0.12)',
        overflow: 'hidden',
        position: 'relative'
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

        {/* Modal Scroll Content (List only) */}
        <div style={{
          overflowY: 'auto',
          padding: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {subtopicLogs.length >= subtopic.target && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--green)', fontWeight: 600, fontSize: '0.9rem' }}>
                  <CheckCircle size={18} /> กรอกครบถ้วนตามเกณฑ์
                </div>
              )}
              <button 
                onClick={() => {
                  setEditingLogId(null);
                  setFormData(initialFormState);
                  setIsFormOpen(true);
                }}
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={16} /> เพิ่มบันทึกเคสใหม่
              </button>
            </div>
          </div>

          {/* List of Existing Entries */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>รายการที่บันทึกแล้วในระบบ ({subtopicLogs.length})</h3>
            
            {subtopicLogs.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: 'rgba(0, 102, 204, 0.01)',
                border: '1px dashed var(--border-light)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
                fontSize: '0.95rem'
              }}>
                ยังไม่มีข้อมูลที่บันทึกในหัวข้อนี้ กดปุ่มสีฟ้าด้านบนเพื่อเพิ่มรายการแรกได้เลยครับ
              </div>
            ) : (
              <div style={{ overflowX: 'auto', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: 'left',
                  fontSize: '0.85rem'
                }}>
                  <thead>
                    <tr style={{ background: 'rgba(0, 102, 204, 0.04)', borderBottom: '1px solid var(--border-light)' }}>
                      <th style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontWeight: 600, width: '60px', textAlign: 'center' }}>ลำดับ</th>
                      {fields.map(f => (
                        <th key={f.name} style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>{f.label}</th>
                      ))}
                      <th style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--text-secondary)', width: '120px', fontWeight: 600 }}>การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subtopicLogs.map((log, index) => (
                      <tr 
                        key={log.id} 
                        style={{ 
                          borderBottom: '1px solid var(--border-light)',
                          background: index % 2 === 0 ? 'transparent' : 'rgba(0, 102, 204, 0.01)',
                          transition: 'background 0.2s'
                        }}
                        className="table-row-hover"
                      >
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center' }}>{index + 1}</td>
                        {fields.map(f => {
                          const val = log.data?.[f.name] || '';
                          
                          // Handle supervisorName column specially to show signature status
                          if (f.name === 'supervisorName') {
                            const hasSig = !!log.data?.supervisorSignature;
                            return (
                              <td key={f.name} style={{ padding: '14px 16px', color: '#1e293b', maxWidth: '240px' }}>
                                <div style={{ fontWeight: 600 }}>{val || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>-</span>}</div>
                                {val && (
                                  <div style={{ marginTop: '6px' }}>
                                    {hasSig ? (
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--green)', fontSize: '0.75rem', fontWeight: 600 }}>
                                          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)' }}></span>
                                          เซ็นแล้ว
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                          <div style={{ 
                                            height: '32px', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            background: 'rgba(255,255,255,0.85)', 
                                            border: '1px solid rgba(0, 102, 204, 0.1)', 
                                            borderRadius: '4px', 
                                            padding: '2px 4px', 
                                            width: 'fit-content' 
                                          }}>
                                            <img src={log.data.supervisorSignature} alt="signature" style={{ height: '26px', display: 'block' }} />
                                          </div>
                                          
                                          <button
                                            onClick={() => {
                                              if (window.confirm("คุณต้องการลบลายเซ็นคุมเคสของอาจารย์ในเคสนี้ใช่หรือไม่?")) {
                                                const targetLog = logs.find(l => l.id === log.id);
                                                if (targetLog) {
                                                  onUpdateLog(log.id, {
                                                    ...targetLog.data,
                                                    supervisorSignature: ''
                                                  });
                                                }
                                              }
                                            }}
                                            style={{
                                              background: 'none',
                                              border: 'none',
                                              color: 'var(--text-muted)',
                                              cursor: 'pointer',
                                              padding: '4px',
                                              borderRadius: '4px',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                                              e.currentTarget.style.color = 'var(--red)';
                                            }}
                                            onMouseLeave={(e) => {
                                              e.currentTarget.style.background = 'none';
                                              e.currentTarget.style.color = 'var(--text-muted)';
                                            }}
                                            title="ลบลายเซ็นเคสนี้"
                                          >
                                            <Trash2 size={13} />
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          setSigPadTargetLogId(log.id);
                                          setIsSigPadOpen(true);
                                        }}
                                        style={{
                                          background: 'rgba(239, 68, 68, 0.04)',
                                          border: '1px dashed rgba(239, 68, 68, 0.3)',
                                          color: 'var(--red)',
                                          padding: '4px 8px',
                                          borderRadius: '4px',
                                          cursor: 'pointer',
                                          fontSize: '0.7rem',
                                          fontWeight: 600,
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                                          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.04)';
                                          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                        }}
                                        title="ลงลายเซ็นสำหรับเคสนี้"
                                      >
                                        ✍️ ยังไม่เซ็น (คลิกเพื่อเซ็น)
                                      </button>
                                    )}
                                  </div>
                                )}
                              </td>
                            );
                          }

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
                            <td key={f.name} style={{ padding: '14px 16px', color: '#1e293b', maxWidth: '240px', whiteSpace: 'pre-wrap' }}>
                              {displayVal || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>-</span>}
                            </td>
                          );
                        })}
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              onClick={() => handleStartEdit(log)}
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
                                e.currentTarget.style.background = 'rgba(0, 102, 204, 0.08)';
                                e.currentTarget.style.color = 'var(--primary)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'none';
                                e.currentTarget.style.color = 'var(--text-muted)';
                              }}
                              title="แก้ไขรายการ"
                            >
                              <Edit3 size={16} />
                            </button>
                            
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
                              title="ลบรายการ"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
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

      {/* Nested Form Modal Popup (Centered overlay for adding/editing data) */}
      {isFormOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.4)', // Translucent overlay
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200, // Higher than list panel
          padding: '20px',
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '650px', // Focused form card width
            maxHeight: '90vh',
            background: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 25px 60px rgba(0, 102, 204, 0.18)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {/* Form Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 24px',
              borderBottom: '1px solid rgba(0, 102, 204, 0.08)',
              background: editingLogId ? 'rgba(2, 132, 199, 0.02)' : 'rgba(0, 102, 204, 0.02)'
            }}>
              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: 700, 
                color: editingLogId ? '#0284c7' : 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {editingLogId ? '✍️ แบบประเมิน / แก้ไขข้อมูลการบันทึก' : '📝 แบบบันทึกเคสการดูแลผู้ป่วยใหม่'}
              </h3>
              <button 
                type="button" 
                onClick={handleCancelEdit}
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
                <X size={18} />
              </button>
            </div>

            {/* Form Modal Body */}
            <div style={{ overflowY: 'auto', padding: '24px' }}>
              <form onSubmit={handleSubmit}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  marginBottom: '24px'
                }}>
                  {fields.map(field => {
                    return (
                      <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>
                          {field.label} {field.required && <span style={{ color: 'var(--red)' }}>*</span>}
                        </label>
                        
                        {field.type === 'textarea' ? (
                          <textarea
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleInputChange}
                            placeholder={field.placeholder}
                            rows={4}
                            style={{ 
                              border: '1px solid rgba(0, 102, 204, 0.15)', 
                              background: '#ffffff', 
                              color: 'var(--text-primary)',
                              fontSize: '0.85rem',
                              borderRadius: 'var(--radius-sm)',
                              padding: '10px 12px',
                              width: '100%',
                              fontFamily: 'inherit'
                            }}
                          />
                        ) : field.type === 'select' ? (
                          <select
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleInputChange}
                            style={{ 
                              border: '1px solid rgba(0, 102, 204, 0.15)', 
                              background: '#ffffff', 
                              color: 'var(--text-primary)',
                              fontSize: '0.85rem',
                              borderRadius: 'var(--radius-sm)',
                              padding: '10px 12px',
                              width: '100%',
                              fontFamily: 'inherit'
                            }}
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
                            placeholder={field.placeholder}
                            style={{ 
                              border: '1px solid rgba(0, 102, 204, 0.15)', 
                              background: '#ffffff', 
                              color: 'var(--text-primary)',
                              fontSize: '0.85rem',
                              borderRadius: 'var(--radius-sm)',
                              padding: '10px 12px',
                              width: '100%',
                              fontFamily: 'inherit'
                            }}
                          />
                        )}

                        {/* If this is the supervisorName field, show signature pad trigger below it */}
                        {field.name === 'supervisorName' && (
                          <div style={{ 
                            marginTop: '8px', 
                            padding: '12px', 
                            background: 'rgba(0,102,204,0.02)', 
                            border: '1px dashed rgba(0,102,204,0.12)', 
                            borderRadius: 'var(--radius-sm)' 
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ลายเซ็นดิจิทัลผู้ประเมิน:</span>
                              {formData.supervisorSignature ? (
                                <span style={{ fontSize: '0.75rem', color: 'var(--green)', fontWeight: 600 }}>✓ ลงชื่อแล้ว</span>
                              ) : (
                                <span style={{ fontSize: '0.75rem', color: 'var(--red)', fontWeight: 600 }}>ยังไม่ได้เซ็น</span>
                              )}
                            </div>
                            
                            {formData.supervisorSignature ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                                <div style={{ 
                                  background: '#ffffff', 
                                  border: '1px solid var(--border-light)', 
                                  borderRadius: '4px', 
                                  padding: '4px', 
                                  height: '42px', 
                                  display: 'flex', 
                                  alignItems: 'center' 
                                }}>
                                  <img src={formData.supervisorSignature} alt="Signature Preview" style={{ height: '34px', display: 'block' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSigPadTargetLogId(null);
                                      setIsSigPadOpen(true);
                                    }}
                                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                                  >
                                    เขียนใหม่
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFormData(prev => ({ ...prev, supervisorSignature: '' }));
                                    }}
                                    style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                                  >
                                    ลบลายเซ็น
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setSigPadTargetLogId(null);
                                  setIsSigPadOpen(true);
                                }}
                                className="btn-secondary"
                                style={{
                                  marginTop: '8px',
                                  width: '100%',
                                  padding: '8px 12px',
                                  fontSize: '0.8rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '6px',
                                  background: '#ffffff',
                                  border: '1px solid rgba(0, 102, 204, 0.25)',
                                  color: 'var(--primary)'
                                }}
                              >
                                ✍️ ลงลายเซ็นดิจิทัลคุมเคสนี้
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  justifyContent: 'flex-end', 
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(0, 102, 204, 0.08)' 
                }}>
                  <button 
                    type="button" 
                    onClick={handleCancelEdit}
                    className="btn-secondary"
                    style={{ padding: '10px 20px', fontSize: '0.85rem', background: '#f8fafc', border: '1px solid var(--border-light)' }}
                  >
                    ยกเลิก / ปิด
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    style={{ 
                      padding: '10px 24px', 
                      fontSize: '0.85rem',
                      background: editingLogId ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'var(--primary)'
                    }}
                  >
                    {editingLogId ? 'บันทึกการแก้ไข' : 'บันทึกเคสใหม่'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Signature Capture Modal overlay */}
      <SignaturePad
        isOpen={isSigPadOpen}
        onClose={() => {
          setIsSigPadOpen(false);
          setSigPadTargetLogId(null);
        }}
        onSave={handleSaveSignature}
        title={sigPadTargetLogId ? "✍️ ลงลายเซ็นสำหรับเคสที่เลือก" : "✍️ ลงลายเซ็นผู้นิเทศคุมฝึกปฏิบัติ"}
      />
    </div>
  );
};

export default LogModal;
