import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
//stores images,videos,apis to cloudinary and stores then in our db
//image from device -> multer picks and keeps temp on our server for any changes if req. -> cloudinary keeps permanent and sends url -> stores url by db to use
//local path-> Server's stored assets path(image,video etc).
//node provides its own fileSystem to manage files on server
(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_CLOUDINARY_API_SECRET,
    });

})  


//method to upload data

const uploadOnCloudinary= async( localPath)=>{
    try {
        if(!localPath){
            return null;
        }
        //upload docs for given path/url and resource will be auto check whether it is image,video etc
       const response=await cloudinary.uploader.upload(localPath,{
            resource_type:"auto"
        })
        //success
        console.log(`File has been uploaded successfully ${response.url}`);
        return response;
    } catch (error) {
        console.error('Upload error:', error);

        // Check if the file exists before trying to remove it
        if (fs.existsSync(localPath)) {
            try {
                fs.unlinkSync(localPath);
                console.log('Temporary file deleted successfully');
               // return null;
            } catch (deleteError) {
                console.error('Error deleting the file:', deleteError);
            }
        } else {
            console.log('No file to delete from the server');
        }
    }
}

export {uploadOnCloudinary};