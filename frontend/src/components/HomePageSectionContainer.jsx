import {useNavigate} from "react-router-dom";

export const HomePageSectionContainer = ({name, link , children}) => {
    const navigate = useNavigate();
    return (
        <div className="w-full flex flex-col items-center justify-center align-middle ">
            <div className='flex justify-between mb-4 w-[80%] '>
                <h1 className='font-semibold text-4xl leading-[30px] color-[#11131A]'>{name}</h1>
                {link && (
                    <button
                        className='border-[1.5px] py-3 px-9 border-[#D9D9D9] hover:border-[#C5C5C5] hover:bg-[#CCCCCC] rounded-3xl btn-xl rounded-[40px]'
                        onClick={() => {
                            navigate(link)
                        }}>
                        <p className='color-[#11131A] font-normal '>Посмотреть все</p>
                    </button>
                )}
            </div>
            {
                children
            }

        </div>
    )
}