import youtube from "./client";

export interface YouTubeComment {
  id: string;
  author: string;
  authorProfileImage: string;
  text: string;
  likeCount: number;
  publishedAt: string;
}

export async function getComments(
  videoId: string,
  maxResults = 100
) {
  const comments: YouTubeComment[] = [];

  let nextPageToken: string | undefined;

  while (comments.length < maxResults) {
    const { data } = await youtube.get("/commentThreads", {
      params: {
        part: "snippet",
        videoId,
        maxResults: Math.min(100, maxResults - comments.length),
        pageToken: nextPageToken,
        textFormat: "plainText",
        key: process.env.YOUTUBE_API_KEY,
      },
    });

    const items = data.items ?? [];

    for (const item of items) {
      const comment =
        item.snippet.topLevelComment.snippet;

      comments.push({
        id: item.id,
        author: comment.authorDisplayName,
        authorProfileImage: comment.authorProfileImageUrl,
        text: comment.textDisplay,
        likeCount: comment.likeCount,
        publishedAt: comment.publishedAt,
      });
    }

    if (!data.nextPageToken) {
      break;
    }

    nextPageToken = data.nextPageToken;
  }

  return comments;
}