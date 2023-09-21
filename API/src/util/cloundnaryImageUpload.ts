import cloudinary from "../config/cloudinaryConfig";
const handleImageUpload = async (req: any) => {
    // to store url from the object which is getting returned from cloudnary
    const uploadedImagesArray: any = [];

    // to store the cloudnary responce
    const uploadedImages: any[] = [];
    for (const file of req.files) {
        const base64Image = file.buffer.toString('base64'); // Convert Buffer to base64
        const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Image}`, {
            folder: 'uploaded-images'
        });
        uploadedImages.push(result);
    }
    // Storing all the url in new array so we can store it in the db
    uploadedImages.map((element) => {
        uploadedImagesArray.push(element.url);
    })
    return uploadedImagesArray;

}
export default handleImageUpload