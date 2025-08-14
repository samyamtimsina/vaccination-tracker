// A simple helper function to get the first error message from the nested errors object
export const getFirstErrorMessage = (errors) => {
    const firstErrorKey = Object.keys(errors)[0];
    if (!firstErrorKey) return 'Unknown error.';

    const firstError = errors[firstErrorKey];
    // Handles errors for simple fields
    if (typeof firstError.message === 'string') {
        return firstError.message;
    }
    // Handles errors for nested fields like weightRecords
    if (Array.isArray(firstError)) {
        const nestedError = firstError.find(
            (err) => err && Object.keys(err).length > 0
        );
        if (nestedError) {
            const nestedKey = Object.keys(nestedError)[0];
            return nestedError[nestedKey].message;
        }
    }
    return 'Please check the form for errors.';
};
