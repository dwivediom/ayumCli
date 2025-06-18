const fs = require("fs");
const path = require("path");
const axios = require("axios");
const host = process.env.NEXT_PUBLIC_B_PORT || "http://localhost:5001";

// List of 20 specialties and easy terms
const specialists = [
  "dentist", "orthopedic+surgeon", "cardiologist", "neurologist", "gynecologist", 
  "dermatologist", "pediatrician", "psychiatrist", "ophthalmologist", "urologist", 
  "oncologist", "gastroenterologist", "endocrinologist", "pulmonologist", 
  "nephrologist", "rheumatologist", "allergist", "immunologist", "plastic+surgeon", 
  "otolaryngologist"
];

const easyTerms = [
  "tooth+doctor", "bone+doctor", "heart+doctor", "brain+doctor", "women+doctor", 
  "skin+doctor", "child+doctor", "mentalHealth+doctor", "eye+doctor", "urinary+doctor", 
  "cancer+doctor", "digestive+doctor", "hormone+doctor", "lung+doctor", 
  "kidney+doctor", "arthritis+doctor", "allergy+doctor", "immune+doctor", 
  "cosmetic+surgeon", "ear+nose+throat+doctor"
];

// Function to get all doctors for sitemap.xml
const getallDoctors = async () => {
  try {
    const allIds = await axios({
      url: `https://server.ayum.in/api/docdirectory/getallDoctors`,
      method: "get",
    });
    return allIds.data;
  } catch (error) {
    console.error("Error fetching doctor IDs:", error);
    return [];
  }
};

// Get unique cities and normalize them
const getCities = async () => {
  try {
    const response = await axios({
      url: "https://server.ayum.in/api/otheropration/getcities",
      method: "get",
    });
    const rawCities = response.data.cities;
    // Normalize cities (lowercase and remove extra spaces)
    const uniqueCities = [...new Set(rawCities.map(city => city.trim().toLowerCase()))];
    return uniqueCities;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};

// Function to get all medical store usernames
const getMedicalStoreUsernames = async () => {
  try {
    const response = await axios({
      url: `https://server.ayum.in/api/ayum/medical-stores/usernames`,
      method: "get",
    });
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching medical store usernames:", error);
    return [];
  }
};

// Generate URLs for the specialists and easy terms
const generateSpecialistUrls = (city, hostd) => {
  const urls = [];
  specialists.forEach((specialist, index) => {
    const easyTerm = easyTerms[index];
    // Old URL format with "-" separators
    const oldSpecialistUrl = `${hostd}/city/best-${specialist}-near-me-in-${city}`;
    const oldEasyUrl = `${hostd}/city/best-${easyTerm}-near-me-in-${city}`;

    
    // Add old and new URLs to the list
    urls.push({ url: oldSpecialistUrl, changefreq: "weekly" });
    urls.push({ url: oldEasyUrl, changefreq: "weekly" });
    
  });
  return urls;
};

// Function to create a range array for pagination
function createRangeArray(n) {
  return Array.from(Array(n).keys(), (x) => x + 1);
}

const generateUrlList = async (idList) => {
  const hostd = "https://www.ayum.in";
  const statPageList = ["", "Contact", "About"];
  const allUrlData = [];

  // Add medical store URLs
  const medicalStoreUsernames = await getMedicalStoreUsernames();
  medicalStoreUsernames.forEach(username => {
    const urlData = {
      url: `${hostd}/medical-store/${username}`,
      changefreq: "weekly",
    };
    allUrlData.push(urlData);
  });

  if (Array.isArray(idList) && idList.length > 0) {
    idList.forEach((id) => {
      const urlData = {
        url: `${hostd}/doctor?docid=${id?._id}`,
        changefreq: "weekly",
      };
      allUrlData.push(urlData);
    });

    let datalength = idList.length;
    let pageList = createRangeArray(Math.ceil(datalength / 10));

    pageList.forEach((page) => {
      const urlData = {
        url: `${hostd}/doctor?p=${page}`,
        changefreq: "weekly",
      };
      allUrlData.push(urlData);
    });

    statPageList.forEach((page) => {
      const encodedPage = encodeURIComponent(page);
      const urlData = { url: `${hostd}/${encodedPage}`, changefreq: "weekly" };
      allUrlData.push(urlData);
    });
  }

  // Fetch and add city-specific URLs (both old and new)
  const uniqueCities = await getCities();
  uniqueCities.forEach((city) => {
    const cityUrls = generateSpecialistUrls(city, hostd);
    allUrlData.push(...cityUrls);
  });

  return allUrlData;
};

const generateXML = (pages) => {
  let xml = `<?xml version ="1.0" encoding="UTF-8" ?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    `;
  pages.forEach((page) => {
    xml += `<url>
        <loc>${page.url}</loc>
        <changefreq>${page.changefreq || "daily"}</changefreq>
        </url>`;
  });
  xml += `
    </urlset>`;
  return xml;
};

const genrateSiteMap = async () => {
  const allIds = await getallDoctors();  // Fetch doctor IDs

  const urldata = await generateUrlList([...allIds]);  // Fetch all URLs (old + new formats)
  let sitemapString = await generateXML(urldata);  // Generate XML string

  fs.writeFileSync(path.resolve("./public/sitemap.xml"), sitemapString);  // Write to file
};

genrateSiteMap();
