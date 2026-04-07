import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, FileDown, Send, AlertCircle, CheckCircle, HelpCircle, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { mockLabels, mockIndustries } from '@/data/mockData';
import StatusBadge from '@/components/StatusBadge';
import type { NutrientRow } from '@/types';
import { toast } from 'sonner';

const DEFAULT_NUTRIENTS: NutrientRow[] = [
  { id: '1', nutriente: 'Valor Energético', por100g: '', porPorcao: '', vd: '' },
  { id: '2', nutriente: 'Carboidratos', por100g: '', porPorcao: '', vd: '' },
  { id: '3', nutriente: 'Açúcares totais', por100g: '', porPorcao: '', vd: '' },
  { id: '4', nutriente: 'Açúcares adicionados', por100g: '', porPorcao: '', vd: '' },
  { id: '5', nutriente: 'Proteínas', por100g: '', porPorcao: '', vd: '' },
  { id: '6', nutriente: 'Gorduras totais', por100g: '', porPorcao: '', vd: '' },
  { id: '7', nutriente: 'Gorduras saturadas', por100g: '', porPorcao: '', vd: '' },
  { id: '8', nutriente: 'Gorduras trans', por100g: '', porPorcao: '', vd: '' },
  { id: '9', nutriente: 'Fibras', por100g: '', porPorcao: '', vd: '' },
  { id: '10', nutriente: 'Sódio', por100g: '', porPorcao: '', vd: '' },
];

const ADVERTENCIAS_DEFAULT = [
  'ESTE PRODUTO NÃO É UM MEDICAMENTO.',
  'NÃO EXCEDER A RECOMENDAÇÃO DIÁRIA DE CONSUMO INDICADA NA EMBALAGEM.',
  'MANTENHA FORA DO ALCANCE DE CRIANÇAS.',
];

