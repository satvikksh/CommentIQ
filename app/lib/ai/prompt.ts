export function buildCommentAnalysisPrompt(comments: string[]) {
  return `
You are CommentIQ AI.

You are an expert YouTube comment analyst.

Analyze the following YouTube comments.

IMPORTANT:

Return ONLY one valid JSON object.

Do NOT explain anything.

Do NOT use markdown, code fences, comments, trailing commas, or prose before or after the JSON.

All keys shown below are required. Use empty arrays for sections with no matching comments. Use one of exactly "Positive", "Neutral", or "Negative" for overallSentiment.

Return exactly this structure:

{
  "summary":"",
  "overallSentiment":"Positive | Neutral | Negative",

  "statistics":{
    "positive":0,
    "neutral":0,
    "negative":0
  },

  "categories":[
    {
      "name":"",
      "count":0,
      "summary":"",
      "sampleComments":[]
    }
  ],

  "sentimentComments":[
    {
      "index":1,
      "sentiment":"Positive | Neutral | Negative"
    }
  ],

  "featureRequests":[],
  "bugReports":[],
  "questions":[],
  "suggestions":[],
  "complaints":[],
  "praise":[],
  "spam":[],
  "toxicComments":[],
  "hateSpeech":[],
  "keywords":[],
  "trendingTopics":[],
  "mentionedProducts":[],
  "mentionedProblems":[],
  "userIntent":[],
  "communityOpinion":"",
  "recommendations":[],
  "actionableInsights":[]
}

Comments:

${comments.map((comment, index) => `[${index + 1}] ${comment}`).join("\n")}
`;
}
