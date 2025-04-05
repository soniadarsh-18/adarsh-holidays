// Mapping of city/country names to airport codes
const cityToAirportCode = {
  Jaipur: "JAI",
  Lucknow: "LKO",
  Visakhapatnam: "VTZ",
  Coimbatore: "CJB",
  Thiruvananthapuram: "TRV",
  Indore: "IDR",
  Chandigarh: "IXC",
  Bhubaneswar: "BBI",
  Nagpur: "NAG",
  Patna: "PAT",

  // Additional 40 Cities with Airports in India
  "New Delhi": "DEL",
  Mumbai: "BOM",
  Bengaluru: "BLR",
  Kolkata: "CCU",
  Chennai: "MAA",
  Hyderabad: "HYD",
  Ahmedabad: "AMD",
  Pune: "PNQ",
  Goa: "GOI",
  Kochi: "COK",
  Guwahati: "GAU",
  Srinagar: "SXR",
  Amritsar: "ATQ",
  Bhopal: "BHO",
  Madurai: "IXM",
  Mangalore: "IXE",
  Varanasi: "VNS",
  Dehradun: "DED",
  Raipur: "RPR",
  Ranchi: "IXR",
  Tiruchirappalli: "TRZ",
  Vadodara: "BDQ",
  Udaipur: "UDR",
  Leh: "IXL",
  Jammu: "IXJ",
  Agartala: "IXA",
  "Port Blair": "IXZ",
  Aurangabad: "IXU",
  Rajkot: "RAJ",
  Surat: "STV",
  Tirupati: "TIR",
  Hubli: "HBX",
  Gwalior: "GWL",
  Jodhpur: "JDH",
  Dibrugarh: "DIB",
  Imphal: "IMF",
  Silchar: "IXS",
  Bagdogra: "IXB",
  Belgaum: "IXG",
  Kannur: "CNN",
  Jharsuguda: "JRG",
  Shirdi: "SAG",
  Durgapur: "RDP",

  // USA
  "New York City": "JFK",
  "New York": "JFK",
  "Los Angeles": "LAX",
  Chicago: "ORD",
  "San Francisco": "SFO",
  Miami: "MIA",
  Houston: "IAH",
  Dallas: "DFW",
  Seattle: "SEA",
  "Washington D.C.": "IAD",
  Boston: "BOS",
  Atlanta: "ATL",
  "Las Vegas": "LAS",

  // UK
  London: "LHR",
  Manchester: "MAN",
  Edinburgh: "EDI",
  Birmingham: "BHX",
  Glasgow: "GLA",

  // UAE
  Dubai: "DXB",
  "Abu Dhabi": "AUH",

  // France
  Paris: "CDG",
  Nice: "NCE",

  // Germany
  Berlin: "BER",
  Frankfurt: "FRA",
  Munich: "MUC",
  Hamburg: "HAM",

  // China
  Beijing: "PEK",
  Shanghai: "PVG",
  Guangzhou: "CAN",
  Shenzhen: "SZX",

  // Japan
  Tokyo: "NRT",
  Osaka: "KIX",
  Nagoya: "NGO",

  // Australia
  Sydney: "SYD",
  Melbourne: "MEL",
  Brisbane: "BNE",
  Perth: "PER",

  // Canada
  Toronto: "YYZ",
  Vancouver: "YVR",
  Montreal: "YUL",
  Calgary: "YYC",

  // Other Major Cities
  Singapore: "SIN",
  Bangkok: "BKK",
  "Hong Kong": "HKG",
  Seoul: "ICN",
  "Kuala Lumpur": "KUL",
  Jakarta: "CGK",
  Istanbul: "IST",
  Rome: "FCO",
  Madrid: "MAD",
  Barcelona: "BCN",
  Moscow: "SVO",
  "Mexico City": "MEX",
  "Sao Paulo": "GRU",
  "Buenos Aires": "EZE",
  Johannesburg: "JNB",

  // Additional Cities
  Amsterdam: "AMS",
  Brussels: "BRU",
  Vienna: "VIE",
  Zurich: "ZRH",
  Copenhagen: "CPH",
  Stockholm: "ARN",
  Oslo: "OSL",
  Helsinki: "HEL",
  Dublin: "DUB",
  Lisbon: "LIS",
  Athens: "ATH",
  Warsaw: "WAW",
  Prague: "PRG",
  Budapest: "BUD",
  Dubrovnik: "DBV",
  Reykjavik: "KEF",
  Cairo: "CAI",
  Casablanca: "CMN",
  "Cape Town": "CPT",
  Nairobi: "NBO",
  Lagos: "LOS",
  Accra: "ACC",
  Dakar: "DSS",
  "Rio de Janeiro": "GIG",
  Lima: "LIM",
  Santiago: "SCL",
  Bogota: "BOG",
  Caracas: "CCS",
  "Panama City": "PTY",
  "San Jose": "SJO",
  Havana: "HAV",
  Kingston: "KIN",
  Nassau: "NAS",
  Riyadh: "RUH",
  Jeddah: "JED",
  Doha: "DOH",
  Manama: "BAH",
  "Kuwait City": "KWI",
  Muscat: "MCT",
  Colombo: "CMB",
  Dhaka: "DAC",
  Kathmandu: "KTM",
  Hanoi: "HAN",
  "Ho Chi Minh City": "SGN",
  Manila: "MNL",
  "Phnom Penh": "PNH",
  Vientiane: "VTE",
  Yangon: "RGN",
  Auckland: "AKL",
  Wellington: "WLG",
  Christchurch: "CHC",
  Queenstown: "ZQN",
  Honolulu: "HNL",
  Anchorage: "ANC",
  "San Diego": "SAN",
  Phoenix: "PHX",
  Denver: "DEN",
  Orlando: "MCO",
  "New Orleans": "MSY",
  Nashville: "BNA",
  Austin: "AUS",
  Portland: "PDX",
  "Salt Lake City": "SLC",
  Minneapolis: "MSP",
  Detroit: "DTW",
  Philadelphia: "PHL",
  Charlotte: "CLT",
  Tampa: "TPA",
  Raleigh: "RDU",
  "St. Louis": "STL",
  "Kansas City": "MCI",
  Cincinnati: "CVG",
  Cleveland: "CLE",
  Pittsburgh: "PIT",
  Indianapolis: "IND",
  Milwaukee: "MKE",
  "Oklahoma City": "OKC",
  Memphis: "MEM",
  Louisville: "SDF",
  Albuquerque: "ABQ",
  Tucson: "TUS",
  Fresno: "FAT",
  Sacramento: "SMF",
  Oakland: "OAK",
  "San Jose": "SJC",
  "Santa Ana": "SNA",
  Burbank: "BUR",
  Ontario: "ONT",
  "Long Beach": "LGB",
  "San Antonio": "SAT",
  "El Paso": "ELP",
  "Fort Worth": "DFW",
  Jacksonville: "JAX",
  Columbus: "CMH",
  Baltimore: "BWI",
  Buffalo: "BUF",
  Rochester: "ROC",
  Albany: "ALB",
  Hartford: "BDL",
  Providence: "PVD",
  Richmond: "RIC",
  Norfolk: "ORF",
  Greensboro: "GSO",
  Greenville: "GSP",
  Birmingham: "BHM",
  Newark: "EWR",
  Trenton: "TTN",
  Allentown: "ABE",
  Harrisburg: "MDT",
  Wilmington: "ILG",
  "Atlantic City": "ACY",
  Portland: "PWM",
  Bangor: "BGR",
  Burlington: "BTV",
  Manchester: "MHT",
  Concord: "CON",
  Montpelier: "MPV",
  Augusta: "AUG",
  Portsmouth: "PSM",
  Nashua: "ASH",
  Concord: "CCR",
  Salem: "SLE",
  Eugene: "EUG",
  Medford: "MFR",
  Redding: "RDD",
  Chico: "CIC",
  Fresno: "FAT",
  Bakersfield: "BFL",
  "Santa Barbara": "SBA",
  "San Luis Obispo": "SBP",
  Monterey: "MRY",
  "Santa Cruz": "STS",
  "San Francisco": "SFO",
  Oakland: "OAK",
  "San Jose": "SJC",
  "Santa Ana": "SNA",
  Burbank: "BUR",
  Ontario: "ONT",
  "Long Beach": "LGB",
  "San Diego": "SAN",
  Phoenix: "PHX",
  Tucson: "TUS",
  "Las Vegas": "LAS",
  Reno: "RNO",
  "Salt Lake City": "SLC",
  Boise: "BOI",
  Spokane: "GEG",
  Seattle: "SEA",
  Portland: "PDX",
  Eugene: "EUG",
  Medford: "MFR",
  Redding: "RDD",
  Chico: "CIC",
  Fresno: "FAT",
  Bakersfield: "BFL",
  "Santa Barbara": "SBA",
  "San Luis Obispo": "SBP",
  Monterey: "MRY",
  "Santa Cruz": "STS",
  "San Francisco": "SFO",
  Oakland: "OAK",
  "San Jose": "SJC",
  "Santa Ana": "SNA",
  Burbank: "BUR",
  Ontario: "ONT",
  "Long Beach": "LGB",
  "San Diego": "SAN",
  Phoenix: "PHX",
  Tucson: "TUS",
  "Las Vegas": "LAS",
  Reno: "RNO",
  "Salt Lake City": "SLC",
  Boise: "BOI",
  Spokane: "GEG",
  Seattle: "SEA",
  Portland: "PDX",
  Eugene: "EUG",
  Medford: "MFR",
  Redding: "RDD",
  Chico: "CIC",
  Fresno: "FAT",
  Bakersfield: "BFL",
  "Santa Barbara": "SBA",
  "San Luis Obispo": "SBP",
  Monterey: "MRY",
  "Santa Cruz": "STS",
  "San Francisco": "SFO",
  Oakland: "OAK",
  "San Jose": "SJC",
  "Santa Ana": "SNA",
  Burbank: "BUR",
  Ontario: "ONT",
  "Long Beach": "LGB",
  "San Diego": "SAN",
  Phoenix: "PHX",
  Tucson: "TUS",
  "Las Vegas": "LAS",
  Reno: "RNO",
  "Salt Lake City": "SLC",
  Boise: "BOI",
  Spokane: "GEG",
  Seattle: "SEA",
  Portland: "PDX",
  Eugene: "EUG",
  Medford: "MFR",
  Redding: "RDD",
  Chico: "CIC",
  Fresno: "FAT",
  Bakersfield: "BFL",
  "Santa Barbara": "SBA",
  "San Luis Obispo": "SBP",
  Monterey: "MRY",
  "Santa Cruz": "STS",
  "San Francisco": "SFO",
  Oakland: "OAK",
  "San Jose": "SJC",
  "Santa Ana": "SNA",
  Burbank: "BUR",
  Ontario: "ONT",
  "Long Beach": "LGB",
  "San Diego": "SAN",
  Phoenix: "PHX",
  Tucson: "TUS",
  "Las Vegas": "LAS",
  Reno: "RNO",
  "Salt Lake City": "SLC",
  Boise: "BOI",
  Spokane: "GEG",
  Seattle: "SEA",
  Portland: "PDX",
  Eugene: "EUG",
  Medford: "MFR",
  Redding: "RDD",
  Chico: "CIC",
  Fresno: "FAT",
  Bakersfield: "BFL",
  "Santa Barbara": "SBA",
  "San Luis Obispo": "SBP",
  Monterey: "MRY",
  "Santa Cruz": "STS",
  "San Francisco": "SFO",
  Oakland: "OAK",
  "San Jose": "SJC",
  "Santa Ana": "SNA",
  Burbank: "BUR",
  Ontario: "ONT",
  "Long Beach": "LGB",
  "San Diego": "SAN",
  Phoenix: "PHX",
  Tucson: "TUS",
  "Las Vegas": "LAS",
  Reno: "RNO",
  "Salt Lake City": "SLC",
  Boise: "BOI",
  Spokane: "GEG",
  Seattle: "SEA",
  Portland: "PDX",
  Eugene: "EUG",
  Medford: "MFR",
  Redding: "RDD",
  Chico: "CIC",
  Fresno: "FAT",
  Bakersfield: "BFL",
  "Santa Barbara": "SBA",
  "San Luis Obispo": "SBP",
  Monterey: "MRY",
  "Santa Cruz": "STS",
  "San Francisco": "SFO",
  Oakland: "OAK",
  "San Jose": "SJC",
  "Santa Ana": "SNA",
  Burbank: "BUR",
  Ontario: "ONT",
  "Long Beach": "LGB",
  "San Diego": "SAN",
  Phoenix: "PHX",
  Tucson: "TUS",
  "Las Vegas": "LAS",
  Reno: "RNO",
  "Salt Lake City": "SLC",
  Boise: "BOI",
  Spokane: "GEG",
  Seattle: "SEA",
  Portland: "PDX",
  Eugene: "EUG",
  Medford: "MFR",
  Redding: "RDD",
  Chico: "CIC",
  Fresno: "FAT",
  Bakersfield: "BFL",
  "Santa Barbara": "SBA",
  "San Luis Obispo": "SBP",
  Monterey: "MRY",
  "Santa Cruz": "STS",
  "San Francisco": "SFO",
  Oakland: "OAK",
  "San Jose": "SJC",
  "Santa Ana": "SNA",
  Burbank: "BUR",
  Ontario: "ONT",
  "Long Beach": "LGB",
  "San Diego": "SAN",
  Phoenix: "PHX",
  Tucson: "TUS",
  "Las Vegas": "LAS",
  Reno: "RNO",
  "Salt Lake City": "SLC",
  Boise: "BOI",
  Spokane: "GEG",
  Seattle: "SEA",
  Portland: "PDX",
  Eugene: "EUG",
  Medford: "MFR",
  Redding: "RDD",
  Chico: "CIC",
  Fresno: "FAT",
  Bakersfield: "BFL",
  "Santa Barbara": "SBA",
  "San Luis Obispo": "SBP",
  Monterey: "MRY",
  "Santa Cruz": "STS",
  "San Francisco": "SFO",
  Oakland: "OAK",
  "San Jose": "SJC",
  "Santa Ana": "SNA",
  Burbank: "BUR",
  Ontario: "ONT",
  "Long Beach": "LGB",
  "San Diego": "SAN",
  Phoenix: "PHX",
  Tucson: "TUS",
  "Las Vegas": "LAS",
  Reno: "RNO",
  "Salt Lake City": "SLC",
  Boise: "BOI",
  Spokane: "GEG",
  Seattle: "SEA",
  Portland: "PDX",
  Eugene: "EUG",
  Medford: "MFR",
  Redding: "RDD",
  Chico: "CIC",
  Fresno: "FAT",
  Bakersfield: "BFL",
  "Santa Barbara": "SBA",
  "San Luis Obispo": "SBP",
  Monterey: "MRY",
  "Santa Cruz": "STS",
  "San Francisco": "SFO",
  Oakland: "OAK",
  "San Jose": "SJC",
  "Santa Ana": "SNA",
  Burbank: "BUR",
  Ontario: "ONT",
  "Long Beach": "LGB",
  "San Diego": "SAN",
  Phoenix: "PHX",
  Tucson: "TUS",
  "Las Vegas": "LAS",
  Reno: "RNO",
  "Salt Lake City": "SLC",
  Boise: "BOI",
  Spokane: "GEG",
  Seattle: "SEA",
  Portland: "PDX",
  Eugene: "EUG",
  Medford: "MFR",
  Redding: "RDD",
  Chico: "CIC",
  Fresno: "FAT",
  Bakersfield: "BFL",
  "Santa Barbara": "SBA",
  "San Luis Obispo": "SBP",
  Monterey: "MRY",
  "Santa Cruz": "STS",
  "San Francisco": "SFO",
  Oakland: "OAK",
  "San Jose": "SJC",
  "Santa Ana": "SNA",
  Burbank: "BUR",
  Ontario: "ONT",
  "Long Beach": "LGB",
  "San Diego": "SAN",
  Phoenix: "PHX",
  Tucson: "TUS",
  "Las Vegas": "LAS",
  Reno: "RNO",
  "Salt Lake City": "SLC",
  Boise: "BOI",
  Spokane: "GEG",
  Seattle: "SEA",
  Portland: "PDX",
  Eugene: "EUG",
  Medford: "MFR",
  Redding: "RDD",
  Chico: "CIC",
  Fresno: "FAT",
  Bakersfield: "BFL",
  "Santa Barbara": "SBA",
  "San Luis Obispo": "SBP",
  Monterey: "MRY",
  "Santa Cruz": "STS",
  "San Francisco": "SFO",
  Oakland: "OAK",
  "San Jose": "SJC",
  "Santa Ana": "SNA",
  Burbank: "BUR",
  Ontario: "ONT",
  "Long Beach": "LGB",
  "San Diego": "SAN",
  Phoenix: "PHX",
  Tucson: "TUS",
  "Las Vegas": "LAS",
  Reno: "RNO",
  "Salt Lake City": "SLC",
  Boise: "BOI",
  Spokane: "GEG",
  Seattle: "SEA",
  Portland: "PDX",
  Eugene: "EUG",
  Medford: "MFR",
  Redding: "RDD",
  Chico: "CIC",
  Fresno: "FAT",
  Bakersfield: "BFL",
  "Santa Barbara": "SBA",
  "San Luis Obispo": "SBP",
  Monterey: "MRY",
  "Santa Cruz": "STS",
  "San Francisco": "SFO",
  Oakland: "OAK",
  "San Jose": "SJC",
  "Santa Ana": "SNA",
  Burbank: "BUR",
  Ontario: "ONT",
  "Long Beach": "LGB",
  "San Diego": "SAN",
  Phoenix: "PHX",
  Tucson: "TUS",
  "Las Vegas": "LAS",
  Reno: "RNO",
  "Salt Lake City": "SLC",
  Boise: "BOI",
  Spokane: "GEG",
  Seattle: "SEA",
  Portland: "PDX",
  Eugene: "EUG",
  Medford: "MFR",
  Redding: "RDD",
  Chico: "CIC",
  Fresno: "FAT",
  Bakersfield: "BFL",
  "Santa Barbara": "SBA",
  "San Luis Obispo": "SBP",
  Monterey: "MRY",
  "Santa Cruz": "STS",
  "San Francisco": "SFO",
  Oakland: "OAK",
  "San Jose": "SJC",
  "Santa Ana": "SNA",
  Burbank: "BUR",
  Ontario: "ONT",
  "Long Beach": "LGB",
  "San Diego": "SAN",
  Phoenix: "PHX",
  Tucson: "TUS",
  "Las Vegas": "LAS",
  Reno: "RNO",
  "Salt Lake City": "SLC",
  Boise: "BOI",
  Spokane: "GEG",
  Seattle: "SEA",
  Portland: "PDX",
  Eugene: "EUG",
  Medford: "MFR",
  Redding: "RDD",
  Chico: "CIC",
  Fresno: "FAT",
  Bakersfield: "BFL",
  "Santa Barbara": "SBA",
  "San Luis Obispo": "SBP",
  Monterey: "MRY",
  "Santa Cruz": "STS",
  "San Francisco": "SFO",
  Oakland: "OAK",
  "San Jose": "SJC",
  "Santa Ana": "SNA",
  Burbank: "BUR",
  Ontario: "ONT",
  "Long Beach": "LGB",
  "San Diego": "SAN",
  Phoenix: "PHX",
  Tucson: "TUS",
  "Las Vegas": "LAS",
  Reno: "RNO",
  "Salt Lake City": "SLC",
  Boise: "BOI",
  Spokane: "GEG",
  Seattle: "SEA",
  Portland: "PDX",
  Eugene: "EUG",
  Medford: "MFR",
  Redding: "RDD",
  Chico: "CIC",
  Fresno: "FAT",
  Bakersfield: "BFL",
  "Santa Barbara": "SBA",
  "San Luis Obispo": "SBP",
  Monterey: "MRY",
  "Santa Cruz": "STS",
  "San Francisco": "SFO",
  Oakland: "OAK",
  "San Jose": "SJC",
  "Santa Ana": "SNA",
  Burbank: "BUR",
  Ontario: "ONT",
  "Long Beach": "LGB",
  "San Diego": "SAN",
  Phoenix: "PHX",
  Tucson: "TUS",
  "Las Vegas": "LAS",
  Reno: "RNO",
  "Salt Lake City": "SLC",
  Boise: "BOI",
  Spokane: "GEG",
  Seattle: "SEA",
  Portland: "PDX",
  Eugene: "EUG",
  Medford: "MFR",
  Redding: "RDD",
  Chico: "CIC",
  Fresno: "FAT",
  Bakersfield: "BFL",
  "Santa Barbara": "SBA",
  "San Luis Obispo": "SBP",
  Monterey: "MRY",
  "Santa Cruz": "STS",
  "San Francisco": "SFO",
  Oakland: "OAK",
  "San Jose": "SJC",
  "Santa Ana": "SNA",
  Burbank: "BUR",
  Ontario: "ONT",
  "Long Beach": "LGB",
  "San Diego": "SAN",
  Phoenix: "PHX",
  Tucson: "TUS",
  "Las Vegas": "LAS",
  Reno: "RNO",
  "Salt Lake City": "SLC",
  Boise: "BOI",
  Spokane: "GEG",
  Seattle: "SEA",
  Portland: "PDX",
  Eugene: "EUG",
  Medford: "MFR",
  Redding: "RDD",
  Chico: "CIC",
  Fresno: "FAT",
  Bakersfield: "BFL",
  "Santa Barbara": "SBA",
  "San Luis Obispo": "SBP",
  Monterey: "MRY",
  "Santa Cruz": "STS",
  "San Francisco": "SFO",
  Oakland: "OAK",
  "San Jose": "SJC",
  "Santa Ana": "SNA",
  Burbank: "BUR",
  Ontario: "ONT",
  "Long Beach": "LGB",
  "San Diego": "SAN",
  Phoenix: "PHX",
  Tucson: "TUS",
  "Las Vegas": "LAS",
  Reno: "RNO",
  "Salt Lake City": "SLC",
  Boise: "BOI",
  Spokane: "GEG",
  Seattle: "SEA",
  Portland: "PDX",
  Eugene: "EUG",
  Medford: "MFR",
  Redding: "RDD",
  Chico: "CIC",
  Fresno: "FAT",
  Bakersfield: "BFL",
  "Santa Barbara": "SBA",
  "San Luis Obispo": "SBP",
  Monterey: "MRY",
  "Santa Cruz": "STS",
  "San Francisco": "SFO",
  Oakland: "OAK",
  "San Jose": "SJC",
  "Santa Ana": "SNA",
  Burbank: "BUR",
  Ontario: "ONT",
  "Long Beach": "LGB",
  "San Diego": "SAN",
  Phoenix: "PHX",
  Tucson: "TUS",
  "Las Vegas": "LAS",
  Reno: "RNO",
  "Salt Lake City": "SLC",
  Boise: "BOI",
  Spokane: "GEG",
  Seattle: "SEA",
  Portland: "PDX",
  Eugene: "EUG",
  Medford: "MFR",
  Redding: "RDD",
  Chico: "CIC",
  Fresno: "FAT",
  Bakersfield: "BFL",
  "Santa Barbara": "SBA",
};

