import styles from "./Feed.module.css";

interface Props {
  children?: React.ReactNode;
  className?: string
}

const Feed: React.FC<Props> = ({children, className }: Props) => {
  return (
    <div className={`${styles.feed} ${className}`}>
      {children}
    </div>
  );
};

export default Feed;
