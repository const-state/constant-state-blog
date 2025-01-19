export interface YouTubeVideo {
    id: {
        videoId: string;
    };
    snippet: {
        title: string;
        description: string;
        publishedAt: string;
        thumbnails: {
            medium: {
                url: string;
            };
        };
    };
}

export async function getYouTubeVideos(): Promise<YouTubeVideo[]> {
    const YOUTUBE_API_KEY = import.meta.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = import.meta.env.YOUTUBE_CHANNEL_ID;

    if (!YOUTUBE_API_KEY || !CHANNEL_ID) {
        console.error('Missing YouTube API credentials');
        return [];
    }

    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=9&type=video`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Error in getYouTubeVideos:', error);
        return [];
    }
}

export async function getVideoById(videoId: string) {
    const videos = await getYouTubeVideos();
    return videos.find(video => video.id.videoId === videoId);
}