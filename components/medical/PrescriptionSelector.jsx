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

const PrescriptionSelector = ({ value, onChange, getAuthHeaders }) => {
  const [prescriptionFiles, setPrescriptionFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
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
        // Show success toast
        toastRef.current.show({
          severity: "success",
          summary: lang === "en" ? "Success" : "सफलता",
          detail:
            lang === "en"
              ? "Prescription uploaded successfully and selected automatically!"
              : "पर्चा सफलतापूर्वक अपलोड हो गया है और स्वचालित रूप से चुना गया है!",
          life: 3000,
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
          <div>{lang == "en" ? English.Loading : Hindi.Loading}</div>
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
              ? lang == "en"
                ? English.Uploading
                : Hindi.Uploading
              : lang == "en"
              ? English.UploadNew
              : Hindi.UploadNew
          }
          icon="pi pi-upload"
          className="p-button-sm"
          disabled={uploading}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        />
      </div>
    </div>
  );
};

export default PrescriptionSelector;
