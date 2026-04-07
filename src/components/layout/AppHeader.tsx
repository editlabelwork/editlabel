import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/industrias': 'Indústrias',
  '/configuracoes': 'Configurações',
  '/rotulos/novo': 'Novo Rótulo',
};

const AppHeader = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Editar Rótulo';

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-card px-6">
      <h1 className="text-lg font-display font-bold text-foreground">{title}</h1>
    </header>
  );
};

export default AppHeader;
