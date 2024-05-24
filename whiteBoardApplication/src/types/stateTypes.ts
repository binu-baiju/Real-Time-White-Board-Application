// src/types.ts
export interface MenuState {
  activeMenuItem: string;
  actionMenuItem: string | null;
}

export interface User {
  roomId?: string;
  userId?: string;
  userName?: string;
  host?: boolean;
  presenter?: boolean;
}
