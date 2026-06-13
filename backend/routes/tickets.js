import express from 'express';
import axios from 'axios';
import { createClient } from 'redis';

const router = express.Router();

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect().catch(console.error);

router.post('/search-flights', async (req, res) => {
  const { originCity, destinationCity, departureDate } = req.body;

  try {
    const apiKey = process.env.RAPIDAPI_KEY;

    
    let travelDate = departureDate;
    const today = new Date().toISOString().split('T')[0];
    
    if (!travelDate || travelDate < today) {
       const nextWeek = new Date();
       nextWeek.setDate(nextWeek.getDate() + 7);
       travelDate = nextWeek.toISOString().split('T')[0];
    }

  
    // Create a unique cache key based on the finalized search parameters
    const cacheKey = `flights:${originCity}:${destinationCity}:${travelDate}`;
    
    const cachedFlights = await redisClient.get(cacheKey);
    
    if (cachedFlights) {
      console.log("⚡ Serving formatted flights from Redis Cache!");
      return res.json(JSON.parse(cachedFlights));
    }

    console.log("🐌 Cache Miss: Fetching live from RapidAPI...");

    //Fetch BOTH skyId and entityId
    const getAirportData = async (query) => {
      const response = await axios.get('https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport', {
        params: { query: query },
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
        }
      });
      
      const airport = response.data?.data?.[0];
      if (!airport) throw new Error(`Could not find an airport for: ${query}`);
      
     
      const skyId = airport?.navigation?.relevantFlightParams?.skyId || airport?.skyId || airport?.id;
      const entityId = airport?.navigation?.relevantFlightParams?.entityId || airport?.entityId;
      
  
      if (!skyId || !entityId) {
        console.log(`\n🔍 WHAT RAPIDAPI ACTUALLY SENT FOR '${query}':`, JSON.stringify(airport, null, 2));
      }
      
      return { skyId, entityId };
    };

    const origin = await getAirportData(originCity);
    const dest = await getAirportData(destinationCity);
    
    console.log("✈️ SEARCHING RAPIDAPI FOR:", {
      originSkyId: origin.skyId,
      destinationSkyId: dest.skyId,
      date: travelDate
    });

    // Fetch real-time flight prices
    const flightResponse = await axios.get('https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights', {
      params: {
        originSkyId: origin.skyId,
        destinationSkyId: dest.skyId,
        originEntityId: origin.entityId,
        destinationEntityId: dest.entityId,
        date: travelDate, 
        adults: '1',
        currency: 'USD',
        market: 'en-US',
        countryCode: 'US'
      },
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
      }
    });

    const liveFlights = flightResponse.data.data?.itineraries;

    if (!liveFlights || liveFlights.length === 0) {
      return res.status(404).json({ message: 'No flights found for this route.' });
    }

    // Format the data for React
    const formattedFlights = liveFlights.slice(0, 5).map(flight => {
      const leg = flight.legs[0]; 
      
      return {
        id: flight.id,
        price: flight.price.raw, 
        currency: 'USD',
        airline: leg.carriers.marketing[0].name,
        itineraries: [{
          departure: leg.origin.displayCode,
          departureTime: leg.departure,
          arrival: leg.destination.displayCode,
          arrivalTime: leg.arrival,
          carrier: leg.carriers.marketing[0].name,
          flightNumber: leg.segments[0].flightNumber
        }]
      };
    });

    // Save the fully processed array to cache for 15 minutes (900 seconds)
    await redisClient.setEx(cacheKey, 900, JSON.stringify(formattedFlights));

    
    res.json(formattedFlights);

  } catch (error) {
    console.error("RapidAPI Error:", error?.response?.data || error.message);
    res.status(500).json({ 
      message: error?.response?.data?.message || 'Failed to fetch live prices from RapidAPI.' 
    });
  }
});

export default router;