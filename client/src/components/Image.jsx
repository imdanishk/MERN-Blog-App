import { IKImage } from "imagekitio-react";

const Image = ({ src, className, w, h, alt }) => {
  const isFullUrl = src.startsWith("http");

  return (
    <IKImage
      urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
      {...(isFullUrl ? { src } : { path: src })}
      className={className}
      loading="lazy"
      lqip={{ active: true, quality: 20 }}
      alt={alt}
      width={w}
      height={h}
      transformation={[
        {
          width: w,
          height: h,
        },
      ]}
    />
  );
};

export default Image;
