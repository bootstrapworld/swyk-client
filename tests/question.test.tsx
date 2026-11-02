import { render, screen, waitFor } from "@testing-library/preact";
import user from "@testing-library/user-event";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { beforeEach, describe, expect, it } from "vitest";

import type { Question } from "../src/bindings/Question";
import { QuestionView, QuizConfigContext, getQuestionMethods } from "../src/lib";
import type { Quiz } from "../src/components/quiz";
import type { TaggedAnswer } from "../src/questions/mod";
import { submitButton } from "./utils";

describe("Question prompt for explanation", () => {
  const question: Question = {
    type: "ShortAnswer",
    prompt: { prompt: "Hello world" },
    answer: { answer: "Yes" },
    promptExplanation: true
  };

  let submitted: TaggedAnswer | null = null;
  beforeEach(async () => {
    submitted = null;
    render(
      <QuizConfigContext.Provider value={{ name: "Foobar", quiz: {} as Quiz }}>
        <QuestionView
          question={question}
          multipart={{}}
          index={1}
          title="1"
          attempt={0}
          onBack={() => {}}
          canGoBack={false}
          onSubmit={answer => {
            submitted = answer;
          }}
        />
      </QuizConfigContext.Provider>
    );
    await waitFor(() => screen.getByText("Hello world"));
  });

  it("accepts an explanation", async () => {
    let input = screen.getByRole("textbox");
    await user.type(input, "No");
    // with promptExplanation, the first button only reveals the explanation box
    await user.click(screen.getByRole("button", { name: "Submit" }));

    input = screen.getByTitle("Explanation");
    await user.type(input, "Because");
    await user.click(submitButton());

    expect(submitted.answer).toMatchObject({ explanation: "Because" });
  });
});

describe("Question image", () => {
  const questions: Question[] = [
    { type: "ShortAnswer", prompt: { prompt: "Hello world" }, answer: { answer: "Yes" } },
    {
      type: "MultipleChoice",
      prompt: { prompt: "Hello world", distractors: ["No"] },
      answer: { answer: "Yes" }
    },
    { type: "Informational", prompt: { prompt: "Hello world" }, answer: null },
    {
      type: "CardSort",
      prompt: { prompt: "Hello world", cards: [{ id: "a", content: "A" }, { id: "b", content: "B" }] },
      answer: { answer: [["a"], ["b"]], ordered: false }
    },
    {
      type: "Categorize",
      prompt: { prompt: "Hello world", leftColumn: ["X"], rightColumn: ["A"] },
      answer: { X: ["A"] }
    },
    { type: "Pyret", prompt: { prompt: "Hello world", program: "" }, answer: "" }
  ];

  it.each(questions.map(q => [q.type, q]))("is shown below the %s prompt", async (_type, q) => {
    // as QuizView does, for card-sort's and categorize's drag and drop
    const { container } = render(
      <DndProvider backend={HTML5Backend}>
        <QuizConfigContext.Provider value={{ name: "Foobar", quiz: {} as Quiz }}>
          <QuestionView
            question={{ ...q, image: "./pic.png" }}
            multipart={{}}
            index={1}
            title="1"
            attempt={0}
            onBack={() => {}}
            canGoBack={false}
            questionState={getQuestionMethods(q.type).questionState?.(q.prompt, q.answer)}
            onSubmit={() => {}}
          />
        </QuizConfigContext.Provider>
      </DndProvider>
    );
    await waitFor(() => screen.getByText("Hello world"));
    expect(container.querySelector('.prompt img[src="./pic.png"]')).not.toBeNull();
  });
});
