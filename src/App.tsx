import React, { useState } from 'react';
import { 
  Case, 
  Sighting, 
  AISuggestion, 
  ActivityLogItem, 
  EvidenceSourceInfo, 
  AISuggestionStatus 
} from './types';
import { 
  INITIAL_CASES, 
  INITIAL_SIGHTINGS, 
  INITIAL_AI_SUGGESTIONS, 
  INITIAL_ACTIVITY_LOG, 
  EVIDENCE_SOURCES 
} from './data/mockData';
import { LandingPage } from './components/LandingPage';
import { Navbar, WorkspaceTab } from './components/Navbar';
import { CaseDetailsHeader } from './components/CaseDetailsHeader';
import { SchematicMap } from './components/SchematicMap';
import { SightingTimeline } from './components/SightingTimeline';
import { SightingDetailDrawer } from './components/SightingDetailDrawer';
import { AISuggestionsReview } from './components/AISuggestionsReview';
import { SightingTable } from './components/SightingTable';
import { ActivityLogView } from './components/ActivityLogView';
import { EvidenceSourcesView } from './components/EvidenceSourcesView';
import { CaseListView } from './components/CaseListView';
import { SettingsView } from './components/SettingsView';
import { AddSightingModal } from './components/AddSightingModal';
import { NewCaseModal } from './components/NewCaseModal';
import { EditCaseModal } from './components/EditCaseModal';
import { Toast, ToastMessage } from './components/Toast';
import { 
  Compass, 
  Sparkles, 
  Table2, 
  History, 
  ShieldAlert, 
  Lock,
  Layers,
  AlertTriangle,
  FolderSearch
} from 'lucide-react';

type CaseSubView = 'matrix' | 'suggestions' | 'table' | 'activity';

