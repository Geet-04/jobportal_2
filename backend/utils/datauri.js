// Import the DataUriParser class from the 'datauri/parser' package - This will help convert file buffers into Data URIs (base64 encoded strings)
import DataUriParser from "datauri/parser.js";

// Import 'path' module from Node.js - Used to handle and extract file extensions from file names
import path from "path";

//This function Convert uploaded file buffer to Data URI
//It Takes a file from Multer, gets its extension, converts its buffer to a Data URI, which can be used to upload directly to Cloudinary or send via API.
const getDataUri = (file) => {
   const parser = new DataUriParser(); // Create a new instance of DataUriParser
   // Extract the file extension (e.g., ".jpg", ".png") from the original file name.'file.originalname' is provided by Multer
   // path.extname() returns the extension including the dot, and we convert it to string
   const extName = path.extname(file.originalname).toString();  
   // Use the parser to convert the file buffer into a Data URI
   // parser.format(extension, fileBuffer) returns an object with 'content' key containing the base64 Data URI
   return parser.format(extName, file.buffer);
}

export default getDataUri;


