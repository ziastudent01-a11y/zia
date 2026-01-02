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
