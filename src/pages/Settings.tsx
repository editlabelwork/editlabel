import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const Settings = () => {
  return (
    <div className="max-w-2xl space-y-6">
      <Card className="p-6 space-y-4">
        <h3 className="font-display font-semibold">Perfil do Farmacêutico</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Nome completo</Label>
            <Input defaultValue="Dr. Rafael Souza" />
          </div>
          <div>
            <Label>Email</Label>
            <Input defaultValue="rafael@editlabel.com" />
          </div>
          <div>
            <Label>CRF</Label>
            <Input defaultValue="11929" />
          </div>
          <div>
            <Label>Estado</Label>
            <Input defaultValue="MG" />
          </div>
          <div>
            <Label>Telefone</Label>
            <Input defaultValue="(31) 99999-9999" />
          </div>
        </div>
        <Button>Salvar Alterações</Button>
      </Card>
    </div>
  );
};

export default Settings;
