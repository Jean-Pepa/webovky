// Datový model Mařeny. Vše je „ploché“ a serializovatelné — ukládá se buď do
// Upstash Redis (sdílené), nebo do localStorage (demo režim v prohlížeči).

export interface Member {
  id: string;
  name: string;
  roleIds: string[]; // posty/funkce, které si člověk vybral (viz lib/roles.ts)
  contact?: string; // instagram / telefon / e-mail — dobrovolné
  note?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  author: string;
  roleId?: string; // za jakou funkci to píše
  title: string;
  body: string;
  pinned: boolean;
  createdAt: string;
}

export interface PollOption {
  id: string;
  label: string;
  voters: string[]; // jména hlasujících
}

export interface Poll {
  id: string;
  question: string;
  author: string;
  options: PollOption[];
  multi: boolean; // lze vybrat víc možností
  closed: boolean;
  createdAt: string;
}

export type EventKind =
  | "schuzka"
  | "deadline"
  | "prednaska"
  | "program"
  | "pruvod"
  | "fleda"
  | "jine";

export interface CalEvent {
  id: string;
  date: string; // ISO "YYYY-MM-DD"
  time?: string; // "17:00"
  title: string;
  kind: EventKind;
  note?: string;
  author: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  roleId?: string;
  assignee?: string;
  done: boolean;
  due?: string; // ISO datum
  createdAt: string;
}

export interface Year {
  id: string; // např. "2025"
  label: string; // "Mařena 2025"
  theme?: string; // téma ročníku
  fledaDate?: string; // termín průvodu / Flédy (ISO)
  members: Member[];
  posts: Post[];
  polls: Poll[];
  events: CalEvent[];
  tasks: Task[];
  createdAt: string;
}

export interface DB {
  years: Year[];
}
