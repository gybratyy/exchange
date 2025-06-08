import {useBookStore} from "../store/useBookStore.js";
import {useEffect} from "react";
import {Loader} from "lucide-react";
import {CatalogCTASection, RecentBooksSection, RecommendationSection} from "../sections/homepage";
import {useTranslation} from "react-i18next";


const HomePage = () => {
  const { getBooks, isBooksLoading} = useBookStore();
    const {t} = useTranslation();
  useEffect(() => {
    getBooks()
  }, [getBooks]);


  if (isBooksLoading)
    return (
        <div className="flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin" />
        </div>
    );
  return (

      <div className="min-h-screen flex flex-col gap-8 items-center ">
        <RecommendationSection/>
        <RecentBooksSection/>
        <CatalogCTASection/>

      </div>
  )
}


export default HomePage;