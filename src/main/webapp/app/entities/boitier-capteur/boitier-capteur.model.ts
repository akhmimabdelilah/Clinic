import { IBoitier } from 'app/entities/boitier/boitier.model';
import { ICapteur } from 'app/entities/capteur/capteur.model';

export interface IBoitierCapteur {
  id?: number;
  branche?: string | null;
  etat?: boolean | null;
  boitiers?: IBoitier | null;
  capteurs?: ICapteur | null;
}

export class BoitierCapteur implements IBoitierCapteur {
  constructor(
    public id?: number,
    public branche?: string | null,
    public etat?: boolean | null,
    public boitiers?: IBoitier | null,
    public capteurs?: ICapteur | null
  ) {
    this.etat = this.etat ?? false;
  }
}

export function getBoitierCapteurIdentifier(boitierCapteur: IBoitierCapteur): number | undefined {
  return boitierCapteur.id;
}
