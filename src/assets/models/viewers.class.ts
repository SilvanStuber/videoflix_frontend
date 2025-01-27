export class Viewer {
    created_at: string;
    picture_file: string | null;
    user: number;
    viewer_id: number;
    viewername: string;
    picture_id: number;

    constructor(obj?: any) {
        this.created_at = obj?.created_at || '';
        this.picture_file = obj?.picture_file || null;
        this.user = obj?.user || 0;
        this.viewer_id = obj?.viewer_id || 0;
        this.viewername = obj?.viewername || '';
        this.picture_id = obj ? obj.picture_id : 0;
    }

    public toJSON() {
        return {
            created_at: this.created_at,
            picture_file: this.picture_file,
            user: this.user,
            viewer_id: this.viewer_id,
            viewername: this.viewername,
            picture_id: this.picture_id,
        };
    }
}
