import {Button} from "@mui/material";
import {CloudUploadIcon} from "lucide-react";
import {useFormikContext} from "formik";
import { useRef, useState} from "react";

export const ImageInput = () => {
    const { values, setFieldValue} = useFormikContext();
    const [imgUrl, setImgUrl] = useState(null);





    const imageInputRef = useRef(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0]


        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImgUrl(reader.result);
            setFieldValue('image', reader.result);
        }
    }



    return(
        <>
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon/>}
            >
                Upload images
                <input
                    ref={imageInputRef}
                    onChange={handleImageChange}
                    type="file"
                    accept="image/*"
                    className='hidden'
                    name='image'
                />
            </Button>

            <img src={imgUrl ? imgUrl : values.image} className='h-[180px]' alt='preview image' />



        </>


    )
}