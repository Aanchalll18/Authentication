import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Corrected
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContext";
import axios from "axios";

const ResetPassword = () => {

  const {backedUrl}=useContext(AppContent)
  axios.defaults.withCredentials=true;

	const navigate = useNavigate();
	const [email, setEmail] = useState("");
  const [password,setPassword]=useState('')
  const [isEmail,setIsEmail]=useState('')
  const [otp,setOtp]=useState(0)
  const [isotpSubmited,setOtpSubmited]=useState(false)

	const inputrefs = React.useRef([]);

	const handleInput = (e, index) => {
		if (e.target.value.length > 0 && index < inputrefs.current.length - 1) {
			inputrefs.current[index + 1]?.focus();
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

      {!isEmail && 
			<form className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
				<h1 className="text-white text-2xl font-semibold text-center mb-4">
					Reset Password
				</h1>
				<p className="text-center mb-6 text-indigo-300">
					Enter your registered email address
				</p>
				<div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
					<img src={assets.mail_icon} alt="" className="w-3 h-3" />
					<input
						type="email"
						placeholder="Email id"
						className="bg-transparent outline-none text-white w-full"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
					Submit
				</button>
			</form>
      }
      
      {!isotpSubmited && isEmail &&
			<form className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
				<h1 className="text-white text-2xl font-semibold text-center mb-4">
					Reset password otp
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
					Submit
				</button>
			</form>
      }

      {!isotpSubmited && isEmail &&
      <form className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
				<h1 className="text-white text-2xl font-semibold text-center mb-4">
					New Password
				</h1>
				<p className="text-center mb-6 text-indigo-300">
					Enter password
				</p>
				<div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
					<img src={assets.lock_icon} alt="" className="w-3 h-3" />
					<input
						type="password"
						placeholder="password "
						className="bg-transparent outline-none text-white w-full"
						value={password}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
					Submit
				</button>
			</form>
      }
		</div>
	);
};

export default ResetPassword;
