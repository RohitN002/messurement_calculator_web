import React, { useState } from "react";
import { Link } from "react-router-dom";
const Login = () => {
  const [formValues, setFormValues] = useState({
    emailId: "",
    password: "",
    mobileNumber: "",
  });
  //   const[is]
  const handleFormSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <div>
          {/* <label htmlFor=""> Enter Email or Phone Number</label> */}
          <input
            type="text"
            name=""
            value={formValues.emailId}
            onChange={(e) =>
              setFormValues((prev) => ({
                ...prev,
                emailId: e.target.value,
              }))
            }
            placeholder="Enter Email id or phone number"
            id=""
          />
        </div>
        <div>
          <input
            type="password"
            name=""
            placeholder="Enter your password"
            id=""
            value={formValues.password}
            onChange={(e) =>
              setFormValues((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Didn't have an account <Link to={"/singup"}>Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
