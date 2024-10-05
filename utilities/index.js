const fs = require('fs');
const path = require('path');

class utilities {
    constructor(){
        this.fetchAndConvertCSV = fetchAndConvertCSV;
        this.fetchAndConvertTSV = fetchAndConvertTSV;
     
    }
  }




// Fetch the CSV file, parse it, and convert it to JSON forma


async function fetchAndConvertCSV() {
  try {
    // Read the CSV file
    const filePath = path.resolve(__dirname, './assets/planet_batch_1.csv');
    const csvData = fs.readFileSync(filePath, 'utf-8');

    // Split the CSV data into lines
    const lines = csvData.split('\n');

    // Find the index of the data start (ignore metadata and comments)
    let headerIndex = 0;
    while (lines[headerIndex].startsWith('#') || lines[headerIndex].trim() === '') {
      headerIndex++;
    }

    // Extract the header and rows
    const headers = lines[headerIndex].split('\t')[0].split(',');
    const dataLines = lines.slice(headerIndex + 1);

    // Parse rows into JSON format
    const jsonData = [];

    for (const line of dataLines) {
      if (!line.trim()) continue; // Skip empty lines
      const values = line.split('\t')[0].split(',');

      // Create a planetData object with the desired fields
      const planetData = {
        id: values[headers.indexOf('hostname')],
        ra: parseFloat(values[headers.indexOf('ra')]),
        dec: parseFloat(values[headers.indexOf('dec')]),
        vmag: parseFloat(values[headers.indexOf('sy_vmag')]),
        distance: parseFloat(values[headers.indexOf('sy_dist')]) * 0.326, // Convert distance from parsecs to light-years
      };

      // Check if any value is null, undefined, or blank string
      const hasInvalidValue = Object.values(planetData).some(
        (value) => value === null || value === undefined || value === ''
      );

      if (hasInvalidValue) {
        continue; // Skip this row
      }

      jsonData.push(planetData);
    }

    // Save JSON data to file
    const jsonFilePath = path.resolve(__dirname, './assets/planet_batch_1.json');
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));

    console.log('JSON data saved to', jsonFilePath);
    return jsonData;
  } catch (error) {
    console.error('Error fetching and converting CSV:', error);
  }
}




 async function fetchAndConvertTSV() {
  try {
    // Read the TSV file
    const filePath = path.resolve(__dirname, './assets/asu.tsv');
    const tsvData = fs.readFileSync(filePath, 'utf-8');

    // Split the TSV data into lines
    const lines = tsvData.split('\n');

    // Find the index of the data start (ignore metadata and comments)
    let headerIndex = 0;
    while (lines[headerIndex].startsWith('#') || lines[headerIndex].trim() === '') {
      headerIndex++;
    }

    // Extract the header and rows
    const headers = lines[headerIndex].split('\t');
    const dataLines = lines.slice(headerIndex + 1);

    // Parse rows into JSON format
    const jsonData = [];
    for (const line of dataLines) {
      if (!line.trim()) continue; // Skip empty lines
      const values = line.split('\t');

      // Create a planetData object with the desired fields
      const planetData = {
        id: values[headers.indexOf('HIP')],
        RAhms: values[headers.indexOf('RAhms')],
        DEdms: values[headers.indexOf('DEdms')],
        vmag: parseFloat(values[headers.indexOf('Vmag')]),
        RAICRS: parseFloat(values[headers.indexOf('RAICRS')]),
        DEICRS: parseFloat(values[headers.indexOf('DEICRS')]),
        Plx: parseFloat(values[headers.indexOf('Plx')]),
        pmRA: parseFloat(values[headers.indexOf('pmRA')]),
        pmDE: parseFloat(values[headers.indexOf('pmDE')]),
        e_Plx: parseFloat(values[headers.indexOf('e_Plx')]),
        B_V: parseFloat(values[headers.indexOf('B-V')]),
        Notes: values[headers.indexOf('Notes')],
        _RA_icrs: parseFloat(values[headers.indexOf('_RA.icrs')]),
        _DE_icrs: parseFloat(values[headers.indexOf('_DE.icrs')]),
        DEJ2000: parseFloat(values[headers.indexOf('_DEJ2000')]),
        RAJ2000: parseFloat(values[headers.indexOf('_RAJ2000')]),
      };

      // Check if any value is null, undefined, or blank string
      const hasInvalidValue = Object.values(planetData).some(
        (value) => value === "null"||value === null || value === undefined || value === ''|| value === ' ' || value === "-----------"
      );

      if (hasInvalidValue) {
        continue; // Skip this row
      }

      jsonData.push(planetData);
    }

    // Save JSON data to file
    const jsonFilePath = path.resolve(__dirname, './assets/stars.json');
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));

    console.log('JSON data saved to', jsonFilePath);
    return jsonData;
  } catch (error) {
    console.error('Error fetching and converting TSV:', error);
  }
}


// Example usage
  
  
  module.exports = utilities;