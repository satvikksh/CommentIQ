interface AIResult {
  summary?: string;
  overallSentiment?: string;

  statistics?: {
    positive?: number;
    neutral?: number;
    negative?: number;
  };

  categories?: {
    name: string;
    count: number;
    summary?: string;
    sampleComments?: string[];
  }[];

  featureRequests?: string[];

  bugReports?: string[];

  questions?: string[];

  complaints?: string[];

  suggestions?: string[];

  praise?: string[];

  spam?: string[];

  toxicComments?: string[];

  hateSpeech?: string[];

  keywords?: string[];

  trendingTopics?: string[];

  mentionedProducts?: string[];

  mentionedProblems?: string[];

  userIntent?: string[];

  communityOpinion?: string;

  recommendations?: string[];

  actionableInsights?: string[];
}

export function mergeResults(results: AIResult[]) {
  const merged = {
    summary: "",

    overallSentiment: "",

    statistics: {
      positive: 0,
      neutral: 0,
      negative: 0,
    },

    categories: [] as AIResult["categories"],

    featureRequests: [] as string[],

    bugReports: [] as string[],

    questions: [] as string[],

    complaints: [] as string[],

    suggestions: [] as string[],

    praise: [] as string[],

    spam: [] as string[],

    toxicComments: [] as string[],

    hateSpeech: [] as string[],

    keywords: [] as string[],

    trendingTopics: [] as string[],

    mentionedProducts: [] as string[],

    mentionedProblems: [] as string[],

    userIntent: [] as string[],

    communityOpinion: "",

    recommendations: [] as string[],

    actionableInsights: [] as string[],
  };

  const categoryMap = new Map<
    string,
    {
      name: string;
      count: number;
      summary?: string;
      sampleComments: string[];
    }
  >();

  const summaries: string[] = [];

  for (const result of results) {
    if (result.summary) {
      summaries.push(result.summary);
    }

    merged.statistics.positive +=
      result.statistics?.positive ?? 0;

    merged.statistics.neutral +=
      result.statistics?.neutral ?? 0;

    merged.statistics.negative +=
      result.statistics?.negative ?? 0;

    result.categories?.forEach((category) => {
      if (!categoryMap.has(category.name)) {
        categoryMap.set(category.name, {
          name: category.name,
          count: 0,
          summary: category.summary,
          sampleComments: [],
        });
      }

      const existing = categoryMap.get(category.name)!;

      existing.count += category.count;

      existing.sampleComments.push(
        ...(category.sampleComments ?? [])
      );
    });

    merged.featureRequests.push(
      ...(result.featureRequests ?? [])
    );

    merged.bugReports.push(
      ...(result.bugReports ?? [])
    );

    merged.questions.push(
      ...(result.questions ?? [])
    );

    merged.complaints.push(
      ...(result.complaints ?? [])
    );

    merged.suggestions.push(
      ...(result.suggestions ?? [])
    );

    merged.praise.push(
      ...(result.praise ?? [])
    );

    merged.spam.push(
      ...(result.spam ?? [])
    );

    merged.toxicComments.push(
      ...(result.toxicComments ?? [])
    );

    merged.hateSpeech.push(
      ...(result.hateSpeech ?? [])
    );

    merged.keywords.push(
      ...(result.keywords ?? [])
    );

    merged.trendingTopics.push(
      ...(result.trendingTopics ?? [])
    );

    merged.mentionedProducts.push(
      ...(result.mentionedProducts ?? [])
    );

    merged.mentionedProblems.push(
      ...(result.mentionedProblems ?? [])
    );

    merged.userIntent.push(
      ...(result.userIntent ?? [])
    );

    if (result.communityOpinion) {
      merged.communityOpinion = result.communityOpinion;
    }

    merged.recommendations.push(
      ...(result.recommendations ?? [])
    );

    merged.actionableInsights.push(
      ...(result.actionableInsights ?? [])
    );
  }

  merged.categories = Array.from(categoryMap.values());

  merged.summary = summaries.join("\n\n");

  const stats = merged.statistics;

  if (
    stats.positive >= stats.neutral &&
    stats.positive >= stats.negative
  ) {
    merged.overallSentiment = "Positive";
  } else if (
    stats.negative >= stats.positive &&
    stats.negative >= stats.neutral
  ) {
    merged.overallSentiment = "Negative";
  } else {
    merged.overallSentiment = "Neutral";
  }

  merged.keywords = [...new Set(merged.keywords)];

  merged.featureRequests = [...new Set(merged.featureRequests)];

  merged.questions = [...new Set(merged.questions)];

  merged.bugReports = [...new Set(merged.bugReports)];

  merged.spam = [...new Set(merged.spam)];

  merged.complaints = [...new Set(merged.complaints)];

  merged.suggestions = [...new Set(merged.suggestions)];

  merged.praise = [...new Set(merged.praise)];

  merged.toxicComments = [...new Set(merged.toxicComments)];

  merged.hateSpeech = [...new Set(merged.hateSpeech)];

  merged.trendingTopics = [...new Set(merged.trendingTopics)];

  merged.mentionedProducts = [...new Set(merged.mentionedProducts)];

  merged.mentionedProblems = [...new Set(merged.mentionedProblems)];

  merged.userIntent = [...new Set(merged.userIntent)];

  merged.recommendations = [...new Set(merged.recommendations)];

  merged.actionableInsights = [...new Set(merged.actionableInsights)];

  return merged;
}
