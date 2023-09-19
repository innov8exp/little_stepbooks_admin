import { useState, useEffect } from "react";
import { message } from "antd";
import HttpStatus from "http-status-codes";
import axios from "./network";

const useFetch = function useFetch(url, deps) {
  const [loading, setLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState();
  const [error, setError] = useState();
  useEffect(() => {
    console.log(
      `sending a http request to URL: ${axios.defaults.baseURL}${url}`
    );
    setLoading(true);
    axios
      .get(url)
      .then((res) => {
        if (res && res.status === HttpStatus.OK) {
          setFetchedData(res.data);
          console.log(res.data);
        }
      })
      .catch((err) => {
        console.error("error message: ", err);
        setError(err);
        message.error(`操作失败，原因：${err.response?.data?.message}`);
      })
      .then(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...(deps || [])]);
  return { loading, fetchedData, error };
};

export default useFetch;
