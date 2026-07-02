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

  spam?: string[];

  keywords?: string[];

  recommendations?: string[];
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

    spam: [] as string[],

    keywords: [] as string[],

    recommendations: [] as string[],
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

    merged.spam.push(
      ...(result.spam ?? [])
    );

    merged.keywords.push(
      ...(result.keywords ?? [])
    );

    merged.recommendations.push(
      ...(result.recommendations ?? [])
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

  merged.recommendations = [...new Set(merged.recommendations)];

  return merged;
}