import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, Settings, Tag, FilePlus } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/industrias', label: 'Indústrias', icon: Building2 },
  { to: '/rotulos/novo', label: 'Novo Rótulo Avulso', icon: FilePlus },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <Tag className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <span className="text-lg font-display font-bold tracking-tight">Edit Label</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => {
          const isActive = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary border-l-2 border-sidebar-primary'
                  : 'text-sidebar-accent-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
            RF
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">Dr. Rafael Souza</p>
            <p className="truncate text-xs text-sidebar-accent-foreground/60">CRF-MG 11929</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
