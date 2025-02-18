import axios from "axios";

export const FetchAllData = async (path: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACK_URI}/api/${path}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching all data from ${path}`, error);
    throw error;
  }
};

export const FetchDataById = async (path: string, id: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACK_URI}/api/${path}/${id}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching all data from ${path}`, error);
    throw error;
  }
};
