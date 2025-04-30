import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { removeUserLogged } from '../../auth';

const Number = () => {
  const navigate = useNavigate();
  const [luckyNumbers, setLuckyNumbers] = useState([]);

  const declareLuckyNumbers = async (e) => {
    e.preventDefault();
    const date = e.target.date.value;
    const time = e.target.time.value;
    const one = e.target.oneDigit.value;
    const two = e.target.twoDigit.value;
    const three = e.target.threeDigit.value;
    const four = e.target.fourDigit.value;

    // Validate digit lengths
    if (one.length !== 1 || two.length !== 2 || three.length !== 3 || four.length !== 4) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid input!',
        text: 'Please enter numbers with correct digit lengths.',
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:4200/api/admin/declareLuckyNumber', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify({ date, time, one, two, three, four }),
      });

      if (!response.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Please login again!',
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
          removeUserLogged();
          navigate('/');
        }, 2000);
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Lucky Numbers updated successfully!',
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        navigate(0);
      }, 2000);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to declare lucky numbers.");
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:4200/api/admin/luckyNumbers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'),
          },
        });

        if (!response.ok) {
          Swal.fire({
            icon: 'error',
            title: 'Please login again!',
            showConfirmButton: false,
            timer: 2000,
          });
          setTimeout(() => {
            removeUserLogged();
            navigate('/');
          }, 2000);
        }

        const responseData = await response.json();
        setLuckyNumbers(responseData);
      } catch (err) {
        console.error(err.response?.data || err.message);
        alert("Failed to load Lucky Numbers...");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="mt-5 pt-5">
      <div className="card container">
        <div className="card-body">
          <div className='row'>
            <div className='col-6'>
              <h2 className="card-title">Lucky Numbers</h2>
            </div>
            <div className='col-6 text-end'>
              <button type="button" className="btn btn-primary rounded-pill" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Declare
              </button>
            </div>
          </div>

          <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Declare Lucky Numbers</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form onSubmit={declareLuckyNumbers}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="date" className="form-label">Date:</label>
                      <input type="text" className="form-control" id="date" placeholder="MM/DD/YYYY" required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="time" className="form-label">Time:</label>
                      <select className="form-select" id='time' required>
                        <option value="Day" defaultValue>Day</option>
                        <option value="Night">Night</option>
                      </select>
                    </div>
                    <hr />
                    <div className="mb-3">
                      <input
                        type="text"
                        id='oneDigit'
                        className="form-control"
                        placeholder="Single Digit"
                        maxLength="1"
                        pattern="\d{1}"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        id='twoDigit'
                        className="form-control"
                        placeholder="Two Digit"
                        maxLength="2"
                        pattern="\d{2}"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        id='threeDigit'
                        className="form-control"
                        placeholder="Three Digit"
                        maxLength="3"
                        pattern="\d{3}"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        id='fourDigit'
                        className="form-control"
                        placeholder="Four Digit"
                        maxLength="4"
                        pattern="\d{4}"
                        required
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-danger rounded-pill" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" className="btn btn-primary rounded-pill">Declare</button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <hr />
          <div className="row">
            {luckyNumbers.map((luckyNumber, index) => (
              <div className="col-sm-4 mb-3" key={index}>
                <div className="card">
                  <div className="card-body">
                    <p><strong>Date: </strong> {luckyNumber.date}</p>
                    <p><strong>Time: </strong> {luckyNumber.time}</p>
                    <hr />
                    <p><strong>One Digit: </strong> {luckyNumber.one}</p>
                    <p><strong>Two Digit: </strong> {luckyNumber.two}</p>
                    <p><strong>Three Digit: </strong> {luckyNumber.three}</p>
                    <p><strong>Four Digit: </strong> {luckyNumber.four}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Number;
