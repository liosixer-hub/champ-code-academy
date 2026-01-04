import type { User } from '../../entity/user';

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

export declare const useUserStore: import('zustand').UseBoundStore<import('zustand').StoreApi<UserState>>;
