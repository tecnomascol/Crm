/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CrmProvider, useCrm } from './context/CrmContext';

// Authentication & Security Screens
import { AuthScreen } from './components/auth/AuthScreen';
import { EmailVerificationScreen } from './components/auth/EmailVerificationScreen';

// Layout & Modals
import { CrmSidebar } from './components/layout/CrmSidebar';
import { CrmNavbar } from './components/layout/CrmNavbar';
import { FirebaseStatusModal } from './components/layout/FirebaseStatusModal';
import { LeadDetailDrawer } from './components/common/LeadDetailDrawer';

// CRM Functional Modules
import { DashboardModule } from './components/modules/DashboardModule';
import { LeadsModule } from './components/modules/LeadsModule';
import { KanbanModule } from './components/modules/KanbanModule';
import { ProjectsModule } from './components/modules/ProjectsModule';
import { InventoryModule } from './components/modules/InventoryModule';
import { TasksModule } from './components/modules/TasksModule';
import { DealsModule } from './components/modules/DealsModule';
import { UsersModule } from './components/modules/UsersModule';
import { AuditModule } from './components/modules/AuditModule';
import { SettingsModule } from './components/modules/SettingsModule';

import { Check, Loader2 } from 'lucide-react';

const CrmAppShell: React.FC = () => {
  const { activeModule, selectedLead, setSelectedLead, toastMessage } = useCrm();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardModule />;
      case 'leads':
        return <LeadsModule />;
      case 'kanban':
        return <KanbanModule />;
      case 'projects':
        return <ProjectsModule />;
      case 'inventory':
        return <InventoryModule />;
      case 'tasks':
        return <TasksModule />;
      case 'deals':
        return <DealsModule />;
      case 'users':
        return <UsersModule />;
      case 'audit':
        return <AuditModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#132E22] flex flex-col font-sans">
      <div className="flex-1 flex overflow-hidden h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <CrmSidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div 
              className="w-64 h-full bg-[#071E13] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <CrmSidebar
                collapsed={false}
                onToggleCollapse={() => setMobileSidebarOpen(false)}
                onOpenFirebaseModal={() => {
                  setMobileSidebarOpen(false);
                  setIsFirebaseModalOpen(true);
                }}
              />
            </div>
          </div>
        )}

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Sticky Navbar */}
          <CrmNavbar
            onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          />

          {/* Module Canvas */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {renderActiveModule()}
          </main>
        </div>
      </div>

      {/* Global Slide-over Drawer for Lead Details & Timeline */}
      <LeadDetailDrawer
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
      />

      {/* Database Diagnostic & Blueprint Status Modal */}
      <FirebaseStatusModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
      />

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#071E13] text-[#FDFBF7] border border-[#C8A261] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs tracking-wide animate-in fade-in slide-in-from-bottom-4">
          <div className="w-5 h-5 rounded-full bg-[#C8A261] text-[#071E13] flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

const AuthGate: React.FC = () => {
  const { currentUser, isLoading } = useAuth();

  // 1. Loading state with luxury editorial splash
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#071E13] flex flex-col items-center justify-center text-white px-4">
        <div className="w-12 h-12 rounded-2xl bg-[#C8A261]/20 border border-[#C8A261] flex items-center justify-center text-[#C8A261] font-serif font-bold text-xl mb-4 shadow-lg shadow-black/40">
          Á
        </div>
        <h2 className="font-serif text-lg tracking-widest text-[#FDFBF7]">
          ÁUREA LUXURY CRM
        </h2>
        <p className="text-xs text-[#C8A261] tracking-wider uppercase mt-1">
          Inicializando entorno seguro y credenciales...
        </p>
        <Loader2 className="w-6 h-6 animate-spin text-[#C8A261] mt-6" />
      </div>
    );
  }

  // 2. Unauthenticated -> Show Authentication Screen (Login / Register / Password Recovery)
  if (!currentUser) {
    return <AuthScreen />;
  }

  // 3. Authenticated but email NOT verified -> Enforce blocking verification screen
  if (!currentUser.emailVerified) {
    return <EmailVerificationScreen />;
  }

  // 4. Authenticated & email verified -> Render full CRM panel
  return (
    <CrmProvider>
      <CrmAppShell />
    </CrmProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
