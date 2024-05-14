import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import { Box, Heading, Input, Text, Flex, Button } from "@chakra-ui/react";
import "./styles/Home.css";
import { useNavigate } from 'react-router-dom';
import { db, auth, email } from "./firebaseConfig"; // Import Firebase firestore
import { collection, getDocs, addDoc, updateDoc, doc, getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const user = getAuth();

  useEffect(() => {
    // Fetch all jobs from Firestore
    const fetchJobs = async () => {
      try {
        const jobsRef = collection(db, 'jobs');
        const querySnapshot = await getDocs(jobsRef);
        const fetchedJobs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setJobs(fetchedJobs);
        setIsLoaded(true); // Set isLoaded to true after jobs are fetched
      } catch (error) {
        console.error("Error fetching jobs: ", error);
      }
    };
  
    // Fetch all jobs
    fetchJobs();
  
    // Clean up function to clear any timers or listeners
    return () => {};
  }, []);


 
  
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
            console.error("Job not found.");
          }
        } else {
          console.error("User not signed in.");
          // Handle this case based on your app's logic, e.g., redirect to login page
        }
      });
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  };
  
  
  

  return (
    <div className={`container ${isLoaded ? "loaded" : ""}`}>
      <div className="body">
        <NavBar />
        <Box padding={"0px"}>
          <Heading as="h1" size="xl" color="#FFF" textAlign="center">
            Searching for a Job?
            <span style={{ color: "#BB86FC" }}> We got you</span>
          </Heading>
          <Heading as="h1" size="xl" color="#FFF" textAlign="center">
            Land Jobs <span style={{ color: "#BB86FC" }}> Faster </span>
          </Heading>
          <Box mt={8} textAlign="center">
            <Input
              variant="outline"
              placeholder="Search for a job"
              bg="rgba(255, 255, 255, 0.05)"
              backdropFilter="blur(10px)"
              border="1px solid rgba(255, 255, 255, 0.1)"
              color="#FFF"
              _placeholder={{ color: "#FFF" }}
              _hover={{ borderColor: "#BB86FC" }}
              _focus={{
                borderColor: "#BB86FC",
                boxShadow: "0 0 0 1px #BB86FC",
              }}
              borderRadius="8px"
              py={3}
              px={4}
              width="500px"
              height={50}
            />
            <Heading
              as="h1"
              mt="30px"
              size="xl"
              color="#FFF"
              textAlign="center"
            >
              Available <span style={{ color: "#BB86FC" }}>Jobs</span>
            </Heading>
            <Flex justifyContent="center" mt={5}>
              {jobs.map((job, index) => (
                <Box
                  key={index}
                  className="glassbox"
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-end" // Align content at the bottom
                  padding="6"
                  borderRadius="16px"
                  border="1px solid rgba(255, 255, 255, 0.125)"
                  boxShadow="0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05)"
                  position="relative"
                  backdropFilter="blur(16px) saturate(180%)"
                  WebkitBackdropFilter="blur(16px) saturate(180%)"
                  width="300px"
                  height="300px"
                  margin="0 10px"
                  backgroundPosition="center"
                  backgroundSize="cover"
                  transition="transform 0.3s ease-in-out" // Add transition for smooth effect
                  _hover={{
                    transform: "scale(1.05)", // Increase scale on hover
                  }}
                >
                  <Text
                    color="white"
                    fontSize={"lg"}
                    textAlign="left"
                    fontWeight={700}
                    marginBottom="10px"
                  >
                    {job.jobName}
                  </Text>
                  <Button
                    colorScheme="#BB86FC"
                    onClick={() => handleApplyJob(job.jobName)} // Pass job name to handleApplyJob
                    mt={6}
                    bg="#BB86FC"
                    _hover={{ bg: "#BB86FE" }}
                    _active={{ bg: "#BB86FC" }}
                  >
                    Apply
                  </Button>
                </Box>
              ))}
            </Flex>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Home;
