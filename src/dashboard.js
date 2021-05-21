import { useEffect, useState } from "react";
import "./App.css";
const getCenters = (district,date) => fetch(
  "https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id="+district+"&date="+date
)
  .then((data) => data.json())
  .then((data) => data);

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

const Dashboard = ({ districtId, title }) => {
  const [retryMsg, setRetryMessage] = useState('');
  const [centers, setCenters] = useState([]);
  const [available, setAvailability] = useState(0);
  const [centerDetails, setCenterDetails] = useState([]);

  const today = (new Date()).toLocaleDateString().split("/").join("-");
  //console.log(today)
  
  const callCowin = () => getCenters(districtId,today).then(data => {
    setTimeout(() => setRetryMessage(''), 2000)
    setAvailability(0);
    setCenterDetails([]);
    const ct18p = [];
    data && data.centers.forEach((ct) => {
      const isTargetCenter =
        ct.sessions?.length > 0 &&
        ct.sessions.filter((session) => {
          if (
            session.min_age_limit === 18 &&
            session.available_capacity_dose1 > 0
          ) {
            setAvailability(session.available_capacity_dose1);
            const center = {
              name: ct.name,
              pin: ct.pincode,
              date: session.date,
              available: session.available_capacity_dose1
            };
            const addCenter = [...centerDetails];
            addCenter.push(center);
            setCenterDetails(addCenter);
            //bookSlot(ct.center_id,session.session_id)
            console.log(`Center id: ${ct.center_id} Session id: ${session.session_id}`,session);
            //alert("Hurry! Slots available", addCenter);
          }
          return session.min_age_limit === 18;
        });
      if (isTargetCenter.length > 0) {
        ct18p.push(ct);
      }
    });
    //console.log(ct18p);
    setCenters(ct18p);
  });


  useEffect(() => {
    callCowin();
    setInterval(() => {
      //console.log("called")
      setRetryMessage('Checking for slots (20s)...');
      callCowin();
    }, 20000);
  }, []);

  return (
    <div>
      <div className="App">
      <h2>{title}</h2>
      {retryMsg && <h3 className="blue">{retryMsg}</h3>}
      {available > 0 && <div className="green">Available slots: {available}</div>}
      <br />
      {centerDetails &&
        centerDetails.length > 0 &&
        centerDetails.map((elm) => (
          <>
            <div className="center-container">
              <label>Center Name:</label>
              <div>{elm.name || "NA"} </div>
            </div>

            <div className="center-container">
              <label>Pin:</label>
              <div>{elm.pin || "NA"} </div>
            </div>

            <div className="center-container">
              <label>Date:</label>
              <div>{elm.date || "NA"} </div>
            </div>

            <div className="center-container">
              <label>Available:</label>
              <div>{elm.available || "NA"} </div>
            </div>
          </>
        ))}
        <br /><br />
      {centers &&
        centers.length > 0 &&
        centers.map((el) => (
          <div className="center-container">
            <div className="name">{el.name}</div>
            <div className="pin">{el.pincode}</div>
          </div>
        ))}
    </div>
    </div>
  );
}

export default Dashboard;