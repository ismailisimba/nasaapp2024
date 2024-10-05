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

    //console.log(headerIndex,"headerIndex")

    // Extract the header and rows
    //const headers = lines[headerIndex].split('\t');
    const headers = lines[headerIndex].split('\t')[0].split(",");
    const dataLines = lines.slice(headerIndex + 1);

    //console.log(headers,"valueHeadersSample")

    // Parse rows into JSON format
    const jsonData = [];
    const valuesSample = dataLines[0].split('\t')[0].split(",");
    const val1 = valuesSample[headers.indexOf('hostname')]

    console.log(val1,"valueDataSample")
    console.log(headers.indexOf('hostname'),"valueDataSample2")

    for (const line of dataLines) {
      if (!line.trim()) continue; // Skip empty lines
      const values = line.split('\t')[0].split(",");
      const planetData = {
        id: values[headers.indexOf('hostname')],
        ra: parseFloat(values[headers.indexOf('ra')]),
        dec: parseFloat(values[headers.indexOf('dec')]),
        vmag: parseFloat(values[headers.indexOf('sy_vmag')]),
        distance: parseFloat(values[headers.indexOf('sy_dist')]) * 0.326, // Convert distance from parsecs to light-years
      };

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

      console.log(headers,"heaeders")
  
      // Parse rows into JSON format
      const jsonData = [];
      for (const line of dataLines) {
        if (!line.trim()) continue; // Skip empty lines
        const values = line.split('\t');
  
        const planetData = {
          id: values[headers.indexOf('HIP')],
          RAhms: parseFloat(values[headers.indexOf('RAhms')]),
          DEdms: parseFloat(values[headers.indexOf('DEdms')]),
          vmag: parseFloat(values[headers.indexOf('Vmag')]),
          dej2000: parseFloat(values[headers.indexOf('_DEJ2000')]),
          raj2000: parseFloat(values[headers.indexOf('_RAJ2000')]), // Convert distance from parsecs to light-years
        };
  
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