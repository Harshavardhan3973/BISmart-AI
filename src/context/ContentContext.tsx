import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { IndianStandard, SiteContent } from '../types';
import { INDIAN_STANDARDS_DATA } from '../data/standardsData';
import { useAuth } from './AuthContext';

interface ContentContextType {
  siteContent: SiteContent;
  standards: IndianStandard[];
  loading: boolean;
  saveSiteContent: (newContent: Partial<SiteContent>) => Promise<void>;
  saveStandard: (standard: IndianStandard) => Promise<void>;
  deleteStandard: (id: string) => Promise<void>;
  statusMessage: string | null;
  clearStatusMessage: () => void;
}

const DEFAULT_SITE_CONTENT: SiteContent = {
  heroHeadline: "One Assistant. Every BIS Need.",
  heroSubheadline: "Instant, source-verified answers on Indian Standards, ISI mark certification, Hallmarking, CRS schemes, and conformity assessment — powered by conversational AI grounded in official BIS gazetted documentation.",
  heroBadge: "Smart India Hackathon 2026 • Problem Statement 26107 • Team BISync",
  impactHeading: "Impact & Benefits",
  impactSubheading: "How BISmart AI bridges the gap between regulatory mandates and on-the-ground compliance for every stakeholder in India's quality ecosystem.",
  aboutMission: '"Empowering Indian enterprises, MSMEs, students, and citizens with an intelligent, accessible, and source-grounded assistant that transforms complex Bureau of Indian Standards documentation into immediate actionable clarity."',
  aboutProblem: "Bureau of Indian Standards publishes tens of thousands of Indian Standards and operates diverse certification schemes (ISI Mark, CRS, Hallmarking, LRS). MSMEs, startups, and everyday citizens face high friction navigating dense gazette PDFs, scattered portals, and evolving Quality Control Orders (QCOs), leading to unintended delays and steep consulting overhead.",
  aboutSolution: "BISmart AI integrates a Retrieval-Augmented Generation (RAG) pipeline with Gemini 3.8 Flash to synthesize natural language responses strictly grounded in gazetted IS documents. Every response supplies an audit trail of applicable standards, conformity schemes, and official Manakonline application links.",
  lastUpdated: undefined,
  updatedBy: undefined,
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [standards, setStandards] = useState<IndianStandard[]>(INDIAN_STANDARDS_DATA);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const { user, isAdmin } = useAuth();

  const showNotification = useCallback((msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  }, []);

  // 1. Subscribe to Site Content updates in Firestore
  useEffect(() => {
    const contentRef = doc(db, 'site_content', 'main_config');

    // Attempt to load initial doc
    getDoc(contentRef).then((snap) => {
      if (snap.exists()) {
        setSiteContent({ ...DEFAULT_SITE_CONTENT, ...snap.data() } as SiteContent);
      }
    }).catch((err) => {
      console.warn('Initial site content read notice:', err);
    });

    const unsubscribe = onSnapshot(contentRef, (docSnap) => {
      if (docSnap.exists()) {
        setSiteContent({ ...DEFAULT_SITE_CONTENT, ...docSnap.data() } as SiteContent);
      }
    }, (err) => {
      console.warn('Site content snapshot notice:', err);
    });

    return () => unsubscribe();
  }, []);

  // 2. Subscribe to Standards updates in Firestore
  useEffect(() => {
    const standardsColRef = collection(db, 'standards');

    const unsubscribe = onSnapshot(standardsColRef, (snapshot) => {
      if (!snapshot.empty) {
        const firestoreStandards: IndianStandard[] = [];
        snapshot.forEach((d) => {
          firestoreStandards.push(d.data() as IndianStandard);
        });

        // Merge firestore standards with defaults (overriding matching IDs)
        const mergedMap = new Map<string, IndianStandard>();
        INDIAN_STANDARDS_DATA.forEach((s) => mergedMap.set(s.id, s));
        firestoreStandards.forEach((s) => mergedMap.set(s.id, s));

        setStandards(Array.from(mergedMap.values()));
      }
      setLoading(false);
    }, (err) => {
      console.warn('Standards snapshot notice:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Admin action: Save Site Content
  const saveSiteContent = async (newContent: Partial<SiteContent>) => {
    if (!isAdmin) {
      showNotification('Unauthorized: Only administrators can modify site content.');
      return;
    }

    const updated: SiteContent = {
      ...siteContent,
      ...newContent,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric', year: 'numeric' }),
      updatedBy: user?.email || 'Admin',
    };

    try {
      const contentRef = doc(db, 'site_content', 'main_config');
      await setDoc(contentRef, updated, { merge: true });
      setSiteContent(updated);
      showNotification('Site content published successfully to Firestore.');
    } catch (err: any) {
      console.error('Error saving site content to Firestore:', err);
      showNotification(`Failed to save changes: ${err?.message || 'Permission denied'}`);
      throw err;
    }
  };

  // Admin action: Save / Add / Edit Standard
  const saveStandard = async (standard: IndianStandard) => {
    if (!isAdmin) {
      showNotification('Unauthorized: Only administrators can edit standards.');
      return;
    }

    try {
      const stdRef = doc(db, 'standards', standard.id);
      await setDoc(stdRef, standard, { merge: true });

      // Optimistic local update
      setStandards((prev) => {
        const exists = prev.some((s) => s.id === standard.id);
        if (exists) {
          return prev.map((s) => (s.id === standard.id ? standard : s));
        }
        return [standard, ...prev];
      });

      showNotification(`Standard ${standard.code} saved and published live.`);
    } catch (err: any) {
      console.error('Error saving standard:', err);
      showNotification(`Failed to save standard: ${err?.message || 'Error'}`);
      throw err;
    }
  };

  // Admin action: Delete Standard
  const deleteStandard = async (id: string) => {
    if (!isAdmin) {
      showNotification('Unauthorized: Only administrators can delete standards.');
      return;
    }

    try {
      const stdRef = doc(db, 'standards', id);
      await deleteDoc(stdRef);

      setStandards((prev) => prev.filter((s) => s.id !== id));
      showNotification('Standard removed successfully.');
    } catch (err: any) {
      console.error('Error deleting standard:', err);
      showNotification(`Failed to delete standard: ${err?.message || 'Error'}`);
      throw err;
    }
  };

  return (
    <ContentContext.Provider
      value={{
        siteContent,
        standards,
        loading,
        saveSiteContent,
        saveStandard,
        deleteStandard,
        statusMessage,
        clearStatusMessage: () => setStatusMessage(null)
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
