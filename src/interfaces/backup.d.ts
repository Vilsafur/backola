export type backupMode = "COPY" | "ARCHIVE" | "CRYPT";

export interface backupOptions {
  src: string;
  dest: string;
  mode: backupMode;
  key?: string;
}
