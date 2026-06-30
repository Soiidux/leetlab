import config from "../backendConfig.js";
import axios from "axios";

export const getJudge0LangId = async (language: string) => {
  const languageMap : Record<string, number> = {
    JAVA: 62,
    PYTHON: 71,
    JAVASCRIPT: 63,
  }
  return languageMap[language.toUpperCase()];
};

export const submitBatch = async (submissions: any[]) => {
  const { data } = await axios.post(`${config.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`, {
    submissions: submissions,
  });
  return data; // {{token},{token},{token}}
};

export const pollBatchResults = async (tokens: string[]) => {
  while (true) {
    const { data } = await axios.get(`${config.JUDGE0_API_URL}/submissions/batch`, {
      params: { tokens: tokens.join(",") , base64_encoded: false},
    });

    const results = data.submissions;
    //@ts-ignore
    const isAllDone = results.every((result) => result.status.id !== 1 && result.status.id !== 2);
    if(isAllDone) {
      return results;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};