// Helper function to convert city/country names to airport codes
function getAirportCode(city) {
  const normalizedCity = city.toLowerCase();
  for (const [key, value] of Object.entries(cityToAirportCode)) {
    if (key.toLowerCase().includes(normalizedCity)) {
      return value;
    }
  }
  return city; // If no mapping is found, return the original input
}

let currentPage = 1;
const flightsPerPage = 5;
let allFlights = [];
let selectedFlight = null;

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem("token") !== null;
}

document.addEventListener("DOMContentLoaded", function () {
  flatpickr("#departure", {
    dateFormat: "d-m-Y",
    minDate: "today",
  });

  flatpickr("#return", {
    dateFormat: "d-m-Y",
    minDate: "today",
  });
});

async function searchFlights() {
  if (!isLoggedIn()) {
    alert("Please login first to search for flights.");
    return;
  }

  const originInput = document.getElementById("from").value.trim();
  const destinationInput = document.getElementById("to").value.trim();
  const departureDateField = document.getElementById("departure");
  const returnDateField = document.getElementById("return");
  const adults = document.getElementById("adults").value;
  const travelClass = document.getElementById("travelClass").value;
  const errorMessage = document.getElementById("error-message");
  const resultsDiv = document.getElementById("results");

  // Validation: Check if any required field is empty
  if (
    !originInput ||
    !destinationInput ||
    !departureDateField.value ||
    !returnDateField.value ||
    !adults
  ) {
    errorMessage.style.display = "block"; // Show error message in red
    return;
  } else {
    errorMessage.style.display = "none"; // Hide error message
  }

  const departureDate = departureDateField.value.split("-").reverse().join("-");
  const returnDate = returnDateField.value.split("-").reverse().join("-");
  const origin = getAirportCode(originInput);
  const destination = getAirportCode(destinationInput);

  // Show results div and add a loading indicator
  resultsDiv.style.display = "block";
  resultsDiv.innerHTML = `<div class="searching"><div class="spinner"></div>Searching...</div>`;

  try {
    const response = await fetch(
      `https://adarsh-holidays-backend-production.up.railway.app/api/flights/search?origin=${origin}&destination=${destination}&departureDate=${departureDate}&returnDate=${returnDate}&adults=${adults}&travelClass=${travelClass}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error fetching flight data.");
    }

    const data = await response.json();
    allFlights = data.flights;
    currentPage = 1;

    if (allFlights.length === 0) {
      resultsDiv.innerHTML = `<p style="color:red;">No flights found.</p>`;
    } else {
      displayResults();
    }
  } catch (error) {
    resultsDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}

// Function to hide error message when user starts typing or selecting a field
function hideErrorMessage() {
  document.getElementById("error-message").style.display = "none";
}

// Attach event listeners to all input fields
document.querySelectorAll("input, select").forEach((field) => {
  field.addEventListener("input", hideErrorMessage);
});

// Ensure results div is hidden initially
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("results").style.display = "none";
});

// JavaScript for Tab Switching:

function openTab(event, tabName) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach((content) => content.classList.remove("active"));

  // Remove 'active' class from all tabs
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => tab.classList.remove("active"));

  // Show the selected tab content
  document.getElementById(tabName).classList.add("active");

  // Set the clicked tab as active
  event.currentTarget.classList.add("active");
}
// Function to display flight results
function displayResults() {
  const resultsDiv = document.getElementById("results");

  // Capture "From" and "To" place names from the form
  const fromPlace = document.getElementById("from").value;
  const toPlace = document.getElementById("to").value;

  if (!allFlights || allFlights.length === 0) {
    resultsDiv.innerHTML = "<p>No flights found.</p>";
    return;
  }

  // Sort flights: Non-stop > Cheapest > Shorter Duration > Others
  allFlights.sort((a, b) => {
    const stopsA = a.itineraries[0].segments.length - 1;
    const stopsB = b.itineraries[0].segments.length - 1;
    const priceA = parseFloat(a.price.total);
    const priceB = parseFloat(b.price.total);
    const durationA = a.itineraries[0].duration;
    const durationB = b.itineraries[0].duration;

    if (stopsA === 0 && stopsB !== 0) return -1; // Non-stop first
    if (stopsA !== 0 && stopsB === 0) return 1;
    if (priceA < priceB) return -1; // Cheapest next
    if (priceA > priceB) return 1;
    if (durationA < durationB) return -1; // Shorter duration next
    return 1;
  });

  // Pagination logic
  const start = (currentPage - 1) * flightsPerPage;
  const end = start + flightsPerPage;
  const paginatedFlights = allFlights.slice(start, end);

  resultsDiv.innerHTML = `
    <div class="available-results">Available Flights!!</div>
    
    <div class="flight-headers">
        <p><strong>Flight Number</strong></p>
        <p><strong>Departure</strong></p>
        <p><strong>Arrival</strong></p>
        <p><strong>Duration & Stops</strong></p>
        <p><strong>Price & Class</strong></p>
    </div>

    ${paginatedFlights
      .map(
        (flight) => `
        <div class="flight-result">
            <div class="flight-summary">
                <p><strong>${flight.itineraries[0].segments[0].carrierCode} ${flight.itineraries[0].segments[0].number
          }</strong></p>

                <div class="flight-info">
                    <p>
                        <i class="fa-solid fa-plane-departure"></i> 
                        
                        <span class="flight-place">${fromPlace}</span>
                        <span class="flight-time">
                          ${new Date(
            flight.itineraries[0].segments[0].departure.at
          ).toLocaleTimeString()}
                        </span>
                    </p>
                    <p> → </p>
                    <p>
                        <i class="fa-solid fa-plane-arrival"></i> 
                        
                        <span class="flight-place">${toPlace}</span>
                        <span class="flight-time">
                          ${new Date(
            flight.itineraries[0].segments[0].arrival.at
          ).toLocaleTimeString()}
                        </span>
                    </p>
                </div>

                <p><i class="fa-solid fa-tower-control"></i> ${flight.itineraries[0].duration
          } (${flight.itineraries[0].segments.length - 1 === 0
            ? "Non-stop"
            : `${flight.itineraries[0].segments.length - 1} Stop(s)`
          })</p>

                <p><strong>₹${flight.price.total}</strong> (${flight.travelerPricings[0].fareDetailsBySegment[0].cabin.toUpperCase()})</p>

                <div class="flight-actions">
                    <button class="view-btn" onclick="toggleDetails('details-${flight.id
          }')">View Details</button>
                    <button class="book-btn" onclick="openBookingPopup(${JSON.stringify(
            flight
          ).replace(/"/g, "&quot;")})">Book Now</button>
                </div>
            </div>

            <div id="details-${flight.id
          }" class="flight-details-dropdown" style="display: none;">
                <p><strong>Flight Type:</strong> ${flight.oneWay ? "One-way" : "Round-trip"
          }</p>
                <p><strong>Aircraft:</strong> ${flight.itineraries[0].segments[0].aircraft.code
          }</p>
                <p><strong>Baggage:</strong> ${flight.travelerPricings[0].fareDetailsBySegment[0]
            .includedCheckedBags.quantity
          } Checked Bag(s) + ${flight.travelerPricings[0].fareDetailsBySegment[0].includedCabinBags
            .quantity
          } Cabin Bag(s)</p>
                <p><strong>Meal:</strong> ${flight.travelerPricings[0].fareDetailsBySegment[0].amenities &&
            flight.travelerPricings[0].fareDetailsBySegment[0].amenities.some(
              (a) => a.amenityType === "MEAL"
            )
            ? "Included"
            : "Not Included"
          }</p>
                <p><strong>Seat Selection:</strong> ${flight.travelerPricings[0].fareDetailsBySegment[0].amenities &&
            flight.travelerPricings[0].fareDetailsBySegment[0].amenities.some(
              (a) => a.amenityType === "PRE_RESERVED_SEAT"
            )
            ? "Available (Chargeable)"
            : "Not Available"
          }</p>
                <p><strong>Ticket Flexibility:</strong> ${flight.travelerPricings[0].fareDetailsBySegment[0].amenities &&
            flight.travelerPricings[0].fareDetailsBySegment[0].amenities.some(
              (a) =>
                a.amenityType === "BRANDED_FARES" &&
                a.description.includes("Refundable")
            )
            ? "Refundable"
            : "Non-refundable"
          }</p>
            </div>
        </div>
    `
      )
      .join("")}
  `;
}

// Toggle flight details
function toggleDetails(id) {
  const details = document.getElementById(id);
  if (details.style.display === "none") {
    details.style.display = "block";
  } else {
    details.style.display = "none";
  }
}

// Open booking popup if user is logged in
function openBookingPopup(flight) {
  if (!isLoggedIn()) {
    alert("Please login first to book this flight.");
    return;
  }
  selectedFlight = flight;
  document.getElementById("booking-popup").style.display = "flex";
  updatePopupContent(flight);
}

// Close booking popup
function closePopup() {
  document.getElementById("booking-popup").style.display = "none";
}

// Update popup content with flight details and Razorpay integration
function updatePopupContent(flight) {
  const popupContent = document.querySelector(".popup-content");
  const fromPlace = document.getElementById("from").value;
  const toPlace = document.getElementById("to").value;

  // Store the selected flight globally with proper formatting
  window.selectedFlight = {
    ...flight,
    price: {
      total: parseFloat(flight.price.total).toFixed(2) // Ensure proper decimal format
    }
  };

  popupContent.innerHTML = `
    <span class="close-btn" onclick="closePopup()">&times;</span>
    <div class="section">
        <h2>${fromPlace} (${flight.itineraries[0].segments[0].departure.iataCode}) → ${toPlace} (${flight.itineraries[0].segments[0].arrival.iataCode})</h2>
        <p>${new Date(flight.itineraries[0].segments[0].departure.at).toDateString()}</p>
        <p>${flight.itineraries[0].segments.length - 1 === 0 ? "Non Stop" : `${flight.itineraries[0].segments.length - 1} Stop`} · ${flight.itineraries[0].duration}</p>
        <p>Non-refundable</p>
        <hr>
        <p><strong>${flight.itineraries[0].segments[0].carrierCode} ${flight.itineraries[0].segments[0].number}</strong></p>
        <p>${flight.itineraries[0].segments[0].aircraft.code}</p>
        <p>${flight.travelerPricings[0].fareDetailsBySegment[0].cabin} > SAVER</p>
        <p>${new Date(flight.itineraries[0].segments[0].departure.at).toLocaleTimeString()} - ${fromPlace} (${flight.itineraries[0].segments[0].departure.iataCode})</p>
        <p>${flight.itineraries[0].duration}</p>
        <p>${new Date(flight.itineraries[0].segments[0].arrival.at).toLocaleTimeString()} - ${toPlace} (${flight.itineraries[0].segments[0].arrival.iataCode})</p>
        <p>Cabin Baggage: ${flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity} Kgs (1 piece only) / Adult</p>
        <p>Check-In Baggage: ${flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity} Kgs (1 piece only) / Adult</p>
    </div>
    <div class="section">
        <p><strong>Total Price:</strong> ₹${parseFloat(flight.price.total).toFixed(2)}</p>
        <button class="pay-now-btn" onclick="handlePayment()">Pay Now</button>
    </div>
  `;
}
// Function to book flight before payment
async function bookFlight() {
  try {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      alert("User not logged in. Please login first.");
      return null;
    }

    // Prepare flight data for booking API
    const flightOffer = {
      itineraries: window.selectedFlight.itineraries,
      validatingAirlineCodes: window.selectedFlight.validatingAirlineCodes,
      price: window.selectedFlight.price
    };

    // You should replace this with actual passenger data collection
    const passengers = [
      { name: "Passenger 1", age: 30, gender: "Male" },
      { name: "Passenger 2", age: 28, gender: "Female" }
    ];

    const bookingData = {
      userId: userId,
      flightOffer: flightOffer,
      passengers: passengers
    };

    const response = await fetch("https://adarsh-holidays-backend-production.up.railway.app/api/flights/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to book flight");
    }

    return await response.json();
  } catch (error) {
    console.error("Booking Error:", error);
    alert("Failed to book flight: " + error.message);
    return null;
  }
}

// Handle payment with Razorpay
async function handlePayment() {
  try {
    // Show loading state
    const payButton = document.querySelector('.pay-now-btn');
    payButton.disabled = true;
    payButton.textContent = 'Processing...';

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      alert("User not logged in. Please login first.");
      return;
    }

    // First, book the flight and get booking details
    const bookingResponse = await bookFlight();
    if (!bookingResponse || !bookingResponse.success) {
      payButton.disabled = false;
      payButton.textContent = 'Pay Now';
      return;
    }

    const booking = bookingResponse.booking;
    const amount = parseFloat(window.selectedFlight.price.total); // Original amount in decimal

    // Create payment order
    const orderResponse = await fetch("https://adarsh-holidays-backend-production.up.railway.app/api/payment/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: amount,
        currency: "INR",
        userId: userId,
        bookingId: booking._id
      })
    });

    if (!orderResponse.ok) {
      throw new Error("Failed to create payment order");
    }

    const orderData = await orderResponse.json();

    // Initialize Razorpay
    const options = {
      key: "rzp_test_6b6SwSwFgzwZnm",
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Adarsh Holidays",
      description: `Flight Booking - ${booking.flightNumber}`,
      order_id: orderData.id,
      handler: function (response) {
        console.log("Payment Response:", response);

        // Directly redirect to user profile after payment
        window.location.href = "/user-dashboard/index.html";
      },
      prefill: {
        name: localStorage.getItem("userName") || "Guest",
        email: localStorage.getItem("userEmail") || "guest@example.com",
        contact: localStorage.getItem("userMobile") || "0000000000"
      },
      theme: { color: "#3399cc" },
      modal: {
        ondismiss: function () {
          payButton.disabled = false;
          payButton.textContent = 'Pay Now';
        }
      }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
  } catch (error) {
    console.error("Payment Error:", error);
    alert("Payment failed: " + error.message);
    const payButton = document.querySelector('.pay-now-btn');
    if (payButton) {
      payButton.disabled = false;
      payButton.textContent = 'Pay Now';
    }
  }
}

// Train Booking System JavaScript Code

let allTrains = []; // Store all trains fetched from the API

// Fetch all trains on page load
async function fetchTrains() {
  const searchTerm = "Rajdhani"; // Example search term
  const response = await fetch(`https://adarsh-holidays-backend-production.up.railway.app/api/trains/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ searchTerm }),
  });

  const data = await response.json();

  if (data.trains) {
    allTrains = data.trains; // Store all trains
    displayTrainResults(allTrains); // Display all trains initially
  }
}

