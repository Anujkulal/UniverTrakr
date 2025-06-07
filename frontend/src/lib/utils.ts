export function cn(...classes: (string | false | undefined | null)[]): string{
    return classes.filter(Boolean).join(' ');
}

export const extractDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    // console.log('Extracted date:', date.toLocaleDateString('en-IN', options));
    return date.toLocaleDateString('en-IN', options).replace(/\//g, '-');
}