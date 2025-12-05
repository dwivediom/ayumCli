import React, { useEffect, useState, useRef } from "react";
import styles from "./profilestyle.module.css";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Rating } from "primereact/rating";
import CustomRating from "./CustomRating";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { generateLast100Years } from "../redux/constants/docConstants";
import { Toast } from "primereact/toast";
// import { useRouter } from "next/navigation";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
const NewDocprofile = ({ item, key, docid, showreview, isMobile }) => {
  const toast = useRef(null);
  const [profiledata, setprofiledata] = useState();
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userReview, setUserReview] = useState(null);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewsLimit, setReviewsLimit] = useState(10);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [loadingMoreReviews, setLoadingMoreReviews] = useState(false);

  // Calculate average rating from reviews
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();

  const GetProfleData = async () => {
    const prodata = await axios({
      method: "post",
      url: `${
        process.env.NEXT_PUBLIC_B_PORT
      }/api/user/getdoctorprofiledata?id=${
        item.onAyum ? item.doctorid : docid
      }`,
      headers: {
        "x-auth-token": localStorage.usertoken,
      },
      data: {},
    });
    console.log(prodata.data?.data, "prodata");
    setprofiledata(prodata.data?.data);
  };

  const GetReviews = async (skip = 0, limit = 10, append = false) => {
    if (!append) {
      setReviewLoading(true);
    } else {
      setLoadingMoreReviews(true);
    }
    try {
      const doctorId = item.onAyum ? item.doctorid : docid;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/docdirectory/${doctorId}/reviews`,
        {
          params: {
            limit,
            skip,
          },
        }
      );
      const fetchedReviews = response.data?.reviews || [];
      
      if (append) {
        setReviews((prev) => [...prev, ...fetchedReviews]);
      } else {
        setReviews(fetchedReviews);
        setReviewsLimit(limit);
      }
      
      setHasMoreReviews(response.data?.hasMore || false);
      
      // Check if current user has already reviewed
      const userData = JSON.parse(localStorage.getItem("userdata"))?.user;
      if (userData) {
        // Convert userid to string for comparison
        const userIdStr = userData._id ? String(userData._id) : null;
        const userEmail = userData.email;
        
        const allReviews = append ? [...reviews, ...fetchedReviews] : fetchedReviews;
        const existingReview = allReviews.find((review) => {
          // Convert review userid to string for comparison
          const reviewUserIdStr = review.userid ? String(review.userid) : null;
          // Strict comparison: match by userid (preferred) or email (fallback)
          return (userIdStr && reviewUserIdStr && reviewUserIdStr === userIdStr) ||
                 (userEmail && review.useremail && review.useremail === userEmail);
        });
        
        if (existingReview) {
          setUserReview(existingReview);
        } else {
          setUserReview(null);
        }
      } else {
        setUserReview(null);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      if (!append) {
        setReviews([]);
      }
    } finally {
      setReviewLoading(false);
      setLoadingMoreReviews(false);
    }
  };

  const loadMoreReviews = () => {
    GetReviews(reviews.length, 10, true);
  };

  const handleSubmitReview = async () => {
    if (!newReview.rating || newReview.rating === 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Rating Required",
        detail: "Please select a rating",
        life: 3000,
      });
      return;
    }
    if (!newReview.comment.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Review Required",
        detail: "Please write a review comment",
        life: 3000,
      });
      return;
    }

    setSubmittingReview(true);
    try {
      const doctorId = item.onAyum ? item.doctorid : docid;
      const userData = JSON.parse(localStorage.getItem("userdata"))?.user;
      
      if (!userData) {
        toast.current?.show({
          severity: "error",
          summary: "Login Required",
          detail: "Please login to submit a review",
          life: 3000,
        });
        setSubmittingReview(false);
        return;
      }

      // Ensure userid is sent as string (backend will convert to ObjectId)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/docdirectory/${doctorId}/reviews`,
        {
          patientemail: userData.email,
          rating: newReview.rating,
          comment: newReview.comment,
          patientprofile: userData.picture || "",
          patientName: userData.name || "Anonymous",
          userid: userData._id ? String(userData._id) : null, // Ensure it's a string or null
        }
      );

      if (response.data?.error) {
        throw new Error(response.data.message || "Failed to submit review");
      }

      // Refresh reviews and profile data - fetch new review and add to top
      const newReviewResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/docdirectory/${doctorId}/reviews`,
        {
          params: {
            limit: 1,
            skip: 0,
          },
        }
      );
      
      const newReviewData = newReviewResponse.data?.reviews?.[0];
      if (newReviewData) {
        // Check if this review is already in the list
        const existingIndex = reviews.findIndex(
          (r) => r._id?.toString() === newReviewData._id?.toString()
        );
        
        if (existingIndex === -1) {
          // Add new review to the top
          setReviews((prev) => [newReviewData, ...prev]);
        } else {
          // Update existing review
          setReviews((prev) => {
            const updated = [...prev];
            updated[existingIndex] = newReviewData;
            return updated;
          });
        }
      } else {
        // Fallback: refresh all reviews
        await GetReviews();
      }
      
      await GetProfleData();
      setShowReviewDialog(false);
      setNewReview({ rating: 0, comment: "" });
      setIsEditingReview(false);
      
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: isEditingReview ? "Review updated successfully!" : "Review submitted successfully!",
        life: 3000,
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || error.message || "Failed to submit review. Please try again.",
        life: 4000,
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditReview = () => {
    if (userReview) {
      setNewReview({
        rating: userReview.rating || 0,
        comment: userReview.description || userReview.comment || "",
      });
      setIsEditingReview(true);
      setShowReviewDialog(true);
    }
  };

  const router = useRouter();
  useEffect(() => {
    GetProfleData();
    GetReviews();
    const userData = JSON.parse(localStorage.getItem("userdata"))?.user;
    setUserData(userData);
  }, []);

  return (
    <>
      <Toast ref={toast} />
      <div
      style={{
        padding: "15px",
        paddingTop: "1.5rem",
        position: "relative",
        width: "100%",
        minWidth: isMobile && "23rem",
      }}
      className={styles.submainbox}
    >
      {docid && (
        <Head>
          <title>
            {`${item.name} ${item.city} , ${item.specialist}`} {"- Ayum"}{" "}
          </title>
          <meta
            name="Title"
            content={`${item.name} ${item.city} in ${item.address?.slice(
              0,
              20
            )} - Best ${item.specialist} in ${item.city} ${item.address?.slice(
              0,
              20
            )} - Ayum`}
          ></meta>
          <meta
            name="description"
            content={`${item.name} ${item.city}  in ${item.address?.slice(
              0,
              20
            )}. Top ${item.specialist} Doctors ${item.address?.slice(
              0,
              20
            )}.Visiting Time, Contact Number, Clinic Address, Map of ${
              item.name
            } ,${item.city} ${item.address?.slice(0, 20)} `}
          ></meta>

          <meta
            name="keywords"
            content={`${item.name} ${item.city}, Contact number, Phone number, Address, Map,${item.name} ${item.city}, Directions, Official website link, Working hours, Services`}
          ></meta>
          <meta
            name="twitter:title"
            content={`${item.name} in  ${item.city},${item.address?.slice(
              0,
              20
            )}  - Best ${item.specialist} Doctors in  ${
              item.city
            } , ${item.address?.slice(0, 20)}  - Ayum`}
          ></meta>
          <meta
            name="twitter:description"
            content={`${item.name}  in ${item.address?.slice(0, 20)}. Top ${
              item.specialist
            } Doctors ${item.address?.slice(
              0,
              20
            )}.Visiting Time, Contact Number, Clinic Address, Map of ${
              item.name
            } ,${item.city} ${item.address?.slice(0, 20)} - Ayum `}
          ></meta>

          <meta name="twitter:image" content="https://ayum.in/Ayumcover.jpg" />
          <meta
            name="twitter:url"
            content={`https://www.ayum.in/doctor?docid=${item._id}`}
          />
          <meta
            property="og:title"
            content={`${item.name}, ${item.city}, ${item.address?.slice(
              0,
              20
            )} - Ayum`}
          ></meta>
          <meta property="og:type" content="website"></meta>
          <meta
            property="og:url"
            content={`https://www.ayum.in/doctor?docid=${item._id}`}
          ></meta>
          <meta
            property="og:image"
            content="https://www.ayum.in/Ayumcover.jpg"
          ></meta>
          <meta
            property="og:image:secure_url"
            content="https://ayum.in/Ayumcover.jpg"
          ></meta>
          <meta property="og:image:width" content="630"></meta>
          <meta property="og:image:height" content="473"></meta>
          <meta
            property="og:description"
            content={`Get Address, Contact Number, Photos, Maps of ${
              item.name
            },Phone-${item.phone.toString()?.slice(0, 5)}...  ${
              item.city
            }, ${item.address?.slice(0, 20)} ,  on Ayum`}
          ></meta>
          {/* <meta name="viewport" content="viewport-fit=cover"></meta> */}
          <meta
            property="al:ios:url"
            content={`https://www.ayum.in/doctor?docid=${item._id}`}
          ></meta>
          <link
            rel="alternate"
            media="only screen and (max-width: 640px)"
            href={`https://www.ayum.in/doctor?docid=${item._id} `}
          ></link>
          <link
            rel="alternate"
            href={`https://www.ayum.in/doctor?docid=${item._id} `}
          ></link>
          <link
            rel="canonical"
            href={`https://www.ayum.in/doctor?docid=${item._id} `}
          ></link>

          {/* Meta tags for SEO optimization */}

          <meta name="author" content={item.name} />
          <meta name="robots" content="index, follow" />
          {/* Add other meta tags as needed */}
        </Head>
      )}
      <div
        style={{
          padding: isMobile ? "20px 15px" : "30px 25px",
          position: "relative",
        }}
        className={styles.submainbox}
      >
        {/* Profile Header Section */}
        <div className={styles.profileHeader}>
          <div className={styles.profileImageWrapper}>
            <Image
              alt={profiledata ? profiledata.name : ""}
              className={styles.profileImage}
              src={
                profiledata ? profiledata?.picture?.replace(/=s\d+-c/, "") : ""
              }
              width={isMobile ? 120 : 180}
              height={isMobile ? 120 : 180}
            />
            {(profiledata?.avgrating || (reviews.length > 0 && averageRating > 0)) && (
              <div className={styles.ratingBadge}>
                <span
                  className="pi pi-star-fill"
                  style={{ fontSize: "14px", marginRight: "4px" }}
                ></span>
                <span style={{ fontWeight: "600" }}>
                  {profiledata?.avgrating || averageRating}
                </span>
              </div>
            )}
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.profileName}>
              {profiledata && profiledata?.name}
            </h1>
            <div className={styles.profileMeta}>
              <span className={styles.regNumber}>
                <span
                  className="pi pi-id-card"
                  style={{ marginRight: "6px" }}
                ></span>
                Reg. No: {profiledata?.regno || "N/A"}
              </span>
              <span className={styles.specialization}>
                <span
                  className="pi pi-briefcase"
                  style={{ marginRight: "6px" }}
                ></span>
                {profiledata?.specialist?.charAt(0).toUpperCase() +
                  profiledata?.specialist?.slice(
                    1,
                    profiledata?.specialist?.length
                  ) || "General Practitioner"}
              </span>
              {profiledata?.education && profiledata.education.length > 0 && (
                <span className={styles.specialization}>
                  <span
                    className="pi pi-graduation-cap"
                    style={{ marginRight: "6px" }}
                  ></span>
                  {profiledata.education[0]?.degree || "Education"}
                  {profiledata.education[0]?.fieldofstudy && ` (${profiledata.education[0].fieldofstudy})`}
                </span>
              )}
              <span className={styles.location}>
                <span
                  className="pi pi-map-marker"
                  style={{ marginRight: "6px" }}
                ></span>
                {profiledata?.city || profiledata?.contactInfo?.address || "City"}
                {profiledata?.contactInfo?.country ? `, ${profiledata.contactInfo.country}` : ", India"}
              </span>
            </div>
            {!profiledata?.avgrating && reviews.length === 0 && (
              <div className={styles.noRatingBadge}>
                <span>Not rated yet</span>
              </div>
            )}
            {!isMobile && (
              <div className={styles.profileactions}>
                <div
                  onClick={() => router.push(`/clinics?id=${profiledata?._id}`)}
                  className={styles.profilesubaction1}
                >
                  <span
                    className="pi pi-calendar"
                    style={{ marginRight: "6px" }}
                  ></span>
                  Book Appointment
                </div>
                <div className={styles.profilesubaction2}>
                  <span
                    className="pi pi-map"
                    style={{ marginRight: "6px" }}
                  ></span>
                  View On Map
                </div>
              </div>
            )}
          </div>
        </div>

        {isMobile && (
          <div className={styles.profileactions} style={{ marginTop: "15px" }}>
            <div
              onClick={() => router.push(`/clinics?id=${profiledata?._id}`)}
              className={styles.profilesubaction1}
            >
              <span
                className="pi pi-calendar"
                style={{ marginRight: "6px" }}
              ></span>
              Book Appointment
            </div>
            <div className={styles.profilesubaction2}>
              <span className="pi pi-map" style={{ marginRight: "6px" }}></span>
              View On Map
            </div>
          </div>
        )}

        {/* Languages Section - Mobile Friendly */}
        {profiledata?.languages && profiledata.languages.length > 0 && (
          <div className={styles.languagesCard}>
            <div className={styles.languagesHeader}>
              <div className={styles.languagesIcon}>
                <span className="pi pi-globe"></span>
              </div>
              <span className={styles.languagesTitle}>Languages</span>
            </div>
            <div className={styles.languageTags}>
              {profiledata.languages.map((lang, index) => (
                <span key={index} className={styles.languageTag}>
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bio Section */}
        <div className={styles.bioSection}>
          <h3 className={styles.sectionTitle}>
            <span className="pi pi-user" style={{ marginRight: "8px" }}></span>
            About
          </h3>
          <p className={styles.bioText}>
            {profiledata?.bio ||
              "No bio available. Please update your profile to add information about yourself and your practice."}
          </p>
        </div>

        {/* Commonly Treats Section */}
        {profiledata?.commonlyTreats && profiledata.commonlyTreats.length > 0 && (
          <div className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>
              <span className="pi pi-heart" style={{ marginRight: "8px" }}></span>
              Commonly Treats
            </h3>
            <div className={styles.treatsGrid}>
              {profiledata.commonlyTreats.map((treat, index) => (
                <div key={index} className={styles.treatItem}>
                  {treat}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Registration Section */}
        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>
            <span
              className="pi pi-shield"
              style={{ marginRight: "8px" }}
            ></span>
            Registration Details
          </h3>
          <div className={styles.registrationInfo}>
            <span className={styles.registrationNumber}>
              {profiledata?.regno || "Not provided"}
            </span>
          </div>
        </div>

        {/* Experience Section */}
        {profiledata?.experience && profiledata?.experience.length > 0 && (
          <div className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>
              <span
                className="pi pi-briefcase"
                style={{ marginRight: "8px" }}
              ></span>
              Professional Experience
            </h3>
            <div className={styles.experienceGrid}>
              {profiledata.experience.map((item, index) => (
                <div key={index} className={styles.expcard}>
                  <div className={styles.expIcon}>
                    <span
                      className="pi pi-building"
                      style={{ fontSize: "24px" }}
                    ></span>
                  </div>
                  <div className={styles.expContent}>
                    <h4 className={styles.expPosition}>{item?.position}</h4>
                    <p className={styles.expOrganization}>
                      {item?.organization}
                    </p>
                    <p className={styles.expLocation}>
                      <span
                        className="pi pi-map-marker"
                        style={{ fontSize: "12px", marginRight: "4px" }}
                      ></span>
                      {item?.location}
                    </p>
                    <p className={styles.expDuration}>
                      {item?.from} - {item?.current ? "Present" : item?.to}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {profiledata?.education && profiledata?.education.length > 0 && (
          <div className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>
              <span
                className="pi pi-graduation-cap"
                style={{ marginRight: "8px" }}
              ></span>
              Educational Qualifications
            </h3>
            <div className={styles.educationGrid}>
              {profiledata.education.map((item, index) => (
                <div key={index} className={styles.educard}>
                  <div className={styles.eduIcon}>
                    <span
                      className="pi pi-book"
                      style={{ fontSize: "24px" }}
                    ></span>
                  </div>
                  <div className={styles.eduContent}>
                    <h4 className={styles.eduDegree}>{item?.degree}</h4>
                    <p className={styles.eduSchool}>{item?.school}</p>
                    <p className={styles.eduField}>
                      Field: {item?.fieldofstudy}
                    </p>
                    <p className={styles.eduDuration}>
                      {item?.from} - {item?.to}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {profiledata?.certifications && profiledata.certifications.length > 0 && (
          <div className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>
              <span
                className="pi pi-certificate"
                style={{ marginRight: "8px" }}
              ></span>
              Certifications & Licenses
            </h3>
            <div className={styles.certificationsGrid}>
              {profiledata.certifications.map((cert, index) => (
                <div key={index} className={styles.certCard}>
                  <div className={styles.certIcon}>
                    <span
                      className="pi pi-verified"
                      style={{ fontSize: "24px" }}
                    ></span>
                  </div>
                  <div className={styles.certContent}>
                    <h4 className={styles.certTitle}>
                      {cert?.title || "Certification"}
                    </h4>
                    <p className={styles.certIssuer}>
                      {cert?.issuer || "Issuing Organization"}
                    </p>
                    {cert?.issuedDate && (
                      <p className={styles.certDate}>Issued: {cert.issuedDate}</p>
                    )}
                    <p className={styles.certStatus}>
                      <span className={styles.statusBadge}>
                        {cert?.status || "Active"}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards & Recognition Section */}
        {profiledata?.awards && profiledata.awards.length > 0 && (
          <div className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>
              <span
                className="pi pi-trophy"
                style={{ marginRight: "8px" }}
              ></span>
              Awards & Recognition
            </h3>
            <div className={styles.awardsGrid}>
              {profiledata.awards.map((award, index) => (
                <div key={index} className={styles.awardCard}>
                  <div className={styles.awardIcon}>
                    <span
                      className="pi pi-star"
                      style={{ fontSize: "28px" }}
                    ></span>
                  </div>
                  <div className={styles.awardContent}>
                    <h4 className={styles.awardTitle}>
                      {award?.title || "Award"}
                    </h4>
                    <p className={styles.awardOrg}>
                      {award?.organization || "Organization"}
                    </p>
                    {award?.year && (
                      <p className={styles.awardYear}>{award.year}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Offered Section */}
        {profiledata?.servicesOffered && profiledata.servicesOffered.length > 0 && (
          <div className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>
              <span className="pi pi-cog" style={{ marginRight: "8px" }}></span>
              Services Offered
            </h3>
            <div className={styles.servicesGrid}>
              {profiledata.servicesOffered.map((service, index) => (
                <div key={index} className={styles.serviceItem}>
                  <span
                    className="pi pi-check-circle"
                    style={{ marginRight: "8px", color: "#38ef7d" }}
                  ></span>
                  {service}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Patient Reviews Section */}
        <div className={styles.sectionCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "10px" }}>
            <h3 className={styles.sectionTitle}>
              <span
                className="pi pi-comments"
                style={{ marginRight: "8px" }}
              ></span>
              Patient Reviews
              <span className={styles.reviewCount}>
                ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </h3>
            {userData && (
              <div style={{ display: "flex", gap: "10px" }}>
                {userReview ? (
                  <Button
                    label="Edit Your Review"
                    icon="pi pi-pencil"
                    onClick={handleEditReview}
                    size="small"
                    style={{ borderRadius: "20px" }}
                  />
                ) : (
                  <Button
                    label="Write Review"
                    icon="pi pi-pencil"
                    onClick={() => {
                      setIsEditingReview(false);
                      setNewReview({ rating: 0, comment: "" });
                      setShowReviewDialog(true);
                    }}
                    size="small"
                    style={{ borderRadius: "20px" }}
                  />
                )}
              </div>
            )}
          </div>
          {reviewLoading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <Image src={"/loader.svg"} width={40} height={40} alt="Loading..." />
            </div>
          ) : reviews.length > 0 ? (
            <div className={styles.reviewsContainer}>
              {reviews.map((review, index) => {
                // Strict comparison for user review identification
                const userIdStr = userData?._id ? String(userData._id) : null;
                const reviewUserIdStr = review.userid ? String(review.userid) : null;
                const isUserReview = userData && (
                  (userIdStr && reviewUserIdStr && reviewUserIdStr === userIdStr) ||
                  (userData.email && review.useremail && review.useremail === userData.email)
                );
                return (
                  <div key={review._id || index} className={styles.reviewCard} style={{ position: "relative" }}>
                    {isUserReview && (
                      <Button
                        icon="pi pi-pencil"
                        onClick={() => {
                          setNewReview({
                            rating: review.rating || 0,
                            comment: review.description || review.comment || "",
                          });
                          setIsEditingReview(true);
                          setShowReviewDialog(true);
                        }}
                        className="p-button-text p-button-sm"
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          color: "#667eea",
                          padding: "4px 8px",
                        }}
                        title="Edit your review"
                      />
                    )}
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewerInfo}>
                        <div className={styles.reviewerAvatar}>
                          {review.userprofile ? (
                            <Image
                              src={review.userprofile}
                              width={40}
                              height={40}
                              alt={review.name || "User"}
                              style={{ borderRadius: "50%" }}
                            />
                          ) : (
                            <span
                              className="pi pi-user"
                              style={{ fontSize: "20px" }}
                            ></span>
                          )}
                        </div>
                        <div>
                          <h4 className={styles.reviewerName}>
                            {review.name || "Anonymous"}
                            {isUserReview && (
                              <span style={{ 
                                fontSize: "0.75rem", 
                                color: "#667eea", 
                                marginLeft: "8px",
                                fontWeight: "normal"
                              }}>
                                (You)
                              </span>
                            )}
                          </h4>
                          <p className={styles.reviewDate}>
                            {review.created
                              ? new Date(review.created).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "Recently"}
                          </p>
                        </div>
                      </div>
                      <div className={styles.reviewRating}>
                        <Rating value={review.rating || 0} readOnly cancel={false} />
                      </div>
                    </div>
                    <p className={styles.reviewText}>
                      {review.description || review.comment || "No comment provided"}
                    </p>
                    
                    {/* Doctor Reply Section */}
                    {review?.reply ? (
                      <div
                        style={{
                          marginTop: "1rem",
                          padding: "0.75rem",
                          background: "#f0f9ff",
                          borderRadius: "8px",
                          borderLeft: "3px solid #667eea",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                          <span
                            className="pi pi-star-fill"
                            style={{
                              fontSize: "14px",
                              color: "#fbbf24",
                              marginRight: "6px",
                            }}
                          ></span>
                          <span style={{ fontWeight: "600", color: "#667eea", fontSize: "0.9rem" }}>
                            {review.reply.repliedByName || "Doctor"}
                          </span>
                          <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "#718096" }}>
                            {review.reply.repliedAt
                              ? new Date(review.reply.repliedAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : ""}
                          </span>
                        </div>
                        <p style={{ color: "#4a5568", fontSize: "0.9rem", margin: 0 }}>
                          {review.reply.text}
                        </p>
                      </div>
                    ) : null}
                  </div>
                );
              })}
              {hasMoreReviews && (
                <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                  <Button
                    label={loadingMoreReviews ? "Loading..." : "Load More Reviews"}
                    icon={loadingMoreReviews ? "pi pi-spin pi-spinner" : "pi pi-chevron-down"}
                    onClick={loadMoreReviews}
                    loading={loadingMoreReviews}
                    outlined
                    style={{ borderRadius: "20px" }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "2rem", color: "#718096" }}>
              <p>No reviews yet. Be the first to review!</p>
              {userData && (
                <Button
                  label="Write First Review"
                  icon="pi pi-pencil"
                  onClick={() => setShowReviewDialog(true)}
                  style={{ marginTop: "1rem", borderRadius: "20px" }}
                />
              )}
            </div>
          )}
        </div>

        {/* Contact & Social Section */}
        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>
            <span className="pi pi-phone" style={{ marginRight: "8px" }}></span>
            Contact Information
          </h3>
          <div className={styles.contactGrid}>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <span
                  className="pi pi-phone"
                  style={{ fontSize: "20px" }}
                ></span>
              </div>
              <div className={styles.contactDetails}>
                <span className={styles.contactLabel}>Phone</span>
                <span className={styles.contactValue}>
                  {profiledata?.contactInfo?.phone || profiledata?.displayphone || profiledata?.phone || "Not provided"}
                </span>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <span
                  className="pi pi-envelope"
                  style={{ fontSize: "20px" }}
                ></span>
              </div>
              <div className={styles.contactDetails}>
                <span className={styles.contactLabel}>Email</span>
                <span className={styles.contactValue}>
                  {profiledata?.contactInfo?.email || profiledata?.email || "Not provided"}
                </span>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <span
                  className="pi pi-map-marker"
                  style={{ fontSize: "20px" }}
                ></span>
              </div>
              <div className={styles.contactDetails}>
                <span className={styles.contactLabel}>Address</span>
                <span className={styles.contactValue}>
                  {profiledata?.contactInfo?.address || profiledata?.address || profiledata?.city || "Not provided"}
                  {profiledata?.contactInfo?.country ? `, ${profiledata.contactInfo.country}` : profiledata?.city ? ", India" : ""}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.socialLinks}>
            <h4
              style={{
                marginBottom: "12px",
                fontSize: "1rem",
                fontWeight: "600",
                color: "#4a5568",
              }}
            >
              Connect on Social Media
            </h4>
            <div className={styles.socialIcons}>
              {profiledata?.social?.facebook && (
                <a
                  href={profiledata.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  style={{ background: "#1877f2" }}
                >
                  <span className="pi pi-facebook"></span>
                </a>
              )}
              {profiledata?.social?.twitter && (
                <a
                  href={profiledata.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  style={{ background: "#1da1f2" }}
                >
                  <span className="pi pi-twitter"></span>
                </a>
              )}
              {profiledata?.social?.linkedin && (
                <a
                  href={profiledata.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  style={{ background: "#0077b5" }}
                >
                  <span className="pi pi-linkedin"></span>
                </a>
              )}
              {profiledata?.social?.instagram && (
                <a
                  href={profiledata.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  style={{ background: "#e4405f" }}
                >
                  <span className="pi pi-instagram"></span>
                </a>
              )}
              {profiledata?.social?.youtube && (
                <a
                  href={profiledata.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  style={{ background: "#ff0000" }}
                >
                  <span className="pi pi-youtube"></span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Submission Dialog */}
      <Dialog
        visible={showReviewDialog}
        onHide={() => {
          setShowReviewDialog(false);
          setNewReview({ rating: 0, comment: "" });
          setIsEditingReview(false);
        }}
        header={isEditingReview ? "Edit Your Review" : "Write a Review"}
        style={{ width: isMobile ? "90%" : "500px" }}
      >
        <div style={{ padding: "1rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
              Rating *
            </label>
            <Rating
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: e.value })}
              cancel={false}
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
              Your Review *
            </label>
            <InputTextarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Share your experience with this doctor..."
              rows={5}
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <Button
              label="Cancel"
              icon="pi pi-times"
              outlined
              onClick={() => {
                setShowReviewDialog(false);
                setNewReview({ rating: 0, comment: "" });
              }}
              style={{ borderRadius: "20px" }}
            />
            <Button
              label={isEditingReview ? "Update Review" : "Submit Review"}
              icon="pi pi-check"
              onClick={handleSubmitReview}
              loading={submittingReview}
              style={{ borderRadius: "20px" }}
            />
          </div>
        </div>
      </Dialog>
    </div>
    </>
  );
};

export default NewDocprofile;
