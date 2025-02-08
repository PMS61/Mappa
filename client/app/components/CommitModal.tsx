import { useEffect, useRef } from "react";
import styles from "./CommitModal.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCommit: (message: string) => void;
};

export function CommitModal({ isOpen, onClose, onCommit }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = textareaRef.current?.value.trim();
    if (message) {
      onCommit(message);
      onClose();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Commit Changes</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            placeholder="Write your commit message..."
            required
          />
          <div className={styles.buttons}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.commitButton}>
              Commit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
