const fs = require("fs");
const path = require("path");
const axios = require("axios");
const host = process.env.NEXT_PUBLIC_B_PORT;

// const filePath = path.resolve("./public/sitemap.xml")

// fs.unlink(filePath, (err) => {
//     if (err) {
//         console.error('Error removing file:', err);
//     } else {
//         console.log('File removed successfully');
//     }
// });

// get all doctors for sitemap.xml it return id of all doc in docdirectory
//http://localhost:5000/api/docdirectory/getallDoctors
const getallDoctors = async () => {
  try {
    const allIds = await axios({
      url: `https://server.ayum.in/api/docdirectory/getallDoctors`,
      method: "get",
    });

    return allIds.data;
  } catch (error) {
    return error.message;
  }
};

function createRangeArray(n) {
  return Array.from(Array(n).keys(), (x) => x + 1);
}

const generateUrlList = async (idList) => {
  const hostd = "https://ayum.in";
  const statPageList = [" ", "Contact", "About"];
  const allUrlData = [];

  if (Array.isArray(idList) && idList.length > 0) {
    idList.forEach((id) => {
      const urlData = {
        url: `${hostd}/doctor?n=${id?.name}&docid=${id?._id}`,
        changefreq: "weekly",
      };
      allUrlData.push(urlData);
    });

    let datalenght = idList.length;
    let pageList = createRangeArray(Math.ceil(datalenght / 10));

    pageList.forEach((page) => {
      const urlData = {
        url: `${hostd}/doctor?p=${page}`,
        changefreq: "weekly",
      };
      allUrlData.push(urlData);
    });
    statPageList.forEach((page) => {
      const urlData = { url: `${hostd}/${page}`, changefreq: "weekly" };
      allUrlData.push(urlData);
    });
  }

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
  const allIds = await getallDoctors();

  const urldata = await generateUrlList([...allIds]);
  let sitemapString = await generateXML(urldata);

  fs.writeFileSync(path.resolve("./public/sitemap.xml"), sitemapString);
};

genrateSiteMap();
