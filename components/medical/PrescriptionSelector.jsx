import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext,
} from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import axios from "axios";
import { AccountContext } from "../../context/AccountProvider";
import English from "../../public/locales/en/index";
import Hindi from "../../public/locales/hi/index";
import {
  validateAndCompressImage,
  isImageFile,
  formatFileSize,
  createProgressCallback,
} from "../../utils/imageCompression";

const PrescriptionSelector = ({ value, onChange, getAuthHeaders }) => {
  const [prescriptionFiles, setPrescriptionFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [compressionProgress, setCompressionProgress] = useState(0);
  const fileInputRef = useRef(null);
  const toastRef = useRef(null);

  // Memoize fetchPrescriptions to prevent unnecessary re-renders
  const fetchPrescriptions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/media/files?fileType=prescription&page=1&limit=10`,
        { headers: getAuthHeaders() }
      );
      setPrescriptionFiles(response.data.data || []);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      setPrescriptionFiles([]);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // Fetch prescriptions on mount and when value changes
  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show file info before starting upload
    const fileSize = formatFileSize(file.size);
    const fileName = file.name;

    // Show info about compression if it's a large image
    if (isImageFile(file) && file.size > 5 * 1024 * 1024) {
      toastRef.current?.show({
        severity: "info",
        summary: lang === "en" ? "Info" : "जानकारी",
        detail:
          lang === "en"
            ? `Large image detected (${fileSize}). Will be automatically compressed for faster upload.`
            : `बड़ी छवि का पता चला (${fileSize})। तेज़ अपलोड के लिए स्वचालित रूप से संपीड़ित की जाएगी।`,
        life: 3000,
      });
    }

    setUploading(true);
    setCompressing(false);
    setUploadProgress("");

    try {
      let fileToUpload = file;
      let compressionMessage = "";

      // Check if it's an image and needs compression
      if (isImageFile(file)) {
        setCompressing(true);
        setCompressionProgress(0);
        setUploadProgress(
          lang === "en"
            ? "Compressing image..."
            : "छवि संपीड़ित की जा रही है..."
        );

        try {
          // Create progress callback for compression
          const progressCallback = createProgressCallback((progress) => {
            setCompressionProgress(progress);
            setUploadProgress(
              lang === "en"
                ? `Compressing image... ${Math.round(progress)}%`
                : `छवि संपीड़ित की जा रही है... ${Math.round(progress)}%`
            );
          });

          const compressionResult = await validateAndCompressImage(
            file,
            undefined,
            progressCallback,
            true
          );
          fileToUpload = compressionResult.file;

          if (compressionResult.wasCompressed) {
            compressionMessage = ` (Compressed from ${compressionResult.originalSize} to ${compressionResult.compressedSize})`;
            console.log(`Original name: ${compressionResult.originalName}`);
            console.log(`New name: ${compressionResult.file.name}`);
          }
        } catch (compressionError) {
          console.error("Image compression failed:", compressionError);
          toastRef.current.show({
            severity: "warn",
            summary: lang === "en" ? "Warning" : "चेतावनी",
            detail:
              lang === "en"
                ? "Image compression failed, uploading original file"
                : "छवि संपीड़न विफल, मूल फ़ाइल अपलोड की जा रही है",
            life: 3000,
          });
        } finally {
          setCompressing(false);
          setCompressionProgress(0);
        }
      }

      setUploadProgress(lang === "en" ? "Uploading..." : "अपलोड हो रहा है...");

      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("fileType", "prescription");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_B_PORT}/api/media/upload`,
        formData,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data?.data?.fileUrl) {
        // Show success toast with compression info if applicable
        const fileNameInfo = compressionMessage
          ? `\nOriginal: ${fileName}\nNew: ${fileToUpload.name}`
          : `\nFile: ${fileName}`;

        toastRef.current.show({
          severity: "success",
          summary: lang === "en" ? "Success" : "सफलता",
          detail:
            lang === "en"
              ? `Prescription uploaded successfully and selected automatically!${compressionMessage}${fileNameInfo}`
              : `पर्चा सफलतापूर्वक अपलोड हो गया है और स्वचालित रूप से चुना गया है!${compressionMessage}${fileNameInfo}`,
          life: 4000,
        });

        // First update the local state
        setPrescriptionFiles((prevFiles) => [
          {
            ...response?.data?.data,
            fileUrl: response.data?.data?.fileUrl,
          },
          ...prevFiles,
        ]);

        // Automatically select the newly uploaded prescription
        onChange(response.data.data);
        console.log(response.data.data, "response.data.data");
        isFileSelected(response.data.data);
        // Finally refresh the list from server
        await fetchPrescriptions();
      }
    } catch (error) {
      console.error("Error uploading prescription:", error);
      // Show error toast
      toastRef.current.show({
        severity: "error",
        summary: lang === "en" ? "Error" : "त्रुटि",
        detail:
          lang === "en"
            ? "Failed to upload prescription. Please try again."
            : "पर्चा अपलोड करने में विफल। कृपया पुनः प्रयास करें।",
        life: 3000,
      });
    } finally {
      setUploading(false);
      setCompressing(false);
      setUploadProgress("");
      setCompressionProgress(0);
    }
  };

  const isFileSelected = (file) => {
    if (!value) return false;
    return (
      (value._id && file._id && value._id === file._id) ||
      (value.url && file.url && value.url === file.url) ||
      (value.fileUrl && file.fileUrl && value.fileUrl === file.fileUrl)
    );
  };

  const handleFileClick = (file) => {
    if (isFileSelected(file)) {
      onChange(null);
    } else {
      console.log(file, "filevaluee");
      onChange(file);
    }
  };

  const { lang } = useContext(AccountContext);

  return (
    <div>
      <Toast ref={toastRef} />
      <div style={{ marginBottom: 8 }}>
        {lang == "en"
          ? English.SelectOrUploadPrescription
          : Hindi.SelectOrUploadPrescription}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxHeight: 180,
          overflowY: "auto",
        }}
      >
        {loading ? (
          <div>{lang == "en" ? "Loading..." : "लोडिंग..."}</div>
        ) : prescriptionFiles.length === 0 ? (
          <div>
            {lang == "en"
              ? English.NoPrescriptionsFound
              : Hindi.NoPrescriptionsFound}
          </div>
        ) : (
          prescriptionFiles.map((file, idx) => (
            <div
              key={file._id || file.fileUrl || idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                border: isFileSelected(file)
                  ? "2px solid #6190e8"
                  : "1px solid #e3e8ee",
                borderRadius: 8,
                padding: 6,
                background: isFileSelected(file) ? "#eaf1fb" : "#fff",
                minHeight: 48,
              }}
              onClick={() => handleFileClick(file)}
            >
              {file.fileFormat?.startsWith("image") ? (
                <img
                  src={file.fileUrl}
                  alt={file.fileName}
                  style={{
                    width: 56, // increased size
                    height: 56,
                    objectFit: "cover",
                    borderRadius: 4,
                    border: "1px solid #e3e8ee",
                  }}
                />
              ) : (
                <i
                  className="pi pi-file-pdf"
                  style={{ fontSize: 32, color: "#e57373" }} // slightly bigger icon for consistency
                ></i>
              )}
              <span
                style={{
                  flex: 1,
                  fontSize: 13,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 120, // limit width for ellipsis
                }}
              >
                {/* Show only first 15 chars, then ... if longer */}
                {(file.fileName || file.fileUrl?.split("/").pop() || "")
                  .replace(/\.[^/.]+$/, "") // remove extension for display
                  .slice(0, 15)}
                {(file.fileName || file.fileUrl?.split("/").pop() || "")
                  .length > 15
                  ? "..."
                  : ""}
              </span>
              {isFileSelected(file) && (
                <i
                  className="pi pi-check-circle"
                  style={{ color: "#6190e8", fontSize: 16 }}
                ></i>
              )}
            </div>
          ))
        )}
      </div>
      <div style={{ marginTop: 10 }}>
        <input
          type="file"
          accept="image/*,application/pdf"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleUpload}
          disabled={uploading}
        />
        <Button
          label={
            uploading
              ? uploadProgress ||
                (lang == "en" ? English.Uploading : Hindi.Uploading)
              : lang == "en"
              ? English.UploadNew
              : Hindi.UploadNew
          }
          icon={
            uploading
              ? compressing
                ? "pi pi-spin pi-spinner"
                : "pi pi-upload"
              : "pi pi-upload"
          }
          className="p-button-sm"
          disabled={uploading}
          loading={uploading}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          style={{
            minWidth: uploading ? "140px" : "auto",
            position: "relative",
          }}
        />
        {uploading && (
          <div
            style={{
              marginTop: 8,
              padding: "8px 12px",
              background: "#e3f2fd",
              borderRadius: "6px",
              border: "1px solid #2196f3",
              fontSize: "12px",
              color: "#1976d2",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: compressing ? "6px" : "0",
              }}
            >
              <i
                className="pi pi-spin pi-spinner"
                style={{ fontSize: "14px" }}
              ></i>
              <span>{uploadProgress}</span>
            </div>
            {compressing && compressionProgress > 0 && (
              <div
                style={{
                  width: "100%",
                  background: "#e0e0e0",
                  borderRadius: "4px",
                  overflow: "hidden",
                  marginTop: "4px",
                }}
              >
                <div
                  style={{
                    width: `${compressionProgress}%`,
                    height: "4px",
                    background: "linear-gradient(90deg, #2196f3, #1976d2)",
                    transition: "width 0.3s ease",
                  }}
                ></div>
              </div>
            )}
          </div>
        )}
        <div
          style={{
            marginTop: 8,
            fontSize: "12px",
            color: "#666",
            fontStyle: "italic",
          }}
        >
          {lang === "en"
            ? "💡 Large images (>5MB) will be automatically compressed for faster upload"
            : "💡 बड़ी छवियां (>5MB) तेज़ अपलोड के लिए स्वचालित रूप से संपीड़ित की जाएंगी"}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionSelector;
