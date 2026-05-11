import API from './services/api';

// Test API connectivity
const testAPI = async () => {
  try {
    console.log('Testing API connectivity...');
    
    // Test public jobs endpoint
    const jobsResponse = await API.get('/jobs/public');
    console.log('✅ Jobs API working:', jobsResponse.data);
    
    // Test if we can reach the backend
    console.log('✅ API integration successful!');
    
  } catch (error) {
    console.error('❌ API Error:', error.message);
    console.error('Full error:', error);
  }
};

testAPI();
