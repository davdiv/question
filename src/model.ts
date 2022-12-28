export interface Option {
	label: string;
	coefficient: number;
}

export interface Question {
	question: string;
	options: Option[];
}

export interface Response {
	timestamp: number;
	responseIndex: number;
	question: Question;
}

export interface SimulationResponseOption {
	coefficient: number;
	label: string;
	number: number;
}

export type SimulationResponse = SimulationResponseOption[];

export interface QuestionValidation {
	fullyValid: boolean;
	questionValid: boolean;
	options: { labelValid: boolean; coefficientValid: boolean }[];
}

export const defaultQuestion = (): Question => ({
	question: "",
	options: [
		{ label: "Oui", coefficient: 1 },
		{ label: "Non", coefficient: 1 },
		{ label: "Pas de réponse", coefficient: 1 }
	]
});

export const addOption = (question: Question) => {
	question.options.push({ label: "", coefficient: 1 });
	return question;
};

export const removeOption = (question: Question, index: number) => {
	question.options.splice(index, 1);
	return question;
};

export const validate = (question: Question): QuestionValidation => {
	let fullyValid = true;
	const questionValid = !!question.question;
	if (!questionValid) {
		fullyValid = false;
	}
	const options = question.options.map(({ label, coefficient }) => {
		const labelValid = !!label;
		const coefficientValid = coefficient > 0;
		if (!(labelValid && coefficientValid)) {
			fullyValid = false;
		}
		return {
			labelValid,
			coefficientValid
		};
	});
	return {
		fullyValid,
		questionValid,
		options
	};
};

export const chooseResponse = (question: Question): Response => {
	const options = question.options;
	const table: number[] = [];
	let sumCoeffs = 0;
	for (let i = 0, l = options.length; i < l; i++) {
		const { coefficient } = options[i];
		sumCoeffs += coefficient;
		table[i] = sumCoeffs;
	}
	const timestamp = Date.now();
	const responseNumber = sumCoeffs * Math.random();
	for (let i = 0, l = table.length; i < l; i++) {
		if (responseNumber < table[i]) {
			return {
				timestamp,
				responseIndex: i,
				question
			};
		}
	}
	// note: we should never reach this code
	throw new Error("assert error");
};

export const simulateResponses = (
	question: Question,
	simulations: number
): SimulationResponse => {
	const table: SimulationResponse = [];
	const options = question.options;
	for (let i = 0, l = options.length; i < l; i++) {
		table[i] = {
			...options[i],
			number: 0
		};
	}
	for (let i = 0; i < simulations; i++) {
		const response = chooseResponse(question);
		table[response.responseIndex].number++;
	}
	return table;
};

const f2 = (value: number) => {
	return `${value < 10 ? "0" : ""}${value}`;
};

export const formatTimestamp = (timestamp: number) => {
	const date = new Date(timestamp);
	return `${f2(date.getDate())}/${f2(
		1 + date.getMonth()
	)}/${date.getFullYear()} ${f2(date.getHours())}h${f2(date.getMinutes())}`;
};

export const formatFilename = (timestamp: number) => {
	const date = new Date(timestamp);
	return `question-${date.getFullYear()}-${f2(1 + date.getMonth())}-${f2(
		date.getDate()
	)}-${f2(date.getHours())}h${f2(date.getMinutes())}m${f2(
		date.getSeconds()
	)}s${date.getMilliseconds()}.txt`;
};

export const buildTextResponse = (response: Response) => {
	const textResponse = [];
	textResponse.push(
		`${formatTimestamp(response.timestamp)}:\n\n${response.question.question}\n`
	);
	response.question.options.forEach((option, index) => {
		textResponse.push(
			` ${index === response.responseIndex ? " ->" : " - "} ${option.label}`
		);
		if (option.coefficient !== 1) {
			textResponse.push(` (coefficient ${option.coefficient})`);
		}
		textResponse.push("\n");
	});
	textResponse.push("\n\n");
	return textResponse.join("");
};
