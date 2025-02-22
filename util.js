// prepends path to fedhr api form data for final form field names
const withPath = (name) => `formResponse.data.${name}`;
const withSignPath = (name) => `formResponse.signatures.${name}`;
const withFormContext = (name) => `formResponse.formContext.${name}`;

// dynamic validation hint text for inputs with character limits
const charCount = (charLimit) => (fieldValue) => {
  if (!fieldValue || fieldValue.length === 0) return `${charLimit} character limit`;
  if (fieldValue.length <= charLimit) return `${charLimit - fieldValue.length} characters remaining`;
  return null;
};

const concatFields = (fieldArray) =>
  fieldArray
    .filter(Boolean)
    .map((item) => item.trim())
    .join(", ");

const deepDiff = (obj1, obj2) => {
  const diff = {};

  const compare = (o1, o2, currentPath = "") => {
    // Iterate through all keys in obj1
    Object.keys(o1).forEach((key) => {
      const fullPath = currentPath ? `${currentPath}.${key}` : key;

      // If the key is not in obj2, record it as a difference
      if (!(key in o2)) {
        diff[fullPath] = { original: o1[key], update: undefined };
      } else if (isObject(o1[key]) && isObject(o2[key])) {
        // If both are objects, recursively compare
        compare(o1[key], o2[key], fullPath);
      } else if (o1[key] !== o2[key]) {
        // If values are different, record the difference
        diff[fullPath] = { original: o1[key], update: o2[key] };
      }
    });

    // Iterate through all keys in obj2 that are not in obj1
    Object.keys(o2).forEach((key) => {
      const fullPath = currentPath ? `${currentPath}.${key}` : key;

      if (!(key in o1)) {
        diff[fullPath] = { original: undefined, update: o2[key] };
      }
    });
  };

  compare(obj1, obj2);
  return diff;
};

// Helper function to check if a value is an object
const isObject = (val) => val && typeof val === "object" && !Array.isArray(val);

const important = (value) => `${value} !important`;

export { withPath, withSignPath, withFormContext, charCount, concatFields, deepDiff, important };
