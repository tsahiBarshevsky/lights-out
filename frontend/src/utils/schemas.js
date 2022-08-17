import * as Yup from 'yup';

const required = 'Required field';
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const phoneRegex = /^05\d([-]{0,1})\d{7}$/;

const registrationSchema = Yup.object().shape({
    email: Yup.string().trim().matches(emailRegex, "Email isn't valid").required(required),
    password: Yup.string().trim().min(6, 'Password must contains at least 6 characters').required(required),
    firstName: Yup.string().trim().required(required),
    lastName: Yup.string().trim().required(required),
    phone: Yup.string().matches(phoneRegex, "Phone number isn't valid").required(required)
});

const loginSchema = Yup.object().shape({
    email: Yup.string().trim().matches(emailRegex, "Email isn't valid").required(required),
    password: Yup.string().trim().min(6, 'Password must contains at least 6 characters').required(required),
});

const checkoutSchema = Yup.object().shape({
    email: Yup.string().trim().matches(emailRegex, "Email isn't valid").required(required),
    firstName: Yup.string().trim().required(required),
    lastName: Yup.string().trim().required(required),
    phone: Yup.string().matches(phoneRegex, "Invalid number").required(required),
    creditNumber: Yup.string().min(19, 'Invalid number').required(required),
    expiryDate: Yup.string().min(5, 'Invalid date').required(required),
    cvc: Yup.string().min(3, 'Invalid number').required(required)
});

const editingSchema = Yup.object().shape({
    firstName: Yup.string().trim().required(required),
    lastName: Yup.string().trim().required(required),
    phone: Yup.string().matches(phoneRegex, "Phone number isn't valid").required(required)
});

export { registrationSchema, loginSchema, checkoutSchema, editingSchema };