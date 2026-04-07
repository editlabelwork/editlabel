import { FileText, Send, AlertCircle, CheckCircle2, Flag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { mockLabels, mockIndustries } from '@/data/mockData';
import StatusBadge from '@/components/StatusBadge';
import { Link } from 'react-router-dom';
import { STATUS_ORDER, STATUS_CONFIG, LabelStatus } from '@/types';

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

  const getLabelsForStatus = (status: LabelStatus) =>
    mockLabels.filter(l => l.status === status);

  return (
    <div className="space-y-6">
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

      {/* Kanban Board */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
          <Flag className="h-4 w-4" /> Quadro de Status — Estilo Kanban
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {STATUS_ORDER.map(status => {
            const config = STATUS_CONFIG[status];
            const labels = getLabelsForStatus(status);
            return (
              <div key={status} className="rounded-xl border bg-card overflow-hidden">
                <div className={`px-3 py-2.5 flex items-center justify-between ${config.bgClass}`}>
                  <span className={`text-xs font-semibold ${config.textClass} flex items-center gap-1.5`}>
                    <span>{config.icon}</span> {config.label}
                  </span>
                  <span className={`text-xs font-bold ${config.textClass} bg-card/60 rounded-full px-2 py-0.5`}>
                    {labels.length}
                  </span>
                </div>
                <div className="p-2 space-y-2 min-h-[120px]">
                  {labels.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-6">Nenhum rótulo</p>
                  )}
                  {labels.map(label => {
                    const industry = mockIndustries.find(i => i.id === label.industryId);
                    return (
                      <Link key={label.id} to={`/rotulos/${label.id}`}>
                        <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer border-l-4" style={{ borderLeftColor: `hsl(var(--status-${status === 'em_andamento' ? 'progress' : status === 'enviado_industria' ? 'sent' : status === 'alteracao' ? 'change' : status === 'aprovado' ? 'approved' : 'done'}-text))` }}>
                          <p className="text-sm font-medium truncate">{label.nomeProduto}</p>
                          <p className="text-xs text-muted-foreground truncate">{industry?.nomeFantasia}</p>
                          {label.prazo && (
                            <p className="text-[10px] text-muted-foreground mt-1">Prazo: {label.prazo}</p>
                          )}
                          {label.changedFields.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {label.changedFields.map(f => (
                                <span key={f} className="bg-status-change-bg text-status-change-text text-[9px] px-1.5 py-0.5 rounded-full font-medium">
                                  {f}
                                </span>
                              ))}
                            </div>
                          )}
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deadline Table */}
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Prazos Próximos</h3>
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
              {mockLabels.filter(l => l.prazo && l.status !== 'finalizado').map(label => {
                const industry = mockIndustries.find(i => i.id === label.industryId);
                return (
                  <tr key={label.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{label.nomeProduto}</td>
                    <td className="py-3 text-muted-foreground">{industry?.nomeFantasia}</td>
                    <td className="py-3">{label.prazo}</td>
                    <td className="py-3"><StatusBadge status={label.status} /></td>
                    <td className="py-3">
                      <Link to={`/rotulos/${label.id}`} className="text-primary hover:underline text-xs font-medium">
                        Editar
                      </Link>
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
