export type ApiResponss<T> = {
  success: boolean;
  data?: T;
  message?: string;
};
