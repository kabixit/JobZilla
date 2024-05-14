// App.js
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import theme from './theme';
import Login from './Login';
import SignUp from './SignUp';
import Home from './Home';
import JobSearch from './JobSearch';
import AppliedJobs from './AppliedJobs';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/SignUp' element={<SignUp />} />
          <Route path='/Home' element={<Home />}/>
          <Route path='/JobSearch' element={<JobSearch/>}/>
          <Route path='/AppliedJobs' element={<AppliedJobs/>}/>
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;