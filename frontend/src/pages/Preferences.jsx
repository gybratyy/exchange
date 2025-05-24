import {useEffect, useState} from "react";
import {useAuthStore} from "../store/useAuthStore.js";
import {useBookStore} from "../store/useBookStore.js";
import {CircleMinus, CirclePlus, Loader2} from "lucide-react";
import {useNavigate} from "react-router-dom";

const Preferences = () => {

    const {preferences, fillPreferences, isFillingPreferences, checkAuth} = useAuthStore();
    const {getCategories, categories} = useBookStore()
    const [prefs, setPrefs] = useState(preferences ? Object.keys(preferences) : []);
    const navigate = useNavigate();

    useEffect(() => {
        getCategories();
        checkAuth();
    }, [getCategories, checkAuth]);

    function changePrefs(id) {
        if (prefs.includes(id)) {
            setPrefs(prefs.filter((pref) => pref !== id));
        } else {
            setPrefs([...prefs, id]);
        }

    }

    function submitPreferences() {
        fillPreferences({preferences:prefs});
    }

    return (

        <div className="min-h-screen flex flex-col justify-center items-center p-6 sm:p-12">
            <div className="w-[80%] h-full  space-y-8 grid grid-cols-12 gap-4 ">
                <div className="col-span-1"></div>

                <div className="col-span-10 flex flex-col items-center ">
                    <div className='text-center mb-12'>
                        <h1 className="text-3xl font-bold mt-2 mb-5">Выберите ваши любимые жанры</h1>
                        <h3 className="text-xl">Выберите как минимум 3 ваших любимый жанров. Мы используем ваш любимый
                            жанр что бы сделать лучше подборку рекомендации что поможет вам видеть их у себя в
                            ленте</h3>
                    </div>
                    <div className="mb-10 grid grid-cols-10 gap-4 ">{
                        categories && categories.map((category) => (
                            <button onClick={() => changePrefs(category._id)} key={category._id}
                                    className='btn h-full  col-span-2 relative p-0 '>
                                <img src={category.image} alt={category.name}
                                     className="aspect-square object-cover w-full h-full  rounded-lg"/>
                                <div
                                    className={` absolute z-10 top-0 left-0 w-full h-full p-2 m-0 bg-black ${prefs.includes(category._id) ? 'bg-opacity-15' : 'bg-opacity-65'} hover:bg-opacity-30  text-start rounded-lg`}>

                                    <div className='flex flex-row justify-between w-full'>
                                        <div className='w-[70%]'><h3
                                            className={` text-wrap   ${prefs.includes(category._id) ? 'text-black' : 'text-white'}`}>{category.name}</h3>
                                        </div>

                                        <div>{prefs.includes(category._id) ? <CircleMinus color='white'/> :
                                            <CirclePlus color='white'/>
                                        }</div>

                                    </div>

                                </div>
                            </button>

                        ))
                    }</div>
                    <button onClick={()=>submitPreferences().then(navigate('/catalog'))} className='btn btn-accent btn-wide rounded-xl '>  {isFillingPreferences ? (
                        <>
                            <Loader2 className="size-5 animate-spin" />
                            Загрузка...
                        </>
                    ) : (
                        "Continue"
                    )}</button>

                </div>
                <div className="col-span-1"></div>

            </div>
        </div>


    );
};
export default Preferences;
