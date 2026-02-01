import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { candidateSchema } from '../validation/schemas';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import Button from '../components/Button';

const AddCandidate = () => {
  const navigate = useNavigate();
  const { addCandidate, jobs } = useAppContext();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resumeLink: '',
    appliedFor: '',
    stage: 'Applied',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const jobOptions = jobs
    .filter((job) => job.status === 'Open')
    .map((job) => ({ value: job.title, label: job.title }));

  const stageOptions = [
    { value: 'Applied', label: 'Applied' },
    { value: 'Shortlisted', label: 'Shortlisted' },
    { value: 'Interview Scheduled', label: 'Interview Scheduled' },
    { value: 'Offer Extended', label: 'Offer Extended' },
    { value: 'Hired', label: 'Hired' },
    { value: 'Rejected', label: 'Rejected' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await candidateSchema.validate(formData, { abortEarly: false });
      addCandidate(formData);
      navigate('/candidates');
    } catch (error) {
      if (error.name === 'ValidationError') {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Candidate</h1>
        <p className="text-gray-600 mt-1">Add a candidate to the hiring pipeline</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder="e.g., John Doe"
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            placeholder="e.g., john.doe@example.com"
          />

          <FormInput
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
            placeholder="e.g., +1-234-567-8900"
          />

          <FormInput
            label="Resume Link"
            name="resumeLink"
            type="url"
            value={formData.resumeLink}
            onChange={handleChange}
            error={errors.resumeLink}
            placeholder="https://example.com/resume.pdf"
          />

          <FormSelect
            label="Applied For"
            name="appliedFor"
            value={formData.appliedFor}
            onChange={handleChange}
            options={jobOptions}
            error={errors.appliedFor}
            required
          />

          <FormSelect
            label="Initial Stage"
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            options={stageOptions}
            error={errors.stage}
            required
          />

          <div className="flex gap-4 mt-6">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Candidate'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/candidates')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCandidate;
