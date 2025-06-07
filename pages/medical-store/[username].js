import React from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import MedicineSelection from '../../components/medical/MedicineSelection';
import styles from '../../styles/Profile.module.css';

// SSR function to fetch initial data
export async function getServerSideProps(context) {
  const { username } = context.params;
  
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_B_PORT}/api/medical/pharmacy/doctor/by-username`,
      {
        params: { username }
      }
    );

    if (response.data.error) {
      return {
        props: {
          profileData: null,
          username,
          error: response.data.message || 'Profile not found'
        }
      };
    }

    return {
      props: {
        profileData: response.data.data,
        username,
        error: null
      }
    };
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return {
      props: {
        profileData: null,
        username,
        error: 'Failed to fetch profile data'
      }
    };
  }
}

const ProfilePage = ({ profileData, username, error }) => {
  const router = useRouter();
  const businessName = profileData?.buisnessname || profileData?.name || '';
  const formattedBusinessName = businessName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  if (error || !profileData) {
    return (
      <>
        <Head>
          <title>Store Not Found | Ayum</title>
          <meta name="description" content="The requested medical store could not be found." />
        </Head>
        <div className={styles.errorContainer}>
          <h1>Store Not Found</h1>
          <p>{error || 'The requested store could not be found.'}</p>
        </div>
      </>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Pharmacy",
    "name": formattedBusinessName || "",
    "description": `${formattedBusinessName || ""} is a trusted pharmacy in ${profileData?.city || ""}, offering a wide range of prescription medications, over‑the‑counter drugs, and healthcare products. We provide fast, friendly service, competitive pricing, and home delivery for all your health‑care needs.`,
    "keywords": `pharmacy, prescription medicines, over the counter drugs, health supplements, home delivery pharmacy, ${profileData?.city || ""} pharmacy`,
    "image": profileData?.picture || "",
    "url": profileData?.ayumUserName ? `https://ayum.in/medical-store/${profileData.ayumUserName}` : "",
    "telephone": profileData?.phone?.toString() || "",
    "priceRange": "₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": profileData?.streetAddress || "",
      "addressLocality": profileData?.city || "",
      "addressRegion": profileData?.state || "",
      "postalCode": profileData?.postalCode || "",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": profileData?.latitude ?? 18.9667,
      "longitude": profileData?.longitude ?? 72.8333
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "08:00",
        "closes": "22:00"
      }
    ],
    "pharmacySpecialty": [
      "Prescription Fulfillment",
      "Over‑the‑Counter Medication",
      "Home Delivery",
      "Health Supplements"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": profileData?.rating?.value || "0",
      "reviewCount": profileData?.rating?.count || "0"
    },
    "review": profileData?.reviews?.length ? profileData.reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review?.author?.name || "Anonymous"
      },
      "datePublished": review?.date || "",
      "reviewBody": review?.text || "",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review?.rating?.toString() || "0"
      }
    })) : [],
    "sameAs": profileData?.ayumUserName ? [
      `https://ayum.in/medical-store/${profileData.ayumUserName}`
    ] : [],
    "paymentAccepted": [
      "Cash",
      "Credit Card",
      "Debit Card",
      "UPI"
    ]
  };
  

  return (
    <>
      <Head>
        <title>{`${formattedBusinessName} - Medical Store | Ayum`}</title>
        <meta name="description" content={`Visit ${formattedBusinessName} for all your medical needs. Located in ${profileData.city}.`} />
        <meta property="og:title" content={`${formattedBusinessName} - Medical Store | Ayum`} />
        <meta property="og:description" content={`Visit ${formattedBusinessName} for all your medical needs. Located in ${profileData.city}.`} />
        <meta property="og:image" content={profileData.picture} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <div className={styles.container}>
        {/* Profile Section */}
        <div className={styles.profileSection}>
          <div className={styles.profileHeader}>
            <div className={styles.profileImage}>
              <img 
                src={profileData.picture || '/default-profile.png'} 
                alt={formattedBusinessName}
              />
            </div>
            <div className={styles.profileInfo}>
              <h1>{formattedBusinessName}</h1>
              {profileData.phone && (
                <p className={styles.phone}>
                  <i className="pi pi-phone"></i> {profileData.phone}
                </p>
              )}
              {profileData.city && (
                <p className={styles.location}>
                  <i className="pi pi-map-marker"></i> {profileData.city}
                </p>
              )}
              {profileData.gstin && (
                <p className={styles.gstin}>
                  <i className="pi pi-id-card"></i> GSTIN: {profileData.gstin}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Medicine Selection Section */}
        <div className={styles.medicineSection}>
          <MedicineSelection 
            pharmacyId={profileData._id}
            showProfile={false}
          />
        </div>
      </div>
    </>
  );
};

export default ProfilePage; 