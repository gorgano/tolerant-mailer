export const getTypedError = (error: unknown) => {
    if (error instanceof Error) return error
    return String(error)
}

/**
 * Takes in a string with HTML, removes the HTML and returns the string.
 * NOTE: Could possibly load this into a browser object and grab the text
 *   element if a more exact method was needed.  There are possibly also
 *   packages that do this specifically.
 * @param strIn string with possible html to remove
 * @returns string with no html
 */
export const stripHtml = (strIn: string) => String(strIn).replace(/(<([^>]+)>)/gi, '');