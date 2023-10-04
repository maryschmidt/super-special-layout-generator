interface DatumCommon {
  name: string;
  value: number;
  id: string;
}

interface DatumWithoutChildren extends DatumCommon {}

export interface DatumWithChildren extends DatumWithoutChildren {
  children: Array<DatumWithoutChildren>;
}

export interface HierarchicalData extends DatumCommon {
  children: Array<DatumWithChildren>;
}
