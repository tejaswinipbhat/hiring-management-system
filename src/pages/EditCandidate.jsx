import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { candidateSchema } from '../validation/schemas';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import Button from '../components/Button';

const EditCandidate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCandidateById, updateCandidate, jobs } = useAppContext();

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
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const candidate = getCandidateById(id);
    if (candidate) {
      setFormData({
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        resumeLink: candidate.resumeLink || '',
        appliedFor: candidate.appliedFor,
        stage: candidate.stage,
      });
    } else {
      navigate('/candidates');
    }
    setLoading(false);
  }, [id, getCandidateById, navigate]);

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
      updateCandidate(id, formData);
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

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Candidate</h1>
        <p className="text-gray-600 mt-1">Update candidate details</p>
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
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <FormInput
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
          />

          <FormInput
            label="Resume Link"
            name="resumeLink"
            type="url"
            value={formData.resumeLink}
            onChange={handleChange}
            error={errors.resumeLink}
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
            label="Current Stage"
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            options={stageOptions}
            error={errors.stage}
            required
          />

          <div className="flex gap-4 mt-6">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Candidate'}
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

export default EditCandidate;
