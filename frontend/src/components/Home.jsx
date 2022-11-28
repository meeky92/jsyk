import React, { useEffect, useState } from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

export default function DataTable() {
  const [data, setData] = useState([]);

  const fetchData = () => {
    fetch("http://127.0.0.1:5000", {
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setData(data);
        console.log(data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <>
    <div className="container mt-4">
      <h4>Recent Submissions</h4>
    </div>
      <>
      <MDBTable striped hover align="middle">
        <MDBTableHead>
          <tr>
            <th scope='col'>Location</th>
            <th scope='col'>Specialty</th>
            <th scope='col'>Years of Experience</th>
            <th scope='col'>Pay</th>
            {/* <th scope='col'>Action</th> */}
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          <>
          {data.map((row) => (
            <tr key={row.id}>
              <th scope='row'>{ row.city }</th>
              <td>{ row.specialty }</td>
              <td>{ row.years_of_experience }</td>
              <td>${ row.wages }/hr</td>
            </tr>
          ))}
          </>
        </MDBTableBody>
      </MDBTable>
      </>  
    </>  
  );

}