import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, MoreVertical, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mockIndustries, mockLabels } from '@/data/mockData';

const Industries = () => {
  const [search, setSearch] = useState('');

  const filtered = mockIndustries.filter(i =>
    i.nomeFantasia.toLowerCase().includes(search.toLowerCase()) ||
    i.cnpj.includes(search)
  );

  const getInitials = (name: string) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const COLORS = ['bg-primary', 'bg-status-sent-text', 'bg-status-review-text', 'bg-status-change-text'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou CNPJ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" />
          Nova Indústria
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((ind, idx) => {
          const labelCount = mockLabels.filter(l => l.industryId === ind.id).length;
          return (
            <Link to={`/industrias/${ind.id}`} key={ind.id}>
              <Card className="group cursor-pointer p-5 transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-primary-foreground ${COLORS[idx % COLORS.length]}`}>
                      {getInitials(ind.nomeFantasia)}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold">{ind.nomeFantasia}</h3>
                      <p className="text-xs text-muted-foreground">{ind.cnpj}</p>
                    </div>
                  </div>
                  <button className="rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" />
                    {labelCount} rótulo{labelCount !== 1 ? 's' : ''}
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    ind.status === 'ativo' ? 'bg-status-approved-bg text-status-approved-text' : 'bg-muted text-muted-foreground'
                  }`}>
                    {ind.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Industries;
