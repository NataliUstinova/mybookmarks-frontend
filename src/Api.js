const airtableKey = process.env.REACT_APP_AIRTABLE_API;
const Authorization = `Bearer ${airtableKey}`

class AirtableApi {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  async _checkServerResponse(res) {
    const result = await res.json();
    return res.ok ? result.records : Promise.reject(result.message);
  }

  //user
  getData() {
    return fetch(`${this._baseUrl}/Bookmarks`, {
      method: "GET",
      headers: this._headers,
    }).then(this._checkServerResponse);
  }
}

const api = new AirtableApi({
  baseUrl: "https://api.airtable.com/v0/appFReskGDPmPBWwu",
  headers: {
    Accept: "application/json",
    'Authorization': Authorization,
    "Content-Type": "application/json",
  },
});

export default api