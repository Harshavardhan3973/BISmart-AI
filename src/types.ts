export type TabType = 'home' | 'chat' | 'standards' | 'how-it-works' | 'impact' | 'about';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isDemo?: boolean;
  error?: boolean;
  sources?: {
    standard?: string;
    scheme?: string;
    portal?: string;
  };
}

export interface LanguageOption {
  code: string;
  label: string;
  nativeName: string;
  flag: string;
}

export interface IndianStandard {
  id: string;
  code: string;
  title: string;
  category: 'Electronics' | 'Food & Water' | 'Textiles' | 'Toys' | 'Construction' | 'Chemicals' | 'Precious Metals' | 'Renewable Energy';
  mandatory: boolean;
  qcoNotification?: string;
  description: string;
  scope: string[];
  certificationSteps: string[];
  keyDocuments: string[];
  msmeBenefits: string;
  scheme: string;
}

export interface PipelineStep {
  id: number;
  title: string;
  subtitle: string;
  iconName: string;
  description: string;
  techDetails: string;
}

export interface UserAccount {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAdmin?: boolean;
}

export interface SiteContent {
  heroHeadline: string;
  heroSubheadline: string;
  heroBadge: string;
  impactHeading: string;
  impactSubheading: string;
  aboutMission: string;
  aboutProblem: string;
  aboutSolution: string;
  lastUpdated?: string;
  updatedBy?: string;
}
