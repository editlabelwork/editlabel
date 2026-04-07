import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, FileDown, Send, Plus, Trash2, Building2,
  Upload, MessageCircle, CheckCircle, ChevronRight, Paperclip, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockLabels, mockIndustries } from '@/data/mockData';
import StatusBadge from '@/components/StatusBadge';
import type { NutrientRow, LabelStatus } from '@/types';
import { STATUS_CONFIG, STATUS_ORDER } from '@/types';
import { toast } from 'sonner';

const NUTRIENTES_BASE: NutrientRow[] = [
  { id: '1', nutriente: 'Valor energético (kcal)', por100g: '', porPorcao: '', vd: '' },
  { id: '2', nutriente: 'Carboidratos totais (g)', por100g: '', porPorcao: '', vd: '' },
  { id: '3', nutriente: 'Açúcares totais (g)', por100g: '', porPorcao: '', vd: '' },
  { id: '4', nutriente: 'Açúcares adicionados (g)', por100g: '', porPorcao: '', vd: '' },
  { id: '5', nutriente: 'Proteínas (g)', por100g: '', porPorcao: '', vd: '' },
  { id: '6', nutriente: 'Gorduras totais (g)', por100g: '', porPorcao: '', vd: '' },
  { id: '7', nutriente: 'Gorduras saturadas (g)', por100g: '', porPorcao: '', vd: '' },
  { id: '8', nutriente: 'Gorduras trans (g)', por100g: '', porPorcao: '', vd: '' },
  { id: '9', nutriente: 'Fibra alimentar (g)', por100g: '', porPorcao: '', vd: '' },
  { id: '10', nutriente: 'Sódio (mg)', por100g: '', porPorcao: '', vd: '' },
];

const ADVERTENCIAS_OPTIONS = [
  { text: 'ESTE PRODUTO NÃO É UM MEDICAMENTO.', required: true },
  { text: 'NÃO EXCEDER A RECOMENDAÇÃO DIÁRIA DE CONSUMO INDICADA NA EMBALAGEM.', required: true },
  { text: 'MANTENHA FORA DO ALCANCE DE CRIANÇAS.', required: true },
  { text: 'ESTE PRODUTO NÃO DEVE SER CONSUMIDO POR GESTANTES, LACTANTES E CRIANÇAS.', required: false },
];

const ALERGENICOS_OPTIONS = [
  'Glúten', 'Leite e derivados', 'Soja', 'Ovo', 'Amendoim',
  'Castanhas', 'Peixe', 'Crustáceos', 'Trigo', 'Centeio',
  'Cevada', 'Aveia', 'Látex natural',
];

const LabelEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const existing = id ? mockLabels.find(l => l.id === id) : null;

  const [nomeProduto, setNomeProduto] = useState(existing?.nomeProduto || '');
  const [sabor, setSabor] = useState(existing?.sabor || '');
  const [apresentacao, setApresentacao] = useState(existing?.apresentacao || '');
  const [tipoSuplemento, setTipoSuplemento] = useState<string>(existing?.tipoSuplemento || '');
  const [pesoPorcao, setPesoPorcao] = useState(existing?.pesoPorcao?.toString() || '');
  const [unidadePeso, setUnidadePeso] = useState(existing?.unidadePeso || 'g');
  const [qtdPorcoes, setQtdPorcoes] = useState(existing?.qtdPorcoes?.toString() || '');
  const [pesoLiquido, setPesoLiquido] = useState(existing?.pesoLiquido?.toString() || '');
  const [unidadePesoLiquido, setUnidadePesoLiquido] = useState<string>(existing?.unidadePesoLiquido || 'g');
  const [codigoBarras, setCodigoBarras] = useState(existing?.codigoBarras || '');
  const [ingredientes, setIngredientes] = useState(existing?.content.ingredientes || '');
  const [alergenicos, setAlergenicos] = useState<string[]>(existing?.content.contemGluten ? ['Glúten'] : []);
  const [aromatizante, setAromatizante] = useState(existing?.content.aromatizante || '');
  const [sugestaoUso, setSugestaoUso] = useState(existing?.content.sugestaoUso || '');
  const [grupoPopulacional, setGrupoPopulacional] = useState(existing?.content.grupoPopulacional || '≥19 anos');
  const [dispensadoRegistro, setDispensadoRegistro] = useState(existing?.content.dispensadoRegistro ?? false);
  const [advertenciasChecked, setAdvertenciasChecked] = useState<boolean[]>(ADVERTENCIAS_OPTIONS.map((a) => a.required || (existing?.content.advertencias?.includes(a.text) ?? false)));
  const [advertenciaExtra, setAdvertenciaExtra] = useState('');
  const [conservacao, setConservacao] = useState(existing?.content.conservacao || 'Conservar o produto em temperatura ambiente (15 a 30°C). Proteger do calor e da umidade. Após aberto consumir o produto em até 60 dias.');
  const [naoContemSignificativo, setNaoContemSignificativo] = useState(false);
  const [medidaCaseira, setMedidaCaseira] = useState('');

  // Fabricante
  const [fabNome, setFabNome] = useState(existing?.content.fabricante.nome || '');
  const [fabCnpj, setFabCnpj] = useState(existing?.content.fabricante.cnpj || '');
  const [fabRua, setFabRua] = useState(existing?.content.fabricante.rua || '');
  const [fabNumero, setFabNumero] = useState(existing?.content.fabricante.numero || '');
  const [fabBairro, setFabBairro] = useState(existing?.content.fabricante.bairro || '');
  const [fabCidade, setFabCidade] = useState(existing?.content.fabricante.cidade || '');
  const [fabEstado, setFabEstado] = useState(existing?.content.fabricante.estado || '');
  const [fabCep, setFabCep] = useState(existing?.content.fabricante.cep || '');
  const [fabSite, setFabSite] = useState(existing?.content.fabricante.site || '');
  const [fabSac, setFabSac] = useState(existing?.content.fabricante.sac || '');
  const [fabEmail, setFabEmail] = useState(existing?.content.fabricante.email || '');
  const [temDistribuidor, setTemDistribuidor] = useState(!!existing?.content.distribuidor);
  const [distNome, setDistNome] = useState(existing?.content.distribuidor?.nome || '');
  const [distCnpj, setDistCnpj] = useState(existing?.content.distribuidor?.cnpj || '');
  const [farmNome, setFarmNome] = useState('Dra. Ana Paula Souza');
  const [farmCrf, setFarmCrf] = useState('CRF-MG 12345');
  const [designerEmail, setDesignerEmail] = useState(existing?.designerEmail || '');

  // Status
  const [currentStatus, setCurrentStatus] = useState<LabelStatus>(existing?.status || 'em_andamento');

  // Attachments (mock)
  const [attachments, setAttachments] = useState<{name: string; type: string}[]>([]);
  const [alteracaoNotes, setAlteracaoNotes] = useState('');

  const [nutrients, setNutrients] = useState<NutrientRow[]>(
    existing?.content.tabelaNutricional.length ? existing.content.tabelaNutricional : [...NUTRIENTES_BASE]
  );

  const handleTipoChange = (val: string) => {
    setTipoSuplemento(val);
    if (val === 'capsulas') {
      if (!apresentacao) setApresentacao('Cápsulas');
      setUnidadePeso('mg');
    } else if (val === 'po') {
      if (!apresentacao) setApresentacao('Pó');
      setUnidadePeso('g');
    } else if (val === 'liquido') {
      if (!apresentacao) setApresentacao('Líquido');
      setUnidadePeso('ml');
      setUnidadePesoLiquido('ml');
    } else if (val === 'sache') {
      if (!apresentacao) setApresentacao('Sachê');
      setUnidadePeso('g');
    }
    if (!existing) setNutrients([...NUTRIENTES_BASE]);
  };

  const addNutrient = () => setNutrients([...nutrients, { id: Date.now().toString(), nutriente: '', por100g: '', porPorcao: '', vd: '' }]);
  const removeNutrient = (nid: string) => setNutrients(nutrients.filter(n => n.id !== nid));
  const updateNutrient = (nid: string, field: keyof NutrientRow, value: string) => setNutrients(nutrients.map(n => n.id === nid ? { ...n, [field]: value } : n));

  const toggleAlergenico = (item: string) => {
    setAlergenicos(prev => prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]);
  };

  const toggleAdvertencia = (idx: number) => {
    if (ADVERTENCIAS_OPTIONS[idx].required) return;
    setAdvertenciasChecked(prev => prev.map((v, i) => i === idx ? !v : v));
  };

  const usarDadosIndustria = () => {
    const ind = existing ? mockIndustries.find(i => i.id === existing.industryId) : mockIndustries[0];
    if (ind) {
      setFabNome(ind.razaoSocial);
      setFabCnpj(ind.cnpj);
      setFabRua(ind.endereco.rua);
      setFabNumero(ind.endereco.numero);
      setFabBairro(ind.endereco.bairro);
      setFabCidade(ind.endereco.cidade);
      setFabEstado(ind.endereco.estado);
      setFabCep(ind.endereco.cep);
      setFabSite(ind.site);
      toast.success('Dados da indústria preenchidos!');
    }
  };

  const industry = existing ? mockIndustries.find(i => i.id === existing.industryId) : null;

  const activeAdvertencias = useMemo(() => {
    const list = ADVERTENCIAS_OPTIONS.filter((_, i) => advertenciasChecked[i]).map(a => a.text);
    if (advertenciaExtra.trim()) list.push(advertenciaExtra.trim());
    return list;
  }, [advertenciasChecked, advertenciaExtra]);

  const alergenicosText = useMemo(() => {
    if (alergenicos.length === 0) return '';
    const contem = alergenicos.map(a => a.toUpperCase());
    return `ALÉRGICOS: CONTÉM ${contem.join(', ')}. PODE CONTER TRAÇOS DE OUTROS ALERGÊNICOS.`;
  }, [alergenicos]);

  const glutenText = useMemo(() => {
    return alergenicos.includes('Glúten') ? 'CONTÉM GLÚTEN' : 'NÃO CONTÉM GLÚTEN';
  }, [alergenicos]);

  const handleFinalizar = () => {
    setCurrentStatus('finalizado');
    toast.success('Rótulo finalizado com sucesso!');
    setTimeout(() => navigate('/'), 600);
  };

  const handleEnviarDesigner = () => {
    if (!designerEmail) { toast.error('Informe o e-mail do designer.'); return; }
    setCurrentStatus('enviado_industria');
    toast.success(`Rótulo enviado para ${designerEmail}!`);
    setTimeout(() => navigate('/'), 600);
  };

  const handleWhatsApp = () => {
    const phone = industry?.contato.whatsapp?.replace(/\D/g, '') || '';
    const msg = encodeURIComponent(`Olá! O rótulo "${nomeProduto}" está pronto para revisão.`);
    window.open(`https://wa.me/55${phone}?text=${msg}`, '_blank');
  };

  const handleSolicitarAlteracao = () => {
    if (!alteracaoNotes.trim()) { toast.error('Descreva a alteração necessária.'); return; }
    setCurrentStatus('alteracao');
    toast.info('Alteração solicitada!');
    setAlteracaoNotes('');
    setTimeout(() => navigate('/'), 600);
  };

  const handleSalvar = () => {
    toast.success('Rascunho salvo!');
  };

  const handleAttachFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setAttachments(prev => [...prev, { name: file.name, type: file.type }]);
        toast.success(`Arquivo "${file.name}" anexado!`);
      }
    };
    input.click();
  };

  // Changed fields highlighting
  const changedFields = existing?.changedFields || [];
  const isChanged = (field: string) => changedFields.includes(field);

  const sectionNumber = (num: number, title: string) => (
    <span className="flex items-center gap-2.5">
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-primary-foreground">{num}</span>
      <span>{title}</span>
    </span>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to={industry ? `/industrias/${industry.id}` : '/industrias'}>
            <Button variant="ghost" size="icon" className="rounded-full"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h2 className="text-xl font-display font-bold">{existing ? 'Editar Rótulo' : 'Novo Rótulo'}</h2>
            {industry && <span className="text-xs text-muted-foreground">{industry.nomeFantasia}</span>}
          </div>
        </div>

        {/* Status Selector */}
        <div className="flex items-center gap-3">
          <Select value={currentStatus} onValueChange={(v) => setCurrentStatus(v as LabelStatus)}>
            <SelectTrigger className="w-[220px] h-9">
              <SelectValue>
                <StatusBadge status={currentStatus} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {STATUS_ORDER.map(s => (
                <SelectItem key={s} value={s}>
                  <span className="flex items-center gap-2">
                    <span>{STATUS_CONFIG[s].icon}</span>
                    <span>{STATUS_CONFIG[s].label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="editor" className="space-y-4">
        <TabsList className="bg-muted/60">
          <TabsTrigger value="editor" className="gap-1.5"><Eye className="h-3.5 w-3.5" /> Editor</TabsTrigger>
          <TabsTrigger value="anexos" className="gap-1.5"><Paperclip className="h-3.5 w-3.5" /> Anexos & Rótulo</TabsTrigger>
          <TabsTrigger value="historico" className="gap-1.5"><ChevronRight className="h-3.5 w-3.5" /> Histórico</TabsTrigger>
        </TabsList>

        {/* ====== EDITOR TAB ====== */}
        <TabsContent value="editor">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3 space-y-0">
              <Accordion type="multiple" defaultValue={['identificacao', 'nutricional', 'ingredientes', 'uso', 'advertencias', 'conservacao', 'fabricante', 'farmaceutico']} className="space-y-2">

                {/* 1 - Identificação */}
                <AccordionItem value="identificacao" className="border rounded-xl bg-card px-5 shadow-sm">
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                    {sectionNumber(1, 'Identificação do Produto')}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`col-span-2 ${isChanged('nomeProduto') ? 'ring-2 ring-status-change-text/40 rounded-lg p-1' : ''}`}>
                        <Label>Nome do produto *</Label>
                        <Input value={nomeProduto} onChange={e => setNomeProduto(e.target.value)} placeholder="Ex: Colágeno Hidrolisado" />
                      </div>
                      <div>
                        <Label>Tipo do suplemento *</Label>
                        <Select value={tipoSuplemento} onValueChange={handleTipoChange}>
                          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="capsulas">💊 Cápsulas</SelectItem>
                            <SelectItem value="po">🥤 Pó</SelectItem>
                            <SelectItem value="liquido">💧 Líquido</SelectItem>
                            <SelectItem value="sache">📦 Sachê</SelectItem>
                            <SelectItem value="outro">📋 Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Sabor</Label>
                        <Input value={sabor} onChange={e => setSabor(e.target.value)} placeholder="Ex: Morango" />
                      </div>
                      <div>
                        <Label>Apresentação *</Label>
                        <Input value={apresentacao} onChange={e => setApresentacao(e.target.value)} />
                      </div>
                      <div>
                        <Label>Porção ({unidadePeso}) *</Label>
                        <Input type="number" value={pesoPorcao} onChange={e => setPesoPorcao(e.target.value)} />
                      </div>
                      <div>
                        <Label>Medida caseira</Label>
                        <Input value={medidaCaseira} onChange={e => setMedidaCaseira(e.target.value)} placeholder="Ex: 1 colher de sopa" />
                      </div>
                      <div>
                        <Label>Porções por embalagem *</Label>
                        <Input type="number" value={qtdPorcoes} onChange={e => setQtdPorcoes(e.target.value)} />
                      </div>
                      <div>
                        <Label>Peso/Volume líquido</Label>
                        <div className="flex gap-2">
                          <Input type="number" value={pesoLiquido} onChange={e => setPesoLiquido(e.target.value)} className="flex-1" />
                          <Select value={unidadePesoLiquido} onValueChange={setUnidadePesoLiquido}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="g">g</SelectItem>
                              <SelectItem value="ml">ml</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Código de barras</Label>
                        <Input value={codigoBarras} onChange={e => setCodigoBarras(e.target.value)} placeholder="EAN-13" />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* 2 - Tabela Nutricional */}
                <AccordionItem value="nutricional" className={`border rounded-xl bg-card px-5 shadow-sm ${isChanged('tabelaNutricional') ? 'ring-2 ring-status-change-text/40' : ''}`}>
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                    {sectionNumber(2, 'Tabela Nutricional (RDC 429/2020)')}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pb-5">
                    <div className="overflow-x-auto rounded-lg border-2 border-foreground/80">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-foreground/80 bg-muted/30">
                            <th className="px-3 py-2 text-left font-semibold text-xs"></th>
                            <th className="px-3 py-2 text-center font-semibold text-xs">100 {unidadePeso}</th>
                            <th className="px-3 py-2 text-center font-semibold text-xs">{pesoPorcao || '000'} {unidadePeso}</th>
                            <th className="px-3 py-2 text-center font-semibold text-xs">%VD*</th>
                            <th className="px-3 py-2 w-8"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {nutrients.map(n => (
                            <tr key={n.id} className="border-b border-foreground/20 hover:bg-muted/20 transition-colors">
                              <td className="px-2 py-1"><Input value={n.nutriente} onChange={e => updateNutrient(n.id, 'nutriente', e.target.value)} className="h-8 text-xs border-none shadow-none bg-transparent px-1 font-medium" /></td>
                              <td className="px-2 py-1"><Input value={n.por100g} onChange={e => updateNutrient(n.id, 'por100g', e.target.value)} className="h-8 text-xs text-center border-none shadow-none bg-transparent" /></td>
                              <td className="px-2 py-1"><Input value={n.porPorcao} onChange={e => updateNutrient(n.id, 'porPorcao', e.target.value)} className="h-8 text-xs text-center border-none shadow-none bg-transparent" /></td>
                              <td className="px-2 py-1"><Input value={n.vd} onChange={e => updateNutrient(n.id, 'vd', e.target.value)} className="h-8 text-xs text-center border-none shadow-none bg-transparent" /></td>
                              <td className="px-2 py-1"><button onClick={() => removeNutrient(n.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm" onClick={addNutrient} className="gap-1.5 rounded-full"><Plus className="h-3 w-3" /> Adicionar nutriente</Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox checked={naoContemSignificativo} onCheckedChange={(v) => setNaoContemSignificativo(!!v)} />
                      <span className="text-xs text-muted-foreground">Não contém quantidades significativas de nutrientes não listados</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">* Percentual de Valores Diários fornecidos pela porção.</p>
                  </AccordionContent>
                </AccordionItem>

                {/* 3 - Ingredientes e Alergênicos */}
                <AccordionItem value="ingredientes" className={`border rounded-xl bg-card px-5 shadow-sm ${isChanged('ingredientes') ? 'ring-2 ring-status-change-text/40' : ''}`}>
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                    {sectionNumber(3, 'Ingredientes e Alergênicos')}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-5">
                    <div>
                      <Label>Lista de ingredientes *</Label>
                      <Textarea value={ingredientes} onChange={e => setIngredientes(e.target.value)} placeholder="Listar em ordem decrescente de quantidade..." rows={4} />
                    </div>
                    <div>
                      <Label className="mb-2 block">Declaração de Alergênicos</Label>
                      <div className="flex flex-wrap gap-2">
                        {ALERGENICOS_OPTIONS.map(item => (
                          <Badge
                            key={item}
                            variant={alergenicos.includes(item) ? 'default' : 'outline'}
                            className="cursor-pointer select-none transition-all hover:scale-105 text-xs"
                            onClick={() => toggleAlergenico(item)}
                          >
                            {alergenicos.includes(item) ? '✓ ' : ''}{item}
                          </Badge>
                        ))}
                      </div>
                      {alergenicos.length > 0 && (
                        <p className="mt-2 text-xs font-semibold text-destructive">{alergenicosText}</p>
                      )}
                    </div>
                    <div>
                      <Label>Aromatizante / Corante</Label>
                      <Select value={aromatizante} onValueChange={setAromatizante}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Aroma natural">Aroma natural</SelectItem>
                          <SelectItem value="Aroma idêntico ao natural">Aroma idêntico ao natural</SelectItem>
                          <SelectItem value="Aroma artificial">Aroma artificial</SelectItem>
                          <SelectItem value="Corante natural">Corante natural</SelectItem>
                          <SelectItem value="Corante artificial">Corante artificial</SelectItem>
                        </SelectContent>
                      </Select>
                      {aromatizante && (
                        <Input className="mt-2" value={aromatizante} onChange={e => setAromatizante(e.target.value)} placeholder="Especifique" />
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* 4 - Uso */}
                <AccordionItem value="uso" className="border rounded-xl bg-card px-5 shadow-sm">
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                    {sectionNumber(4, 'Informações de Uso')}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-5">
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
                <AccordionItem value="advertencias" className={`border rounded-xl bg-card px-5 shadow-sm ${isChanged('advertencias') ? 'ring-2 ring-status-change-text/40' : ''}`}>
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                    {sectionNumber(5, 'Advertências')}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pb-5">
                    {ADVERTENCIAS_OPTIONS.map((adv, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Checkbox checked={advertenciasChecked[i]} onCheckedChange={() => toggleAdvertencia(i)} disabled={adv.required} className="mt-0.5" />
                        <div className="flex-1">
                          <span className="text-sm">{adv.text}</span>
                          {adv.required && <span className="ml-2 text-[10px] text-muted-foreground">(obrigatória)</span>}
                        </div>
                      </div>
                    ))}
                    <div className="pt-2">
                      <Label>Advertência adicional</Label>
                      <Input value={advertenciaExtra} onChange={e => setAdvertenciaExtra(e.target.value)} placeholder="Ex: CONTÉM CAFEÍNA." />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* 6 - Conservação */}
                <AccordionItem value="conservacao" className="border rounded-xl bg-card px-5 shadow-sm">
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                    {sectionNumber(6, 'Conservação')}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <Textarea value={conservacao} onChange={e => setConservacao(e.target.value)} rows={3} />
                  </AccordionContent>
                </AccordionItem>

                {/* 7 - Fabricante */}
                <AccordionItem value="fabricante" className="border rounded-xl bg-card px-5 shadow-sm">
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                    {sectionNumber(7, 'Fabricante / Distribuidor')}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-5">
                    <Button variant="outline" size="sm" onClick={usarDadosIndustria} className="gap-1.5 rounded-full">
                      <Building2 className="h-3.5 w-3.5" /> Usar dados da indústria
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2"><Label>Razão Social *</Label><Input value={fabNome} onChange={e => setFabNome(e.target.value)} /></div>
                      <div><Label>CNPJ *</Label><Input value={fabCnpj} onChange={e => setFabCnpj(e.target.value)} /></div>
                      <div><Label>Rua</Label><Input value={fabRua} onChange={e => setFabRua(e.target.value)} /></div>
                      <div><Label>Nº</Label><Input value={fabNumero} onChange={e => setFabNumero(e.target.value)} /></div>
                      <div><Label>Bairro</Label><Input value={fabBairro} onChange={e => setFabBairro(e.target.value)} /></div>
                      <div><Label>Cidade</Label><Input value={fabCidade} onChange={e => setFabCidade(e.target.value)} /></div>
                      <div><Label>UF</Label><Input value={fabEstado} onChange={e => setFabEstado(e.target.value)} maxLength={2} /></div>
                      <div><Label>CEP</Label><Input value={fabCep} onChange={e => setFabCep(e.target.value)} /></div>
                      <div><Label>Site</Label><Input value={fabSite} onChange={e => setFabSite(e.target.value)} /></div>
                      <div><Label>SAC</Label><Input value={fabSac} onChange={e => setFabSac(e.target.value)} /></div>
                      <div><Label>E-mail</Label><Input value={fabEmail} onChange={e => setFabEmail(e.target.value)} /></div>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <Switch checked={temDistribuidor} onCheckedChange={setTemDistribuidor} />
                      <Label>Tem distribuidor?</Label>
                    </div>
                    {temDistribuidor && (
                      <div className="grid grid-cols-2 gap-3 pl-4 border-l-2 border-primary/20">
                        <div><Label>Nome</Label><Input value={distNome} onChange={e => setDistNome(e.target.value)} /></div>
                        <div><Label>CNPJ</Label><Input value={distCnpj} onChange={e => setDistCnpj(e.target.value)} /></div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* 8 - Farmacêutico */}
                <AccordionItem value="farmaceutico" className="border rounded-xl bg-card px-5 shadow-sm">
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                    {sectionNumber(8, 'Farmacêutico Responsável')}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pb-5">
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Nome completo</Label><Input value={farmNome} onChange={e => setFarmNome(e.target.value)} /></div>
                      <div><Label>CRF / Estado</Label><Input value={farmCrf} onChange={e => setFarmCrf(e.target.value)} /></div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Preview */}
            <div className="lg:col-span-2">
              <div className="sticky top-20 space-y-3">
                <Card className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Preview do Rótulo</h3>
                    <StatusBadge status={currentStatus} size="sm" />
                  </div>

                  <div className="border rounded-lg p-4 space-y-2.5 text-xs bg-card">
                    <p className="text-sm font-display font-bold text-center">{nomeProduto || 'Nome do Produto'}</p>
                    {sabor && <p className="text-center text-muted-foreground text-[11px]">Sabor: {sabor}</p>}
                    <p className="text-center text-muted-foreground text-[11px]">{apresentacao || 'Apresentação'}</p>

                    {/* ANVISA Nutrition Table */}
                    {pesoPorcao && (
                      <div className="border border-foreground/80 rounded overflow-hidden mt-2">
                        <div className="border-b-2 border-foreground/80 px-2 py-1.5">
                          <p className="font-bold text-xs text-center uppercase">Informação Nutricional</p>
                        </div>
                        <div className="px-2 py-1 border-b border-foreground/40 text-[10px] leading-tight">
                          <p>Porções por embalagem: {qtdPorcoes || '—'} porções</p>
                          <p>Porção: {pesoPorcao} {unidadePeso}{medidaCaseira ? ` (${medidaCaseira})` : ''}</p>
                        </div>
                        <table className="w-full text-[10px]">
                          <thead>
                            <tr className="border-b border-foreground/60">
                              <th className="text-left px-2 py-1 font-semibold"></th>
                              <th className="text-center px-1 py-1 font-semibold">100 {unidadePeso}</th>
                              <th className="text-center px-1 py-1 font-semibold">{pesoPorcao} {unidadePeso}</th>
                              <th className="text-center px-1 py-1 font-semibold">%VD*</th>
                            </tr>
                          </thead>
                          <tbody>
                            {nutrients.filter(n => n.nutriente).map(n => (
                              <tr key={n.id} className="border-b border-foreground/15">
                                <td className="px-2 py-0.5">{n.nutriente}</td>
                                <td className="text-center px-1 py-0.5">{n.por100g || '—'}</td>
                                <td className="text-center px-1 py-0.5">{n.porPorcao || '—'}</td>
                                <td className="text-center px-1 py-0.5">{n.vd ? `${n.vd}%` : '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {naoContemSignificativo && (
                          <p className="px-2 py-0.5 text-[8px] text-muted-foreground border-t border-foreground/15">
                            Não contém quantidades significativas de nutrientes não listados.
                          </p>
                        )}
                        <p className="px-2 py-0.5 text-[8px] text-muted-foreground border-t border-foreground/15">
                          *Percentual de valores diários fornecidos pela porção.
                        </p>
                      </div>
                    )}

                    {ingredientes && (
                      <div className="pt-1.5">
                        <p className="font-bold uppercase text-[10px]">Ingredientes</p>
                        <p className="text-[10px]">{ingredientes}</p>
                      </div>
                    )}

                    <div className="pt-1">
                      <p className="font-bold text-[10px]">{glutenText}</p>
                      {alergenicos.length > 0 && <p className="font-bold text-destructive text-[9px] mt-0.5">{alergenicosText}</p>}
                    </div>

                    {aromatizante && <p className="text-muted-foreground text-[10px]">Contém aromatizante: {aromatizante}</p>}
                    {sugestaoUso && <div className="pt-1"><p className="font-bold uppercase text-[10px]">Modo de Uso</p><p className="text-[10px]">{sugestaoUso}</p></div>}
                    {activeAdvertencias.length > 0 && (
                      <div className="pt-1 space-y-0.5">
                        {activeAdvertencias.map((a, i) => <p key={i} className="font-bold uppercase text-[9px]">{a}</p>)}
                      </div>
                    )}
                    {conservacao && <div className="pt-1"><p className="font-bold uppercase text-[10px]">Conservação</p><p className="text-[10px]">{conservacao}</p></div>}
                    {dispensadoRegistro && <p className="pt-1 text-muted-foreground italic text-[9px]">Produto dispensado de registro conforme RDC n° 240/2018.</p>}
                    {fabNome && (
                      <div className="pt-1.5 border-t">
                        <p className="font-bold text-[9px]">Fabricado por: {fabNome}</p>
                        {fabCnpj && <p className="text-[9px]">CNPJ: {fabCnpj}</p>}
                        {fabRua && <p className="text-[9px]">{fabRua}, {fabNumero} - {fabBairro} - {fabCidade}/{fabEstado}</p>}
                      </div>
                    )}
                    {farmNome && (
                      <div className="pt-1 border-t text-[9px]">
                        <p>Farm. Resp.: {farmNome} — {farmCrf}</p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Designer & Actions */}
                <Card className="p-4 space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground">E-mail do Designer</Label>
                  <Input value={designerEmail} onChange={e => setDesignerEmail(e.target.value)} placeholder="designer@email.com" />

                  {currentStatus === 'alteracao' && (
                    <div>
                      <Label className="text-xs font-semibold text-status-change-text">Notas de alteração</Label>
                      <Textarea value={alteracaoNotes} onChange={e => setAlteracaoNotes(e.target.value)} placeholder="Descreva o que precisa ser alterado..." rows={3} className="mt-1" />
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ====== ANEXOS TAB ====== */}
        <TabsContent value="anexos">
          <div className="max-w-2xl space-y-6">
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-sm">Rótulo CRU (arquivo original da indústria)</h3>
              <p className="text-xs text-muted-foreground">Anexe aqui o rótulo bruto enviado pela indústria para referência.</p>
              <Button variant="outline" onClick={handleAttachFile} className="gap-2 rounded-full">
                <Upload className="h-4 w-4" /> Anexar Rótulo CRU
              </Button>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-sm">Rótulo do Designer (versão pronta)</h3>
              <p className="text-xs text-muted-foreground">Anexe a versão finalizada pelo designer. Caso precise de alteração, selecione "Solicitação de Alteração" no status e descreva as correções.</p>
              <Button variant="outline" onClick={handleAttachFile} className="gap-2 rounded-full">
                <Upload className="h-4 w-4" /> Anexar Rótulo Designer
              </Button>
            </Card>

            {attachments.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold text-sm mb-3">Arquivos Anexados</h3>
                <div className="space-y-2">
                  {attachments.map((a, i) => (
                    <div key={i} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{a.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* ====== HISTÓRICO TAB ====== */}
        <TabsContent value="historico">
          <Card className="p-6 max-w-2xl">
            <h3 className="font-semibold text-sm mb-4">Histórico de Alterações</h3>
            {existing?.revisions && existing.revisions.length > 0 ? (
              <div className="space-y-3">
                {existing.revisions.map(r => (
                  <div key={r.id} className="border-l-2 border-primary/30 pl-4 py-2">
                    <p className="text-sm font-medium">{STATUS_CONFIG[r.fromStatus].label} → {STATUS_CONFIG[r.toStatus].label}</p>
                    <p className="text-xs text-muted-foreground">{r.notes}</p>
                    {r.changedFields.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {r.changedFields.map(f => (
                          <Badge key={f} variant="outline" className="text-[10px]">{f}</Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1">{r.createdAt}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma alteração registrada ainda.</p>
            )}

            {changedFields.length > 0 && (
              <div className="mt-6 p-4 bg-status-change-bg/50 rounded-lg">
                <h4 className="text-sm font-semibold text-status-change-text mb-2">Campos alterados (destacados no editor)</h4>
                <div className="flex flex-wrap gap-1.5">
                  {changedFields.map(f => (
                    <Badge key={f} className="bg-status-change-bg text-status-change-text text-xs">{f}</Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Bar */}
      <div className="sticky bottom-0 border-t bg-card py-3 px-4 -mx-6 -mb-6 flex items-center gap-2 justify-between flex-wrap rounded-t-xl shadow-lg">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 rounded-full" onClick={handleSalvar}>
            <Save className="h-4 w-4" /> Salvar
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 rounded-full" onClick={() => toast.info('PDF gerado! (em desenvolvimento)')}>
            <FileDown className="h-4 w-4" /> Exportar PDF
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 rounded-full" onClick={handleWhatsApp}>
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 rounded-full" onClick={handleEnviarDesigner}>
            <Send className="h-4 w-4" /> Enviar ao Designer
          </Button>
          {currentStatus === 'alteracao' && (
            <Button variant="outline" size="sm" className="gap-1.5 rounded-full border-status-change-text/30 text-status-change-text hover:bg-status-change-bg" onClick={handleSolicitarAlteracao}>
              Enviar Alteração
            </Button>
          )}
          <Button size="sm" className="gap-1.5 rounded-full" onClick={handleFinalizar}>
            <CheckCircle className="h-4 w-4" /> Finalizar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LabelEditor;
