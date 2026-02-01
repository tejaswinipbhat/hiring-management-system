// Local Storage utility functions for Phase 2

const STORAGE_KEYS = {
  JOBS: 'jobs_data',
  CANDIDATES: 'candidates_data',
};

// Generic get function
export const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
};

// Generic set function
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    return false;
  }
};

// Jobs functions
export const getJobs = () => {
  return getFromStorage(STORAGE_KEYS.JOBS) || [];
};

export const saveJobs = (jobs) => {
  return saveToStorage(STORAGE_KEYS.JOBS, jobs);
};

export const addJob = (job) => {
  const jobs = getJobs();
  const newJob = {
    ...job,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  jobs.push(newJob);
  saveJobs(jobs);
  return newJob;
};

export const updateJob = (id, updatedJob) => {
  const jobs = getJobs();
  const index = jobs.findIndex((job) => job.id === id);
  if (index !== -1) {
    jobs[index] = { ...jobs[index], ...updatedJob, updatedAt: new Date().toISOString() };
    saveJobs(jobs);
    return jobs[index];
  }
  return null;
};

export const deleteJob = (id) => {
  const jobs = getJobs();
  const filteredJobs = jobs.filter((job) => job.id !== id);
  saveJobs(filteredJobs);
  return filteredJobs;
};

// Candidates functions
export const getCandidates = () => {
  return getFromStorage(STORAGE_KEYS.CANDIDATES) || [];
};

export const saveCandidates = (candidates) => {
  return saveToStorage(STORAGE_KEYS.CANDIDATES, candidates);
};

export const addCandidate = (candidate) => {
  const candidates = getCandidates();
  const newCandidate = {
    ...candidate,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  candidates.push(newCandidate);
  saveCandidates(candidates);
  return newCandidate;
};

export const updateCandidate = (id, updatedCandidate) => {
  const candidates = getCandidates();
  const index = candidates.findIndex((candidate) => candidate.id === id);
  if (index !== -1) {
    candidates[index] = { ...candidates[index], ...updatedCandidate, updatedAt: new Date().toISOString() };
    saveCandidates(candidates);
    return candidates[index];
  }
  return null;
};

export const deleteCandidate = (id) => {
  const candidates = getCandidates();
  const filteredCandidates = candidates.filter((candidate) => candidate.id !== id);
  saveCandidates(filteredCandidates);
  return filteredCandidates;
};

// Initialize storage with mock data from JSON files if empty
export const initializeStorage = async () => {
  try {
    const jobs = getJobs();
    const candidates = getCandidates();

    if (jobs.length === 0) {
      const response = await fetch('/jobs.json');
      if (response.ok) {
        const jobsData = await response.json();
        const jobsWithIds = jobsData.map((job, index) => ({
          ...job,
          id: job.id || `job-${index + 1}`,
          createdAt: job.createdAt || new Date().toISOString(),
        }));
        saveJobs(jobsWithIds);
      }
    }

    if (candidates.length === 0) {
      const response = await fetch('/candidates.json');
      if (response.ok) {
        const candidatesData = await response.json();
        const candidatesWithIds = candidatesData.map((candidate, index) => ({
          ...candidate,
          id: candidate.id || `candidate-${index + 1}`,
          createdAt: candidate.createdAt || new Date().toISOString(),
        }));
        saveCandidates(candidatesWithIds);
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};
