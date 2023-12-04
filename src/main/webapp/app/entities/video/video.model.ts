import * as dayjs from 'dayjs';
import { IPatient } from 'app/entities/patient/patient.model';

export interface IVideo {
  id?: number;
  nom?: string | null;
  url?: string | null;
  date?: dayjs.Dayjs | null;
  duree?: number | null;
  patients?: IPatient | null;
}

export class Video implements IVideo {
  constructor(
    public id?: number,
    public nom?: string | null,
    public url?: string | null,
    public date?: dayjs.Dayjs | null,
    public duree?: number | null,
    public patients?: IPatient | null
  ) {}
}

export function getVideoIdentifier(video: IVideo): number | undefined {
  return video.id;
}
