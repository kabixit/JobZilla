import React from 'react';
import { Box, Flex, Spacer, Button, Link } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import "./NavBar.css"

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement your logout logic here
    navigate('/Login');
  };

  return (
    <Box className="sticky-nav">
      <Flex align="center" margin={7} paddingBottom={30}>
        <Link mt={2} className="logo" _hover={{ textDecoration :' none'}} fontSize="xl" fontWeight="bold" color="#BB86FC" onClick={() => navigate('/Home')}>
          JOBZILLA
        </Link>
        <Spacer />
        <Box mt={4}>
          <Link color="white" fontWeight="bold" mr={20} onClick={() => navigate('/Home')} _hover={{ color: '#BB86FC' }}>
            HOME
          </Link>
          <Link color="white" fontWeight="bold" mr={20} onClick={() => navigate('/JobSearch')} _hover={{ color: '#BB86FC' }}>
            JOBS
          </Link>
          <Link color="white" fontWeight="bold" onClick={() => navigate('/AppliedJobs')} _hover={{ color: '#BB86FC' }}>
            APPLIED JOBS
          </Link>
        </Box>
        <Spacer />
        <Button onClick={handleLogout} color={'black'} >
          Login
        </Button>
      </Flex>
    </Box>
  );
};

export default NavBar;