const request = require('request');
const fs = require('fs');
const readline = require('readline');

// Extract the domain, resource locator and file path from command line
// use node fetcher.js http://www.example.edu/ ./index.html ./index.html 
const domain = process.argv.slice(2)[0];
const resource = process.argv.slice(2)[1];
const filePath = process.argv.slice(2)[2];

// Create the url by combining domain and resource
const url = new URL(resource, domain).href;

// Make an http request to the constructed url
request(url, (error, response, body) => {
  // console.log('error:', error); // Print the error if one occurred
  // console.log('statusCode:', response);
  // console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
  if (error) {
    // When an invalid url is provided
    console.log('Invalid url provided!!!');
    return;
  }

  // Check if the file already exist
  fs.access(filePath, err => {
    if (err) {
      fs.writeFile(filePath, body, err => {
        if (err) {
          console.error(err);
        }
        console.log(`Downloaded and saved ${body.length} bytes to ./index.html`)
      })
    }
    // To make sure the user understands that the file will be
    // overwritten if it already exists
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question("Do you want to overwrite the existing file? Y/N", (answer) => {
      if (answer.toUpperCase() === 'Y') {
        fs.writeFile(filePath, body, err => {
          if (err) {
            console.error(err);
          }
          console.log(`Downloaded and saved ${body.length} bytes to ./index.html`)
        })
      }
      
      rl.close();
    })

  });
  
  // Write the body into the file path
  // fs.writeFile(filePath, body, err => {
  //   if (err) {
  //     console.error(err);
  //   }
  //   console.log(`Downloaded and saved ${body.length} bytes to ./index.html`)
  // });
});