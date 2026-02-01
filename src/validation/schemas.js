import * as yup from 'yup';

// Job validation schema
export const jobSchema = yup.object().shape({
  title: yup
    .string()
    .required('Job title is required')
    .min(3, 'Job title must be at least 3 characters')
    .max(100, 'Job title must be less than 100 characters'),
  department: yup
    .string()
    .required('Department is required'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  status: yup
    .string()
    .oneOf(['Open', 'Closed'], 'Status must be either Open or Closed')
    .required('Status is required'),
});

// Candidate validation schema
export const candidateSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  phone: yup
    .string()
    .required('Phone is required')
    .matches(/^[0-9+\-() ]+$/, 'Phone number is not valid'),
  resumeLink: yup
    .string()
    .url('Resume link must be a valid URL')
    .nullable(),
  appliedFor: yup
    .string()
    .required('Applied job is required'),
  stage: yup
    .string()
    .oneOf(
      ['Applied', 'Shortlisted', 'Interview Scheduled', 'Offer Extended', 'Hired', 'Rejected'],
      'Invalid stage'
    )
    .required('Stage is required'),
});
