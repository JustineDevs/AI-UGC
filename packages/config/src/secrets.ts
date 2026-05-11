export const getSecretReference = (value: string | undefined): string => {
  if (!value) {
    return 'MISSING_SECRET';
  }

  return value.replace(/.(?=.{4})/g, '*');
};
