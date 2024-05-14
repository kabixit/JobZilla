import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import { Box, Heading, Text, Flex } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { db, auth } from "./firebaseConfig"; // Import Firebase
import { collection, query, where, getDocs } from 'firebase/firestore';

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const navigate = useNavigate();
  const userEmail = auth.currentUser.email;

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const appliedJobsRef = collection(db, 'applied');
        const appliedJobsQuery = query(appliedJobsRef, where("user", "==", userEmail));
        const querySnapshot = await getDocs(appliedJobsQuery);
        const fetchedAppliedJobs = querySnapshot.docs.map(doc => doc.data());
        setAppliedJobs(fetchedAppliedJobs);
      } catch (error) {
        console.error("Error fetching applied jobs: ", error);
      }
    };

    // Fetch applied jobs when the component mounts
    fetchAppliedJobs();

    // Clean up function to clear any timers or listeners
    return () => {};
  }, [userEmail]); // Add userEmail to dependency array to re-fetch when it changes

  return (
    <div className="container">
      <NavBar />
      <Box padding="20px">
        <Heading as="h1" size="xl" color="#FFF" textAlign="center">
          Applied Jobs
        </Heading>
        <Flex justifyContent="center" mt={5}>
          <Box>
            {appliedJobs.map((job, index) => (
              <Box key={index} mb={4}>
                <Text color="#FFF" fontSize="lg" fontWeight="bold">
                  Job ID: {job.jobId}
                </Text>
                <Text color="#FFF">{job.user}</Text>
              </Box>
            ))}
          </Box>
        </Flex>
      </Box>
    </div>
  );
};

export default AppliedJobs;
