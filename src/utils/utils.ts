export const deepCopy = (obj: unknown) => JSON.parse(JSON.stringify(obj));

export const toSentanceCase = (str: string) => `${str.charAt(0).toUpperCase()}${str.substring(1)}`;

export const toTitleCase = (str: string) => str.split(' ').map(toSentanceCase).join(' ');

export const formatDate = (date: Date, format: string) => format.replace('YYYY', date.getUTCFullYear().toString()).replace('mm', (date.getUTCMonth() + 1 < 10 ? '0' : '') + (date.getUTCMonth() + 1).toString()).replace('dd', (date.getUTCDate() < 10 ? '0' : '') + date.getUTCDate().toString());

export function setFormValues(formValues: object, formElement: HTMLFormElement) {
    const dispatchChangedEvent = (el: Node) => el.dispatchEvent(new Event('change'));
    Object.entries(formValues).forEach(([key, value]) => {
        const element = formElement.elements.namedItem(key);
        if (element instanceof RadioNodeList) {
            element.value = value;
        }
        else if (element instanceof Element) {
            element.setAttribute('value', value);
            dispatchChangedEvent(element);
        }
    });
}