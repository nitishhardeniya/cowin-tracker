import { useEffect, useState } from "react";
import "./App.css";

const getCenters = fetch(
  "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=294&date=06-05-2021"
)
  .then((data) => data.json())
  .then((data) => data);

setInterval(() => {
  window.location.reload();
}, 30000);

const bookSlot = (centerId, sessionId) => fetch("https://cdn-api.co-vin.in/api/v2/appointment/schedule", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9",
    "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiI5NGU5YzMyMi01NThiLTRhMTEtOGJlNi1hZTU0ZjMzZWQwMjkiLCJ1c2VyX2lkIjoiOTRlOWMzMjItNTU4Yi00YTExLThiZTYtYWU1NGYzM2VkMDI5IiwidXNlcl90eXBlIjoiQkVORUZJQ0lBUlkiLCJtb2JpbGVfbnVtYmVyIjo5NjYzNTkyOTE2LCJiZW5lZmljaWFyeV9yZWZlcmVuY2VfaWQiOjExNTM1OTkyNDgwMzYwLCJ1YSI6Ik1vemlsbGEvNS4wIChNYWNpbnRvc2g7IEludGVsIE1hYyBPUyBYIDEwXzE1XzcpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS85MC4wLjQ0MzAuOTMgU2FmYXJpLzUzNy4zNiIsImRhdGVfbW9kaWZpZWQiOiIyMDIxLTA1LTA0VDE4OjAzOjQ5Ljc4MloiLCJpYXQiOjE2MjAxNTE0MjksImV4cCI6MTYyMDE1MjMyOX0.zjK1x6WN43mX2MNHSUwiFsJQFAW4cjMHSfYBsC9exvI",
    "content-type": "application/json",
    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site"
  },
  "referrer": "https://selfregistration.cowin.gov.in/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"center_id\":"+centerId+",\"session_id\":\""+sessionId+"\",\"beneficiaries\":[\"44201509464610\"],\"slot\":\"01:00PM-03:00PM\",\"dose\":1}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});

export default function App() {
  const [centers, setCenters] = useState([]);
  const [available, setAvailability] = useState(0);
  const [centerDetails, setCenterDetails] = useState([]);

  useEffect(() => {
    const allCenters = getCenters;
    allCenters.then((data) => {
      //console.log(data);
      const ct18p = [];
      data.centers.forEach((ct) => {
        const isTargetCenter =
          ct.sessions?.length > 0 &&
          ct.sessions.filter((session) => {
            if (
              session.min_age_limit === 18 &&
              session.available_capacity > 0
            ) {
              setAvailability(session.available_capacity);
              const center = {
                name: ct.name,
                pin: ct.pincode,
                date: session.date,
                available: session.available_capacity
              };
              const addCenter = [...centerDetails];
              addCenter.push(center);
              setCenterDetails(addCenter);
              bookSlot(ct.center_id,session.session_id)
              console.log(`Center id: ${ct.center_id} Session id: ${session.session_id}`);
              alert("Hurry! Slots available", addCenter);
            }
            return session.min_age_limit === 18;
          });
        if (isTargetCenter.length > 0) {
          ct18p.push(ct);
        }
      });
      console.log(ct18p);
      return setCenters(ct18p);
    });
  }, []);

  return (
    <div className="fl center">
      <div className="App">
      <h1>CoWin 18+ Tracker</h1>
      {centers &&
        centers.length > 0 &&
        centers.map((el) => (
          <div className="center-container">
            <div className="name">{el.name}</div>
            <div className="pin">{el.pincode}</div>
          </div>
        ))}
      <div className="green">Available slots: {available}</div>
      {centerDetails &&
        centerDetails.length > 0 &&
        centerDetails.map((elm) => (
          <div className="center-container">
            Center Name: {elm.name || "NA"} <br />
            Pin: {elm.pin || "NA"}
            Date: {elm.date || "NA"}
            Available: {elm.available || 0}
          </div>
        ))}
    </div>
    </div>
  );
}
