import { IExtraUser } from 'app/entities/extra-user/extra-user.model';
import { IMedecinPatient } from 'app/entities/medecin-patient/medecin-patient.model';

export interface IMedecin {
  id?: number;
  specialite?: string | null;
  extraUserId?: IExtraUser | null;
  medecinPatients?: IMedecinPatient[] | null;
}

export class Medecin implements IMedecin {
  constructor(
    public id?: number,
    public specialite?: string | null,
    public extraUserId?: IExtraUser | null,
    public medecinPatients?: IMedecinPatient[] | null
  ) {}
}

export function getMedecinIdentifier(medecin: IMedecin): number | undefined {
  return medecin.id;
}
