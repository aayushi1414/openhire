import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { Question } from "@/types/interview";

interface InterviewQuestionCardProps {
  questionNumber: number;
  questionData: Question;
  onQuestionChange: (id: string, question: Question) => void;
  onDelete: (id: string) => void;
}

const depthLevels = [
  { level: 1, label: "Low" },
  { level: 2, label: "Medium" },
  { level: 3, label: "High" },
] as const;

export default function InterviewQuestionCard(Props: InterviewQuestionCardProps) {
  const { questionNumber, questionData, onQuestionChange, onDelete } = Props;
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        {/* Header row: title | depth buttons + delete */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-y-2">
          <CardTitle className="shrink-0 text-base">Question {questionNumber}</CardTitle>

          <div className="flex items-center gap-1.5">
            <span className="mr-1 font-semibold text-muted-foreground text-sm">Depth Level:</span>
            {depthLevels.map(({ level, label }) => (
              <Button
                key={level}
                type="button"
                className={`h-7 px-3 text-xs hover:bg-primary/80 ${
                  questionData?.followUpCount === level ? "bg-primary" : "opacity-50"
                }`}
                onClick={() =>
                  onQuestionChange(questionData.id, {
                    ...questionData,
                    followUpCount: level,
                  })
                }
              >
                {label}
              </Button>
            ))}

            <button
              type="button"
              className="ml-1 shrink-0 text-muted-foreground transition-colors hover:text-destructive"
              onClick={() => onDelete(questionData.id)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Full-width textarea */}
        <Textarea
          value={questionData?.question}
          className="resize-none border-2 border-input transition-colors focus:border-primary"
          placeholder="e.g. Can you tell me about a challenging project you've worked on?"
          rows={3}
          onChange={(e) =>
            onQuestionChange(questionData.id, {
              ...questionData,
              question: e.target.value,
            })
          }
          onBlur={(e) =>
            onQuestionChange(questionData.id, {
              ...questionData,
              question: e.target.value.trim(),
            })
          }
        />
      </CardContent>
    </Card>
  );
}
