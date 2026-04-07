import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface NewIndustryDialogProps {
  trigger?: React.ReactNode;
}

const NewIndustryDialog = ({ trigger }: NewIndustryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    razaoSocial: '', nomeFantasia: '', cnpj: '',
    rua: '', numero: '', bairro: '', cidade: '', estado: '', cep: '',
    contatoNome: '', contatoEmail: '', contatoTelefone: '', contatoWhatsapp: '',
    site: '', observacoes: '',
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.razaoSocial || !form.nomeFantasia || !form.cnpj) {
      toast.error('Preencha os campos obrigatórios.');
      return;
    }
    toast.success(`Indústria "${form.nomeFantasia}" cadastrada com sucesso!`);
    setOpen(false);
    setForm({ razaoSocial: '', nomeFantasia: '', cnpj: '', rua: '', numero: '', bairro: '', cidade: '', estado: '', cep: '', contatoNome: '', contatoEmail: '', contatoTelefone: '', contatoWhatsapp: '', site: '', observacoes: '' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-1.5">
            <Plus className="h-4 w-4" />
            Nova Indústria
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Cadastrar Nova Indústria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Dados da empresa */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dados da Empresa</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Razão Social *</Label>
                <Input value={form.razaoSocial} onChange={e => update('razaoSocial', e.target.value)} placeholder="Nome jurídico completo" />
              </div>
              <div>
                <Label>Nome Fantasia *</Label>
                <Input value={form.nomeFantasia} onChange={e => update('nomeFantasia', e.target.value)} placeholder="Nome comercial" />
              </div>
              <div>
                <Label>CNPJ *</Label>
                <Input value={form.cnpj} onChange={e => update('cnpj', e.target.value)} placeholder="00.000.000/0000-00" />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Endereço</p>
            <div className="grid grid-cols-6 gap-3">
              <div className="col-span-4">
                <Label>Rua</Label>
                <Input value={form.rua} onChange={e => update('rua', e.target.value)} />
              </div>
              <div className="col-span-2">
                <Label>Número</Label>
                <Input value={form.numero} onChange={e => update('numero', e.target.value)} />
              </div>
              <div className="col-span-2">
                <Label>Bairro</Label>
                <Input value={form.bairro} onChange={e => update('bairro', e.target.value)} />
              </div>
              <div className="col-span-2">
                <Label>Cidade</Label>
                <Input value={form.cidade} onChange={e => update('cidade', e.target.value)} />
              </div>
              <div>
                <Label>UF</Label>
                <Input value={form.estado} onChange={e => update('estado', e.target.value)} maxLength={2} />
              </div>
              <div>
                <Label>CEP</Label>
                <Input value={form.cep} onChange={e => update('cep', e.target.value)} placeholder="00000-000" />
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contato</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Nome do contato</Label>
                <Input value={form.contatoNome} onChange={e => update('contatoNome', e.target.value)} />
              </div>
              <div>
                <Label>E-mail</Label>
                <Input type="email" value={form.contatoEmail} onChange={e => update('contatoEmail', e.target.value)} />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input value={form.contatoTelefone} onChange={e => update('contatoTelefone', e.target.value)} />
              </div>
              <div>
                <Label>WhatsApp</Label>
                <Input value={form.contatoWhatsapp} onChange={e => update('contatoWhatsapp', e.target.value)} />
              </div>
            </div>
          </div>

          <div>
            <Label>Site</Label>
            <Input value={form.site} onChange={e => update('site', e.target.value)} placeholder="www.exemplo.com.br" />
          </div>
          <div>
            <Label>Observações</Label>
            <Textarea value={form.observacoes} onChange={e => update('observacoes', e.target.value)} rows={2} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Cadastrar Indústria</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewIndustryDialog;
