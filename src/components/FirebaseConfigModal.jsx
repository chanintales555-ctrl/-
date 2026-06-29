import React, { useState } from 'react';
import { dbService } from '../firebase';
import { Database, X, RefreshCw, Check } from 'lucide-react';

const FirebaseConfigModal = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState(
    dbService.getFirebaseConfig() || {
      apiKey: "",
      authDomain: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: ""
    }
  );

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value.trim() }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      dbService.saveFirebaseConfig(config);
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1000);
    }, 800);
  };

  const handleClear = () => {
    dbService.saveFirebaseConfig(null);
    window.location.reload();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(5, 12, 22, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '520px',
        background: 'rgba(15, 27, 45, 0.95)',
        border: '1px solid var(--border-glow)',
        boxShadow: '0 0 30px rgba(0, 240, 255, 0.15)',
        padding: '30px',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <Database size={24} style={{ color: 'var(--accent)' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)' }}>ตั้งค่าการเชื่อมต่อ Firebase</h2>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
          หากคุณต้องการเก็บข้อมูลบันทึกจริงขึ้นฐานข้อมูลออนไลน์ สามารถคัดลอกค่า Config ของโปรเจกต์ Firebase Firestore มาใส่ที่นี่ได้เลยครับ ระบบจะทำการบันทึกข้อมูลเรียลไทม์ หากไม่ได้ใส่ ค่าเริ่มต้นจะเก็บบันทึกบนเครื่องของคุณ (LocalStorage)
        </p>

        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label>API Key</label>
              <input 
                type="text" 
                name="apiKey" 
                value={config.apiKey} 
                onChange={handleChange} 
                placeholder="AIzaSy..." 
              />
            </div>
            <div>
              <label>Project ID</label>
              <input 
                type="text" 
                name="projectId" 
                value={config.projectId} 
                onChange={handleChange} 
                placeholder="my-project-id" 
              />
            </div>
            <div>
              <label>Auth Domain</label>
              <input 
                type="text" 
                name="authDomain" 
                value={config.authDomain} 
                onChange={handleChange} 
                placeholder="project.firebaseapp.com" 
              />
            </div>
            <div>
              <label>Storage Bucket</label>
              <input 
                type="text" 
                name="storageBucket" 
                value={config.storageBucket} 
                onChange={handleChange} 
                placeholder="project.appspot.com" 
              />
            </div>
            <div>
              <label>App ID</label>
              <input 
                type="text" 
                name="appId" 
                value={config.appId} 
                onChange={handleChange} 
                placeholder="1:12345:web:abcd" 
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            {dbService.isFirebaseConnected() && (
              <button 
                type="button" 
                onClick={handleClear}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: 'var(--red)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                ตัดการเชื่อมต่อ Firebase
              </button>
            )}
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={saving || saveSuccess}
              style={{ minWidth: '120px' }}
            >
              {saving ? (
                <RefreshCw size={16} className="spin-animation" />
              ) : saveSuccess ? (
                <Check size={16} />
              ) : (
                "บันทึกค่าและเริ่มใหม่"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FirebaseConfigModal;
