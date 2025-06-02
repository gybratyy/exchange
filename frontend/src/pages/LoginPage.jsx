import {useState} from "react";
import {useAuthStore} from "../store/useAuthStore";
import {Link} from "react-router-dom";
import {Eye, EyeOff, Loader2, Lock, Mail, MessageSquare} from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (

      <div className="h-screen flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full h-max-screen max-w-lg space-y-8 bg-[#11131A] px-16 py-14 rounded-[20px]">

          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl leading-8 text-white font-medium mt-2">Добро пожаловать</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Почта</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={'input input-bordered w-full pl-10 rounded-xl border-[#EAEAEA] '}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Пароль</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10 rounded-xl`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn w-full rounded-3xl mt-14 hover:bg-[#408ACF] border-0 text-[#11131A]"
                    disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Загрузка...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center text-white flex flex-col gap-4 ">
            <p className="">

              <Link to="/signup" className="link  hover:text-[#408ACF]">
                Забыли пароль?
              </Link>
            </p>
            <p className="">
              Нет аккаунта?{" "}
              <Link to="/signup" className="link  hover:text-[#408ACF]">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>
      </div>



  );
};
export default LoginPage;
