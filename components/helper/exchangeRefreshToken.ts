import firebaseClientConfig from "../../firebaseClientConfig";

interface returnData {
  expires_in: string;
  token_type: string;
  refresh_token: string;
  id_token: string;
  user_id: string;
  project_id: string;
}

export default async function exchangeRefreshToken(
  refreshToken: string
): Promise<returnData> {
  if (refreshToken) {
    const res = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${firebaseClientConfig.apiKey}`,
      {
        method: "POST",
        body: new URLSearchParams(
          `grant_type=refresh_token&refresh_token=${refreshToken}`
        ),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    ).then(async (res) => {
      if (res.ok) {
        return res.json();
      } else {
        return res.json().then((data) => {
          let errorMessage = "Refetch Token failed.";
          if (data && data.error && data.error.message) {
            errorMessage = data.error.message;
          }
          throw new Error(errorMessage);
        });
      }
    });
    return res;
  } else {
    throw new Error("Refresh token invalid.");
  }
}
