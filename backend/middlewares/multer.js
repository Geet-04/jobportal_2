import multer from "multer"

const storage = multer.memoryStorage(); //Stores uploaded file in memory (Buffer)
export const singleUpload = multer({storage}).single("file") //multer({storage})	Initializes Multer with that storage.single("file")	Handles one file under field "file". "file" in .single("file") refers to name="file" in your HTML input.