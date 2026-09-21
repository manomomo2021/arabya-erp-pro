export const MODULES = [
  'dashboard','database','sales','purchases','customers','suppliers','inventory','storage','treasury','banks','accounting','production','hr','users','reports','audit'
] as const;
export type Permission='VIEW'|'ADD'|'EDIT'|'DELETE'|'PRINT'|'EXPORT';
export function can(session:any, p:Permission){return !!session?.permissions?.includes(p);}
