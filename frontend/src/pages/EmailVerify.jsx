import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import getUserData from "../../../backend/controllers/userControllers";
import { useNavigate } from "react-router-dom";

const EmailVerify = () => {
	axios.defaults.withCredentials = true;

  const navigate=useNavigate();

	const { backendUrl } = useContext(AppContent);
	const inputrefs = React.useRef([]);

	const handleInput = (e, index) => {
  if (e.target.value.length > 0 && index < inputrefs.current.length - 1) {
    inputrefs.current[index + 1]?.focus();
  }
};

const onsubmitHandler = async (e) => {
  try {
    e.preventDefault();
    const otparray = inputrefs.current.map((input) => input.value);
    const otp = otparray.join("");
    const { data } = await axios.post(
      backendUrl + "/api/auth/verify-account",
      { otp }
    );
    if (data.success) {
      toast.success(data.message);
      getUserData();
      navigate("/");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};


	return (
		<div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
			<img
				onClick={() => navigate("/")}
				src={assets.logo}
				alt="logo"
				className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
			/>
			<form onSubmit={onsubmitHandler}
      className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
				<h1 className="text-white text-2xl font-semibold text-center mb-4">
					Email Verify Otp
				</h1>
				<p className="text-center mb-6 text-indigo-300">
					Enter the 6-digit code sent to your email id
				</p>
				<div className="flex justify-between mb-8">
					{Array(6)
						.fill(0)
						.map((_, index) => (
							<input
								type="text"
								maxLength="1"
								key={index}
								required
								className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
								ref={(e) => (inputrefs.current[index] = e)}
								onInput={(e) => handleInput(e, index)}
							/>
						))}
				</div>
				<button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900">
					verify Email
				</button>
			</form>
		</div>
	);
};

export default EmailVerify;
