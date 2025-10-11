/* eslint-disable no-console */
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import fs from "fs";

cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.cloud_api_key,
    api_secret: config.cloud_api_secret
});

// export const sendImageToCloudinary = async (imageName: string, path: string): Promise<UploadApiResponse> => {

//     // cloudinary.config({
//     //     cloud_name: config.cloud_name,
//     //     api_key: config.cloud_api_key,
//     //     api_secret: config.cloud_api_secret
//     // });

//     return new Promise((resolve, reject) => {
//         cloudinary.uploader.upload(
//             path,
//             { public_id: imageName },
//             function (error, result) {
//                 if(error){
//                     reject(error)
//                 };
//                 resolve(result)
//             }
//         );
//     });

//     // // Upload an image
//     // const uploadResult = await cloudinary.uploader
//     //     .upload(
//     //         path, {
//     //         public_id: imageName,
//     //     }
//     //     )
//     //     .catch((error) => {
//     //         console.log(error);
//     //     });

//     // console.log(uploadResult);


//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url(imageName, {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });

//     console.log(optimizeUrl);

//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });

//     console.log(autoCropUrl);


// };


export const sendImageToCloudinary = async (
    imageName: string,
    path: string
): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            path,
            { public_id: imageName },
            function (error, result) {
                if (error) {
                    return reject(error);
                }

                // ✅ Type narrowing to remove undefined
                if (!result) {
                    return reject(new Error('Upload failed with unknown error'));
                }

                resolve(result); // ✅ now TypeScript knows it's UploadApiResponse

                //delete image system 
                fs.unlink(path, (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        console.log('File is deleted.')
                    }
                });
            }
        );
    });
};



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/src/uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024, // ✅ 20MB
    }
});

