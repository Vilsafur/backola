export type backupMode = "COPY" | "ARCHIVE"

export interface backupOptions {
    src: string,
    dest: string,
    mode: backupMode
}