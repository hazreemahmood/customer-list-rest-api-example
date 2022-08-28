import '../App.css';
import React, { useEffect, useRef, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {db} from '../firebase'
import {collection, addDoc, Timestamp, updateDoc} from 'firebase/firestore'
import { onSnapshot } from 'firebase/firestore';
import { query } from 'firebase/firestore';
import { orderBy } from 'firebase/firestore';
import { doc } from 'firebase/firestore';


// Routing --------------------

function App(){
    const customername = useRef(null);
    const customer_id = useRef(null);
    const customeremail = useRef(null);
    const edit = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    // const [firstname, setFirstName] = useState("");
    // const [lastname, setLastName] = useState("");
    // const [email, setEmail] = useState("");
    // const [telno, setTelno] = useState("");
    const [customerdata, setCustomerData] = useState([]);
    const [customerid, setCustomerId] = useState();
    const [editform, setEdit] = useState();
    useEffect(() => {
        if (location.state) {
            setCustomerData(location.state.data);
            setCustomerId(location.state.id);
            setEdit(location.state.edit);
        }
    },[])

    /* function to add new task to firestore */
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (edit.current.value) {
                const data = {
                    id: customer_id.current.value,
                    name: customername.current.value,
                    email: customeremail.current.value,
                    gender: "Male",
                    status: "Active"
                };
                fetch("https://gorest.co.in/public/v2/users/"+customer_id.current.value, {
                    method: "PUT",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer bf80bf813ebfd5fcbb80a248af81b4d7f12ef4b18258076a07fc4ae9c41f37b6'
                    },
                    body: JSON.stringify({
                        name: customername.current.value,
                        email: customeremail.current.value,
                        gender: "Male",
                        status: "Active"
                    })
                })
                navigate('/list', {state: {show:true, message: 'Record Updated Successfully', type: 'success'}});
            }else{
                fetch("https://gorest.co.in/public/v2/users", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer bf80bf813ebfd5fcbb80a248af81b4d7f12ef4b18258076a07fc4ae9c41f37b6'
                    },
                    body: JSON.stringify({
                        name: customername.current.value,
                        email: customeremail.current.value,
                        gender: "Male",
                        status: "Active"
                    })
                })
                navigate('/list', {state: {show:true, message: 'New Record Added', type: 'success'}});
            }
        } catch (err) {
            alert(err)
        }
    }
    
    return (
        <div>
            <div className="back-button">
                <Button to="/add_new" variant="primary"><div className="button-link"><Link to="/list">Back</Link></div></Button>
            </div>
            <h2>Create New Customer</h2>
            <Form className="form" onSubmit={handleSubmit}>
                <Form.Control type="hidden" placeholder="edit" ref={edit} defaultValue={editform} />
                <Form.Control type="hidden" placeholder="edit" ref={customer_id} defaultValue={customerid} />
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>customername</Form.Label>
                    <Form.Control type="text" placeholder="Enter Name" ref={customername} defaultValue={customerdata.name} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter Email" ref={customeremail} defaultValue={customerdata.email} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
};

export default App;