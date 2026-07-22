import { z } from "zod";

export const sentimentSchema = z.enum(["Positive", "Neutral", "Negative"]);

export const aiAnalysisSchema = z.object({
  summary: z.string().trim().min(1, "summary is required"),
  overallSentiment: sentimentSchema,
  statistics: z.object({
    positive: z.number().int().nonnegative(),
    neutral: z.number().int().nonnegative(),
    negative: z.number().int().nonnegative(),
  }),
  categories: z.array(
    z.object({
      name: z.string().trim().min(1, "category name is required"),
      count: z.number().int().nonnegative(),
      summary: z.string().trim().min(1, "category summary is required"),
      sampleComments: z.array(z.string()),
    })
  ),
  sentimentComments: z.array(
    z.object({
      index: z.number().int().positive(),
      sentiment: sentimentSchema,
    })
  ),
  featureRequests: z.array(z.string()),
  bugReports: z.array(z.string()),
  questions: z.array(z.string()),
  suggestions: z.array(z.string()),
  complaints: z.array(z.string()),
  praise: z.array(z.string()),
  spam: z.array(z.string()),
  toxicComments: z.array(z.string()),
  hateSpeech: z.array(z.string()),
  keywords: z.array(z.string()),
  trendingTopics: z.array(z.string()),
  mentionedProducts: z.array(z.string()),
  mentionedProblems: z.array(z.string()),
  userIntent: z.array(z.string()),
  communityOpinion: z.string(),
  recommendations: z.array(z.string()),
  actionableInsights: z.array(z.string()),
});

export const mergedAnalysisSchema = aiAnalysisSchema.extend({
  analyzedComments: z.number().int().positive().optional(),
});

export type AIAnalysis = z.infer<typeof aiAnalysisSchema>;
export type MergedAnalysis = z.infer<typeof mergedAnalysisSchema>;
