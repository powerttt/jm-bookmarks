interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string

    readonly APP_TITLE: string;
    readonly JIANGUOYUN_DAV_URL: string;
    readonly JIANGUOYUN_DAV_BASE_DIR: string;
    readonly WEDAV_BASE_DIR: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}