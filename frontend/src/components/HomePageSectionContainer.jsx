import {useNavigate} from "react-router-dom";

export const HomePageSectionContainer = ({name, link , children}) => {
    const navigate = useNavigate();
    return (
        <div className='w-[80%] '>
            <div className='flex justify-between mb-4'>
                <h1 className='font-bold text-3xl'>{name}</h1>
                {link && (
                    <button className='btn btn-outline rounded-3xl btn-xl w-[10%]' onClick={() => {navigate(link)}}>
                        View All
                    </button>
                )}
            </div>
            {
                children
            }

        </div>
    )
}