// Train booking
async function searchTrains() {
  const from = document.getElementById("trainFrom").value;
  const to = document.getElementById("trainTo").value;
  const departure = document.getElementById("trainDeparture").value;
  const travelClass = document.getElementById("trainClass").value;

  if (!from || !to || !departure) {
    alert("Please enter all fields!");
    return;
  }

  // Filter trains based on user inputs
  const filteredTrains = allTrains.filter((train) => {
    const matchesFrom =
      !from || train.source.toLowerCase().includes(from.toLowerCase());
    const matchesTo =
      !to || train.destination.toLowerCase().includes(to.toLowerCase());
    const matchesDeparture =
      !departure || train.departureTime.startsWith(departure);
    const matchesClass = !travelClass || train.classes.includes(travelClass);

    return matchesFrom && matchesTo && matchesDeparture && matchesClass;
  });

  if (filteredTrains.length > 0) {
    displayTrainResults(filteredTrains);
  } else {
    document.getElementById(
      "trainResults"
    ).innerHTML = `<p>No trains found for the selected filters.</p>`;
  }
}

// Display train results
function displayTrainResults(trains) {
  const resultsContainer = document.getElementById("trainResults");
  resultsContainer.innerHTML = "";

  trains.forEach((train) => {
    const trainDiv = document.createElement("div");
    trainDiv.classList.add("result-item");
    trainDiv.innerHTML = `
        <h3>${train.trainName} (${train.trainNumber})</h3>
        <p>From: ${train.source} → To: ${train.destination}</p>
        <p>Departure: ${new Date(train.departureTime).toLocaleString()}</p>
        <p>Arrival: ${new Date(train.arrivalTime).toLocaleString()}</p>
        <p>Class: ${train.travelClass} | Price: ₹${train.price}</p>
        <button onclick="bookTrain('${train._id}')">Book Now</button>
    `;
    resultsContainer.appendChild(trainDiv);
  });
}

