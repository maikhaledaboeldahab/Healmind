import styles from "./Skeleton.module.css";

// A single pulsing gray placeholder bar/circle, shown while real data loads.
// Props: width, height (any CSS size), circle (true for avatar placeholders)
const Skeleton = ({ width = "100%", height = "16px", circle = false }) => {
  return (
    <span
      className={styles.skeleton}
      style={{ width, height, borderRadius: circle ? "50%" : undefined }}
    ></span>
  );
};

export default Skeleton;