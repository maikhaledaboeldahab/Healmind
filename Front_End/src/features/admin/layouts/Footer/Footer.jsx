import styles from './Footer.module.css'

function Footer() {
  return (
    <footer className={styles.footer}>
      <span>© {new Date().getFullYear()} HealMind. All rights reserved.</span>
      <span>Admin Dashboard v1.0.0</span>
    </footer>
  )
}

export default Footer
