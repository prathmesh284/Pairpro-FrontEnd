import { useState } from 'react';
import styles from './file_exp.module.css';

export default function FileExp({
  sidebarWidth,
  files,
  selectedFile,
  onSelectFile,
  onAddFile,
  onRemoveFile,
  onRenameFile
}) {
  const [renamingIndex, setRenamingIndex] = useState(null);
  const [renameInput, setRenameInput] = useState("");

  const handleDoubleClick = (index, filename) => {
    setRenamingIndex(index);
    setRenameInput(filename);
  };

  const handleRename = (e, index) => {
    e.preventDefault();
    if (!renameInput.trim()) return;
    onRenameFile(index, renameInput.trim());
    setRenamingIndex(null);
  };

  return (
    <div style={{ width: `${sidebarWidth}%` }} className={styles.files}>
      <h2>File Explorer</h2>
      <div className={styles.divider}></div>
      <button className={styles.fileBtn} onClick={onAddFile}>➕ Add File</button>
      <button className={styles.fileBtn} onClick={onRemoveFile}>❌ Remove File</button>
      {files.map((filename, index) => (
        <div
          key={index}
          className={index === selectedFile ? styles.selectedFile : styles.file}
          onClick={() => onSelectFile(index)}
          onDoubleClick={() => handleDoubleClick(index, filename)}
        >
          {renamingIndex === index ? (
            <form onSubmit={(e) => handleRename(e, index)}>
              <input
                autoFocus
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                onBlur={(e) => handleRename(e, index)}
                className={styles.renameInput}
              />
            </form>
          ) : (
            filename
          )}
        </div>
      ))}

      <div className={styles.divider}></div>
    </div>
  );
}
