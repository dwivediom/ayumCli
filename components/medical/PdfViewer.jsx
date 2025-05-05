import React, { useEffect, useRef, useState } from 'react';

// Dynamically load pdfjsLib from CDN
const PDFJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.2/pdf.min.js';
const PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.2/pdf.worker.min.js';

const PdfViewer = ({ url }) => {
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(60); // percent
  const pagesRef = useRef();
  const pdfDocRef = useRef();

  // Load pdf.js script
  useEffect(() => {
    if (!window.pdfjsLib) {
      const script = document.createElement('script');
      script.src = PDFJS_CDN;
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
        renderPdf();
      };
      document.body.appendChild(script);
      return () => document.body.removeChild(script);
    } else {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
      renderPdf();
    }
    // eslint-disable-next-line
  }, [url]);

  // Re-render on zoom
  useEffect(() => {
    if (pdfDocRef.current) {
      renderPages(pdfDocRef.current);
    }
    // eslint-disable-next-line
  }, [zoom]);

  const renderPdf = () => {
    setLoading(true);
    setError(null);
    if (!url) return;
    fetch(url)
      .then(res => res.arrayBuffer())
      .then(buffer => {
        window.pdfjsLib.getDocument(new Uint8Array(buffer)).promise.then(pdfDoc => {
          pdfDocRef.current = pdfDoc;
          setNumPages(pdfDoc.numPages);
          renderPages(pdfDoc);
        }).catch(err => {
          setError('Failed to load PDF');
          setLoading(false);
        });
      })
      .catch(() => {
        setError('Failed to fetch PDF');
        setLoading(false);
      });
  };

  const renderPages = (pdfDoc) => {
    if (!pagesRef.current) return;
    pagesRef.current.innerHTML = '';
    setLoading(true);
    const promises = [];
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      promises.push(
        pdfDoc.getPage(i).then(page => {
          const viewport = page.getViewport(zoom / 100);
          const canvas = document.createElement('canvas');
          canvas.className = 'page';
          canvas.title = `Page ${i}`;
          canvas.style.margin = '10px auto';
          canvas.style.display = 'block';
          canvas.style.boxShadow = '0px 0px 5px #000';
          canvas.style.transition = 'all 1s ease, width 0.2s ease';
          canvas.style.width = `${zoom}%`;
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise.then(() => {});
          pagesRef.current.appendChild(canvas);
        })
      );
    }
    Promise.all(promises).then(() => setLoading(false));
  };

  const zoomIn = () => setZoom(z => Math.min(z + 10, 150));
  const zoomOut = () => setZoom(z => Math.max(z - 10, 20));
  const zoomReset = () => setZoom(60);

  return (
    <div style={{ background: '#404040', color: '#fff', padding: 12, borderRadius: 8 }}>
      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={zoomIn} style={{ padding: '4px 10px', borderRadius: 4 }}>Zoom In</button>
        <div id="zoom-percent" style={{ minWidth: 32, textAlign: 'center' }}>{zoom}%</div>
        <button onClick={zoomOut} style={{ padding: '4px 10px', borderRadius: 4 }}>Zoom Out</button>
        <button onClick={zoomReset} style={{ padding: '4px 10px', borderRadius: 4 }}>Reset Zoom</button>
        <span style={{ marginLeft: 'auto', fontSize: 13 }}>{numPages ? `Pages: ${numPages}` : ''}</span>
      </div>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      {loading && <div style={{ textAlign: 'center', margin: 16 }}>Loading PDF...</div>}
      <div id="pages" ref={pagesRef} style={{ textAlign: 'center', minHeight: 40 }} />
    </div>
  );
};

export default PdfViewer; 