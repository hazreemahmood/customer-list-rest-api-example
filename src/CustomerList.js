import './App.css';
import React, { useEffect, useState } from 'react';
import { Form, Button, Table, ToastContainer, Toast } from 'react-bootstrap';
import { Link, Route, Router, Routes, useLocation, useNavigate } from 'react-router-dom';
import {collection, query, orderBy, onSnapshot, doc, deleteDoc} from "firebase/firestore"
import {db} from './firebase'



// Routing --------------------

function CustomerList() {
  const [show, setShow] = useState([false]);
  const [tasks, setTasks] = useState([])
  const [customerId, setCustomerId] = useState()
  const [customer, setCustomer] = useState([]);
  const [customdata, setCustomData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

/* function to get all tasks from firestore in realtime */ 
  useEffect(() => {
    console.log(location.state);
      if (location.state) {
        setShow([location.state.show, '', location.state.message, location.state.type, true, location.state.title]);
      }
    fetch('https://gorest.co.in/public/v2/users', {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'Authorization': 'Bearer bf80bf813ebfd5fcbb80a248af81b4d7f12ef4b18258076a07fc4ae9c41f37b6'
        }
      })
      .then((response) => response.json())
      .then((data) => {
          setCustomer(data);
      })
      .catch((err) => {
          console.log(err.message);
      });
    
  }, []);
  
  /* function to delete a document from firstore */ 
  function handleDelete (customer_id){
    fetch("https://gorest.co.in/public/v2/users/"+customer_id, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'Authorization': 'Bearer bf80bf813ebfd5fcbb80a248af81b4d7f12ef4b18258076a07fc4ae9c41f37b6'
        }
    }).then((response) => {
      navigate('/list', {state: {show:true, title: 'Success!', message: 'Record Deleted!', type: 'success && text-white'}});
      window.location.reload()
    })
  }
  /* function to delete a document from firstore */ 
  function handleEdit (id){
    // const taskDocRef = doc(db, 'tasks', id)
    setCustomerId(id);
  }
  console.log(customer);


  return (
    <div>
      <ToastContainer position="top-end" className="p-3">
        <Toast bg={show[3]} onClose={() => setShow([false])} show={show[0]} delay={3000} autohide={show[4]}>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">
            {show[1] ? 'Delete record?' : show[5]}
            </strong>
            <small>just now</small>
          </Toast.Header>
          <Toast.Body>
            {show[2]}
            {show[1] ? 
            <div>
              <Button className="toast-button" variant="danger" onClick={() => handleDelete(show[1])}>Yes</Button>
              <Button className="toast-button" variant="success" onClick={() => setShow([false])}>No</Button>
            </div> : ''}
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <h2>Customer Listing</h2>
        <div className="add-new">
          <Button variant="primary"><div className="button-link"><Link to="/add_new">Add New</Link></div></Button>
        </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {customer.map((custdata, index) => ( 
            <tr>
              <td>{index+1}</td>
              <td><Link to="/view" state={{id: custdata.id, data: {name: custdata.name, email: custdata.email, gender: custdata.gender}, edit: 1}}>{custdata.name}</Link></td>
              <td>{custdata.email}</td>
              <td>
                <Button className='action_btn' variant="primary" onClick={() => handleEdit(custdata.id)}>
                  <div className="button-link"><Link to="/edit" state={{id: custdata.id, data: {name: custdata.name, email: custdata.email, gender: custdata.gender}, edit: 1}}>Edit</Link></div>
                  </Button>
                <Button className='action_btn' variant="danger" onClick={() => setShow([true,custdata.id,'Are you sure you want to delete this record?.', 'warning'])}>Delete</Button>
              </td>
            </tr>
          ))}  
        </tbody>
      </Table>
    </div>
  );
};

export default CustomerList;