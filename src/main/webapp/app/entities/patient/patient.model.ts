import { IExtraUser } from 'app/entities/extra-user/extra-user.model';
import { IMesure } from 'app/entities/mesure/mesure.model';
import { IVideo } from 'app/entities/video/video.model';
import { IMedecinPatient } from 'app/entities/medecin-patient/medecin-patient.model';
import { IBoitierPatient } from 'app/entities/boitier-patient/boitier-patient.model';

export interface IPatient {
  id?: number;
  profession?: string | null;
  extraUserId?: IExtraUser | null;
  mesures?: IMesure[] | null;
  videos?: IVideo[] | null;
  medecinPatients?: IMedecinPatient[] | null;
  boitierPatients?: IBoitierPatient[] | null;
}

export class Patient implements IPatient {
  constructor(
    public id?: number,
    public profession?: string | null,
    public extraUserId?: IExtraUser | null,
    public mesures?: IMesure[] | null,
    public videos?: IVideo[] | null,
    public medecinPatients?: IMedecinPatient[] | null,
    public boitierPatients?: IBoitierPatient[] | null
  ) {}
}

export function getPatientIdentifier(patient: IPatient): number | undefined {
  return patient.id;
}
