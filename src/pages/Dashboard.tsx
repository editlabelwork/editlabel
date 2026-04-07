import { FileText, Send, AlertCircle, CheckCircle2, Plus, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockLabels, mockIndustries } from '@/data/mockData';
import StatusBadge from '@/components/StatusBadge';
import { Link } from 'react-router-dom';
import NewIndustryDialog from '@/components/NewIndustryDialog';

const Dashboard = () => {
  const totalLabels = mockLabels.length;
  const emAndamento = mockLabels.filter(l => l.status === 'em_andamento').length;
  const alteracoes = mockLabels.filter(l => l.status === 'alteracao').length;
  const finalizados = mockLabels.filter(l => l.status === 'finalizado').length;

  const metrics = [
    { title: 'Total de Rótulos', value: totalLabels, icon: FileText, color: 'text-primary' },
    { title: 'Em Andamento', value: emAndamento, icon: Send, color: 'text-status-progress-text' },
    { title: 'Alterações Pendentes', value: alteracoes, icon: AlertCircle, color: 'text-destructive' },
    { title: 'Finalizados', value: finalizados, icon: CheckCircle2, color: 'text-status-done-text' },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex items-center gap-3">
        <NewIndustryDialog trigger={
          <Button className="gap-2 rounded-full">
            <Plus className="h-4 w-4" /> Nova Indústria
          </Button>
        } />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.title} className="flex items-center gap-4 p-5">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary ${m.color}`}>
              <m.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{m.title}</p>
              <p className="text-2xl font-display font-bold">{m.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Industries Grid */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
          <Building2 className="h-4 w-4" /> Suas Indústrias
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockIndustries.filter(i => i.status === 'ativo').map(ind => {
            const labels = mockLabels.filter(l => l.industryId === ind.id);
            return (
              <Link key={ind.id} to={`/industrias/${ind.id}`}>
                <Card className="group cursor-pointer p-5 transition-all hover:shadow-md hover:-translate-y-0.5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm shrink-0">
                      {ind.nomeFantasia.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-semibold truncate">{ind.nomeFantasia}</h3>
                      <p className="text-xs text-muted-foreground">{ind.cnpj}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" /> {labels.length} rótulo{labels.length !== 1 ? 's' : ''}
                    </span>
                    <div className="flex gap-1">
                      {labels.slice(0, 3).map(l => (
                        <StatusBadge key={l.id} status={l.status} size="sm" />
                      ))}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Labels */}
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Rótulos Recentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 font-medium">Produto</th>
                <th className="pb-3 font-medium">Indústria</th>
                <th className="pb-3 font-medium">Prazo</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {mockLabels.map(label => {
                const industry = mockIndustries.find(i => i.id === label.industryId);
                return (
                  <tr key={label.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{label.nomeProduto}</td>
                    <td className="py-3 text-muted-foreground">{industry?.nomeFantasia}</td>
                    <td className="py-3">{label.prazo || '—'}</td>
                    <td className="py-3"><StatusBadge status={label.status} /></td>
                    <td className="py-3">
                      <Link to={`/rotulos/${label.id}`} className="text-primary hover:underline text-xs font-medium">Editar</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
