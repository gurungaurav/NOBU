// Function to convert spaces to underscores
export const convertSpacesToUnderscores = (string) => {
  return string.replace(/\s+/g, "_");
};

// Function to convert underscores to spaces
export const convertUnderscoresToSpaces = (string) => {
  return string.replace(/_/g, " ");
};
