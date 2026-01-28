export type SignupValidationError =
	| "passwordsDoNotMatch"
	| "passwordTooShort"
	| "passwordRequirements";

type SignupPasswordInput = {
	password: string;
	confirmPassword: string;
};

export const validateSignupPassword = ({
	password,
	confirmPassword,
}: SignupPasswordInput): SignupValidationError | null => {
	if (password !== confirmPassword) {
		return "passwordsDoNotMatch";
	}

	if (password.length < 8) {
		return "passwordTooShort";
	}

	const hasLetter = /[a-zA-Z]/.test(password);
	const hasNumber = /\d/.test(password);
	if (!hasLetter || !hasNumber) {
		return "passwordRequirements";
	}

	return null;
};
