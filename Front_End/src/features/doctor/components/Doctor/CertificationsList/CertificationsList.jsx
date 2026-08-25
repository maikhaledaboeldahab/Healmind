import styles from "./CertificationsList.module.css";

// Props:
// certifications  -> array of { id, name, issueDate, docId, fileUrl, issuer, fileName }
// onViewDocument  -> callback when "View Document" is clicked
const CertificationsList = ({ certifications = [], onViewDocument }) => {
  return (
    <div className={`${styles.card} p-3 p-md-4 mb-4`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className={styles.title}>Professional Certifications</h4>
      </div>

      {certifications.length === 0 ? (
        <div className={styles.emptyState}>
          <i className="fa-regular fa-file-lines fa-2x mb-2"></i>
          <p>No certifications uploaded yet.</p>
        </div>
      ) : (
        certifications.map((cert) => (
          <div key={cert.id} className={styles.certRow}>
            <div className={styles.certIcon}>
              <i className="fa-solid fa-certificate"></i>
            </div>

            <div className="flex-grow-1">
              <p className={styles.certName}>{cert.name}</p>
              <p className={styles.certMeta}>
                Issued: {cert.issueDate} • ID: {cert.docId}
              </p>
            </div>

            <button
              type="button"
              className={styles.viewBtn}
              onClick={() => onViewDocument && onViewDocument(cert)}
            >
              <i className="fa-solid fa-eye me-1"></i> View Document
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default CertificationsList;