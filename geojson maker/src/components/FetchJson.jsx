//FetchJson.jsx

import { useEffect } from 'react';
import axios from 'axios';

function FetchJson({ setMarkers }) {
  useEffect(() => {
    // Fetch markers from the server when the component mounts
    axios
      .get('http://localhost:3005/getMarkers')
      .then((response) => {
        setMarkers(response.data); // Pass the fetched data to the parent component
      })
      .catch((error) => {
        console.error('Error fetching markers:', error);
      });
  }, [setMarkers]); // Include setMarkers in the dependency array

  return null; // This component doesn't render anything itself
}

export default FetchJson;
