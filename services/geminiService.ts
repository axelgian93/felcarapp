
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RideOption, ServiceType } from "../types";

// Lazy Initialize Gemini Client
let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
    // Safe fallback string to prevent crash, though calls will fail if key is invalid
    const apiKey = process.env.API_KEY || ''; 
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const getRideEstimates = async (
  origin: string,
  destination: string,
  currentLat: number,
  currentLng: number,
  serviceType: ServiceType = ServiceType.RIDE
): Promise<RideOption[]> => {
  
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING, description: "Service name e.g. MotoFlash, Taxi Standard, Van" },
        price: { type: Type.NUMBER, description: "Total price" },
        currency: { type: Type.STRING, description: "Always USD" },
        eta: { type: Type.NUMBER, description: "Minutes until pickup" },
        duration: { type: Type.NUMBER, description: "Trip duration in minutes or hours" },
        description: { type: Type.STRING, description: "Short details" },
        capacity: { type: Type.STRING, description: "Capacity or Package size limit" },
      },
      required: ["id", "name", "price", "currency", "eta", "duration", "description", "capacity"],
    },
  };

  let contextPrompt = "";

  if (serviceType === ServiceType.DELIVERY) {
    contextPrompt = `Generate 3 options for "Delivery/Encomiendas" in Guayaquil, Ecuador. 
    Options should include: 'Moto Flash' (Cheap, small packages), 'Auto Envíos' (Medium), 'Camioneta' (Large).
    Prices should be realistic for Guayaquil (e.g., Moto starting $1.50 - $3.00). Currency: USD.`;
  } else if (serviceType === ServiceType.HOURLY) {
    contextPrompt = `Generate 3 options for "Hourly Driver Rental" in Guayaquil.
    Options should be based on time blocks: '1 Hora', '3 Horas', '5 Horas'.
    Destination is irrelevant for pricing, use duration.
    Prices approx $10-$12 per hour. Currency: USD.`;
  } else {
    contextPrompt = `Generate 3 ride options for a taxi app in Guayaquil, Ecuador.
    Options: 'Económico' (Chevy Spark/Kia Picanto), 'Confort' (Sedan + A/C), 'XL' (Family/Groups).
    Prices must be in USD and realistic for the distance (Guayaquil rates).
    Minimum ride is usually $1.50-$2.00.`;
  }

  try {
    const client = getAI();
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User location: ${currentLat}, ${currentLng} (approx ${origin}). 
      Destination: "${destination}". 
      ${contextPrompt}
      Return strictly JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.4,
      },
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as RideOption[];
  } catch (error) {
    console.error("Error getting estimates from Gemini:", error);
    // Fallback data for Guayaquil
    if (serviceType === ServiceType.DELIVERY) {
      return [
        { id: "del-1", name: "Moto Flash", price: 2.50, currency: "$", eta: 5, duration: 15, description: "Doc. y Paquetes pequeños", capacity: "10kg" },
        { id: "del-2", name: "Auto Envíos", price: 4.00, currency: "$", eta: 8, duration: 20, description: "Cajas medianas", capacity: "Maletero" }
      ];
    }
    if (serviceType === ServiceType.HOURLY) {
      return [
        { id: "hr-1", name: "1 Hora", price: 12.00, currency: "$", eta: 5, duration: 60, description: "Servicio por tiempo", capacity: "4 pax" },
        { id: "hr-3", name: "3 Horas", price: 30.00, currency: "$", eta: 5, duration: 180, description: "Servicio por tiempo", capacity: "4 pax" }
      ];
    }
    return [
      { id: "std-1", name: "Económico", price: 2.50, currency: "$", eta: 3, duration: 15, description: "Auto compacto", capacity: "4" },
      { id: "std-2", name: "Confort", price: 3.50, currency: "$", eta: 5, duration: 15, description: "Sedán con A/C", capacity: "4" }
    ];
  }
};

export const getDestinationCoordinates = async (destination: string, nearbyLat: number, nearbyLng: number): Promise<{lat: number, lng: number} | null> => {
   try {
     const client = getAI();
     const response = await client.models.generateContent({
       model: "gemini-2.5-flash",
       contents: `I am at ${nearbyLat}, ${nearbyLng} (Guayaquil, EC). The user wants to go to "${destination}". 
       Generate a JSON object with 'lat' and 'lng'. Return coordinates in Guayaquil.`,
       config: {
         responseMimeType: "application/json",
         responseSchema: {
           type: Type.OBJECT,
           properties: {
             lat: { type: Type.NUMBER },
             lng: { type: Type.NUMBER }
           }
         }
       }
     });
     
     const text = response.text;
     if(!text) return null;
     return JSON.parse(text);
   } catch (e) {
     return { lat: nearbyLat + 0.01, lng: nearbyLng + 0.01 };
   }
};
