import {Formik, Form} from "formik";
import {useBookStore} from "../store/useBookStore.js";
import {Autocomplete, Button, TextareaAutosize, TextField} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {useCallback} from "react";
import {ImageInput} from "./ImageInput.jsx";

export const BookForm = ({closeModal}) => {
    const {book, categories, createBook, updateBook} = useBookStore()

    const languageOptions = [{label: 'Қазақша'}, {label: 'Русский'}, {label: 'English'},]
    const typeOptions = [
        {value: 'forSale', label: 'For Sale'},
        {value: 'forExchange', label: 'For Exchange'},
        {value: 'any', label: 'For Exchange / For Sale'},
        {value: 'forFree', label: 'For Free'},
    ]

    const handleSubmit = useCallback(async (values) => {
        try {
            if (book && book._id) {
                await updateBook({...values, _id: book._id});
            } else {
                await createBook(values);
            }
            closeModal();
        } catch (error) {
            console.error("Error submitting book form:", error);
        }
    }, [createBook, updateBook, book, closeModal]);


    return (<Formik
        enableReinitialize
        initialValues={book ? {
            publishedDate: book.publishedDate ? dayjs(book.publishedDate) : null,
            title: book.title || '',
            author: book.author || '',
            description: book.description || '',
            language: book.language || '',
            price: book.price || '',
            image: book.image || '',
            type: book.type || '',
            categories: book.categories || [],
        } : {
            title: '',
            author: '',
            description: '',
            language: '',
            publishedDate: null,
            price: '',
            image: '',
            type: '',
            categories: [],
        }}
        onSubmit={handleSubmit}
    >
        {({values, handleChange, handleBlur, handleSubmit, setFieldValue}) => (<Form onSubmit={handleSubmit}>
            <div className='grid grid-cols-2 gap-x-5 gap-y-8 overflow-y-auto'>
                <TextField value={values.title} onChange={handleChange} onBlur={handleBlur}
                           label="Title" name='title' fullWidth/>
                <TextField value={values.author} onChange={handleChange} onBlur={handleBlur}
                           label="Author" variant="outlined" name='author' fullWidth/>
                <TextareaAutosize maxRows={7} minRows={3} value={values.description} onChange={handleChange}
                                  onBlur={handleBlur} placeholder="Description"
                                  className='col-span-2 w-full resize-none' name='description'/>
                <Autocomplete
                    renderInput={(params) => <TextField {...params} label="Language"/>}
                    options={languageOptions}
                    getOptionLabel={(option) => option.label}
                    value={languageOptions.find((option) => option.label === values.language) || null}
                    onChange={(event, newValue) => setFieldValue('language', newValue ? newValue.label : '')}
                    onBlur={handleBlur}
                    variant="outlined"
                    name='language'
                    fullWidth
                />
                <DatePicker
                    value={values.publishedDate}
                    label="PublishedDate"
                    onChange={(date) => setFieldValue('publishedDate', date)}
                    onBlur={handleBlur}
                    name="publishedDate"
                    slotProps={{textField: {fullWidth: true}}}
                />
                <TextField value={values.price} onChange={handleChange} onBlur={handleBlur} label="Price"
                           variant="outlined" type='number' name='price' fullWidth/>
              <ImageInput />

                <Autocomplete
                    renderInput={(params) => <TextField {...params} label="Type"/>}
                    options={typeOptions}
                    getOptionLabel={(option) => option.label}
                    value={typeOptions.find((option) => option.value === values.type) || null}
                    onChange={(event, newValue) => setFieldValue('type', newValue ? newValue.value : '')}
                    onBlur={handleBlur}
                    variant="outlined"
                    name='type'
                    fullWidth
                />

                <Autocomplete
                    multiple
                    options={categories}
                    getOptionLabel={(option) => option.name}
                    value={categories.filter(category => values.categories.includes(category.name))}
                    onChange={(event, newValue) => setFieldValue('categories', newValue.map(option => option.name))}
                    onBlur={handleBlur}
                    renderInput={(params) => <TextField {...params} label="Categories" variant="outlined"/>}
                    name="categories"
                    fullWidth
                />
                <Button type="submit" className='btn btn-primary'>
                    {book && book._id ? "Update Book" : "Create Book"}
                </Button>
            </div>
        </Form>)}

    </Formik>)
}