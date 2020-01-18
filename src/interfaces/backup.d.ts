export type backupMode = "COPY"

export interface backupOptions {
    src: string,
    dest: string,
    mode: backupMode
}