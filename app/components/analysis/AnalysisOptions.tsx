"use client";

import { Brain, SmilePlus, FolderTree, ShieldAlert, Lightbulb, Bug, CircleHelp, Languages, KeyRound, FileDown } from "lucide-react";

const options = [
  { id: "sentiment", title: "Sentiment Analysis", description: "Detect positive, neutral and negative comments.", icon: SmilePlus },
  { id: "categories", title: "AI Categorization", description: "Group similar comments automatically.", icon: FolderTree },
  { id: "spam", title: "Spam Detection", description: "Identify spam and promotional comments.", icon: ShieldAlert },
  { id: "feature", title: "Feature Requests", description: "Find requested features from users.", icon: Lightbulb },
  { id: "bugs", title: "Bug Reports", description: "Collect bug reports automatically.", icon: Bug },
  { id: "questions", title: "Questions", description: "Find audience questions.", icon: CircleHelp },
  { id: "language", title: "Language Detection", description: "Detect multiple languages.", icon: Languages },
  { id: "keywords", title: "Keyword Extraction", description: "Extract trending keywords.", icon: KeyRound },
];

interface AnalysisOptionsProps {
  selected: string[];
  onToggle: (id: string) => void;
}

export default function AnalysisOptions({ selected, onToggle }: AnalysisOptionsProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <div className="mb-8 flex items-center gap-3">
        <Brain className="h-8 w-8 text-red-500" />
        <div>
          <h2 className="text-3xl font-bold text-white">AI Analysis Options</h2>
          <p className="mt-2 text-zinc-400">Select the insights you want AI to generate.</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {options.map((option) => {
          const Icon = option.icon;
          const active = selected.includes(option.id);

          return (
            <button
              key={option.id}
              onClick={() => onToggle(option.id)}
              type="button"
              className={`rounded-2xl border p-5 text-left transition-all duration-300 ${
                active ? "border-red-500 bg-red-500/10" : "border-white/10 bg-zinc-900/60 hover:border-red-500/30"
              }`}
            >
              <Icon className={`mb-4 h-8 w-8 ${active ? "text-red-400" : "text-zinc-400"}`} />
              <h3 className="font-semibold text-white">{option.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{option.description}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-zinc-900/60 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-lg font-semibold text-white">{selected.length} AI modules selected</p>
          <p className="mt-1 text-zinc-400">More modules may slightly increase processing time.</p>
        </div>

        <button type="button" className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700">
          <FileDown className="mr-2 h-5 w-5" />
          Save Preset
        </button>
      </div>
    </section>
  );
}
