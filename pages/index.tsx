import axios from "axios";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import Loader from "../Components/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const handleDownload = (url: string) => {
  const tag = document.createElement("a");
  tag.href = url;
  tag.download = url?.slice(8) + ".mp4";
  tag.target = "_blank";
  tag.click();
};
export default function Home() {
  const [url, setUrl] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchVideoUrl = async () => {
    try {
      setIsLoading(true);
      const { data, status } = await axios.post(
        "/api/download",
        { url },
        { headers: { "Content-Type": "application/json" } }
      );
      if (status === 200 && data.status && data.downloadLink?.length > 0) {
        setDownloadLink(data.downloadLink[0]);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setDownloadLink("");
        toast.error(data?.message, {
          position: "top-right",
        });
      }
    } catch (error) {
      setIsLoading(false);
      setDownloadLink("");
      toast.error("Unable to find this reel", {
        position: "top-right",
        theme: "dark",
      });
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <main className={styles.main}>
        <h1 className={styles.title}>Instagram Reel Downloader</h1>

        <div className={styles.serachContainer}>
          <input value={url} onChange={(e) => setUrl(e.target.value)} />
          {url && (
            <img
              onClick={() => {
                setUrl("");
                setDownloadLink("");
              }}
              src="/close.svg"
              height={10}
              width={10}
              className={styles.closeImage}
            />
          )}
          <button
            onClick={() => {
              if (url) {
                fetchVideoUrl();
              }
            }}
          >
            Search
          </button>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          downloadLink &&
          url && (
            <>
              <button
                onClick={() => url && handleDownload(downloadLink)}
                className={styles.downloadButton}
              >
                Download
              </button>
            </>
          )
        )}
        <div></div>
      </main>
    </div>
  );
}
