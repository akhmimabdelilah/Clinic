import * as dayjs from 'dayjs';
import { IMedecin } from 'app/entities/medecin/medecin.model';
import { IPatient } from 'app/entities/patient/patient.model';

export interface IMedecinPatient {
  id?: number;
  dateDebut?: dayjs.Dayjs | null;
  dateFin?: dayjs.Dayjs | null;
  medecins?: IMedecin | null;
  patients?: IPatient | null;
}

export class MedecinPatient implements IMedecinPatient {
  constructor(
    public id?: number,
    public dateDebut?: dayjs.Dayjs | null,
    public dateFin?: dayjs.Dayjs | null,
    public medecins?: IMedecin | null,
    public patients?: IPatient | null
  ) {}
}

export function getMedecinPatientIdentifier(medecinPatient: IMedecinPatient): number | undefined {
  return medecinPatient.id;
}
