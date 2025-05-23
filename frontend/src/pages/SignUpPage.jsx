import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useBookStore } from "../store/useBookStore";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, User, ArrowLeft, Send, MapPin, Globe } from "lucide-react";
import toast from "react-hot-toast";
import {Stepper} from "../components/Stepper";




const SignUpPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    telegramId: "",
    preferences: [],
    country: "Kazakhstan",
    city: "Astana",
  });

  const { signup, isSigningUp } = useAuthStore();
  const { getCategories, categories } = useBookStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentStep === 2) {
      getCategories();
    }
  }, [currentStep, getCategories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePreference = (categoryId) => {
    setFormData((prev) => {
      const currentPreferences = prev.preferences;
      if (currentPreferences.includes(categoryId)) {
        return { ...prev, preferences: currentPreferences.filter((id) => id !== categoryId) };
      } else {
        return { ...prev, preferences: [...currentPreferences, categoryId] };
      }
    });
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) { toast.error("Full name is required"); return false; }
    if (!formData.email.trim()) { toast.error("Email is required"); return false; }
    if (!/\S+@\S+\.\S+/.test(formData.email)) { toast.error("Invalid email format"); return false; }
    if (!formData.password) { toast.error("Password is required"); return false; }
    if (formData.password.length < 6) { toast.error("Password must be at least 6 characters"); return false; }
    if (formData.telegramId && !/^@([a-zA-Z0-9_]){5,32}$/.test(formData.telegramId)) {
      toast.error("Invalid Telegram ID format (e.g., @username)");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (formData.preferences.length < 3) {
      toast.error("Please select at least 3 genres.");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.country.trim()) { toast.error("Country is required"); return false; }
    if (!formData.city.trim()) { toast.error("City is required"); return false; }
    return true;
  }

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    try {
      await signup(formData);
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const renderProgressBar = () => {
    const filledCount = Math.min(formData.preferences.length, 3);
    return (
        <div className="flex space-x-1 mb-4">
          {[...Array(3)].map((_, i) => (
              <div key={i} className={`h-2 flex-1 rounded-full ${i < filledCount ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          ))}
        </div>
    );
  };


  return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-[80%] space-y-8 flex flex-col align-baseline ">

            {currentStep > 1 && (
               <button onClick={prevStep} className="btn btn-ghost btn-sm self-start ">
                  <ArrowLeft size={20} /> Назад
                </button>)
                }




          <Stepper currentStep={currentStep} />

          {currentStep === 1 && (
              <div className=' mx-auto p-0 w-full'>
                <div className="text-center">
                  <h1 className="text-2xl font-bold">Create Your Account</h1>
                  <p className="text-base-content/60">Step 1: Basic Information</p>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-4 max-w-lg mx-auto">
                  <div>
                    <label className="label"><span className="label-text font-medium">Full Name</span></label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <input type="text" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleInputChange} className="input input-bordered w-full pl-10 rounded-xl" />
                    </div>
                  </div>
                  <div>
                    <label className="label"><span className="label-text font-medium">Email</span></label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleInputChange} className="input input-bordered w-full pl-10 rounded-xl" />
                    </div>
                  </div>
                  <div>
                    <label className="label"><span className="label-text font-medium">Password</span></label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" value={formData.password} onChange={handleInputChange} className="input input-bordered w-full pl-10 pr-10 rounded-xl" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="label"><span className="label-text font-medium">Telegram ID (Optional)</span></label>
                    <div className="relative">
                      <Send className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <input type="text" name="telegramId" placeholder="@username" value={formData.telegramId} onChange={handleInputChange} className="input input-bordered w-full pl-10 rounded-xl" />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary w-full rounded-3xl">Next</button>
                </form>
              </div>
          )}

          {currentStep === 2 && (
              <div className='flex flex-col align-baseline'>
                <div className="text-center">
                  <h1 className="text-2xl font-bold">Выберите ваш любимый жанр</h1>
                  <p className="text-base-content/60">Выберите как минимум 3 ваших любимых жанров. Мы используем ваш любимый жанр что бы сделать лучше подборку рекомендации что поможет вам видеть их у себя в ленте.</p>
                </div>
                {renderProgressBar()}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4  overflow-y-auto py-4">
                  {categories.map((category) => (
                      <button
                          key={category._id}
                          onClick={() => togglePreference(category._id)}
                          className={`btn h-auto p-0 relative aspect-square rounded-lg overflow-hidden focus:outline-none border-4
                                ${formData.preferences.includes(category._id) ? "border-[#83C049] " : "border-base-100"}`}
                      >
                        <img src={category.image || 'https://via.placeholder.com/150?text=No+Image'} alt={category.name} className="w-full h-full object-cover" />
                        <div className={`absolute inset-0 flex flex-col justify-between p-2 
                                 ${formData.preferences.includes(category._id) ? "bg-black/20" : "bg-black/50 hover:bg-black/30"} transition-colors`}>
                    <span className={`font-semibold text-left ${formData.preferences.includes(category._id) ? "text-white" : "text-white"}`}>
                      {category.name}
                    </span>
                        </div>
                      </button>
                  ))}
                </div>
                <button onClick={nextStep} className="btn btn-primary w-[25%] mt-4 mx-auto rounded-3xl" disabled={formData.preferences.length < 3}>Next</button>
                <p className="text-center text-sm text-base-content/60 mt-2">Тут нет ваших любимых жанров? <Link to="/contact" className="link link-hover">Напишите</Link></p>
              </div>
          )}

          {currentStep === 3 && (
              <div className='max-w-lg mx-auto'>
                <div className="text-center">
                  <h1 className="text-2xl font-bold">Выберите вашу страну и город</h1>
                  <p className="text-base-content/60">Укажите страну и город, чтобы мы могли подобрать лучшие рекомендации для вас. Если вы не нашли нужный город – напишите нам, и мы постараемся добавить его как можно скорее.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label"><span className="label-text font-medium">Country</span></label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <select name="country" value={formData.country} onChange={handleInputChange} className="select select-bordered w-full pl-10 rounded-xl  ">
                        <option value="Kazakhstan">Kazakhstan</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label"><span className="label-text font-medium">City</span></label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <select name="city" value={formData.city} onChange={handleInputChange} className="select select-bordered w-full pl-10 rounded-xl">
                        <option value="Astana">Astana</option>
                        <option value="Almaty">Almaty</option>
                        <option value="Shymkent">Shymkent</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary w-full rounded-3xl" disabled={isSigningUp}>
                    {isSigningUp ? <Loader2 className="animate-spin" /> : "Finish Registration"}
                  </button>
                </form>
                <p className="text-center text-sm text-base-content/60 mt-2">Если вы не нашли нужный город – <Link to="/contact" className="link link-hover">напишите нам</Link></p>
              </div>
          )}

          {(currentStep === 1) && (
              <div className="text-center mt-4">
                <p className="text-base-content/60">
                  Already have an account?{" "}
                  <Link to="/login" className="link link-primary">
                    Sign in
                  </Link>
                </p>
              </div>
          )}
        </div>
      </div>
  );
};
export default SignUpPage;