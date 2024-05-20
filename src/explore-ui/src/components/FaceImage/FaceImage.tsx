import { ImageUrl } from "../../lib/Scans";
import "./FaceImage.styles.scss";

type FaceImageProps = {
  src: ImageUrl;
  size?: "small" | "medium" | "large";
  title?: string;
  rounded?: boolean;
  relative?: boolean;
};

const FaceImage = (props: FaceImageProps) => {
  const { size, src, title, rounded, relative } = props;

  const classes = ["FaceImage"];
  if (size) classes.push(size);
  if (relative) classes.push("relative");

  if (rounded) classes.push("rounded");

  return (
    <div
      title={title}
      className={classes.join(" ")}
      style={{ backgroundImage: `url('${src}')` }}
    />
  );
};

export default FaceImage;
