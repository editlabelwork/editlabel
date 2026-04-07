import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, FileDown, Send, AlertCircle, CheckCircle, Plus, Trash2, RotateCcw, Building2 } from 'lucide-react';
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
import { mockLabels, mockIndustries } from '@/data/mockData';
import StatusBadge from '@/components/StatusBadge';
import type { NutrientRow } from '@/types';
import { toast } from 'sonner';

const NUTRIENTES_CAPSULAS: NutrientRow[] = [
  { id: '1', nutriente: 'Valor Energético', por100g: '', porPorcao: '', vd: '' },
  { id: '2', nutriente: 'Proteínas', por100g: '', porPorcao: '', vd: '' },
  { id: '3', nutriente: 'Gorduras totais', por100g: '', porPorcao: '', vd: '' },
  { id: '4', nutriente: 'Gorduras saturadas', por100g: '', porPorcao: '', vd: '' },
  { id: '5', nutriente: 'Gorduras trans', por100g: '', porPorcao: '', vd: '' },
  { id: '6', nutriente: 'Carboidratos', por100g: '', porPorcao: '', vd: '' },
  { id: '7', nutriente: 'Açúcares totais', por100g: '', porPorcao: '', vd: '' },
  { id: '8', nutriente: 'Açúcares adicionados', por100g: '', porPorcao: '', vd: '' },
  { id: '9', nutriente: 'Fibras', por100g: '', porPorcao: '', vd: '' },
  { id: '10', nutriente: 'Sódio', por100g: '', porPorcao: '', vd: '' },
];

