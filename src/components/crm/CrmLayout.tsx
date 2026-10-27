import React from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { CrmHeader } from './CrmHeader';
import { CrmTabsNav } from './CrmTabsNav';
import { CrmDashboard } from './CrmDashboard';
import { CrmKanban } from './CrmKanban';
import { CrmLeadsTable } from './CrmLeadsTable';
import { CrmInventory } from './CrmInventory';
import { CrmTasks } from './CrmTasks';
import { CrmBrandSettings } from './CrmBrandSettings';
import { CrmFirebaseStatus } from './CrmFirebaseStatus';

export const CrmLayout: React.FC = () => {
  const { crmTab } = useRealEstate();

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0A2F1D] flex flex-col">
      <CrmHeader />
      <CrmTabsNav />

      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        {crmTab === 'dashboard' && <CrmDashboard />}
        {crmTab === 'kanban' && <CrmKanban />}
        {crmTab === 'leads' && <CrmLeadsTable />}
        {crmTab === 'inventory' && <CrmInventory />}
        {crmTab === 'tasks' && <CrmTasks />}
        {crmTab === 'brand' && <CrmBrandSettings />}
        {crmTab === 'firebase' && <CrmFirebaseStatus />}
      </main>
    </div>
  );
};
