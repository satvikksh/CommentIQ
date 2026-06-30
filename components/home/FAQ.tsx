"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does CommentIQ work?",
    answer:
      "Simply paste a public YouTube video URL. CommentIQ fetches the comments using the YouTube Data API, then AI analyzes them to generate categories, sentiment, summaries, and insights.",
  },
  {
    question: "Do I need to install anything?",
    answer:
      "No. CommentIQ runs entirely in your browser. Just paste a YouTube link and start analyzing.",
  },
  {
    question: "Can I analyze any YouTube video?",
    answer:
      "Yes. Any public YouTube video with accessible comments can be analyzed.",
  },
  {
    question: "How accurate is the AI analysis?",
    answer:
      "The AI uses semantic understanding instead of simple keyword matching, allowing it to group similar comments and identify trends with high accuracy.",
  },
  {
    question: "Does CommentIQ save my data?",
    answer:
      "Only if you're signed in and choose to save an analysis. Otherwise, analyses can be processed without being stored permanently.",
  },
  {
    question: "Will there be a Chrome extension?",
    answer:
      "Yes. A Chrome extension is planned that will let you analyze the current YouTube video with a single click.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      className="relative bg-zinc-900 py-28 text-white"
    >
      <div className="mx-auto max-w-4xl px-6">
        {/* Heading */}
        <div className="mb-16 text-center">
          <span className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400">
            FAQ
          </span>

          <h2 className="mt-6 text-4xl font-black md:text-6xl">
            Frequently Asked
            <span className="block bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>

          <p className="mt-6 text-lg text-zinc-400">
            Everything you need to know before analyzing your first
            YouTube video.
          </p>
        </div>

        {/* Accordion */}
        <Accordion
          type="single"
          collapsible
          className="space-y-5"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-2xl border border-white/10 bg-white/5 px-6 backdrop-blur-xl"
            >
              <AccordionTrigger className="py-6 text-left text-lg font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>

              <AccordionContent className="pb-6 text-base leading-8 text-zinc-400">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}