const NUTRIENTES_PO: NutrientRow[] = [
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

  // Farmacêutico
  const [farmNome, setFarmNome] = useState('Dra. Ana Paula Souza');
  const [farmCrf, setFarmCrf] = useState('CRF-MG 12345');

  // Designer email
  const [designerEmail, setDesignerEmail] = useState(existing?.designerEmail || '');

  const getNutrientPreset = (tipo: string) => {
    if (tipo === 'capsulas') return NUTRIENTES_CAPSULAS;
    return NUTRIENTES_PO;
  };

  const [nutrients, setNutrients] = useState<NutrientRow[]>(
    existing?.content.tabelaNutricional.length ? existing.content.tabelaNutricional : getNutrientPreset(tipoSuplemento || 'po')
  );

  const handleTipoChange = (val: string) => {
    setTipoSuplemento(val);
    // Auto-set presentation & units
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
    // Reset nutrients to preset
    if (!existing) {
      setNutrients(getNutrientPreset(val));
    }
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
    if (alergenicos.length === 0) return 'NÃO CONTÉM DECLARAÇÃO DE ALERGÊNICOS.';
    const contem = alergenicos.map(a => a.toLowerCase());
    return `ALÉRGICOS: CONTÉM ${contem.join(', ').toUpperCase()}. PODE CONTER TRAÇOS DE OUTROS ALERGÊNICOS.`;
  }, [alergenicos]);

  const glutenText = useMemo(() => {
    return alergenicos.includes('Glúten') ? 'CONTÉM GLÚTEN' : 'NÃO CONTÉM GLÚTEN';
  }, [alergenicos]);

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
          <Accordion type="multiple" defaultValue={['identificacao', 'nutricional', 'ingredientes', 'uso', 'advertencias', 'conservacao', 'fabricante', 'farmaceutico']} className="space-y-3">

            {/* 1 - Identificação */}
            <AccordionItem value="identificacao" className="border rounded-lg bg-card px-4">
              <AccordionTrigger className="text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">1</span>
                  Identificação do Produto
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Nome do produto *</Label>
                    <Input value={nomeProduto} onChange={e => setNomeProduto(e.target.value)} placeholder="Ex: Colágeno Hidrolisado" />
                  </div>
                  <div>
                    <Label>Tipo do suplemento *</Label>
                    <Select value={tipoSuplemento} onValueChange={handleTipoChange}>
                      <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
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
                    <Input value={apresentacao} onChange={e => setApresentacao(e.target.value)} placeholder={tipoSuplemento === 'capsulas' ? 'Ex: Cápsulas 60 un' : 'Ex: Pó 300g'} />
                  </div>
                  <div>
                    <Label>Porção ({unidadePeso}) *</Label>
                    <Input type="number" value={pesoPorcao} onChange={e => setPesoPorcao(e.target.value)} />
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
            <AccordionItem value="nutricional" className="border rounded-lg bg-card px-4">
              <AccordionTrigger className="text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">2</span>
                  Tabela Nutricional
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 text-left text-muted-foreground">
                        <th className="px-3 py-2 font-medium">Nutriente</th>
                        <th className="px-3 py-2 font-medium">Por 100g</th>
                        <th className="px-3 py-2 font-medium">Por Porção</th>
                        <th className="px-3 py-2 font-medium">%VD*</th>
                        <th className="px-3 py-2 w-8"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {nutrients.map(n => (
                        <tr key={n.id} className="border-t">
                          <td className="px-2 py-1.5"><Input value={n.nutriente} onChange={e => updateNutrient(n.id, 'nutriente', e.target.value)} className="h-8 text-xs" /></td>
                          <td className="px-2 py-1.5"><Input value={n.por100g} onChange={e => updateNutrient(n.id, 'por100g', e.target.value)} className="h-8 text-xs" /></td>
                          <td className="px-2 py-1.5"><Input value={n.porPorcao} onChange={e => updateNutrient(n.id, 'porPorcao', e.target.value)} className="h-8 text-xs" /></td>
                          <td className="px-2 py-1.5"><Input value={n.vd} onChange={e => updateNutrient(n.id, 'vd', e.target.value)} className="h-8 text-xs" /></td>
                          <td className="px-2 py-1.5"><button onClick={() => removeNutrient(n.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" onClick={addNutrient} className="gap-1"><Plus className="h-3 w-3" /> Adicionar nutriente</Button>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={naoContemSignificativo} onCheckedChange={(v) => setNaoContemSignificativo(!!v)} />
                  <span className="text-xs text-muted-foreground">Não contém quantidades significativas de nutrientes não listados</span>
                </div>
                <p className="text-xs text-muted-foreground">* Percentual de Valores Diários fornecidos pela porção.</p>
              </AccordionContent>
            </AccordionItem>

            {/* 3 - Ingredientes e Alergênicos */}
            <AccordionItem value="ingredientes" className="border rounded-lg bg-card px-4">
              <AccordionTrigger className="text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">3</span>
                  Ingredientes e Alergênicos
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4">
                <div>
                  <Label>Lista de ingredientes *</Label>
                  <Textarea value={ingredientes} onChange={e => setIngredientes(e.target.value)} placeholder="Listar em ordem decrescente de quantidade..." rows={4} />
                  <p className="text-xs text-muted-foreground mt-1">Dica: liste os ingredientes em ordem decrescente de quantidade conforme RDC 429/2020.</p>
                </div>

                <div>
                  <Label className="mb-2 block">Declaração de Alergênicos</Label>
                  <div className="flex flex-wrap gap-2">
                    {ALERGENICOS_OPTIONS.map(item => (
                      <Badge
                        key={item}
                        variant={alergenicos.includes(item) ? 'default' : 'outline'}
                        className="cursor-pointer select-none transition-all hover:scale-105"
                        onClick={() => toggleAlergenico(item)}
                      >
                        {item}
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
                    <SelectTrigger><SelectValue placeholder="Selecione ou digite" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aroma natural">Aroma natural</SelectItem>
                      <SelectItem value="Aroma idêntico ao natural">Aroma idêntico ao natural</SelectItem>
                      <SelectItem value="Aroma artificial">Aroma artificial</SelectItem>
                      <SelectItem value="Corante natural">Corante natural</SelectItem>
                      <SelectItem value="Corante artificial">Corante artificial</SelectItem>
                    </SelectContent>
                  </Select>
                  {aromatizante && (
                    <Input className="mt-2" value={aromatizante} onChange={e => setAromatizante(e.target.value)} placeholder="Especifique. Ex: Aroma idêntico ao natural de manga" />
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 4 - Uso */}
            <AccordionItem value="uso" className="border rounded-lg bg-card px-4">
              <AccordionTrigger className="text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">4</span>
                  Informações de Uso
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4">
                <div>
                  <Label>Sugestão de uso *</Label>
                  <Textarea value={sugestaoUso} onChange={e => setSugestaoUso(e.target.value)} rows={3} placeholder={tipoSuplemento === 'capsulas' ? 'Ex: Ingerir 2 cápsulas ao dia junto às refeições.' : 'Ex: Dissolver 10g (1 colher de sopa) em 200ml de água.'} />
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
              <AccordionTrigger className="text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">5</span>
                  Advertências
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                {ADVERTENCIAS_OPTIONS.map((adv, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Checkbox
                      checked={advertenciasChecked[i]}
                      onCheckedChange={() => toggleAdvertencia(i)}
                      disabled={adv.required}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-sm">{adv.text}</span>
                      {adv.required && <span className="ml-2 text-[10px] text-muted-foreground">(obrigatória)</span>}
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <Label>Advertência adicional (opcional)</Label>
                  <Input value={advertenciaExtra} onChange={e => setAdvertenciaExtra(e.target.value)} placeholder="Ex: CONTÉM CAFEÍNA. EVITAR O USO PRÓXIMO AO PERÍODO DE SONO." />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 6 - Conservação */}
            <AccordionItem value="conservacao" className="border rounded-lg bg-card px-4">
              <AccordionTrigger className="text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">6</span>
                  Conservação
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <Textarea value={conservacao} onChange={e => setConservacao(e.target.value)} rows={3} />
              </AccordionContent>
            </AccordionItem>

            {/* 7 - Fabricante */}
            <AccordionItem value="fabricante" className="border rounded-lg bg-card px-4">
              <AccordionTrigger className="text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">7</span>
                  Fabricante / Distribuidor
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4">
                <Button variant="outline" size="sm" onClick={usarDadosIndustria} className="gap-1.5">
                  <Building2 className="h-3.5 w-3.5" /> Usar dados da indústria cadastrada
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
            <AccordionItem value="farmaceutico" className="border rounded-lg bg-card px-4">
              <AccordionTrigger className="text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">8</span>
                  Farmacêutico Responsável
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                <p className="text-xs text-muted-foreground">Pré-preenchido do seu perfil. Edite se necessário.</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Nome completo</Label><Input value={farmNome} onChange={e => setFarmNome(e.target.value)} /></div>
                  <div><Label>CRF / Estado</Label><Input value={farmCrf} onChange={e => setFarmCrf(e.target.value)} /></div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Preview - ANVISA format */}
        <div className="lg:col-span-2">
          <div className="sticky top-20 space-y-3">
            <Card className="p-5 space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Preview do Rótulo</h3>
              <div className="border-2 border-foreground/20 rounded-lg p-4 space-y-3 text-xs bg-card">
                <p className="text-base font-display font-bold text-center">{nomeProduto || 'Nome do Produto'}</p>
                {sabor && <p className="text-center text-muted-foreground">Sabor: {sabor}</p>}
                <p className="text-center text-muted-foreground">{apresentacao || 'Apresentação'}</p>

                {/* Tabela Nutricional ANVISA */}
                {pesoPorcao && (
                  <div className="border-2 border-foreground rounded-md overflow-hidden mt-3">
                    <div className="bg-foreground text-background px-3 py-1.5 text-center">
                      <p className="font-bold text-xs uppercase tracking-wide">Informação Nutricional</p>
                    </div>
                    <div className="px-3 py-1.5 border-b border-foreground/30 text-[10px]">
                      <p>Porções por embalagem: {qtdPorcoes || '—'}</p>
                      <p>Porção: {pesoPorcao}{unidadePeso}</p>
                    </div>
                    <table className="w-full text-[10px]">
                      <thead>
                        <tr className="border-b-2 border-foreground">
                          <th className="text-left px-2 py-1 font-bold"></th>
                          <th className="text-right px-2 py-1 font-bold">100{unidadePeso}</th>
                          <th className="text-right px-2 py-1 font-bold">Porção</th>
                          <th className="text-right px-2 py-1 font-bold">%VD*</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nutrients.filter(n => n.nutriente).map(n => (
                          <tr key={n.id} className="border-b border-foreground/20">
                            <td className="px-2 py-0.5 font-medium">{n.nutriente}</td>
                            <td className="text-right px-2 py-0.5">{n.por100g || '—'}</td>
                            <td className="text-right px-2 py-0.5">{n.porPorcao || '—'}</td>
                            <td className="text-right px-2 py-0.5">{n.vd || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {naoContemSignificativo && (
                      <p className="px-2 py-1 text-[8px] text-muted-foreground border-t border-foreground/20">
                        Não contém quantidades significativas de nutrientes não listados.
                      </p>
                    )}
                    <p className="px-2 py-1 text-[8px] text-muted-foreground border-t border-foreground/20">
                      * Percentual de Valores Diários fornecidos pela porção.
                    </p>
                  </div>
                )}

                {ingredientes && (
                  <div className="pt-2">
                    <p className="font-bold uppercase">Ingredientes</p>
                    <p>{ingredientes}</p>
                  </div>
                )}

                <div className="pt-1">
                  <p className="font-bold">{glutenText}</p>
                  {alergenicos.length > 0 && <p className="font-bold text-destructive text-[10px] mt-0.5">{alergenicosText}</p>}
                </div>

                {aromatizante && <p className="text-muted-foreground">Contém aromatizante: {aromatizante}</p>}

                {sugestaoUso && (
                  <div className="pt-2">
                    <p className="font-bold uppercase">Modo de Uso</p>
                    <p>{sugestaoUso}</p>
                  </div>
                )}

                {grupoPopulacional && <p className="text-muted-foreground">Indicado para {grupoPopulacional}</p>}

                {activeAdvertencias.length > 0 && (
                  <div className="pt-2 space-y-0.5">
                    {activeAdvertencias.map((a, i) => <p key={i} className="font-bold uppercase text-[10px]">{a}</p>)}
                  </div>
                )}

                {conservacao && (
                  <div className="pt-2">
                    <p className="font-bold uppercase">Conservação</p>
                    <p>{conservacao}</p>
                  </div>
                )}

                {dispensadoRegistro && (
                  <p className="pt-2 text-muted-foreground italic text-[10px]">Produto dispensado de registro conforme RDC n° 240/2018.</p>
                )}

                {fabNome && (
                  <div className="pt-2 border-t">
                    <p className="font-bold text-[10px]">Fabricado por: {fabNome}</p>
                    {fabCnpj && <p className="text-[10px]">CNPJ: {fabCnpj}</p>}
                    {fabRua && <p className="text-[10px]">{fabRua}, {fabNumero} - {fabBairro} - {fabCidade}/{fabEstado} - CEP: {fabCep}</p>}
                    {fabSac && <p className="text-[10px]">SAC: {fabSac}</p>}
                  </div>
                )}

                {temDistribuidor && distNome && (
                  <div className="pt-1">
                    <p className="font-bold text-[10px]">Distribuído por: {distNome}</p>
                    {distCnpj && <p className="text-[10px]">CNPJ: {distCnpj}</p>}
                  </div>
                )}

                {farmNome && (
                  <div className="pt-2 border-t text-[10px]">
                    <p>Farm. Resp.: {farmNome} — {farmCrf}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Designer email */}
            <Card className="p-4">
              <Label className="text-xs font-semibold text-muted-foreground">E-mail do Designer</Label>
              <Input value={designerEmail} onChange={e => setDesignerEmail(e.target.value)} placeholder="designer@email.com" className="mt-1.5" />
            </Card>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="sticky bottom-0 border-t bg-card py-3 px-4 -mx-6 -mb-6 flex items-center gap-2 justify-end flex-wrap">
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success('Rascunho salvo!')}>
          <Save className="h-4 w-4" /> Salvar Rascunho
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.info('PDF gerado! (em desenvolvimento)')}>
          <FileDown className="h-4 w-4" /> Exportar PDF
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => {
          if (!designerEmail) { toast.error('Informe o e-mail do designer.'); return; }
          toast.success(`Rótulo enviado para ${designerEmail}!`);
        }}>
          <Send className="h-4 w-4" /> Enviar ao Designer
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5 text-status-change-text border-status-change-text/30 hover:bg-status-change-bg" onClick={() => toast.info('Alteração solicitada!')}>
          <RotateCcw className="h-4 w-4" /> Solicitar Alteração
        </Button>
        <Button size="sm" className="gap-1.5" onClick={() => toast.success('Rótulo finalizado e aprovado!')}>
          <CheckCircle className="h-4 w-4" /> Finalizar
        </Button>
      </div>
    </div>
  );
};

export default LabelEditor;
