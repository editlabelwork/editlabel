import { useLocation, Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/industrias': 'Indústrias',
  '/configuracoes': 'Configurações',
};

const AppHeader = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Edit Label';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <h1 className="text-xl font-display font-bold text-foreground">{title}</h1>
      <Link to="/rotulos/novo">
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Novo Rótulo
        </Button>
      </Link>
    </header>
  );
};

export default AppHeader;
