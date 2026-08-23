import styles from "./DoctorFooter.module.css";

const Footer = ({
  year = new Date().getFullYear(),
  appName = "HealMind",
}) => {
  return (
    <footer
      className={`${styles.footer} d-flex align-items-center justify-content-center`}
    >
      <span>
        © {year} {appName}. All Rights Reserved
      </span>
    </footer>
  );
};

export default Footer;
