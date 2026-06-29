import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';

// Default mock configuration or read from local storage / environment variables
const getFirebaseConfig = () => {
  const localConfig = localStorage.getItem('firebase_config');
  if (localConfig) {
    try {
      return JSON.parse(localConfig);
    } catch (e) {
      console.error("Failed to parse firebase config", e);
    }
  }
  
  // Environment variables fallback
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
  };
};

let db = null;
let useFirebase = false;

const config = getFirebaseConfig();
if (config.apiKey && config.projectId) {
  try {
    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    db = getFirestore(app);
    useFirebase = true;
    console.log("Firebase initialized successfully!");
  } catch (error) {
    console.error("Firebase initialization failed, falling back to LocalStorage:", error);
  }
}

// LocalStorage Mock DB implementation
const mockDb = {
  getLogs: async (userId) => {
    const allLogs = JSON.parse(localStorage.getItem('enp_logs') || '[]');
    return allLogs.filter(log => log.userId === userId);
  },
  
  saveLog: async (logData) => {
    const allLogs = JSON.parse(localStorage.getItem('enp_logs') || '[]');
    const newLog = {
      ...logData,
      id: logData.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: logData.timestamp || new Date().toISOString()
    };
    allLogs.push(newLog);
    localStorage.setItem('enp_logs', JSON.stringify(allLogs));
    return newLog;
  },
  
  updateLog: async (logId, updatedFields) => {
    let allLogs = JSON.parse(localStorage.getItem('enp_logs') || '[]');
    let updatedLog = null;
    allLogs = allLogs.map(log => {
      if (log.id === logId) {
        updatedLog = { ...log, ...updatedFields };
        return updatedLog;
      }
      return log;
    });
    localStorage.setItem('enp_logs', JSON.stringify(allLogs));
    return updatedLog;
  },
  
  deleteLog: async (logId) => {
    let allLogs = JSON.parse(localStorage.getItem('enp_logs') || '[]');
    allLogs = allLogs.filter(log => log.id !== logId);
    localStorage.setItem('enp_logs', JSON.stringify(allLogs));
    return true;
  },

  saveUserProfile: async (userProfile) => {
    const profiles = JSON.parse(localStorage.getItem('enp_user_profiles') || '{}');
    profiles[userProfile.id] = {
      id: userProfile.id,
      fullName: userProfile.fullName,
      position: userProfile.position,
      venue1: userProfile.venue1,
      venue2: userProfile.venue2,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('enp_user_profiles', JSON.stringify(profiles));
    return profiles[userProfile.id];
  },

  getUserProfile: async (userId) => {
    const profiles = JSON.parse(localStorage.getItem('enp_user_profiles') || '{}');
    return profiles[userId] || null;
  }
};

// Unified Database API
export const dbService = {
  isFirebaseConnected: () => useFirebase,
  
  getFirebaseConfig: () => getFirebaseConfig(),
  
  saveFirebaseConfig: (newConfig) => {
    if (!newConfig || !newConfig.apiKey) {
      localStorage.removeItem('firebase_config');
    } else {
      localStorage.setItem('firebase_config', JSON.stringify(newConfig));
    }
    window.location.reload();
  },
  
  getLogs: async (userId) => {
    if (useFirebase && db) {
      try {
        const q = query(collection(db, "logs"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const logs = [];
        querySnapshot.forEach((docSnap) => {
          logs.push({ id: docSnap.id, ...docSnap.data() });
        });
        return logs;
      } catch (error) {
        console.error("Firebase getLogs failed, falling back to LocalStorage:", error);
        return mockDb.getLogs(userId);
      }
    } else {
      return mockDb.getLogs(userId);
    }
  },
  
  saveLog: async (logData) => {
    if (useFirebase && db) {
      try {
        const docRef = await addDoc(collection(db, "logs"), {
          ...logData,
          timestamp: new Date().toISOString()
        });
        return { id: docRef.id, ...logData };
      } catch (error) {
        console.error("Firebase saveLog failed, falling back to LocalStorage:", error);
        return mockDb.saveLog(logData);
      }
    } else {
      return mockDb.saveLog(logData);
    }
  },
  
  updateLog: async (logId, updatedFields) => {
    if (String(logId).startsWith('local_') || !useFirebase || !db) {
      return mockDb.updateLog(logId, updatedFields);
    }
    try {
      const docRef = doc(db, "logs", logId);
      await updateDoc(docRef, updatedFields);
      return { id: logId, ...updatedFields };
    } catch (error) {
      console.error("Firebase updateLog failed, falling back to LocalStorage:", error);
      return mockDb.updateLog(logId, updatedFields);
    }
  },
  
  deleteLog: async (logId) => {
    if (String(logId).startsWith('local_') || !useFirebase || !db) {
      return mockDb.deleteLog(logId);
    }
    try {
      const docRef = doc(db, "logs", logId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Firebase deleteLog failed, falling back to LocalStorage:", error);
      return mockDb.deleteLog(logId);
    }
  },

  saveUserProfile: async (userProfile) => {
    if (useFirebase && db) {
      try {
        const docRef = doc(db, "users", String(userProfile.id));
        await setDoc(docRef, {
          id: userProfile.id,
          fullName: userProfile.fullName,
          position: userProfile.position,
          venue1: userProfile.venue1,
          venue2: userProfile.venue2,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        console.log("User profile saved online!");
      } catch (error) {
        console.error("Firebase saveUserProfile failed, falling back to LocalStorage:", error);
        await mockDb.saveUserProfile(userProfile);
      }
    } else {
      await mockDb.saveUserProfile(userProfile);
    }
  },

  getUserProfile: async (userId) => {
    if (useFirebase && db) {
      try {
        const docRef = doc(db, "users", String(userId));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data();
        }
        return null;
      } catch (error) {
        console.error("Firebase getUserProfile failed, falling back to LocalStorage:", error);
        return mockDb.getUserProfile(userId);
      }
    } else {
      return mockDb.getUserProfile(userId);
    }
  }
};
