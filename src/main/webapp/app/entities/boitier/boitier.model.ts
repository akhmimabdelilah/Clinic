import { IBoitierCapteur } from 'app/entities/boitier-capteur/boitier-capteur.model';
import { IBoitierPatient } from 'app/entities/boitier-patient/boitier-patient.model';

export interface IBoitier {
  id?: number;
  type?: string | null;
  ref?: string | null;
  nbrBranche?: number | null;
  boitierCapteurs?: IBoitierCapteur[] | null;
  boitierPatients?: IBoitierPatient[] | null;
}

export class Boitier implements IBoitier {
  constructor(
    public id?: number,
    public type?: string | null,
    public ref?: string | null,
    public nbrBranche?: number | null,
    public boitierCapteurs?: IBoitierCapteur[] | null,
    public boitierPatients?: IBoitierPatient[] | null
  ) {}
}

export function getBoitierIdentifier(boitier: IBoitier): number | undefined {
  return boitier.id;
}
