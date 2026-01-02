export function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== "" && value !== null && value !== undefined
    )
  );
}
export function computeEligibility(data: {
  socialSecurity?: string;
  designation?: string;
  factoryName?: string;
}): boolean {
  return Boolean(
    data.socialSecurity &&
    data.designation &&
    data.factoryName
  );
}