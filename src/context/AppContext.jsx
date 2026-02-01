import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getJobs,
  getCandidates,
  addJob as addJobToStorage,
  updateJob as updateJobInStorage,
  deleteJob as deleteJobFromStorage,
  addCandidate as addCandidateToStorage,
  updateCandidate as updateCandidateInStorage,
  deleteCandidate as deleteCandidateFromStorage,
  initializeStorage,
} from '../utils/localStorage';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize data from localStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        await initializeStorage();
        const jobsData = getJobs();
        const candidatesData = getCandidates();
        setJobs(jobsData);
        setCandidates(candidatesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Job operations
  const addJob = (job) => {
    const newJob = addJobToStorage(job);
    setJobs([...jobs, newJob]);
    return newJob;
  };

  const updateJob = (id, updatedJob) => {
    const updated = updateJobInStorage(id, updatedJob);
    if (updated) {
      setJobs(jobs.map((job) => (job.id === id ? updated : job)));
    }
    return updated;
  };

  const deleteJob = (id) => {
    deleteJobFromStorage(id);
    setJobs(jobs.filter((job) => job.id !== id));
  };

  const getJobById = (id) => {
    return jobs.find((job) => job.id === id);
  };

  // Candidate operations
  const addCandidate = (candidate) => {
    const newCandidate = addCandidateToStorage(candidate);
    setCandidates([...candidates, newCandidate]);
    return newCandidate;
  };

  const updateCandidate = (id, updatedCandidate) => {
    const updated = updateCandidateInStorage(id, updatedCandidate);
    if (updated) {
      setCandidates(candidates.map((candidate) => (candidate.id === id ? updated : candidate)));
    }
    return updated;
  };

  const deleteCandidate = (id) => {
    deleteCandidateFromStorage(id);
    setCandidates(candidates.filter((candidate) => candidate.id !== id));
  };

  const getCandidateById = (id) => {
    return candidates.find((candidate) => candidate.id === id);
  };

  const updateCandidateStage = (id, newStage) => {
    return updateCandidate(id, { stage: newStage });
  };

  const value = {
    jobs,
    candidates,
    loading,
    addJob,
    updateJob,
    deleteJob,
    getJobById,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    getCandidateById,
    updateCandidateStage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
