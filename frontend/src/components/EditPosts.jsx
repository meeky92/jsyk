import React, { useEffect, useState } from "react";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBInput,
} from "mdb-react-ui-kit";
import { useRouteLoaderData } from "react-router-dom";

export default function EditPosts() {
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editPostData, setEditPostData] = useState();

  const [cityData, setCityData] = useState("");
  const [specialtyData, setSpecialtyData] = useState("");
  const [wagesData, setWagesData] = useState("");
  const [yoeData, setYoeData] = useState("");

  const onCityChange = (e) => setCityData(e.target.value);
  const onSpecialtyChange = (e) => setSpecialtyData(e.target.value);
  const onWagesChange = (e) => setWagesData(e.target.value);
  const onYoeChange = (e) => setYoeData(e.target.value);

  const fetchData = () => {
    let token = localStorage.getItem("token");
    let user_id = localStorage.getItem("user_id");

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Access-Control-Allow-Origin", "*");

    fetch("http://127.0.0.1:5000/user_posts", {
      mode: "cors",
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        user_id: Number(user_id),
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setData(data);
        console.log(data);
      });
  };

  const handleDelete = (e) => {
    let token = localStorage.getItem("token");
    let post_id = e.target.value;
    console.log(post_id);

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Access-Control-Allow-Origin", "*");

    fetch("http://127.0.0.1:5000/delete_post", {
      mode: "cors",
      method: "DELETE",
      headers: myHeaders,
      body: JSON.stringify({
        post_id: Number(post_id),
      }),
    }).then((response) => {
      console.log(response);
      fetchData();
    });
  };

  const handleEdit = (e) => {
    setEditPostData(data.find((row) => row["id"] == e.target.value));
    setCityData(editPostData["city"]);
    setSpecialtyData(editPostData["specialty"]);
    setWagesData(editPostData["wages"]);
    setYoeData(editPostData["years_of_experience"]);
    setEditMode((edit) => !edit);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let token = localStorage.getItem("token");
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Access-Control-Allow-Origin", "*");

    fetch("http://127.0.0.1:5000/edit_post", {
      mode: "cors",
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        city: cityData,
        specialty: specialtyData,
        wages: Number(wagesData),
        yoe: Number(yoeData),
        post_id: Number(editPostData['id']),
      }),
    })
      .then((res) => {
        console.log(res);
        fetchData();
      })
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
    
    setEditMode(false);
    setCityData("");
    setSpecialtyData("");
    setWagesData("");
    setYoeData("");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="container mt-4">
        <h4>Your Posts</h4>
      </div>
      <>
        {editMode ? (
          <>
            <h3 className="text-center mt-4">Edit Post</h3>
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
        ) : (
          <></>
        )}

        <MDBTable striped hover align="middle">
          <MDBTableHead>
            <tr>
              <th scope="col">Location</th>
              <th scope="col">Specialty</th>
              <th scope="col">Years of Experience</th>
              <th scope="col">Pay</th>
              <th scope="col">Actions</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            <>
              {data.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.city}</th>
                  <td>{row.specialty}</td>
                  <td>{row.years_of_experience}</td>
                  <td>${row.wages}/hr</td>
                  <td>
                    <MDBBtn
                      color="link"
                      onClick={(e) => handleEdit(e)}
                      value={row.id}
                      rounded
                      size="sm"
                    >
                      EDIT
                    </MDBBtn>
                    <MDBBtn
                      color="link"
                      onClick={(e) => handleDelete(e)}
                      value={row.id}
                      rounded
                      size="sm"
                    >
                      DELETE
                    </MDBBtn>
                  </td>
                </tr>
              ))}
            </>
          </MDBTableBody>
        </MDBTable>
      </>
    </>
  );
}
