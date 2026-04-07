import { FileText, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { mockLabels, mockIndustries } from '@/data/mockData';
import StatusBadge from '@/components/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const totalLabels = mockLabels.length;
  const enviados = mockLabels.filter(l => l.status === 'enviado').length;
  const alteracoes = mockLabels.filter(l => l.status === 'alteracao').length;
  const aprovados = mockLabels.filter(l => l.status === 'aprovado').length;

  const metrics = [
    { title: 'Total de Rótulos', value: totalLabels, icon: FileText, color: 'text-primary' },
    { title: 'Aguardando Designer', value: enviados, icon: Send, color: 'text-status-sent-text' },
    { title: 'Alterações Pendentes', value: alteracoes, icon: AlertCircle, color: 'text-destructive' },
    { title: 'Finalizados', value: aprovados, icon: CheckCircle2, color: 'text-status-approved-text' },
  ];

  const statusData = [
    { name: 'Rascunho', value: mockLabels.filter(l => l.status === 'rascunho').length },
    { name: 'Enviado', value: enviados },
    { name: 'Em Análise', value: mockLabels.filter(l => l.status === 'em_analise').length },
    { name: 'Alteração', value: alteracoes },
    { name: 'Aprovado', value: aprovados },
  ];

  const industryData = mockIndustries.filter(i => i.status === 'ativo').map(ind => ({
    name: ind.nomeFantasia,
    value: mockLabels.filter(l => l.industryId === ind.id).length,
  }));

  const PIE_COLORS = ['hsl(152,64%,26%)', 'hsl(152,50%,40%)', 'hsl(40,96%,60%)', 'hsl(270,60%,60%)', 'hsl(0,84%,60%)'];

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

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Rótulos por Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(152,64%,26%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Por Indústria</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={industryData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={3}>
                {industryData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
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
              {mockLabels.filter(l => l.prazo && l.status !== 'aprovado').map(label => {
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
