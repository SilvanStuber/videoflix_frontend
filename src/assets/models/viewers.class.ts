export class Viewer {
    picture_file: string;
    user: number;
    viewer_id: number;
    viewername: string;

    constructor(obj?: any) {
        this.picture_file = obj?.picture_file;
        this.user = obj?.user || 0;
        this.viewer_id = obj?.viewer_id || 0;
        this.viewername = obj?.viewername || '';
    }

    public toJSON() {
        return {
            picture_file: this.picture_file,
            user: this.user,
            viewer_id: this.viewer_id,
            viewername: this.viewername,
        };
    }
}
