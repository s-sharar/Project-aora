import React from "react";
import { Alert } from "react-native";

const useAppwrite = (fn) => {
    const [data, setData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const fetchData = async () => {
        setIsLoading(true);
        try {
          const res = await fn();
          setData(res);
        } catch(err) {
          Alert.alert('Error', err.message)
        } finally {
          setIsLoading(false);
        }
      }
    React.useEffect(() => {
      fetchData();
    }, [])

    const refetch = () => fetchData();

    return { data, isLoading, refetch };
}

export default useAppwrite;