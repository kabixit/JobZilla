import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import './styles/JobSearch.css';
import {
  Box,
  Heading,
  Input,
  Flex,
  Checkbox,
  CheckboxGroup,
  Button,
  Select,
  Spinner,
  Text 
} from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { db, auth, email } from "./firebaseConfig"; // Import Firebase firestore
import { collection, getDocs, addDoc, updateDoc, doc, getFirestore, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


const JobSearch = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true); // State to track loading status
    const [role, setRole] = useState("");
    const [jobTime, setJobTime] = useState([]);
    const [jobType, setJobType] = useState("");
  
    const fetchJobs = async () => {
      setLoading(true); // Set loading to true when searching
      try {
        const jobsRef = collection(db, 'jobs');
        let jobsQuery = query(jobsRef);
  
        // Apply filters based on user input
        if (role) {
          jobsQuery = query(jobsQuery, where("jobName", "==", role));
        }
        if (jobTime.length > 0) {
          jobsQuery = query(jobsQuery, where("jobTime", "in", jobTime));
        }
        if (jobType) {
          jobsQuery = query(jobsQuery, where("jobType", "==", jobType));
        }
  
        const querySnapshot = await getDocs(jobsQuery);
        const fetchedJobs = querySnapshot.docs.map((doc) => doc.data());
        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching jobs: ", error);
      } finally {
        setLoading(false); // Set loading to false after jobs are fetched
      }
    };
  
    useEffect(() => {
      // Fetch jobs only if role, jobTime, or jobType changes
      if (role !== "" || jobTime.length > 0 || jobType !== "") {
        fetchJobs();
      } else {
        setLoading(false); // Set loading to false if no filters applied
      }
    }, [role, jobTime, jobType]);

  const handleSearch = () => {
    setLoading(true); // Set loading to true when searching
    // Fetch jobs again to apply new filters
    fetchJobs();
  };

  const handleApplyJob = async (jobName) => {
    try {
      const auth = getAuth();
      let userEmail = ""; // Initialize userEmail
  
      // Listen for authentication state changes
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          userEmail = user.email;
          console.log("User email:", userEmail);
  
          // Find the job to update
          const jobToUpdate = jobs.find((job) => job.jobName === jobName);
          if (jobToUpdate) {
            // Update job application array with user's email
            const updatedJobApplications = [
              ...(jobToUpdate.jobApplications || []), // Ensure jobApplications is an array
              userEmail,
            ];
  
            // Update Firestore document for job
            const db = getFirestore();
            await updateDoc(doc(db, "jobs", jobToUpdate.id), {
              jobApplications: updatedJobApplications,
            });
            console.log("Job application submitted successfully.");
            navigate('/AppliedJobs')
  
            // Update "applied" collection
            const appliedRef = collection(db, "applied");
            await addDoc(appliedRef, {
              jobId: jobToUpdate.jobId,
              user: userEmail,
            });
            console.log("Applied job added to 'applied' collection.");
          } else {
            console.error("Job not found for:", jobName);
            // Handle this case based on your app's logic, e.g., show an alert or redirect to a different page
          }
        } else {
          console.error("User not signed in.");
          // Handle this case based on your app's logic, e.g., redirect to login page
        }
      });
    } catch (error) {
      console.error("Error applying for job:", error);
      // Handle other errors, e.g., show an error message to the user
    }
  };
  
  
  return (
    <div className="container">
      <NavBar />
      <Box padding={"30px"} className="glassmorphism-container">
        <Heading as="h1" size="lg" color="#FFF" textAlign="center">
          Find a Job
        </Heading>
        <Input
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          mt={2}
          variant="outline"
          color="#FFF"
          bg="rgba(255, 255, 255, 0.05)"
          border="1px solid rgba(255, 255, 255, 0.1)"
          _placeholder={{ color: "#FFF" }}
          _hover={{ borderColor: "#00BAE2" }}
          _focus={{
            borderColor: "#00BAE2",
            boxShadow: "0 0 0 1px #00BAE2",
          }}
          borderRadius="8px"
          py={3}
          px={4}
          width="100%"
        />

        <CheckboxGroup colorScheme="teal" mt={5}>
          <Flex justify={'left'}>
            <Checkbox
              value="Full-Time"
              onChange={(e) => setJobTime([...jobTime, e.target.value])}
              color="#FFF"
              mr={4}
            >
              Full-time
            </Checkbox>
            <Checkbox
              value="Part-Time"
              onChange={(e) => setJobTime([...jobTime, e.target.value])}
              color="#FFF"
            >
              Part-time
            </Checkbox>
          </Flex>
        </CheckboxGroup>

        <Select
          placeholder="Select job type"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          mt={4}
          variant="outline"
          color="#FFF"
          bg="rgba(255, 255, 255, 0.05)"
          border="1px solid rgba(255, 255, 255, 0.1)"
          _placeholder={{ color: "#FFF" }}
          _hover={{ borderColor: "#00BAE2" }}
          _focus={{
            borderColor: "#00BAE2",
            boxShadow: "0 0 0 1px #00BAE2",
          }}
          borderRadius="8px"
          py={3}
          px={4}
          width="100%"
        >
          <option value="Remote">Remote</option>
          <option value="On-Site">Onsite</option>
          <option value="Hybrid">Hybrid</option>
        </Select>

        <Button
          onClick={handleSearch}
          mt={6}
          bg="#BB86FC"
          _hover={{ bg: "#0597B7" }}
          _active={{ bg: "#008EAF" }}
        >
          Search
        </Button>

        {/* Display Spinner while loading */}
        {loading && (
          <Flex justify="center" mt={6}>
            <Spinner size="lg" color="teal" />
          </Flex>
        )}

        {/* Display jobs */}
        <Box mt={6}>
          {jobs.length > 0 ? (
            jobs.map((job, index) => (
<Box key={index} bg="rgba(255, 255, 255, 0.05)" p={2} my={2} borderRadius="md" display="flex"
  justifyContent="space-between"
  alignItems="center">
  <Heading as="h2" size="md" color="#FFF" pt={3}>{job.jobName}</Heading>
  <Button style={{ width: '100px'}} onClick={handleApplyJob}>Apply</Button>
  {/* Display other job details */}
</Box>

            ))
          ) : (
            <Text color="white">No Jobs found.</Text>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default JobSearch;
