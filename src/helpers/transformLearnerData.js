import { format } from "date-fns";

export function replaceSpecialCharacters(str) {
  return str
    .replace(/[^a-zA-Z0-9\s]+/g, '') // Remove all special characters except spaces
    .replace(/[\s/]+/g, '_')            // Replace spaces with underscores
    .toLowerCase();                  // Optionally convert to lowercase for consistency
}

export function transformLearnerData(item) {
    return {
      id: item.id,
      name: item.name,
      ...(Array.isArray(item.column_values) ? item.column_values.reduce((acc, column) => {
        if (column && column.column && column.column.title) {
          const title = replaceSpecialCharacters(column.column.title.toLowerCase());
          let value = "";

          // Check if it has values (like labels) or dates
          if (column.values && column.values.length > 0) {
            value = column.values[0].label; // Use the first label
          } else if (column.date) {
            value = format(column.date, 'MMMM dd, yyyy'); // Format the date
          } else if (column.text) {
            value = column.text
          } else if (column.number !== null || column.number !== undefined) {
            value = column.number + column.symbol; // Add the symbol if it exists
          } 

          acc[title] = value; // Add the title as key, value as value

        }
        return acc;
      }, {}) : {}) // If column_values is undefined or not an array, use an empty object
    };
  }