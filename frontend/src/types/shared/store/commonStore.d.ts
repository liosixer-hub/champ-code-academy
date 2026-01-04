export interface CommonState {
  loading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export declare const useCommonStore: import('zustand').UseBoundStore<import('zustand').StoreApi<CommonState>>;
