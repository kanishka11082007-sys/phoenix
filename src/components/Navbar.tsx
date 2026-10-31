import React from 'react';
import { 
  ShieldAlert, 
  FolderSearch, 
  Eye, 
  Radio, 
  Settings, 
  ArrowLeft,
  PlusCircle,
  UserCheck
} from 'lucide-react';

export type WorkspaceTab = 'cases' | 'sightings' | 'evidence' | 'settings';

interface NavbarProps {
  currentTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  onReturnToLanding: () => void;
  onOpenNewCaseModal: () => void;
  activeCaseCount: number;
  totalSightingsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onReturnToLanding,
  onOpenNewCaseModal,
  activeCaseCount,
  totalSightingsCount,
}) => {
  return (
    <header className="workspace-header">
      <div className="workspace-header-inner">
        <div className="header-left">
          {/* Brand Logo & Back to Landing */}
          <div 
            className="header-brand" 
            onClick={onReturnToLanding}
            title="Return to Phoenix Portal"
          >
            <div className="brand-icon">
              <ShieldAlert size={18} />
            </div>
            <div className="brand-text">PHOENIX</div>
          </div>

          {/* Workspace Tabs */}
          <nav className="nav-tabs" aria-label="Investigator Workspace Navigation">
            <button
              id="nav-tab-cases"
              className={`nav-tab-btn ${currentTab === 'cases' ? 'active' : ''}`}
              onClick={() => onSelectTab('cases')}
            >
              <FolderSearch size={16} />
              <span>Cases</span>
              <span className="badge-counter">{activeCaseCount}</span>
            </button>

            <button
              id="nav-tab-sightings"
              className={`nav-tab-btn ${currentTab === 'sightings' ? 'active' : ''}`}
              onClick={() => onSelectTab('sightings')}
            >
              <Eye size={16} />
              <span>Sightings</span>
              <span className="badge-counter">{totalSightingsCount}</span>
            </button>

            <button
              id="nav-tab-evidence"
              className={`nav-tab-btn ${currentTab === 'evidence' ? 'active' : ''}`}
              onClick={() => onSelectTab('evidence')}
            >
              <Radio size={16} />
              <span>Evidence Sources</span>
            </button>

            <button
              id="nav-tab-settings"
              className={`nav-tab-btn ${currentTab === 'settings' ? 'active' : ''}`}
              onClick={() => onSelectTab('settings')}
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="header-right">
          {/* Role Label */}
          <div className="role-badge">
            <UserCheck size={14} color="#FFD84D" />
            <span>INVESTIGATOR WORKSPACE • <strong>INV-4082</strong></span>
          </div>

          {/* New Case Action */}
          <button 
            id="btn-nav-new-case"
            className="btn-header-action" 
            onClick={onOpenNewCaseModal}
            title="Create a new fictional demo case"
          >
            <PlusCircle size={15} />
            <span>New Case</span>
          </button>

          {/* Return button */}
          <button 
            className="nav-tab-btn" 
            style={{ fontSize: '13px', color: '#9CA3AF' }}
            onClick={onReturnToLanding}
            title="Back to Landing Page"
          >
            <ArrowLeft size={14} />
            <span>Exit</span>
          </button>
        </div>
      </div>
    </header>
  );
};
