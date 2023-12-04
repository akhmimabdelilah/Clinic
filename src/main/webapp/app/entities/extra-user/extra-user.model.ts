import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';

export interface IExtraUser {
  id?: number;
  cin?: string | null;
  numeroTelephone?: number | null;
  dateNaissance?: dayjs.Dayjs | null;
  nationalite?: string | null;
  adresse?: string | null;
  genre?: string | null;
  user?: IUser | null;
}

export class ExtraUser implements IExtraUser {
  constructor(
    public id?: number,
    public cin?: string | null,
    public numeroTelephone?: number | null,
    public dateNaissance?: dayjs.Dayjs | null,
    public nationalite?: string | null,
    public adresse?: string | null,
    public genre?: string | null,
    public user?: IUser | null
  ) {}
}

export function getExtraUserIdentifier(extraUser: IExtraUser): number | undefined {
  return extraUser.id;
}
