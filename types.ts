
export interface Participant {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  members: Participant[];
}

export type View = 'data' | 'lucky-draw' | 'grouping';
