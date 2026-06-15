// Sdílené typy návratových stavů pro server akce (nesmí být v "use server" souboru).
export type AuthState = { error?: string };

export type FormState = {
  error?: string;
  ok?: boolean;
  message?: string;
};

export const EMPTY_FORM_STATE: FormState = {};
