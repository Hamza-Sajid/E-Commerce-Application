// Importing the multer
import multer from "multer";

// Configuring the multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;

// End of File (EOF)