const LabelEditor = () => {
  const { id } = useParams();
  const existing = id ? mockLabels.find(l => l.id === id) : null;

  const [nomeProduto, setNomeProduto] = useState(existing?.nomeProduto || '');
  const [sabor, setSabor] = useState(existing?.sabor || '');
  const [apresentacao, setApresentacao] = useState(existing?.apresentacao || '');
  const [tipoSuplemento, setTipoSuplemento] = useState(existing?.tipoSuplemento || 'capsulas');
  const [pesoPorcao, setPesoPorcao] = useState(existing?.pesoPorcao?.toString() || '');
  const [qtdPorcoes, setQtdPorcoes] = useState(existing?.qtdPorcoes?.toString() || '');
  const [pesoLiquido, setPesoLiquido] = useState(existing?.pesoLiquido?.toString() || '');
  const [codigoBarras, setCodigoBarras] = useState(existing?.codigoBarras || '');
  const [ingredientes, setIngredientes] = useState(existing?.content.ingredientes || '');
  const [contemGluten, setContemGluten] = useState(existing?.content.contemGluten ?? false);
  const [aromatizante, setAromatizante] = useState(existing?.content.aromatizante || '');
  const [sugestaoUso, setSugestaoUso] = useState(existing?.content.sugestaoUso || '');
  const [grupoPopulacional, setGrupoPopulacional] = useState(existing?.content.grupoPopulacional || '≥19 anos');
  const [dispensadoRegistro, setDispensadoRegistro] = useState(existing?.content.dispensadoRegistro ?? false);
  const [advertencias, setAdvertencias] = useState<string[]>(existing?.content.advertencias || ADVERTENCIAS_DEFAULT);
  const [conservacao, setConservacao] = useState(existing?.content.conservacao || 'Conservar o produto em temperatura ambiente (15 a 30°C). Proteger do calor e da umidade. Após aberto consumir o produto em até 60 dias.');
  const [nutrients, setNutrients] = useState<NutrientRow[]>(existing?.content.tabelaNutricional.length ? existing.content.tabelaNutricional : DEFAULT_NUTRIENTS);

  const addNutrient = () => {
    setNutrients([...nutrients, { id: Date.now().toString(), nutriente: '', por100g: '', porPorcao: '', vd: '' }]);
  };

  const removeNutrient = (nid: string) => {
    setNutrients(nutrients.filter(n => n.id !== nid));
  };

  const updateNutrient = (nid: string, field: keyof NutrientRow, value: string) => {
    setNutrients(nutrients.map(n => n.id === nid ? { ...n, [field]: value } : n));
  };

  const industry = existing ? mockIndustries.find(i => i.id === existing.industryId) : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={industry ? `/industrias/${industry.id}` : '/industrias'}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-xl font-display font-bold">{existing ? 'Editar Rótulo' : 'Novo Rótulo'}</h2>
          {existing && <div className="flex items-center gap-2 mt-0.5"><StatusBadge status={existing.status} /><span className="text-xs text-muted-foreground">{industry?.nomeFantasia}</span></div>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-3 space-y-0">
          <Accordion type="multiple" defaultValue={['identificacao', 'nutricional', 'ingredientes', 'uso', 'advertencias', 'conservacao']} className="space-y-3">
            {/* 1 - Identificação */}
            <AccordionItem value="identificacao" className="border rounded-lg bg-card px-4">
              <AccordionTrigger className="text-sm font-semibold">1 — Identificação do Produto</AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Nome do produto *</Label>
                    <Input value={nomeProduto} onChange={e => setNomeProduto(e.target.value)} placeholder="Ex: Colágeno Hidrolisado" />
                  </div>
                  <div>
                    <Label>Sabor</Label>
                    <Input value={sabor} onChange={e => setSabor(e.target.value)} placeholder="Ex: Morango" />
                  </div>
                  <div>
                    <Label>Apresentação *</Label>
                    <Input value={apresentacao} onChange={e => setApresentacao(e.target.value)} placeholder="Ex: Pó 300g" />
                  </div>
                  <div>
                    <Label>Tipo</Label>
                    <Select value={tipoSuplemento} onValueChange={setTipoSuplemento}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="capsulas">Cápsulas</SelectItem>
                        <SelectItem value="po">Pó</SelectItem>
                        <SelectItem value="liquido">Líquido</SelectItem>
                        <SelectItem value="sache">Sachê</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Porção (g/ml) *</Label>
                    <Input type="number" value={pesoPorcao} onChange={e => setPesoPorcao(e.target.value)} />
                  </div>
                  <div>
                    <Label>Porções por embalagem *</Label>
                    <Input type="number" value={qtdPorcoes} onChange={e => setQtdPorcoes(e.target.value)} />
                  </div>
                  <div>
                    <Label>Peso líquido</Label>
                    <Input type="number" value={pesoLiquido} onChange={e => setPesoLiquido(e.target.value)} />
                  </div>
                  <div>
                    <Label>Código de barras</Label>
                    <Input value={codigoBarras} onChange={e => setCodigoBarras(e.target.value)} placeholder="EAN-13" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 2 - Tabela Nutricional */}
            <AccordionItem value="nutricional" className="border rounded-lg bg-card px-4">
              <AccordionTrigger className="text-sm font-semibold">2 — Tabela Nutricional</AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-2 font-medium">Nutriente</th>
                        <th className="pb-2 font-medium">Por 100g</th>
                        <th className="pb-2 font-medium">Por Porção</th>
                        <th className="pb-2 font-medium">%VD*</th>
                        <th className="pb-2 w-8"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {nutrients.map(n => (
                        <tr key={n.id} className="border-b last:border-0">
                          <td className="py-1.5 pr-2"><Input value={n.nutriente} onChange={e => updateNutrient(n.id, 'nutriente', e.target.value)} className="h-8 text-xs" /></td>
                          <td className="py-1.5 pr-2"><Input value={n.por100g} onChange={e => updateNutrient(n.id, 'por100g', e.target.value)} className="h-8 text-xs" /></td>
                          <td className="py-1.5 pr-2"><Input value={n.porPorcao} onChange={e => updateNutrient(n.id, 'porPorcao', e.target.value)} className="h-8 text-xs" /></td>
                          <td className="py-1.5 pr-2"><Input value={n.vd} onChange={e => updateNutrient(n.id, 'vd', e.target.value)} className="h-8 text-xs" /></td>
                          <td className="py-1.5"><button onClick={() => removeNutrient(n.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Button variant="outline" size="sm" onClick={addNutrient} className="gap-1"><Plus className="h-3 w-3" /> Adicionar nutriente</Button>
                <p className="text-xs text-muted-foreground">* Percentual de Valores Diários fornecidos pela porção.</p>
              </AccordionContent>
            </AccordionItem>

            {/* 3 - Ingredientes */}
            <AccordionItem value="ingredientes" className="border rounded-lg bg-card px-4">
              <AccordionTrigger className="text-sm font-semibold">3 — Ingredientes</AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4">
                <div>
                  <Label>Lista de ingredientes *</Label>
                  <Textarea value={ingredientes} onChange={e => setIngredientes(e.target.value)} placeholder="Listar em ordem decrescente de quantidade..." rows={4} />
                </div>
                <div className="flex items-center gap-3">
                  <Label>Contém glúten?</Label>
                  <Switch checked={contemGluten} onCheckedChange={setContemGluten} />
                  <span className="text-xs text-muted-foreground">{contemGluten ? 'CONTÉM GLÚTEN' : 'NÃO CONTÉM GLÚTEN'}</span>
                </div>
                <div>
                  <Label>Aromatizante / Corante</Label>
                  <Input value={aromatizante} onChange={e => setAromatizante(e.target.value)} placeholder="Ex: Aroma idêntico ao natural de manga" />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 4 - Uso */}
            <AccordionItem value="uso" className="border rounded-lg bg-card px-4">
              <AccordionTrigger className="text-sm font-semibold">4 — Informações de Uso</AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4">
                <div>
                  <Label>Sugestão de uso *</Label>
                  <Textarea value={sugestaoUso} onChange={e => setSugestaoUso(e.target.value)} rows={3} />
                </div>
                <div>
                  <Label>Grupo populacional *</Label>
                  <Select value={grupoPopulacional} onValueChange={setGrupoPopulacional}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="≥7 anos">≥ 7 anos</SelectItem>
                      <SelectItem value="≥10 anos">≥ 10 anos</SelectItem>
                      <SelectItem value="≥14 anos">≥ 14 anos</SelectItem>
                      <SelectItem value="≥19 anos">≥ 19 anos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={dispensadoRegistro} onCheckedChange={setDispensadoRegistro} />
                  <Label>Dispensado de registro (RDC 240/2018)</Label>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 5 - Advertências */}
            <AccordionItem value="advertencias" className="border rounded-lg bg-card px-4">
              <AccordionTrigger className="text-sm font-semibold">5 — Advertências</AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                {advertencias.map((adv, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Checkbox checked={true} className="mt-0.5" />
                    <span className="text-sm">{adv}</span>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* 6 - Conservação */}
            <AccordionItem value="conservacao" className="border rounded-lg bg-card px-4">
              <AccordionTrigger className="text-sm font-semibold">6 — Conservação</AccordionTrigger>
              <AccordionContent className="pb-4">
                <Textarea value={conservacao} onChange={e => setConservacao(e.target.value)} rows={3} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="sticky top-20">
            <Card className="p-5 space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Preview do Rótulo</h3>
              <div className="border rounded-lg p-4 space-y-3 text-xs">
                <p className="text-base font-display font-bold">{nomeProduto || 'Nome do Produto'}</p>
                {sabor && <p className="text-muted-foreground">Sabor: {sabor}</p>}
                <p className="text-muted-foreground">{apresentacao || 'Apresentação'}</p>

                {pesoPorcao && (
                  <div className="border-t pt-2">
                    <p className="font-semibold">INFORMAÇÃO NUTRICIONAL</p>
                    <p>Porção de {pesoPorcao}g{qtdPorcoes && ` (${qtdPorcoes} porções por embalagem)`}</p>
                    <table className="w-full mt-1 text-xs">
                      <thead><tr className="border-b"><th className="text-left py-0.5">Nutriente</th><th className="text-right py-0.5">Por porção</th><th className="text-right py-0.5">%VD*</th></tr></thead>
                      <tbody>
                        {nutrients.filter(n => n.nutriente).map(n => (
                          <tr key={n.id} className="border-b"><td className="py-0.5">{n.nutriente}</td><td className="text-right py-0.5">{n.porPorcao || '—'}</td><td className="text-right py-0.5">{n.vd || '—'}</td></tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="mt-1 text-muted-foreground" style={{ fontSize: '9px' }}>* Percentual de Valores Diários fornecidos pela porção.</p>
                  </div>
                )}

                {ingredientes && (
                  <div className="border-t pt-2">
                    <p className="font-semibold">INGREDIENTES</p>
                    <p>{ingredientes}</p>
                  </div>
                )}

                <div className="border-t pt-2">
                  <p className="font-semibold">{contemGluten ? 'CONTÉM GLÚTEN' : 'NÃO CONTÉM GLÚTEN'}</p>
                </div>

                {sugestaoUso && (
                  <div className="border-t pt-2">
                    <p className="font-semibold">MODO DE USO</p>
                    <p>{sugestaoUso}</p>
                  </div>
                )}

                {grupoPopulacional && <p className="text-muted-foreground">Indicado para {grupoPopulacional}</p>}

                {advertencias.length > 0 && (
                  <div className="border-t pt-2 space-y-0.5">
                    {advertencias.map((a, i) => <p key={i} className="font-bold uppercase">{a}</p>)}
                  </div>
                )}

                {conservacao && (
                  <div className="border-t pt-2">
                    <p className="font-semibold">CONSERVAÇÃO</p>
                    <p>{conservacao}</p>
                  </div>
                )}

                {dispensadoRegistro && (
                  <p className="border-t pt-2 text-muted-foreground italic">Produto dispensado de registro conforme RDC 240/2018.</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="sticky bottom-0 border-t bg-card py-3 px-4 -mx-6 -mb-6 flex items-center gap-3 justify-end">
        <Button variant="outline" className="gap-1.5" onClick={() => toast.success('Rascunho salvo!')}><Save className="h-4 w-4" /> Salvar Rascunho</Button>
        <Button variant="outline" className="gap-1.5"><FileDown className="h-4 w-4" /> Exportar PDF</Button>
        <Button variant="outline" className="gap-1.5"><Send className="h-4 w-4" /> Enviar ao Designer</Button>
        <Button className="gap-1.5"><CheckCircle className="h-4 w-4" /> Finalizar</Button>
      </div>
    </div>
  );
};

export default LabelEditor;
