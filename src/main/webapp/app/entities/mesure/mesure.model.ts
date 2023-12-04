import * as dayjs from 'dayjs';
import { IPatient } from 'app/entities/patient/patient.model';

export interface IMesure {
  id?: number;
  type?: string | null;
  valeur?: number | null;
  date?: dayjs.Dayjs | null;
  patient?: IPatient | null;
}

export class Mesure implements IMesure {
  constructor(
    public id?: number,
    public type?: string | null,
    public valeur?: number | null,
    public date?: dayjs.Dayjs | null,
    public patient?: IPatient | null
  ) {}
}

export function getMesureIdentifier(mesure: IMesure): number | undefined {
  return mesure.id;
}
