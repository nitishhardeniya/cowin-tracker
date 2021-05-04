import { useEffect, useState } from "react";
import "./App.css";

const getCenters = fetch(
  "https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=294&date=04-05-2021"
)
  .then((data) => data.json())
  .then((data) => data);

setInterval(() => {
  window.location.reload();
}, 30000);

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
              alert("New slots available");
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
