import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { jobSchema } from '../validation/schemas';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import FormTextArea from '../components/FormTextArea';
import Button from '../components/Button';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJobById, updateJob } = useAppContext();

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    description: '',
    status: 'Open',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const departmentOptions = [
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'HR', label: 'HR' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Operations', label: 'Operations' },
  ];

  const statusOptions = [
    { value: 'Open', label: 'Open' },
    { value: 'Closed', label: 'Closed' },
  ];

  useEffect(() => {
    const job = getJobById(id);
    if (job) {
      setFormData({
        title: job.title,
        department: job.department,
        description: job.description,
        status: job.status,
      });
    } else {
      navigate('/jobs');
    }
    setLoading(false);
  }, [id, getJobById, navigate]);

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
      await jobSchema.validate(formData, { abortEarly: false });
      updateJob(id, formData);
      navigate('/jobs');
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
        <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
        <p className="text-gray-600 mt-1">Update job posting details</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Job Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
            placeholder="e.g., Senior Software Engineer"
          />

          <FormSelect
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            options={departmentOptions}
            error={errors.department}
            required
          />

          <FormTextArea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            required
            rows={6}
            placeholder="Enter job description, requirements, and responsibilities..."
          />

          <FormSelect
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
            error={errors.status}
            required
          />

          <div className="flex gap-4 mt-6">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Job'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/jobs')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;
