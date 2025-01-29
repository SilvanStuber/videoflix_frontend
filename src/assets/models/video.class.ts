export class Video {
    id: number;
    title: string;
    description: string;
    created_at: string;
    video_file: string;
    video_720p: string;
    video_480p: string;

    resolutions: { label: string, url: string }[];

    constructor(obj?: any) {
        this.id = obj?.id || 0;
        this.title = obj?.title || '';
        this.description = obj?.description || '';
        this.created_at = obj?.created_at || '';
        this.video_file = obj?.video_file || '';
        this.video_720p = obj?.video_720p || '';
        this.video_480p = obj?.video_480p || '';

        this.resolutions = [
            { label: '1080p', url: this.video_file },
            { label: '720p', url: this.video_720p },
            { label: '480p', url: this.video_480p }
        ].filter(res => res.url);
    }

    public toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            created_at: this.created_at,
            video_file: this.video_file,
            video_720p: this.video_720p,
            video_480p: this.video_480p
        };
    }
}

