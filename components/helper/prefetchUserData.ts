import firebaseClientConfig from "../../firebaseClientConfig";

interface idData {
  access_token: string,
  expires_in: string,
  token_type: string,
  refresh_token:  string,
  id_token: string,
  user_id: string,
  project_id: string,
}

export default async function getUserData(
  idToken: string
): Promise<idData> {
  if (idToken) {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseClientConfig.apiKey}`,
      {
        method: "POST",
        body: JSON.stringify({idToken: idToken}),
        headers: {
          "Content-Type": "application/json",
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
