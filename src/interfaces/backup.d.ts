export enum backupMode {
    copy
}

export interface backupOptions {
    src: string,
    dest: string,
    mode: backupMode
}