import youtube from "./client";

export async function getVideo(videoId: string) {
  const { data } = await youtube.get("/videos", {
    params: {
      id: videoId,
      part: "snippet,statistics,contentDetails",
      key: process.env.YOUTUBE_API_KEY,
    },
  });

  if (!data.items.length) {
    throw new Error("Video not found");
  }

  const video = data.items[0];

  return {
    id: video.id,

    title: video.snippet.title,

    description: video.snippet.description,

    channelTitle: video.snippet.channelTitle,

    publishedAt: video.snippet.publishedAt,

    thumbnail:
      video.snippet.thumbnails.high?.url ??
      video.snippet.thumbnails.default.url,

    views: Number(video.statistics.viewCount),

    likes: Number(video.statistics.likeCount),

    comments: Number(video.statistics.commentCount),

    duration: video.contentDetails.duration,
  };
}