// Book train
async function bookTrain(trainId) {
  // Retrieve user details from local storage (or session storage)
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("authToken");

  // Check if user is logged in
  if (!user || !user._id || !token) {
    alert("You must be logged in to book a train!");
    return;
  }

  // Prepare booking data
  const bookingData = {
    userId: user._id,
    trainId: trainId,
    travelClass: document.getElementById("trainClass").value,
    paymentStatus: "Pending",
  };

  try {
    const response = await fetch(`https://adarsh-holidays-backend-production.up.railway.app/api/trains/book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });

    const data = await response.json();
    if (data.success) {
      alert("🚆 Train booked successfully!");
    } else {
      alert("❌ Booking failed! Please try again.");
    }
  } catch (error) {
    console.error("Error booking train:", error);
    alert("⚠️ An error occurred while booking. Please try again later.");
  }
}

// Initialize: Fetch all trains on page load
fetchTrains();

// Delete train booking

async function deleteTrainBooking(bookingId) {
  // Retrieve JWT token dynamically
  const token = localStorage.getItem("authToken");

  if (!token) {
    alert("You must be logged in to cancel a booking!");
    return;
  }

  try {
    const response = await fetch(
      `https://adarsh-holidays-backend-production.up.railway.app/api/trains/delete/${bookingId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Sending JWT token
        },
      }
    );

    const data = await response.json();
    if (data.success) {
      alert("🚆 Booking canceled successfully!");
      searchTrains(); // ✅ Refresh train list dynamically
    } else {
      alert(
        `❌ Failed to cancel booking! ${data.error || "Please try again."}`
      );
    }
  } catch (error) {
    console.error("Error canceling booking:", error);
    alert("⚠️ An error occurred while canceling. Please try again later.");
  }
}

// Initialize Flatpickr for Departure Date
flatpickr("#departure", {
  dateFormat: "d-m-Y",
  altInput: true,
  altFormat: "d-m-Y",
  allowInput: false, // Prevent manual input
  clickOpens: true, // Allow opening on click
});

// Initialize Flatpickr for Return Date
flatpickr("#return", {
  dateFormat: "d-m-Y",
  altInput: true,
  altFormat: "d-m-Y",
  allowInput: false, // Prevent manual input
  clickOpens: true, // Allow opening on click
});
