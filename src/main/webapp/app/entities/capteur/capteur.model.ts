import { IBoitierCapteur } from 'app/entities/boitier-capteur/boitier-capteur.model';

export interface ICapteur {
  id?: number;
  type?: string | null;
  reference?: string | null;
  resolution?: string | null;
  valeurMin?: number | null;
  valeurMax?: number | null;
  boitierCapteurs?: IBoitierCapteur[] | null;
}

export class Capteur implements ICapteur {
  constructor(
    public id?: number,
    public type?: string | null,
    public reference?: string | null,
    public resolution?: string | null,
    public valeurMin?: number | null,
    public valeurMax?: number | null,
    public boitierCapteurs?: IBoitierCapteur[] | null
  ) {}
}

export function getCapteurIdentifier(capteur: ICapteur): number | undefined {
  return capteur.id;
}
