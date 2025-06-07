import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import styles from './styles.module.css';

const ShareDialog = ({ visible, onHide, ayumUserName }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://ayum.in/medical-store/${ayumUserName}`;
  const whatsappUrl = `https://wa.me/?text=Check out this medical store on Ayum: ${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    window.open(whatsappUrl, '_blank');
  };

  const footer = (
    <div>
      <Button 
        label="Close" 
        icon="pi pi-times" 
        onClick={onHide} 
        className="p-button-text" 
      />
    </div>
  );

  return (
    <Dialog
      header="Share Store"
      visible={visible}
      style={{ width: '90vw', maxWidth: '500px' }}
      onHide={onHide}
      footer={footer}
    >
      <div className={styles.shareDialog}>
        <div className={styles.shareUrl}>
          <InputText 
            value={shareUrl} 
            readOnly 
            className={styles.urlInput}
          />
          <Button
            icon={copied ? "pi pi-check" : "pi pi-copy"}
            label={copied ? "Copied!" : "Copy"}
            onClick={handleCopy}
            className={styles.copyButton}
          />
        </div>

        <div className={styles.shareButtons}>
          <Button
            icon="pi pi-whatsapp"
            label="Share on WhatsApp"
            onClick={handleWhatsAppShare}
            className="p-button-success"
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default ShareDialog; 