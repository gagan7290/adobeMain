import React, { useState, useCallback, useEffect, useRef } from 'react';
import styles from './UploadPdf.module.css';
import hotAirBaloon from "../../assets/images/hotAirBaloon.webp"
import skyline from "../../assets/images/skyline.webp"
import cloud from "../../assets/images/cloud1.webp"
import cloudAtBack from "../../assets/images/cloudback.webp"
import moon from "../../assets/images/mooon.webp"


const Icon = ({ path, className = '' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={path}></path>
    </svg>
);

// Animated background component
const AnimatedBackground = () => (
    <div className={styles.uploadCardImages}>
        <img src={cloud} alt="" />
        <img src={cloudAtBack} alt="" />
    </div>
);

// File Item Component
const FileListItem = ({ file }) => {
    const statusIcon = () => {
        if (file.status === 'success') {
            return <Icon className={`${styles.statusIcon} ${styles.success}`} path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />;
        }
        if (file.status === 'error') {
            return <Icon className={`${styles.statusIcon} ${styles.error}`} path="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />;
        }
        return <div className={styles.statusIcon}></div>; // Placeholder
    };

    return (
        <li className={styles.fileItem}>
            <Icon className={styles.fileIcon} path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            <div className={styles.fileDetails}>
                <p className={styles.fileName}>{file.file.name}</p>
                <div className={styles.progressBarContainer}>
                    <div className={styles.progressBar} style={{ width: `${file.progress}%` }}></div>
                </div>
            </div>
            {statusIcon()}
        </li>
    );
};

// --- Main App Component ---
export default function App() {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const activeIntervals = {};

        const simulateUpload = (fileToUpload) => {
            if (activeIntervals[fileToUpload.id]) return;

            activeIntervals[fileToUpload.id] = setInterval(() => {
                setFiles(currentFiles => {
                    const targetFile = currentFiles.find(f => f.id === fileToUpload.id);
                    if (!targetFile || targetFile.progress >= 100) {
                        clearInterval(activeIntervals[fileToUpload.id]);
                        delete activeIntervals[fileToUpload.id];
                        return currentFiles;
                    }

                    return currentFiles.map(f => {
                        if (f.id === fileToUpload.id) {
                            const newProgress = f.progress + Math.random() * 15;
                            const isComplete = newProgress >= 100;
                            return {
                                ...f,
                                progress: Math.min(newProgress, 100),
                                status: isComplete ? 'success' : 'uploading',
                            };
                        }
                        return f;
                    });
                });
            }, 200);
        };

        files.filter(f => f.status === 'uploading' && f.progress < 100).forEach(simulateUpload);

        return () => {
            Object.values(activeIntervals).forEach(clearInterval);
        };
    }, [files]);

    const handleFiles = useCallback((incomingFiles) => {
        const newFiles = [...incomingFiles].map(file => ({
            id: `${file.name}-${file.size}-${Date.now()}`,
            file,
            progress: 0,
            status: file.type === 'application/pdf' ? 'uploading' : 'error',
            error: file.type !== 'application/pdf' ? 'Invalid file type' : null,
        }));
        setFiles(currentFiles => [...currentFiles, ...newFiles]);
    }, []);

    const handleDragEvents = useCallback((handler) => (e) => {
        e.preventDefault();
        e.stopPropagation();
        handler(e);
    }, []);

    const onBrowseClick = () => fileInputRef.current.click();
    
    const onFileSelect = (e) => {
        handleFiles(e.target.files);
        e.target.value = '';
    };

    const resetUploader = () => setFiles([]);

    return (
        <div className={styles.uploadCard}>
            <AnimatedBackground />
            <input
                type="file"
                ref={fileInputRef}
                onChange={onFileSelect}
                accept="application/pdf"
                multiple
                style={{ display: 'none' }}
            />

            {files.length === 0 ? (
                <div
                    className={`${styles.dropZone} ${isDragging ? styles.dragover : ''}`}
                    onDragEnter={handleDragEvents(() => setIsDragging(true))}
                    onDragOver={handleDragEvents(() => setIsDragging(true))}
                    onDragLeave={handleDragEvents(() => setIsDragging(false))}
                    onDrop={handleDragEvents((e) => {
                        setIsDragging(false);
                        handleFiles(e.dataTransfer.files);
                    })}
                >
                    <Icon className={styles.dropZoneIcon} path="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    <p>Drag & Drop your PDFs here</p>
                    <p className={styles.orText}>or</p>
                    <button onClick={onBrowseClick} className={styles.browseBtn}>Browse Files</button>
                </div>
            ) : (
                <div className={styles.fileListContainer}>
                    <div className={styles.fileListHeader}>
                        <h2>Uploading Files</h2>
                        <button onClick={resetUploader} className={styles.clearAllBtn}>Clear All</button>
                    </div>
                    <ul className={styles.fileList}>
                        {files.map(file => <FileListItem key={file.id} file={file} />)}
                    </ul>
                </div>
            )}
        </div>
    );
}
