import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCandidateById, updateCandidateStage } = useAppContext();
  const [candidate, setCandidate] = useState(null);
  const [selectedStage, setSelectedStage] = useState('');

  const stages = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Offer Extended', 'Hired', 'Rejected'];

  useEffect(() => {
    const candidateData = getCandidateById(id);
    if (candidateData) {
      setCandidate(candidateData);
      setSelectedStage(candidateData.stage);
    } else {
      navigate('/candidates');
    }
  }, [id, getCandidateById, navigate]);

  const handleStageUpdate = () => {
    if (selectedStage !== candidate.stage) {
      updateCandidateStage(id, selectedStage);
      setCandidate({ ...candidate, stage: selectedStage });
    }
  };

  const getStageColor = (stage) => {
    const colors = {
      'Applied': 'bg-blue-100 text-blue-800 border-blue-200',
      'Shortlisted': 'bg-purple-100 text-purple-800 border-purple-200',
      'Interview Scheduled': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Offer Extended': 'bg-orange-100 text-orange-800 border-orange-200',
      'Hired': 'bg-green-100 text-green-800 border-green-200',
      'Rejected': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[stage] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (!candidate) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link to="/candidates" className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block">
          ← Back to Candidates
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{candidate.name}</h1>
        <p className="text-gray-600 mt-1">Candidate Details and Pipeline Management</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900 mt-1">{candidate.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900 mt-1">{candidate.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900 mt-1">{candidate.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Applied For</label>
                <p className="text-gray-900 mt-1">{candidate.appliedFor}</p>
              </div>
              {candidate.resumeLink && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Resume</label>
                  <p className="text-gray-900 mt-1">
                    <a
                      href={candidate.resumeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View Resume
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="text-gray-900 mt-1">
                  {candidate.createdAt ? new Date(candidate.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
              {candidate.updatedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-gray-900 mt-1">{new Date(candidate.updatedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Stage</h2>
            <div className={`p-4 rounded-lg border-2 text-center ${getStageColor(candidate.stage)}`}>
              <p className="font-semibold">{candidate.stage}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Update Stage</h2>
            <p className="text-sm text-gray-600 mb-4">Move the candidate to a different stage in the hiring pipeline</p>

            <div className="space-y-4">
              {stages.map((stage) => (
                <button
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition ${
                    selectedStage === stage
                      ? getStageColor(stage) + ' font-semibold'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>

            {selectedStage !== candidate.stage && (
              <div className="mt-4">
                <Button variant="success" onClick={handleStageUpdate} className="w-full">
                  Update to {selectedStage}
                </Button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-2">
              <Link to={`/candidates/edit/${id}`} className="block">
                <Button variant="primary" className="w-full">
                  Edit Details
                </Button>
              </Link>
              <Link to="/candidates" className="block">
                <Button variant="outline" className="w-full">
                  Back to List
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetail;
