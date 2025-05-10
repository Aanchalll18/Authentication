import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-hot-toast";

const Navbar = () => {
	const navigate = useNavigate();
	const { userData, backendUrl, setisLoggedIn, setUserData } = useContext(AppContent);

	const sendVerificationOtp=async()=>{
		try {
			axios.defaults.withCredentials=true;
			const {data}=await axios.post(backendUrl + '/api/auth/send-verify-otp')

			if(data.success){
				navigate('/email-verify')
				toast.success(data.message)
			}else{
				toast.error(data.message)
			}

		} catch (error) {
			toast.error(error.message)
		}
	}

	const logout=async()=>{
		try {
			axios.defaults.withCredentials=true
			const {data}=await axios.post(backendUrl + '/api/auth/logout')
			data.success && setisLoggedIn(false)
			data.success && setUserData(false)
			navigate('/')
			toast.success(data.message)
		} catch (error) {
			console.log(error)
			toast.error(error.message)
		}
	}

	const handleLogout = async () => {
		try {
			await axios.get(backendUrl + "/api/auth/logout", { withCredentials: true });
			setisLoggedIn(false);
			setUserData(null);
			toast.success("Logged out");
			navigate("/login");
		} catch (err) {
			toast.error("Logout failed");
		}
	};

	return (
		<div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
			<img src={assets.logo} alt="Logo" className="w-28 sm:w-32" />
			{userData ? (
				<div className="relative group">
					<div className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white relative group">
						{userData.name[0].toUpperCase()}
					</div>
					<div className="hidden group-hover:block absolute top-0 right-0  text-black text-sm z-10 pt-10">
						<ul className="list-none m-0 p-2 bg-gray-100 text-sm">
						<li onClick={sendVerificationOtp}
							className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
							
						>
							Verify Email
						</li>
						<li onClick={logout}
							className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
							
						>
							Logout
						</li>
						</ul>
					</div>
				</div>
			) : (
				<button
					onClick={() => navigate("/login")}
					className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
				>
					Login
					<img src={assets.arrow_icon} alt="arrow" />
				</button>
			)}
		</div>
	);
};

export default Navbar;
