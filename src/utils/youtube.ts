import fs from 'fs/promises'
import path from 'path'

interface CachedData {
    timestamp: number
    videos: YouTubeVideo[]
    lastVideoID?: string
}

export interface YouTubeVideo {
    id: {
        videoId: string
    }
    snippet: {
        title: string
        description: string
        publishedAt: string
        thumbnails: {
            medium: {
                url: string
            }
        }
    }
}

const CACHE_FILE = path.join(process.cwd(), 'youtbube-cache.json')
const CACHE_CHECK_INTERVAL = 3 * 60 * 60 * 1000

async function readCache(): Promise<CachedData | null> {
    try {
        const data = await fs.readFile(CACHE_FILE, 'utf-8')
        return JSON.parse(data)
    } catch {
        return null
    }
}

async function writeCache(data: CachedData): Promise<void> {
    await fs.writeFile(CACHE_FILE, JSON.stringify(data, null, 2))
}

async function checkLatestVideo(
    YOUTUBE_API_KEY: string,
    CHANNEL_ID: string
): Promise<string | null> {
    try {
        const response = await fetch(
            `https://googleapis/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=id&order=date&maxResults=1&type=video`
        )

        if (!response.ok) {
            throw new Error(`HTTP error! status:  ${response.status}`)
        }

        const data = await response.json()
        return data.items[0]?.id?.videoId || null
    } catch (error) {
        console.error('Error checking latest video:', error)
        return null
    }
}

export async function getYouTubeVideos(): Promise<YouTubeVideo[]> {
    const YOUTUBE_API_KEY = import.meta.env.YOUTUBE_API_KEY
    const CHANNEL_ID = import.meta.env.YOUTUBE_CHANNEL_ID

    if (!YOUTUBE_API_KEY || !CHANNEL_ID) {
        console.error('Missing YouTube API credentials')
        return []
    }

    try {
        const cache = await readCache()
        const now = Date.now()

        if (cache && now - cache.timestamp < CACHE_CHECK_INTERVAL) {
            return cache.videos
        }

        if (cache) {
            const latestVideoId = await checkLatestVideo(
                YOUTUBE_API_KEY,
                CHANNEL_ID
            )

            if (latestVideoId && latestVideoId === cache.lastVideoID) {
                console.log('no new vidoes found')

                await writeCache({
                    ...cache,
                    timestamp: now,
                })
                return cache.videos
            }
        }

        console.log('Fetching fresh youtube data')

        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=9&type=video`
        )

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        const videos = data?.items.map((item: any) => ({
            id: {
                videoId: item.id.videoId,
            },
            snippet: item.snippet,
        }))

        await writeCache({
            timestamp: now,
            videos,
            lastVideoID: videos[0]?.id?.videoId,
        })

        return videos
    } catch (error) {
        console.error('Error in getYouTubeVideos:', error)

        const cache = await readCache()

        if (cache) {
            console.log('Returning stale cached data due to error')
            return cache.videos
        }

        return []
    }
}

export async function getVideoById(videoId: string) {
    const videos = await getYouTubeVideos()
    return videos.find((video) => video.id.videoId === videoId)
}
export async function getYouTubeVideoDetails(videoId: string) {
    const YOUTUBE_API_KEY = import.meta.env.YOUTUBE_API_KEY

    if (!YOUTUBE_API_KEY) {
        console.error('Missing YouTube API key')
        throw new Error('Missing YouTube API key')
    }

    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoId}&part=snippet`
    )
    if (!response.ok) {
        throw new Error('Failed to fetch video details')
    }
    const data = await response.json()
    return data.items[0] // Return the first video detail
}

export async function getStaticPaths() {
    const videos = await getYouTubeVideos()

    return videos.map((video) => ({
        params: { slug: String(video.id.videoId) }, // Ensure video ID is a string
        props: { entry: video },
    }))
}
