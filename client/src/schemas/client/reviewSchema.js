import * as Yup from 'yup'


export const reviewHotelSchema= Yup.object({
    ratings: Yup.number().min(1).max(5).required('Please enter a rating'),
    title: Yup.string().min(1).required('Please provide a title'),
    content: Yup.string().min(1).required('Please provide a content for your review')
})