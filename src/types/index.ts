export type CaseStatus = 'Active Priority 1' | 'In Review' | 'Closed' | 'Archived';

export interface Case {
  id: string;
  code: string; // e.g. DEMO-014
  title: string; // e.g. Child A
  alias: string;
  age: number;
  status: CaseStatus;
  openedDate: string;
  lastSeenLocation: string;
  lastSeenTime: string;
  lastSeenCoordinates: { x: number; y: number; lat: number; lng: number };
  clothingDescription: string;
  physicalDescription: string;
  clothingTags: string[];
  leadInvestigator: string;
  investigatorBadge: string;
  summary: string;
  avatarPlaceholderType: 'child_silhouette_a' | 'child_silhouette_b' | 'child_silhouette_c';
}

export type SightingSource = 'CCTV Upload' | 'Public Tip' | 'Partner Organization' | 'Transit Scanner';
export type SightingStatus = 'Unverified' | 'Corroborated' | 'AI Linked' | 'Dismissed' | 'Pending Review';

export interface Sighting {
  id: string;
  caseId: string;
  code: string; // e.g. RPT-201
  source: SightingSource;
  reportedTime: string;
  elapsedMinutes: number; // minutes after last seen
  locationName: string;
  coordinates: { x: number; y: number }; // Relative coordinates for schematic map (0-100%)
  description: string;
  clothingNotes: string;
  status: SightingStatus;
  confidenceScore: number; // 0 - 100
  sourceRef: string; // e.g. Cam-08 West Gate, Hotline #412
  evidenceSnippet?: string;
  investigatorNotes?: string;
  linkedSightingCodes?: string[];
}

export type AISuggestionStatus = 'Unverified' | 'Confirmed' | 'Dismissed' | 'Needs More Info';

export interface AISuggestion {
  id: string;
  caseId: string;
  primarySightingId: string;
  primaryCode: string;
  targetSightingId: string;
  targetCode: string;
  confidenceLabel: 'High Correlation' | 'Moderate Match' | 'Temporal Cluster';
  confidencePercentage: number;
  matchFactors: {
    factor: string;
    detail: string;
    matchLevel: 'high' | 'medium' | 'low';
  }[];
  explanation: string;
  sourceReferences: {
    title: string;
    id: string;
    timestamp: string;
    detail: string;
  }[];
  reviewStatus: AISuggestionStatus;
  decisionNote?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface ActivityLogItem {
  id: string;
  caseId: string;
  timestamp: string;
  actor: string;
  actorBadge: string;
  actionType: 'CONFIRM_LINK' | 'DISMISS_LINK' | 'REQUEST_INFO' | 'ADD_SIGHTING' | 'EDIT_CASE' | 'NOTE_ADDED' | 'CASE_CREATED';
  summary: string;
  details?: string;
  targetCode?: string;
}

export interface EvidenceSourceInfo {
  id: string;
  name: string;
  type: 'CCTV' | 'HOTLINE' | 'PARTNER' | 'TRANSIT';
  status: 'Operational' | 'Syncing' | 'Standby';
  latency: string;
  coverageArea: string;
  activeFeeds: number;
  lastIngestTime: string;
  authLevel: string;
}