export const App: React.FC = () => {
  // Navigation State: defaults to workspace so seeded cases are immediately visible
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'workspace'>('workspace');
  const [currentTab, setCurrentTab] = useState<WorkspaceTab>('active-case');
  const [caseSubView, setCaseSubView] = useState<CaseSubView>('matrix');

  // Core Data State: seeded Delhi casework
  const [cases, setCases] = useState<Case[]>(INITIAL_CASES);
  const [activeCaseId, setActiveCaseId] = useState<string>('case-del-014');
  const [sightings, setSightings] = useState<Sighting[]>(INITIAL_SIGHTINGS);
  const [selectedSightingId, setSelectedSightingId] = useState<string | null>('sight-del-201');
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>(INITIAL_AI_SUGGESTIONS);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(INITIAL_ACTIVITY_LOG);
  const [evidenceSources] = useState<EvidenceSourceInfo[]>(EVIDENCE_SOURCES);

  // Modals & Notifications
  const [isAddSightingModalOpen, setIsAddSightingModalOpen] = useState(false);
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [isEditCaseModalOpen, setIsEditCaseModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Computed Active Case & Records
  const activeCase = cases.find((c) => c.id === activeCaseId) || cases[0];
  const activeSightings = sightings.filter((s) => s.caseId === activeCase.id);
  const activeSuggestions = aiSuggestions.filter((s) => s.caseId === activeCase.id);
  const activeLogs = activityLogs.filter((l) => l.caseId === activeCase.id);
  const selectedSighting = activeSightings.find((s) => s.id === selectedSightingId) || activeSightings[0] || null;

  // Case Selection Switcher
  const handleSelectCase = (caseId: string) => {
    setActiveCaseId(caseId);
    const caseSightings = sightings.filter((s) => s.caseId === caseId);
    if (caseSightings.length > 0) {
      setSelectedSightingId(caseSightings[0].id);
    } else {
      setSelectedSightingId(null);
    }
    setCurrentTab('active-case');
    setCaseSubView('matrix');
  };

  // Helper: Toast Notifications
  const addToast = (type: 'success' | 'info' | 'warning', message: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Log Activity Helper
  const logActivity = (
    actionType: ActivityLogItem['actionType'],
    summary: string,
    details?: string,
    targetCode?: string
  ) => {
    const newLog: ActivityLogItem = {
      id: `act-${Date.now()}`,
      caseId: activeCase.id,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST',
      actor: 'Det. Sarah Vance',
      actorBadge: 'INV-DEL-4082',
      actionType,
      summary,
      details,
      targetCode,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Sighting Status Change Handler
  const handleUpdateSightingStatus = (
    sightingId: string, 
    newStatus: Sighting['status'], 
    note?: string
  ) => {
    setSightings((prev) =>
      prev.map((s) => (s.id === sightingId ? { ...s, status: newStatus } : s))
    );

    const target = sightings.find((s) => s.id === sightingId);
    const code = target?.code || 'Sighting';

    logActivity(
      newStatus === 'Corroborated' ? 'CONFIRM_LINK' : 'DISMISS_LINK',
      `Investigator updated ${code} status to: ${newStatus}`,
      note || `Manual status revision applied in detail inspection drawer.`,
      code
    );

    addToast('success', `${code} status updated to ${newStatus}`);
  };

  // Sighting Notes Save Handler
  const handleSaveSightingNotes = (sightingId: string, notes: string) => {
    setSightings((prev) =>
      prev.map((s) => (s.id === sightingId ? { ...s, investigatorNotes: notes } : s))
    );

    const target = sightings.find((s) => s.id === sightingId);
    const code = target?.code || 'Sighting';

    logActivity(
      'NOTE_ADDED',
      `Investigator assessment notes recorded for ${code}`,
      `"${notes.substring(0, 100)}${notes.length > 100 ? '...' : ''}"`,
      code
    );

    addToast('info', `Notes recorded in audit log for ${code}`);
  };

  // AI Suggestion Decision Handler
  const handleAISuggestionDecision = (
    suggestionId: string,
    status: AISuggestionStatus,
    decisionNote?: string
  ) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST';

    setAiSuggestions((prev) =>
      prev.map((sugg) => {
        if (sugg.id === suggestionId) {
          return {
            ...sugg,
            reviewStatus: status,
            reviewedBy: 'Det. Sarah Vance (INV-DEL-4082)',
            reviewedAt: timestamp,
            decisionNote: decisionNote || `Decision: ${status}`,
          };
        }
        return sugg;
      })
    );

    const targetSugg = aiSuggestions.find((s) => s.id === suggestionId);
    if (!targetSugg) return;

    // If confirmed, corroborate the target sighting on the timeline & trajectory
    if (status === 'Confirmed') {
      setSightings((prev) =>
        prev.map((s) => {
          if (s.id === targetSugg.targetSightingId) {
            return {
              ...s,
              status: 'Corroborated',
              linkedSightingCodes: Array.from(
                new Set([...(s.linkedSightingCodes || []), targetSugg.primaryCode])
              ),
            };
          }
          if (s.id === targetSugg.primarySightingId) {
            return {
              ...s,
              linkedSightingCodes: Array.from(
                new Set([...(s.linkedSightingCodes || []), targetSugg.targetCode])
              ),
            };
          }
          return s;
        })
      );
    } else if (status === 'Dismissed') {
      setSightings((prev) =>
        prev.map((s) => {
          if (s.id === targetSugg.targetSightingId && s.status === 'AI Linked') {
            return { ...s, status: 'Dismissed' };
          }
          return s;
        })
      );
    }

    logActivity(
      status === 'Confirmed' ? 'CONFIRM_LINK' : status === 'Dismissed' ? 'DISMISS_LINK' : 'REQUEST_INFO',
      `Investigator review decision on AI Suggestion (${targetSugg.primaryCode} → ${targetSugg.targetCode}): ${status.toUpperCase()}`,
      decisionNote || `Evaluated by lead investigator Det. Vance.`,
      `${targetSugg.primaryCode}→${targetSugg.targetCode}`
    );

    addToast(
      status === 'Confirmed' ? 'success' : status === 'Dismissed' ? 'info' : 'warning',
      `AI link between ${targetSugg.primaryCode} and ${targetSugg.targetCode} marked as ${status}.`
    );
  };

  // Add Sighting Handler
  const handleAddSighting = (newSightingData: Omit<Sighting, 'id'>) => {
    const newId = `sight-${Date.now()}`;
    const newSighting: Sighting = {
      ...newSightingData,
      id: newId,
    };

    setSightings((prev) => [newSighting, ...prev]);
    setSelectedSightingId(newId);

    logActivity(
      'ADD_SIGHTING',
      `New sighting ${newSighting.code} ingested from ${newSighting.source}`,
      `Reported at ${newSighting.locationName} (${newSighting.reportedTime}). Attire: ${newSighting.clothingNotes}`,
      newSighting.code
    );

    addToast('success', `Sighting ${newSighting.code} added to case timeline and map.`);
  };

  // Create Case Handler
  const handleCreateCase = (newCase: Case) => {
    setCases((prev) => [newCase, ...prev]);
    setActiveCaseId(newCase.id);
    setSelectedSightingId(null);
    setCurrentTab('active-case');

    logActivity(
      'ADD_SIGHTING',
      `New case file ${newCase.code} opened for ${newCase.title}`,
      `Last known location: ${newCase.lastSeenLocation}. Lead investigator: ${newCase.leadInvestigator}.`
    );

    addToast('success', `Case ${newCase.code} (${newCase.title}) created.`);
  };

  // Save Case Details Handler
  const handleSaveCase = (updatedCase: Case) => {
    setCases((prev) =>
      prev.map((c) => (c.id === updatedCase.id ? updatedCase : c))
    );

    logActivity(
      'EDIT_CASE',
      `Case specifications updated for ${updatedCase.code}`,
      `Updated attire specs, physical profile, and last known coordinates.`
    );

    addToast('info', `Case specifications for ${updatedCase.code} saved.`);
  };

  // Reset to Demo Data
  const handleResetDemoData = () => {
    setCases(INITIAL_CASES);
    setActiveCaseId('case-del-014');
    setSightings(INITIAL_SIGHTINGS);
    setSelectedSightingId('sight-del-201');
    setAiSuggestions(INITIAL_AI_SUGGESTIONS);
    setActivityLogs(INITIAL_ACTIVITY_LOG);
    setCurrentTab('active-case');
    setCaseSubView('matrix');
    addToast('info', 'Prototype restored to default Delhi demonstration casework.');
  };

  // Quick select sighting by code (e.g. from AI link button)
  const handleSelectSightingByCode = (code: string) => {
    const found = sightings.find((s) => s.code === code);
    if (found) {
      setSelectedSightingId(found.id);
      setCaseSubView('matrix');
      addToast('info', `Focused on Sighting ${code}`);
    }
  };

  // Select demo case from landing page
  const handleOpenDemoCase = (caseId: string) => {
    handleSelectCase(caseId);
    setCurrentScreen('workspace');
    setCurrentTab('active-case');
    setCaseSubView('matrix');
  };

  // If on landing screen, show high-impact landing page
  if (currentScreen === 'landing') {
    return (
      <LandingPage
        onOpenWorkspace={() => {
          setCurrentScreen('workspace');
          setCurrentTab('active-case');
        }}
        onOpenDemoCase={handleOpenDemoCase}
      />
    );
  }

  return (
    <div className="workspace-shell">
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Workspace Sticky Header Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onReturnToLanding={() => setCurrentScreen('landing')}
        onOpenNewCaseModal={() => setIsNewCaseModalOpen(true)}
        activeCaseCount={cases.length}
        activeCaseCode={activeCase.code}
        totalSightingsCount={sightings.length}
      />

      {/* Visible Demonstration Notice */}
      <div 
        style={{
          background: '#FFFBEB',
          borderBottom: '1px solid #FDE68A',
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '12px',
          color: '#92400E',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={15} color="#D97706" style={{ flexShrink: 0 }} />
          <span>
            <strong>DEMO DATA & SIMULATED CASEWORK:</strong> All case files, names (e.g. Mira Sharma, Kabir Mehta, Zoya Kapoor), Delhi neighbourhood references, and sighting timelines are entirely fictional for demonstration. No real missing-person information, exact coordinates, or live CCTV feeds are used.
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: '11px', 
            background: '#FEF3C7', 
            color: '#B45309', 
            padding: '2px 8px', 
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #FCD34D',
            fontWeight: 700
          }}>
            7 SEEDED DELHI CASES
          </span>
        </div>
      </div>

      {/* Tab: Master Case Roster */}
      {currentTab === 'cases' && (
        <main className="workspace-content">
          <CaseListView
            cases={cases}
            activeCaseId={activeCaseId}
            onSelectCase={handleSelectCase}
            onOpenNewCaseModal={() => setIsNewCaseModalOpen(true)}
          />
        </main>
      )}

      {/* Tab: Active Case Investigation Workspace */}
      {currentTab === 'active-case' && (
        <>
          {/* Active Case Banner Header */}
          <CaseDetailsHeader
            activeCase={activeCase}
            casesList={cases}
            onSelectCase={handleSelectCase}
            onOpenAddSightingModal={() => setIsAddSightingModalOpen(true)}
            onOpenEditCaseModal={() => setIsEditCaseModalOpen(true)}
            onOpenCaseRoster={() => setCurrentTab('cases')}
          />

          <main className="workspace-content">
            {/* View Sub-navigation Bar */}
            <div className="subnav-bar">
              <div className="view-selector-tabs">
                <button
                  id="tab-view-matrix"
                  className={`view-tab ${caseSubView === 'matrix' ? 'active' : ''}`}
                  onClick={() => setCaseSubView('matrix')}
                >
                  <Compass size={15} />
                  <span>Tactical Matrix</span>
                </button>

                <button
                  id="tab-view-suggestions"
                  className={`view-tab ${caseSubView === 'suggestions' ? 'active' : ''}`}
                  onClick={() => setCaseSubView('suggestions')}
                >
                  <Sparkles size={15} color="var(--accent-orange)" />
                  <span>AI Suggestions</span>
                  <span className="badge-counter" style={{ background: 'var(--accent-yellow)', color: '#121316' }}>
                    {activeSuggestions.filter((s) => s.reviewStatus === 'Unverified').length}
                  </span>
                </button>

                <button
                  id="tab-view-table"
                  className={`view-tab ${caseSubView === 'table' ? 'active' : ''}`}
                  onClick={() => setCaseSubView('table')}
                >
                  <Table2 size={15} />
                  <span>Sightings Roster</span>
                </button>

                <button
                  id="tab-view-activity"
                  className={`view-tab ${caseSubView === 'activity' ? 'active' : ''}`}
                  onClick={() => setCaseSubView('activity')}
                >
                  <History size={15} />
                  <span>Chain of Custody Log</span>
                  <span className="badge-counter">{activeLogs.length}</span>
                </button>
              </div>

              {/* Responsible Use Advisory */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                <Lock size={12} />
                <span>RESTRICTED INVESTIGATOR ENCLAVE • CASE #{activeCase.code}</span>
              </div>
            </div>

            {/* Sub-view: Tactical Matrix (Timeline + Schematic Map + Detail Drawer) */}
            {caseSubView === 'matrix' && (
              <div className="investigation-matrix-grid">
                {/* Left Column: Chronological Timeline */}
                <div className="timeline-column">
                  <SightingTimeline
                    sightings={activeSightings}
                    selectedSightingId={selectedSightingId}
                    onSelectSighting={setSelectedSightingId}
                  />
                </div>

                {/* Center Column: Interactive Schematic Tactical Map & AI Highlights */}
                <div className="map-column" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <SchematicMap
                    activeCase={activeCase}
                    sightings={activeSightings}
                    selectedSightingId={selectedSightingId}
                    onSelectSighting={setSelectedSightingId}
                    showTrajectoryFlow={true}
                  />

                  {/* Compact AI Suggestions Banner inside Matrix */}
                  <div style={{ background: '#FFFDF5', border: '1px solid #FDE68A', borderRadius: 'var(--radius-md)', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Sparkles size={18} color="var(--accent-orange)" />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-primary)' }}>
                          AI Sighting Link Analysis: {activeSuggestions.filter((s) => s.reviewStatus === 'Unverified').length} Unverified Correlations
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          Probabilistic trajectory match detected along Route 14 corridor. Requires investigator verification.
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn-secondary"
                      style={{ fontSize: '12px', padding: '6px 14px' }}
                      onClick={() => setCaseSubView('suggestions')}
                    >
                      <span>Review AI Links</span>
                    </button>
                  </div>
                </div>

                {/* Right Column: Sighting Detail Inspection Drawer */}
                <div className="drawer-column">
                  <SightingDetailDrawer
                    sighting={selectedSighting}
                    onUpdateStatus={handleUpdateSightingStatus}
                    onSaveNotes={handleSaveSightingNotes}
                    onSelectSightingByCode={handleSelectSightingByCode}
                  />
                </div>
              </div>
            )}

            {/* Sub-view: AI Link Analysis Deck */}
            {caseSubView === 'suggestions' && (
              <AISuggestionsReview
                suggestions={activeSuggestions}
                onDecision={handleAISuggestionDecision}
                onInspectSighting={handleSelectSightingByCode}
              />
            )}

            {/* Sub-view: Tabular Sightings List */}
            {caseSubView === 'table' && (
              <SightingTable
                sightings={activeSightings}
                selectedSightingId={selectedSightingId}
                onSelectSighting={(id) => {
                  setSelectedSightingId(id);
                  setCaseSubView('matrix');
                }}
              />
            )}

            {/* Sub-view: Activity Audit Trail */}
            {caseSubView === 'activity' && (
              <ActivityLogView
                logs={activeLogs}
                caseCode={activeCase.code}
              />
            )}
          </main>
        </>
      )}

      {/* Tab: Sightings Master View */}
      {currentTab === 'sightings' && (
        <main className="workspace-content">
          <SightingTable
            sightings={sightings}
            selectedSightingId={selectedSightingId}
            onSelectSighting={(id) => {
              const targetSighting = sightings.find((s) => s.id === id);
              if (targetSighting) {
                setActiveCaseId(targetSighting.caseId);
              }
              setSelectedSightingId(id);
              setCurrentTab('active-case');
              setCaseSubView('matrix');
            }}
          />
        </main>
      )}

      {/* Tab: Evidence Sources */}
      {currentTab === 'evidence' && (
        <main className="workspace-content">
          <EvidenceSourcesView sources={evidenceSources} />
        </main>
      )}

      {/* Tab: Settings */}
      {currentTab === 'settings' && (
        <main className="workspace-content">
          <SettingsView onResetDemoData={handleResetDemoData} />
        </main>
      )}

      {/* Interactive Modals */}
      <AddSightingModal
        isOpen={isAddSightingModalOpen}
        onClose={() => setIsAddSightingModalOpen(false)}
        caseId={activeCase.id}
        caseCode={activeCase.code}
        onAddSighting={handleAddSighting}
      />

      <NewCaseModal
        isOpen={isNewCaseModalOpen}
        onClose={() => setIsNewCaseModalOpen(false)}
        onCreateCase={handleCreateCase}
      />

      <EditCaseModal
        isOpen={isEditCaseModalOpen}
        onClose={() => setIsEditCaseModalOpen(false)}
        caseItem={activeCase}
        onSaveCase={handleSaveCase}
      />
    </div>
  );
};

export default App;
