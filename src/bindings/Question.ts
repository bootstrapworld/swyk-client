export type Markdown = string;

import type { MultipleChoice } 	from "../questions/multiple-choice";
import type { ShortAnswer } 	from "../questions/short-answer";
import type { Tracing } 		from "../questions/tracing";
import type { Informational } 	from "../questions/informational";
import type { CardSort } 		from "../questions/card-sort";
import type { Categorize } 	from "../questions/categorize";
import type { Pyret } 			from "../questions/pyret";

export type Question = 
	{ "type": "ShortAnswer" } 	 & ShortAnswer 	  | 
	{ "type": "Tracing" } 		 & Tracing 		  | 
	{ "type": "MultipleChoice" } & MultipleChoice | 
	{ "type": "Informational" }  & Informational  | 
	{ "type": "CardSort" } 		 & CardSort	 	  |
	{ "type": "Categorize" } 	 & Categorize 	  |
	{ "type": "Pyret" }          & Pyret;

export interface QuestionFields<Prompt, Answer> {
	id?: string,
	multipart?: string,
	prompt: Prompt,
	answer: Answer,
	context?: Markdown,
	promptExplanation?: boolean,
	image?: string,
	// Optional for now while quiz authors migrate existing quiz.json files;
	// both are expected to become required once that migration is done.
	label?: string,
	construct?: string
}
