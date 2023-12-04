import * as dayjs from 'dayjs';
import { IBoitier } from 'app/entities/boitier/boitier.model';
import { IPatient } from 'app/entities/patient/patient.model';

export interface IBoitierPatient {
  id?: number;
  dateDebut?: dayjs.Dayjs | null;
  dateFin?: dayjs.Dayjs | null;
  boitiers?: IBoitier | null;
  patients?: IPatient | null;
}

export class BoitierPatient implements IBoitierPatient {
  constructor(
    public id?: number,
    public dateDebut?: dayjs.Dayjs | null,
    public dateFin?: dayjs.Dayjs | null,
    public boitiers?: IBoitier | null,
    public patients?: IPatient | null
  ) {}
}

export function getBoitierPatientIdentifier(boitierPatient: IBoitierPatient): number | undefined {
  return boitierPatient.id;
}
