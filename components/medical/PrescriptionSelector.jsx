import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext,
} from "react";
import { Button } from "primereact/button";
import axios from "axios";
import { AccountContext } from "../../context/AccountProvider";
import English from "../../public/locales/en/index";
import Hindi from "../../public/locales/hi/index";
const PrescriptionSelector = ({ value, onChange, getAuthHeaders }) => {
  const [prescriptionFiles, setPrescriptionFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

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
      if (response.data && response.data.url) {
        // First update the local state
        setPrescriptionFiles((prevFiles) => [response.data, ...prevFiles]);
        // Then notify parent of the new selection
        onChange(response.data);
        // Finally refresh the list from server
        await fetchPrescriptions();
      }
    } catch (error) {
      console.error("Error uploading prescription:", error);
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
                  src={file.fileUrl || file.url}
                  alt={file.fileName}
                  style={{
                    width: 38,
                    height: 38,
                    objectFit: "cover",
                    borderRadius: 4,
                    border: "1px solid #e3e8ee",
                  }}
                />
              ) : (
                <i
                  className="pi pi-file-pdf"
                  style={{ fontSize: 24, color: "#e57373" }}
                ></i>
              )}
              <span
                style={{
                  flex: 1,
                  fontSize: 12,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {file.fileName || file.fileUrl?.split("/").pop()}
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
