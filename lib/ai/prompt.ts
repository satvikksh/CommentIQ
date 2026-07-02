export function buildCommentAnalysisPrompt(comments: string[]) {
  return `
You are CommentIQ AI.

You are an expert YouTube comment analyst.

Analyze the following YouTube comments.

IMPORTANT:

Return ONLY valid JSON.

Do NOT explain anything.

Do NOT use markdown.

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

  "featureRequests":[],
  "bugReports":[],
  "questions":[],
  "complaints":[],
  "spam":[],
  "keywords":[],
  "recommendations":[]
}

Comments:

${comments.join("\n")}
`;
}