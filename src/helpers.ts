
export const groupBy = <T>(array: T[], predicate: (value: T, index: number, array: T[]) => string) =>
  array.reduce((acc, value, index, array) => {
    (acc[predicate(value, index, array)] ||= []).push(value);
    return acc;
  }, {} as { [key: string]: T[] });

export const buildBlogPath = (slug: String) => {
  const [year, month, day, ...rest] = slug.split('-');
  return `/${year}/${month}/${day}/${rest.join('-')}`;
}
