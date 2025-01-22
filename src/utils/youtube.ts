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
        console.log('API response data:', data);

        return data.items.map((item: any) => ({
            id: {
                videoId: item.id.videoId,
            },
            snippet: item.snippet,
        })) || [];
    } catch (error) {
        console.error('Error in getYouTubeVideos:', error);
        return [];
    }
}

export async function getVideoById(videoId: string) {
    const videos = await getYouTubeVideos();
    return videos.find(video => video.id.videoId === videoId);
}
export async function getYouTubeVideoDetails(videoId: string) {
    const YOUTUBE_API_KEY = import.meta.env.YOUTUBE_API_KEY;
    
    if (!YOUTUBE_API_KEY) {
        console.error('Missing YouTube API key');
        throw new Error('Missing YouTube API key');
    }

    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoId}&part=snippet`);
    if (!response.ok) {
        throw new Error('Failed to fetch video details');
    }
    const data = await response.json();
    return data.items[0]; // Return the first video detail
}

export async function getStaticPaths() {
    const videos = await getYouTubeVideos();

    return videos.map((video) => ({
        params: { slug: video.id.videoId }, // Use video ID as slug
        props: { entry: video },
    }));
}