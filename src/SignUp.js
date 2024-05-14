// SignUp.js
import React, { useState } from 'react';
import { app } from './firebaseConfig';
import { Box, Text, Input, Stack, Button, Image, Link } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import './styles/Login.css';



const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    const auth = getAuth(app);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User signed up:', user);
      // You might want to perform additional actions after successful signup
      navigate('/Home');
    } catch (error) {
      setError(error.message);
      console.error('SignUp error:', error.message);
    }
  };

  const navigateToLogin = () => {
    navigate('/Login');
  };

  const handleGoogleSignIn = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider(); // Create GoogleAuthProvider instance
    try {
      const result = await signInWithPopup(auth, provider); // Open Google sign-in popup
      const user = result.user;
      console.log('User signed in with Google:', user);
      navigate('/Home');
    } catch (error) {
      setError(error.message);
      console.error('Google sign-in error:', error.message);
    }
  };

  return (
    <div className='screen'>
      <Box display="flex" height='100vh'>
      <Box>
        <Image src='orbs.png' height='100vh' className='orb'></Image>
      </Box>
      <Box
        className="glassmorphism-container"
        position="absolute"
        top="12%"
        left="50%"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Text className='Logintext'>Sign Up</Text>
        <form onSubmit={handleSignUp}>
          <Stack>
            <label className="tags">Email</label>
                <Input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Email"
      variant="filled"
      color="white"
      _focus={{
        borderColor: '#00ffff',
      }}
      bg="rgba(0, 0, 0, 0.9)" // Set the background color to black with 90% opacity
      _hover={{
        bgGradient: 'linear(to-r, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4))',
      }}
      borderRadius='15px'
    />


            <label className="tags">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                variant="filled"
                color="white"
                _focus={{
                  borderColor: '#00ffff',
                }}
                bg="rgba(0, 0, 0, 0.9)" // Set the background color to black with 90% opacity
                _hover={{
                  bgGradient: 'linear(to-r, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4))',
                }}
                borderRadius='15px'
              />
            <Link ml='275px' color='#007AFF'>Forgot Password?</Link>
              <Button
    type="submit"
    colorScheme="custom"
    size="md"
    borderRadius="10px"
    bgGradient="linear(to-r, rgba(8, 110, 221, 0.6), #010C0F)"
    fontFamily="'Black Han Sans', sans-serif"
    className="loginbutton"
    _hover={{
      filter: 'brightness(200%)', // Dimming effect on hover
      transition: 'filter 0.3s ease-in-out', // Smooth transition over 0.3 seconds
    }}

  >
    SignUp
  </Button>
    <Image src='or.png' width='350px' height='22px' margin='auto' mt='20px'></Image>

    <Button
    variant="solid"
    bg="rgba(217, 217, 217, 0.1)"
    color="white"
    leftIcon={<img src="Google.png" alt="Google Icon" />}
    onClick={handleGoogleSignIn}
    borderRadius='15px'
                  _hover={{
                bgGradient: 'linear(to-r, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4))',
                filter: 'brightness(85%)', // Dimming effect on hover
    opacity: 0.9, // Reduce opacity on hover
    transition: 'filter 0.4s ease, opacity 0.4s ease',
              }}
  >
    Sign in with Google
  </Button>
          </Stack>
        </form>
        {error && <Text color="red.500" mt={2}>{error}</Text>}
        <Link onClick={navigateToLogin} color="white" fontWeight="bold" mt={10}>Already have an account? <span className='signuptext'>Login</span></Link>
      </Box>
      </Box>
    </div>
  );
};

export default SignUp;