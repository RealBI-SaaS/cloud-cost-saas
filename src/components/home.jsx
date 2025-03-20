import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from '../context/UserContext';
import Landing from './Landing';
import HomeAuthenticated from './HomeAuthenticated';

const Home = () => {
  const { user, loading, setUser } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleTokenParams = async () => {
      const accessToken = searchParams.get('access');
      const refreshToken = searchParams.get('refresh');

      if (accessToken && refreshToken) {
        try {
          // Store tokens in localStorage
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', refreshToken);
          
          // Fetch user data using the access token
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/user/`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            // Update user context directly
            setUser(userData);
          }
        } catch (error) {
          console.error('Error handling token parameters:', error);
        }
      }
    };
    console.log("searchParams")
    console.log(searchParams)
    handleTokenParams();
  }, [searchParams, setUser]);

  if (loading) {
    return <div>Loading...</div>;
  }


  if (!user) {
    return (
      <Landing />
    );
  }else{
    return <HomeAuthenticated />;
  }

};

export default Home;
