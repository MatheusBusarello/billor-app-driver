const LOAD_IDENTIFY_REGEX= '[A-Z]{2}[0-9]{4}'

export function loadIdentifyValidate(loadIdentify: string){
  const load = loadIdentify.toUpperCase();

  const isValid = load.match(LOAD_IDENTIFY_REGEX);

  return isValid;
}