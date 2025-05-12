import {Formik, Form} from "formik";


import {useBookStore} from "../store/useBookStore.js";
import {Autocomplete, Button, Input, TextareaAutosize, TextField} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {CloudUploadIcon} from "lucide-react";

export const BookForm = () => {
    const {book, categories} = useBookStore()

    const languageOptions = [{label: 'Қазақша'}, {label: 'Русский'}, {label: 'English'},]
    const typeOptions = [
        {value: 'forSale', label: 'For Sale'},
        {value: 'forExchange', label: 'For Exchange'},
        {value: 'any', label: 'For Exchange / For Sale'},
        {value: 'forFree', label: 'For Free'},
    ]

    function handleSubmit(values) {
        console.log(values);
    }


    return (<Formik
            enableReinitialize
            initialValues={book ? {publishedDate: book.publishedDate ? new Date(book.publishedDate) : null, ...book} : {
                title: '',
                author: '',
                description: '',
                language: '',
                publishedDate: null,
                price: '',
                image: [],
                type: '',
                categories: [],
            }}
        >
            {({values, handleChange, handleBlur}) => (<Form>
                    <div className='grid grid-cols-2 gap-x-5 gap-y-8'>
                        <TextField value={values.title || ''} onChange={handleChange} onBlur={handleBlur}
                                   label="Title" name='title'/>
                        <TextField value={values.author || ''} onChange={handleChange} onBlur={handleBlur}
                                   label="Author" variant="outlined" name='author'/>
                        <TextareaAutosize maxRows={7} minRows={3} value={values.description || ''} onChange={handleChange}
                                          onBlur={handleBlur} placeholder="Description"
                                          className='col-span-2' name='description'/>
                        <Autocomplete
                            renderInput={(params) => <TextField {...params} label="Language"/>}
                            options={languageOptions}
                            getOptionLabel={(option) => option.label}
                            value={languageOptions.find((option) => option.value === values.language) || null}
                            onChange={(event, newValue) => handleChange({
                                target: {
                                    name: 'language',
                                    value: newValue ? newValue.label : ''
                                }
                            })}
                            onBlur={handleBlur}
                            variant="outlined"
                            name='language'
                        />
                        <DatePicker
                            value={dayjs(values.publishedDate) || null}
                            label="PublishedDate"
                            onChange={(date) => handleChange({target: {name: 'publishedDate', value: new Date(date)}})}
                            onBlur={handleBlur}
                            name="publishedDate"
                        />
                        <TextField value={values.price || ''} onChange={handleChange} onBlur={handleBlur} label="Price"
                                   variant="outlined" type='number' name='price'/>
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon/>}
                        >
                            Upload images
                            <Input
                                type="file"
                                onChange={(event) => {
                                    const files = event.target.files;
                                    const fileArray = Array.from(files);
                                    handleChange({
                                        target: {
                                            name: 'image',
                                            value: fileArray,
                                        },
                                    });
                                }}
                                accept="image/*"
                                multiple={true}
                                name="image"
                            />
                        </Button>

                        <Autocomplete
                            renderInput={(params) => <TextField {...params} label="Type"/>}
                            options={typeOptions}
                            getOptionLabel={(option) => option.label}
                            value={typeOptions.find((option) => option.value === values.type) || null}
                            onChange={(event, newValue) => handleChange({
                                target: {
                                    name: 'type',
                                    value: newValue ? newValue.value : ''
                                }
                            })}
                            onBlur={handleBlur}
                            variant="outlined"
                            name='type'
                        />

                        <Autocomplete
                            multiple
                            options={categories}
                            getOptionLabel={(option) => option.name}
                            value={categories.filter((category) => values.categories?.includes(category.name)) || []} // Map names to objects
                            onChange={(event, newValue) => handleChange({
                                target: {
                                    name: 'categories', value: newValue.map((option) => option.name), // Store names in values.categories
                                },
                            })}
                            onBlur={handleBlur}
                            renderInput={(params) => <TextField {...params} label="Categories" variant="outlined"/>}
                            name="categories"
                        />
                        <Button onClick={()=>console.log(values)}>Submit</Button>
                    </div>
                </Form>)}

        </Formik>)
}

