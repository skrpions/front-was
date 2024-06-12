interface TitleEssential {
  name: string;
}
interface TitleOptionals {
  id: number;
}

export type TitleEntity = Required<TitleEssential> & Partial<TitleOptionals>;
