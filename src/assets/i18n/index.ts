import en from './en.json';
import vi from './vi.json';

// Helper function to generate resources dynamically
function generateResources(json: any) {
  // Flatten nested objects with :: separator
  const flatten = (obj: any, parentKey = ''): any => {
    let result: any = {};

    Object.keys(obj).forEach((key) => {
      const newKey = parentKey ? `${parentKey}::${key}` : key;

      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(result, flatten(obj[key], newKey));
      } else {
        result[newKey] = obj[key];
      }
    });

    return result;
  };

  return Object.keys(json).map((key) => ({
    resourceName: key,
    texts: flatten(json[key]),
  }));
}

export const localizationResources = [
  {
    culture: 'en',
    resources: generateResources(en),
  },
  {
    culture: 'vi',
    resources: generateResources(vi),
  },
];
