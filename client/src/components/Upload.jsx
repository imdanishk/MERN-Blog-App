import { IKContext, IKUpload } from "imagekitio-react";
import { useRef } from "react";

const Upload = ({ children, type }) => {
  const ref = useRef(null);

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
    >
      <IKUpload
        useUniqueFileName
        className="hidden"
        ref={ref}
        accept={`${type}/*`}
      />
      <div className="cursor-pointer" onClick={() => ref.current.click()}>
        {children}
      </div>
    </IKContext>
  );
};

export default Upload;
