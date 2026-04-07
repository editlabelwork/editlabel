import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { mockIndustries, mockLabels } from '@/data/mockData';
import StatusBadge from '@/components/StatusBadge';
import type { LabelStatus } from '@/types';

const IndustryDetail = () => {
  const { id } = useParams();
  const industry = mockIndustries.find(i => i.id === id);
  const labels = mockLabels.filter(l => l.industryId === id);

  if (!industry) return <p>Indústria não encontrada.</p>;

  const filterLabels = (status?: LabelStatus) =>
    status ? labels.filter(l => l.status === status) : labels;

  const renderLabels = (list: typeof labels) => (
    <div className="space-y-3">
      {list.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Nenhum rótulo encontrado.</p>}
      {list.map(label => (
        <Link to={`/rotulos/${label.id}`} key={label.id}>
          <Card className="flex items-center justify-between p-4 transition-shadow hover:shadow-sm">
            <div>
              <p className="font-medium">{label.nomeProduto}</p>
              <p className="text-xs text-muted-foreground">{label.sabor && `${label.sabor} · `}{label.apresentacao}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={label.status} />
              <span className="text-xs text-muted-foreground">{label.prazo || '—'}</span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/industrias">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-display font-bold">{industry.nomeFantasia}</h2>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              industry.status === 'ativo' ? 'bg-status-approved-bg text-status-approved-text' : 'bg-muted text-muted-foreground'
            }`}>
              {industry.status === 'ativo' ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{industry.cnpj} · {industry.endereco.cidade}/{industry.endereco.estado}</p>
        </div>
        <Link to="/rotulos/novo">
          <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Novo Rótulo</Button>
        </Link>
      </div>

      <Tabs defaultValue="todos">
        <TabsList>
          <TabsTrigger value="todos">Todos ({labels.length})</TabsTrigger>
          <TabsTrigger value="rascunho">Rascunho</TabsTrigger>
          <TabsTrigger value="andamento">Em andamento</TabsTrigger>
          <TabsTrigger value="alteracao">Alteração</TabsTrigger>
          <TabsTrigger value="aprovado">Finalizados</TabsTrigger>
        </TabsList>
        <TabsContent value="todos" className="mt-4">{renderLabels(labels)}</TabsContent>
        <TabsContent value="rascunho" className="mt-4">{renderLabels(filterLabels('rascunho'))}</TabsContent>
        <TabsContent value="andamento" className="mt-4">{renderLabels(labels.filter(l => ['enviado', 'em_analise'].includes(l.status)))}</TabsContent>
        <TabsContent value="alteracao" className="mt-4">{renderLabels(filterLabels('alteracao'))}</TabsContent>
        <TabsContent value="aprovado" className="mt-4">{renderLabels(filterLabels('aprovado'))}</TabsContent>
      </Tabs>
    </div>
  );
};

export default IndustryDetail;
