import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MDBInput, MDBBtn } from "mdb-react-ui-kit";

export default function CreatePost() {
  const [cityData, setCityData] = useState("");
  const [specialtyData, setSpecialtyData] = useState("");
  const [wagesData, setWagesData] = useState("");
  const [yoeData, setYoeData] = useState("");

  const onCityChange = (e) => setCityData(e.target.value);
  const onSpecialtyChange = (e) => setSpecialtyData(e.target.value);
  const onWagesChange = (e) => setWagesData(e.target.value);
  const onYoeChange = (e) => setYoeData(e.target.value);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    let token = localStorage.getItem("token");
    let user_id = localStorage.getItem("user_id");

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Access-Control-Allow-Origin", "*");

    fetch("http://127.0.0.1:5000/form", {
      mode: "cors",
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        city: cityData,
        specialty: specialtyData,
        wages: Number(wagesData),
        yoe: Number(yoeData),
        user_id: Number(user_id),
      }),
    })
      .then((res) => {
        if (res.ok) {
          navigate("/");
        }
      })
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <h3 className="text-center mt-4">Add Your Salary</h3>
      <div className="d-flex justify-content-center">
        <form>
          <MDBInput
            className="mt-4"
            id="location"
            label="Location"
            onChange={onCityChange}
            value={cityData}
          />

          <MDBInput
            className="mt-4"
            id="specialty"
            label="Specialty"
            onChange={onSpecialtyChange}
            value={specialtyData}
          />

          <MDBInput
            className="mt-4"
            id="yoe"
            label="Years of Experience"
            onChange={onYoeChange}
            value={yoeData}
          />

          <MDBInput
            className="mt-4"
            id="pay"
            label="Hourly Pay"
            onChange={onWagesChange}
            value={wagesData}
          />

          <MDBBtn
            type="submit"
            className="mt-4 btn-dark"
            style={{ width: "30rem" }}
            onClick={handleSubmit}
            block
          >
            Submit
          </MDBBtn>
        </form>
      </div>
    </>
  );
}
