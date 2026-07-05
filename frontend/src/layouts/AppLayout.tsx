import { Outlet } from 'react-router';
import { SidebarProvider, SidebarInset } from '@/components/animate-ui/components/radix/sidebar';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';

export function AppLayout() {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <Sidebar />
      <SidebarInset className="min-w-0 overflow-hidden bg-cream">
        <Header />
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
